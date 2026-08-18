// js/services/dbService.js — Firestore CRUD operations

import { db, firebase } from '../firebase/config.js';
import { normalizeNote, normalizeText } from '../ui/helpers.js';

/**
 * Obtiene el perfil de usuario.
 */
export async function getUserProfile(uid) {
    const doc = await db.collection('users').doc(uid).get();
    return doc.exists ? doc.data() : null;
}

/**
 * Guarda el perfil de usuario con merge.
 */
export async function saveUserProfile(uid, profileData) {
    profileData.updatedAt = firebase.firestore.FieldValue.serverTimestamp();
    await db.collection('users').doc(uid).set(profileData, { merge: true });
}

/**
 * Carga el plan financiero.
 */
export async function getPlan(uid) {
    try {
        const doc = await db.collection('plans').doc(uid).get();
        if (doc.exists) return doc.data();
    } catch (_) { }

    // Fallback for environments where /plans rules are not deployed yet.
    const userDoc = await db.collection('users').doc(uid).get();
    const userData = userDoc.exists ? userDoc.data() : {};
    const planConfig = userData.planConfig || {};
    return {
        incomeTarget: Number(planConfig.incomeTarget || 0),
        expenseLimit: Number(planConfig.expenseLimit || 0)
    };
}

/**
 * Guarda el plan financiero.
 */
export async function savePlan(uid, planData) {
    const payload = {
        ...planData,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    };

    try {
        await db.collection('plans').doc(uid).set(payload);
    } catch (_) {
        // Fallback for environments where /plans rules are not deployed yet.
        await db.collection('users').doc(uid).set({
            planConfig: {
                incomeTarget: Number(planData.incomeTarget || 0),
                expenseLimit: Number(planData.expenseLimit || 0)
            },
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        }, { merge: true });
    }
}

/**
 * Obtiene transacciones desde una fecha de inicio.
 */
export async function getTransactions(uid, startTs) {
    const incomeRef = db.collection('transactions').doc(uid).collection('income');
    const expenseRef = db.collection('transactions').doc(uid).collection('expenses');

    let incomeDocs = [];
    let expenseDocs = [];

    try {
        // Query by `date` for current schema and by `createdAt` for legacy docs.
        const [incomeByDate, incomeByCreatedAt, expenseByDate, expenseByCreatedAt] = await Promise.all([
            incomeRef.where('date', '>=', startTs).get(),
            incomeRef.where('createdAt', '>=', startTs).get(),
            expenseRef.where('date', '>=', startTs).get(),
            expenseRef.where('createdAt', '>=', startTs).get()
        ]);
        incomeDocs = [...incomeByDate.docs, ...incomeByCreatedAt.docs];
        expenseDocs = [...expenseByDate.docs, ...expenseByCreatedAt.docs];
    } catch (_) {
        // Safe fallback if indexed queries are not available yet.
        const [incomeSnap, expenseSnap] = await Promise.all([
            incomeRef.get(),
            expenseRef.get()
        ]);
        incomeDocs = incomeSnap.docs;
        expenseDocs = expenseSnap.docs;
    }

    const uniqueById = (docs) => {
        const map = new Map();
        docs.forEach((doc) => map.set(doc.id, doc));
        return [...map.values()];
    };

    return {
        incomeItems: uniqueById(incomeDocs).map(doc => ({ id: doc.id, type: 'income', ...doc.data() })),
        expenseItems: uniqueById(expenseDocs).map(doc => ({ id: doc.id, type: 'expense', ...doc.data() }))
    };
}

/**
 * Guarda o actualiza un ingreso.
 */
export async function saveIncome(uid, data, editId = null) {
    const colRef = db.collection('transactions').doc(uid).collection('income');
    if (editId) {
        await colRef.doc(editId).update(data);
    } else {
        data.createdAt = firebase.firestore.FieldValue.serverTimestamp();
        await colRef.add(data);
    }
}

/**
 * Guarda o actualiza un gasto.
 */
export async function saveExpense(uid, data, editId = null) {
    const colRef = db.collection('transactions').doc(uid).collection('expenses');
    if (editId) {
        await colRef.doc(editId).update(data);
    } else {
        data.createdAt = firebase.firestore.FieldValue.serverTimestamp();
        await colRef.add(data);
    }
}

/**
 * Duplica un gasto.
 */
export async function addDuplicateExpense(uid, expenseItem) {
    if (!expenseItem.assetId) {
        throw new Error('El gasto original no tiene una cuenta asociada');
    }

    const duplicateData = {
        amount: expenseItem.amount,
        category: expenseItem.category || 'yellow',
        note: normalizeNote(`${expenseItem.note || 'Gasto'} (duplicado)`),
        merchant: normalizeText(expenseItem.merchant || '', 80),
        method: expenseItem.method || 'efectivo',
        priority: expenseItem.priority || 'media',
        assetId: expenseItem.assetId,
        date: firebase.firestore.Timestamp.fromDate(new Date()),
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    };

    await db.collection('transactions')
        .doc(uid)
        .collection('expenses')
        .add(duplicateData);
}

