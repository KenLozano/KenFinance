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
    const duplicateData = {
        amount: expenseItem.amount,
        category: expenseItem.category || 'yellow',
        note: normalizeNote(`${expenseItem.note || 'Gasto'} (duplicado)`),
        merchant: normalizeText(expenseItem.merchant || '', 80),
        method: expenseItem.method || 'efectivo',
        priority: expenseItem.priority || 'media',
        date: firebase.firestore.Timestamp.fromDate(new Date()),
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    };
    await db.collection('transactions').doc(uid).collection('expenses').add(duplicateData);
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