/**
 * Elimina una transacción.
 */
export async function deleteTransaction(uid, type, id) {
    const collection = type === 'income' ? 'income' : 'expenses';
    await db.collection('transactions').doc(uid).collection(collection).doc(id).delete();
}

/**
 * Lee una única transacción.
 */
export async function getTransactionById(uid, type, id) {
    const collection = type === 'income' ? 'income' : 'expenses';
    const doc = await db.collection('transactions').doc(uid).collection(collection).doc(id).get();
    return doc.exists ? doc.data() : null;
}

/**
 * Obtiene todas las transacciones ordenadas por fecha (para exportación).
 */
export async function getAllTransactionsOrdered(uid) {
    const [incSnap, expSnap] = await Promise.all([
        db.collection('transactions').doc(uid).collection('income').get(),
        db.collection('transactions').doc(uid).collection('expenses').get()
    ]);
    const txs = [];
    incSnap.docs.forEach(doc => txs.push({ id: doc.id, type: 'income', ...doc.data() }));
    expSnap.docs.forEach(doc => txs.push({ id: doc.id, type: 'expense', ...doc.data() }));
    const toMs = (item) => item.date?.toDate?.()?.getTime?.() || item.createdAt?.toDate?.()?.getTime?.() || 0;
    txs.sort((a, b) => toMs(b) - toMs(a));
    return txs;
}

/**
 * Obtiene todos los assets (cuentas) del usuario.
 */
export async function getAssets(uid) {
    const snap = await db.collection('users').doc(uid).collection('assets').get();

    return snap.docs
        .map(doc => normalizeTimestamps({ id: doc.id, ...doc.data() }))
        .filter(asset => asset.active !== false);
}
/**
 * Guarda o actualiza un asset.
 */
export async function saveAsset(uid, data, editId = null) {
    const colRef = db.collection('users').doc(uid).collection('assets');

    const payload = {
        ...data,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    };

    if (editId) {
        await colRef.doc(editId).update(payload);
        return editId;
    }

    payload.active = true;
    payload.createdAt = firebase.firestore.FieldValue.serverTimestamp();

    const docRef = await colRef.add(payload);

    return docRef.id;
}

/**
 * Elimina un asset / el asset solo se archiva.
 */
export async function archiveAsset(uid, assetId) {
    await db
        .collection('users')
        .doc(uid)
        .collection('assets')
        .doc(assetId)
        .update({
            active: false,
            archivedAt: firebase.firestore.FieldValue.serverTimestamp(),
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
}

/**
 * Obtiene todas las goals (metas) del usuario.
 */
export async function getGoals(uid) {
    const snap = await db.collection('users').doc(uid).collection('goals').get();
    return snap.docs.map(doc => normalizeTimestamps({ id: doc.id, ...doc.data() }));
}

/**
 * Guarda o actualiza una goal.
 */
export async function saveGoal(uid, data, editId = null) {
    const colRef = db.collection('users').doc(uid).collection('goals');
    const payload = { ...data };
    if (payload.deadline instanceof Date) {
        payload.deadline = firebase.firestore.Timestamp.fromDate(payload.deadline);
    }
    if (editId) {
        await colRef.doc(editId).update(payload);
    } else {
        payload.createdAt = firebase.firestore.FieldValue.serverTimestamp();
        await colRef.add(payload);
    }
}

/**
 * Elimina una goal.
 */
export async function deleteGoal(uid, goalId) {
    await db.collection('users').doc(uid).collection('goals').doc(goalId).delete();
}

/**
 * Calcula el balance de un asset sumando los movimientos que le pertenecen.
 * No se guarda como campo fijo — se recalcula cada vez (más seguro, como se decidió).
 */
export async function getAssetBalance(uid, assetId) {
    const all = await getAllTransactionsOrdered(uid);
    return all
        .filter(t => t.assetId === assetId)
        .reduce((sum, t) => sum + (t.type === 'income' ? Number(t.amount) : -Number(t.amount)), 0);
}

/**
 * Calcula cuánto se ha asignado a una goal sumando los movimientos vinculados.
 */
export async function getGoalProgress(uid, goalId) {
    const all = await getAllTransactionsOrdered(uid);
    return all
        .filter(t => t.goalId === goalId)
        .reduce((sum, t) => sum + Number(t.amount), 0);
}
/**
 * Convierte los Timestamp de Firestore a Date normal de JS
 * antes de que el resto de la app los vea.
 */
function normalizeTimestamps(data) {
    const result = { ...data };
    ['date', 'createdAt', 'updatedAt', 'deadline'].forEach(field => {
        if (result[field]?.toDate) result[field] = result[field].toDate();
    });
    return result;
}
