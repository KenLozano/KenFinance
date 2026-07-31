// js/app.js — Main entry point for Konteo 05
// All inline code from index.html has been extracted into this modular architecture.

import { auth, db, firebase } from './firebase/config.js';
import { state, persistUiState } from './state.js';
import { showPage, fmt, normalizeText, normalizeNote, normalizeTags, todayString, sortTransactions, calculateProfileCompletion, toggleCustomRangePanel } from './ui/helpers.js';
import { showToast } from './ui/toast.js';
import { openModal, closeModal } from './ui/modals.js';
import { renderTransactionList } from './ui/render.js';
import { renderCharts } from './ui/charts.js';
import { updateInsights, updateStrategyPanel, loadPlanConfigToUi, savePlanConfigFromUi } from './ui/insights.js';
import * as dbService from './services/dbService.js';
import { exportToExcel, exportToPDF } from './services/exportService.js';

// ============================================
// THEME
// ============================================
function initTheme() {
    const saved = localStorage.getItem('konteo.theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = saved || (prefersDark ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', theme);
    updateThemeIcon(theme);
}

function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('konteo.theme', next);
    updateThemeIcon(next);
}

function updateThemeIcon(theme) {
    const btn = document.getElementById('theme-toggle-btn');
    if (btn) btn.textContent = theme === 'dark' ? '☀️' : '🌙';
}

// ============================================
// CONNECTIVITY
// ============================================
window.addEventListener('online', () => { state.isOnline = true; });
window.addEventListener('offline', () => { state.isOnline = false; });

// ============================================
// DOM REFERENCES
// ============================================
const listEl = document.getElementById('list');
const todayStr = todayString();

// ============================================
// PROFILE
// ============================================
async function loadUserProfile() {
    if (!state.currentUser) return;
    try {
        const data = await dbService.getUserProfile(state.currentUser.uid) || {};
        state.userProfile = {
            name: data.name || state.currentUser.displayName || '',
            phone: data.phone || '',
            birthday: data.birthday || '',
            city: data.city || '',
            country: data.country || '',
            occupation: data.occupation || '',
            currency: data.currency || 'PEN',
            monthlyTarget: Number(data.monthlyTarget || 0),
            bio: data.bio || '',
            recoveryEmail: data.recoveryEmail || '',
            emergencyContact: data.emergencyContact || ''
        };
        if (state.userProfile.name) {
            document.getElementById('user-name').textContent = state.userProfile.name;
        }
        // Populate profile form fields
        const fields = {
            'profile-name': state.userProfile.name,
            'profile-phone': state.userProfile.phone,
            'profile-birthday': state.userProfile.birthday,
            'profile-city': state.userProfile.city,
            'profile-country': state.userProfile.country,
            'profile-occupation': state.userProfile.occupation,
            'profile-currency': state.userProfile.currency,
            'profile-bio': state.userProfile.bio,
            'profile-recovery-email': state.userProfile.recoveryEmail,
            'profile-emergency-contact': state.userProfile.emergencyContact
        };
        for (const [id, value] of Object.entries(fields)) {
            const el = document.getElementById(id);
            if (el) el.value = value;
        }
        const targetInput = document.getElementById('profile-monthly-target');
        if (targetInput) targetInput.value = state.userProfile.monthlyTarget > 0 ? String(state.userProfile.monthlyTarget) : '';

        const completion = document.getElementById('profile-completion');
        if (completion) completion.textContent = `${calculateProfileCompletion(state.userProfile)}%`;
    } catch (err) {
        showToast('No se pudo cargar el perfil', 'error');
    }
}

async function saveUserProfile() {
    if (!state.currentUser) return;
    const name = normalizeText(document.getElementById('profile-name')?.value || '', 60);
    const phone = normalizeText(document.getElementById('profile-phone')?.value || '', 20);
    const birthday = document.getElementById('profile-birthday')?.value || '';
    const city = normalizeText(document.getElementById('profile-city')?.value || '', 50);
    const country = normalizeText(document.getElementById('profile-country')?.value || '', 50);
    const occupation = normalizeText(document.getElementById('profile-occupation')?.value || '', 60);
    const currency = document.getElementById('profile-currency')?.value || 'PEN';
    const monthlyTarget = Number(document.getElementById('profile-monthly-target')?.value || 0);
    const bio = normalizeText(document.getElementById('profile-bio')?.value || '', 240);
    const recoveryEmail = normalizeText(document.getElementById('profile-recovery-email')?.value || '', 120);
    const emergencyContact = normalizeText(document.getElementById('profile-emergency-contact')?.value || '', 20);

    if (!name) { showToast('El nombre es obligatorio', 'error'); return; }

    const profileData = {
        name, phone, birthday, city, country, occupation,
        currency, monthlyTarget: monthlyTarget > 0 ? monthlyTarget : 0,
        bio, recoveryEmail, emergencyContact
    };

    await dbService.saveUserProfile(state.currentUser.uid, profileData);
    if (state.currentUser.displayName !== name) {
        await state.currentUser.updateProfile({ displayName: name });
    }
    state.userProfile = { ...state.userProfile, ...profileData };
    document.getElementById('user-name').textContent = name;
    const completion = document.getElementById('profile-completion');
    if (completion) completion.textContent = `${calculateProfileCompletion(state.userProfile)}%`;
    closeModal('modal-profile');
    showToast('Perfil actualizado', 'success');
}



// ============================================
// LOAD DATA — Core orchestrator
// ============================================
async function loadData() {
    if (!state.currentUser) return;

    const myToken = ++state.currentLoadToken;

    const now = new Date();
    let startDate;
    let endDate = null;

    if (state.currentFilter === 'today') {
        startDate = new Date();
        startDate.setHours(0, 0, 0, 0);
    } else if (state.currentFilter === 'week') {
        startDate = new Date();
        // Hoy + 6 dias previos = 7 dias calendario.
        startDate.setDate(startDate.getDate() - 6);
        startDate.setHours(0, 0, 0, 0);
    } else if (state.currentFilter === 'custom') {
        if (!state.customRangeStart || !state.customRangeEnd) {
            showToast('Selecciona un rango de fechas', 'error');
            return;
        }
        startDate = new Date(`${state.customRangeStart}T00:00:00`);
        endDate = new Date(`${state.customRangeEnd}T23:59:59`);
    } else {
        startDate = new Date();
        startDate.setDate(1);
        startDate.setHours(0, 0, 0, 0);
    }

    const startTs = firebase.firestore.Timestamp.fromDate(startDate);

    try {
        const { incomeItems: incomeItemsRaw, expenseItems: expenseItemsRaw } =
            await dbService.getTransactions(state.currentUser.uid, startTs);

        const withinPeriod = (item) => {
            const itemDate = item.date?.toDate?.() || item.createdAt?.toDate?.() || new Date(0);
            if (itemDate < startDate) return false;
            if (endDate && itemDate > endDate) return false;
            return true;
        };

        const incomeItems = incomeItemsRaw.filter(withinPeriod);
        const expenseItems = expenseItemsRaw.filter(withinPeriod);

        const totalIncome = incomeItems.reduce((sum, i) => sum + (Number(i.amount) || 0), 0);
        const totalExpenses = expenseItems.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);

        // Race condition check
        if (myToken !== state.currentLoadToken) return;

        const balance = totalIncome - totalExpenses;

        document.getElementById('balance').textContent = `S/ ${fmt(balance)}`;
        document.getElementById('balance').className = balance >= 0 ? 'balance-positive' : 'balance-negative';
        document.getElementById('total-income').textContent = `S/ ${fmt(totalIncome)}`;
        document.getElementById('total-expenses').textContent = `S/ ${fmt(totalExpenses)}`;

        const allInPeriod = [...incomeItems, ...expenseItems];
        const all = sortTransactions(allInPeriod, state.currentSort);
        state.latestExpenseItem = sortTransactions(expenseItems, 'date_desc')[0] || null;

        // Search & category filter
        const searchTerm = document.getElementById('search-input')?.value.toLowerCase() || '';
        const categoryFilter = document.getElementById('category-filter')?.value || 'all';

        const filtered = all.filter(item => {
            const matchesSearch = !searchTerm ||
                (item.note && item.note.toLowerCase().includes(searchTerm)) ||
                String(Number(item.amount) || 0).includes(searchTerm);
            let matchesCategory = true;
            if (categoryFilter !== 'all') {
                if (categoryFilter === 'income') {
                    matchesCategory = item.type === 'income';
                } else {
                    matchesCategory = item.category === categoryFilter;
                }
            }
            return matchesSearch && matchesCategory;
        });

        const endForPeriod = endDate || now;
        const periodDays = Math.max(1, Math.ceil((endForPeriod - startDate) / 86400000) + 1);

        // Fetch plan and override state
        try {
            const plan = await dbService.getPlan(state.currentUser.uid);
            state.planConfig.incomeTarget = Number(plan.incomeTarget || 0);
            state.planConfig.expenseLimit = Number(plan.expenseLimit || 0);
            loadPlanConfigToUi();
        } catch (planErr) {
            console.warn('No se pudo cargar plan:', planErr?.message || planErr);
        }

        updateInsights({ totalIncome, totalExpenses, balance, expenseItems, periodDays });
        updateStrategyPanel({ totalIncome, totalExpenses, balance, periodDays });
        renderTransactionList(document.getElementById('list'), filtered);
        renderCharts(totalIncome, totalExpenses, expenseItems);

    } catch (err) {
        console.error('Load error:', err);
        showToast('Error cargando datos: ' + err.message, 'error');
    }
}

// ============================================
// TRANSACTION OPERATIONS
// ============================================
async function deleteItem(id, type) {
    if (!confirm('¿Eliminar este registro?')) return;
    try {
        await dbService.deleteTransaction(state.currentUser.uid, type, id);
        showToast('Eliminado ✅', 'success');
        loadData();
    } catch (err) {
        showToast('Error: ' + err.message, 'error');
    }
}

async function editItem(id, type) {
    try {
        const data = await dbService.getTransactionById(state.currentUser.uid, type, id);
        if (!data) { showToast('Registro no encontrado', 'error'); return; }

        const dateObj = data.date?.toDate?.() || data.createdAt?.toDate?.() || new Date();
        const dateStr = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')}`;

        if (type === 'income') {
            document.getElementById('income-amount').value = data.amount;
            document.getElementById('income-date').value = dateStr;
            document.getElementById('income-note').value = data.note || '';
            const sourceEl = document.getElementById('income-source');
            if (sourceEl) sourceEl.value = data.source || 'otros';
            const accountEl = document.getElementById('income-account');
            if (accountEl) accountEl.value = data.account || 'efectivo';
            const tagsEl = document.getElementById('income-tags');
            if (tagsEl) tagsEl.value = data.tags || '';
            document.getElementById('income-edit-id').value = id;
            openModal('modal-income');
        } else {
            document.getElementById('expense-amount').value = data.amount;
            document.getElementById('expense-date').value = dateStr;
            document.getElementById('expense-note').value = data.note || '';
            const merchantEl = document.getElementById('expense-merchant');
            if (merchantEl) merchantEl.value = data.merchant || '';
            const methodEl = document.getElementById('expense-method');
            if (methodEl) methodEl.value = data.method || 'efectivo';
            const priorityEl = document.getElementById('expense-priority');
            if (priorityEl) priorityEl.value = data.priority || 'media';
            const radio = document.querySelector(`input[name="category"][value="${data.category}"]`);
            if (radio) radio.checked = true;
            document.getElementById('expense-edit-id').value = id;
            openModal('modal-expense');
        }
    } catch (err) {
        showToast('Error: ' + err.message, 'error');
    }
}

async function duplicateLastExpense() {
    if (!state.currentUser) return;
    if (!state.latestExpenseItem) {
        showToast('No hay gasto previo para duplicar', 'info');
        return;
    }
    try {
        await dbService.addDuplicateExpense(state.currentUser.uid, state.latestExpenseItem);
        showToast('Ultimo gasto duplicado', 'success');
        loadData();
    } catch (err) {
        showToast('No se pudo duplicar: ' + err.message, 'error');
    }
}

// ============================================
// AUTH STATE
// ============================================
auth.onAuthStateChanged(user => {
    if (user) {
        state.currentUser = user;
        showPage('dashboard');
        document.getElementById('user-name').textContent = user.displayName || user.email;

        const sortSelect = document.getElementById('sort-select');
        const rangeStartInput = document.getElementById('range-start');
        const rangeEndInput = document.getElementById('range-end');
        if (sortSelect) sortSelect.value = state.currentSort;
        if (rangeStartInput) rangeStartInput.value = state.customRangeStart;
        if (rangeEndInput) rangeEndInput.value = state.customRangeEnd;

        loadPlanConfigToUi();
        toggleCustomRangePanel(state.currentFilter);
        loadUserProfile();

        const recoveryInput = document.getElementById('recovery-email');
        if (recoveryInput) recoveryInput.value = user.email || '';

        loadData();
    } else {
        state.currentUser = null;
        showPage('login');
    }
});

// ============================================
// EVENT LISTENERS — Auth forms
// ============================================
document.getElementById('login-form').onsubmit = async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const btn = e.target.querySelector('button[type="submit"]');
    const original = btn?.textContent;
    if (btn) { btn.disabled = true; btn.textContent = 'Cargando...'; }
    try {
        await auth.signInWithEmailAndPassword(email, password);
    } catch (err) {
        showToast('Error: ' + err.message, 'error');
        if (btn) { btn.disabled = false; btn.textContent = original; }
    }
};

document.getElementById('register-form').onsubmit = async (e) => {
    e.preventDefault();
    const name = document.getElementById('reg-name').value.trim();
    const email = document.getElementById('reg-email').value;
    const phone = normalizeText(document.getElementById('reg-phone')?.value || '', 20);
    const birthday = document.getElementById('reg-birthday')?.value || '';
    const password = document.getElementById('reg-password').value;

    if (name.length < 2 || name.length > 50) {
        showToast('El nombre debe tener entre 2 y 50 caracteres', 'error');
        return;
    }

    const sanitizedName = name.replace(/<[^>]*>/g, '');
    const btn = e.target.querySelector('button[type="submit"]');
    const original = btn?.textContent;
    if (btn) { btn.disabled = true; btn.textContent = 'Cargando...'; }

    try {
        const cred = await auth.createUserWithEmailAndPassword(email, password);
        await cred.user.updateProfile({ displayName: sanitizedName });
        await db.collection('users').doc(cred.user.uid).set({
            name: sanitizedName,
            phone,
            birthday,
            currency: 'PEN',
            monthlyTarget: 0,
            bio: '',
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        }, { merge: true });
        showToast('¡Cuenta creada! Bienvenido a Konteo 05', 'success');
    } catch (err) {
        showToast('Error: ' + err.message, 'error');
        if (btn) { btn.disabled = false; btn.textContent = original; }
    }
};

document.getElementById('logout-btn').onclick = async () => {
    if (confirm('¿Cerrar sesión?')) {
        try {
            await auth.signOut();
            showToast('Sesión cerrada', 'success');
        } catch (err) {
            showToast('Error: ' + err.message, 'error');
        }
    }
};

document.getElementById('show-register').onclick = (e) => { e.preventDefault(); showPage('register'); };
document.getElementById('show-login').onclick = (e) => { e.preventDefault(); showPage('login'); };

// ============================================
// EVENT LISTENERS — Forgot password & recovery
// ============================================
document.getElementById('forgot-password-link')?.addEventListener('click', (e) => {
    e.preventDefault();
    const email = (document.getElementById('email')?.value || '').trim();
    const recoveryInput = document.getElementById('recovery-email');
    if (recoveryInput) recoveryInput.value = email;
    openModal('modal-recovery');
});

document.getElementById('btn-open-recovery')?.addEventListener('click', () => {
    const recoveryInput = document.getElementById('recovery-email');
    const recoveryAltInput = document.getElementById('recovery-alt-email');
    if (recoveryInput) recoveryInput.value = state.currentUser?.email || '';
    if (recoveryAltInput) recoveryAltInput.value = state.userProfile.recoveryEmail || '';
    closeModal('modal-profile');
    openModal('modal-recovery');
});

document.getElementById('form-recovery')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = (document.getElementById('recovery-email')?.value || '').trim();
    const alt = (document.getElementById('recovery-alt-email')?.value || '').trim();
    if (!email) { showToast('Ingresa el correo de la cuenta', 'error'); return; }
    try {
        await auth.sendPasswordResetEmail(email);
        let altSaved = true;
        if (alt && state.currentUser) {
            try {
                await db.collection('users').doc(state.currentUser.uid).set({
                    lastRecoveryRequestAt: firebase.firestore.FieldValue.serverTimestamp(),
                    recoveryEmail: alt || null
                }, { merge: true });
            } catch (saveErr) {
                altSaved = false;
                console.warn('No se pudo guardar el correo alterno:', saveErr?.message || saveErr);
            }
        }
        closeModal('modal-recovery');
        showToast(
            altSaved ? 'Enlace de recuperación enviado' : 'Enlace enviado. No se guardó el correo alterno.',
            altSaved ? 'success' : 'warning'
        );
    } catch (err) {
        showToast('No se pudo enviar el enlace: ' + err.message, 'error');
    }
});

// ============================================
// EVENT LISTENERS — Profile
// ============================================
document.getElementById('profile-btn')?.addEventListener('click', () => openModal('modal-profile'));
document.getElementById('form-profile')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    try { await saveUserProfile(); } catch (err) {
        showToast('Error al guardar perfil: ' + err.message, 'error');
    }
});

// ============================================
// EVENT LISTENERS — Period filters
// ============================================
document.querySelectorAll('.filter').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.filter').forEach(b => {
            b.classList.remove('active');
            b.setAttribute('aria-pressed', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');
        state.currentFilter = btn.dataset.filter;
        toggleCustomRangePanel(state.currentFilter);
        if (state.currentFilter === 'custom') {
            document.getElementById('range-start')?.focus();
        }
        loadData();
    });
});

// Set max date on inputs
const incomeDateInput = document.getElementById('income-date');
const expenseDateInput = document.getElementById('expense-date');
const rangeStartInput = document.getElementById('range-start');
const rangeEndInput = document.getElementById('range-end');
if (incomeDateInput) incomeDateInput.setAttribute('max', todayStr);
if (expenseDateInput) expenseDateInput.setAttribute('max', todayStr);
if (rangeStartInput) rangeStartInput.setAttribute('max', todayStr);
if (rangeEndInput) rangeEndInput.setAttribute('max', todayStr);
if (rangeStartInput && state.customRangeStart) rangeStartInput.value = state.customRangeStart;
if (rangeEndInput && state.customRangeEnd) rangeEndInput.value = state.customRangeEnd;

rangeStartInput?.addEventListener('change', (e) => { state.customRangeStart = e.target.value; persistUiState(); });
rangeEndInput?.addEventListener('change', (e) => { state.customRangeEnd = e.target.value; persistUiState(); });

document.getElementById('btn-apply-range')?.addEventListener('click', () => {
    const startValue = rangeStartInput?.value || '';
    const endValue = rangeEndInput?.value || '';
    if (!startValue || !endValue) { showToast('Define fecha inicio y fin', 'error'); return; }
    if (startValue > endValue) { showToast('La fecha inicio no puede ser mayor que la fecha fin', 'error'); return; }
    state.customRangeStart = startValue;
    state.customRangeEnd = endValue;
    state.currentFilter = 'custom';
    persistUiState();
    document.querySelectorAll('.filter').forEach(b => {
        const active = b.dataset.filter === 'custom';
        b.classList.toggle('active', active);
        b.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
    loadData();
});

document.getElementById('sort-select')?.addEventListener('change', (e) => {
    state.currentSort = e.target.value;
    persistUiState();
    loadData();
});

// ============================================
// EVENT LISTENERS — Modals (income/expense/budget)
// ============================================
document.getElementById('btn-income').onclick = () => {
    document.getElementById('income-date').value = todayStr;
    document.getElementById('income-edit-id').value = '';
    const source = document.getElementById('income-source');
    if (source) source.value = 'salario';
    const account = document.getElementById('income-account');
    if (account) account.value = 'efectivo';
    const tags = document.getElementById('income-tags');
    if (tags) tags.value = '';
    openModal('modal-income');
};

document.getElementById('btn-expense').onclick = () => {
    document.getElementById('expense-date').value = todayStr;
    document.getElementById('expense-edit-id').value = '';
    const merchant = document.getElementById('expense-merchant');
    if (merchant) merchant.value = '';
    const method = document.getElementById('expense-method');
    if (method) method.value = 'efectivo';
    const priority = document.getElementById('expense-priority');
    if (priority) priority.value = 'media';
    openModal('modal-expense');
};

// ============================================
// EVENT LISTENERS — Save income
// ============================================
document.getElementById('form-income').onsubmit = async (e) => {
    e.preventDefault();
    let amount = parseFloat(document.getElementById('income-amount').value);
    if (isNaN(amount) || amount <= 0 || amount > 999999999) {
        showToast('Ingresa un monto válido (máximo 999,999,999)', 'error');
        return;
    }
    amount = Math.round(amount * 100) / 100;

    const dateStr = document.getElementById('income-date').value;
    const note = normalizeNote(document.getElementById('income-note').value);
    const source = document.getElementById('income-source')?.value || 'otros';
    const account = document.getElementById('income-account')?.value || 'efectivo';
    const tags = normalizeTags(document.getElementById('income-tags')?.value || '');
    const editId = document.getElementById('income-edit-id').value;

    if (!dateStr) { showToast('Selecciona una fecha', 'error'); return; }
    const [y, m, d] = dateStr.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    if (Number.isNaN(date.getTime())) { showToast('Fecha inválida', 'error'); return; }
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);
    if (date > todayEnd) { showToast('No puedes registrar transacciones futuras', 'error'); return; }
    if (!state.isOnline) { showToast('Sin conexión. Conéctate para guardar.', 'error'); return; }

    try {
        const data = {
            amount,
            date: firebase.firestore.Timestamp.fromDate(date),
            note, source, account, tags
        };

        await dbService.saveIncome(state.currentUser.uid, data, editId || null);
        showToast(editId ? 'Ingreso actualizado ✅' : 'Ingreso guardado ✅', 'success');
        closeModal('modal-income');
        e.target.reset();
        document.getElementById('income-edit-id').value = '';
        loadData();
    } catch (err) {
        showToast('Error: ' + err.message, 'error');
    }
};

// ============================================
// EVENT LISTENERS — Save expense
// ============================================
document.getElementById('form-expense').onsubmit = async (e) => {
    e.preventDefault();
    let amount = parseFloat(document.getElementById('expense-amount').value);
    if (isNaN(amount) || amount <= 0 || amount > 999999999) {
        showToast('Ingresa un monto válido (máximo 999,999,999)', 'error');
        return;
    }
    amount = Math.round(amount * 100) / 100;

    const dateStr = document.getElementById('expense-date').value;
    const category = document.querySelector('input[name="category"]:checked')?.value;
    const note = normalizeNote(document.getElementById('expense-note').value);
    const merchant = normalizeText(document.getElementById('expense-merchant')?.value || '', 80);
    const method = document.getElementById('expense-method')?.value || 'efectivo';
    const priority = document.getElementById('expense-priority')?.value || 'media';
    const editId = document.getElementById('expense-edit-id').value;

    if (!category) { showToast('Selecciona una categoría', 'error'); return; }

    if (!dateStr) { showToast('Selecciona una fecha', 'error'); return; }
    const [y, m, d] = dateStr.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    if (Number.isNaN(date.getTime())) { showToast('Fecha inválida', 'error'); return; }
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);
    if (date > todayEnd) { showToast('No puedes registrar transacciones futuras', 'error'); return; }
    if (!state.isOnline) { showToast('Sin conexión. Conéctate para guardar.', 'error'); return; }

    try {
        const data = {
            amount,
            date: firebase.firestore.Timestamp.fromDate(date),
            category, note, merchant, method, priority
        };

        await dbService.saveExpense(state.currentUser.uid, data, editId || null);
        showToast(editId ? 'Gasto actualizado ✅' : 'Gasto guardado ✅', 'success');
        closeModal('modal-expense');
        e.target.reset();
        document.getElementById('expense-edit-id').value = '';
        loadData();
    } catch (err) {
        showToast('Error: ' + err.message, 'error');
    }
};



// ============================================
// EVENT DELEGATION — Transaction actions, cancel, quick amounts
// ============================================
if (listEl) {
    listEl.addEventListener('click', (e) => {
        const editBtn = e.target.closest('.edit-btn');
        const deleteBtn = e.target.closest('.delete-btn');
        if (editBtn) editItem(editBtn.dataset.id, editBtn.dataset.type);
        if (deleteBtn) deleteItem(deleteBtn.dataset.id, deleteBtn.dataset.type);
    });
}

document.addEventListener('click', (e) => {
    const cancelBtn = e.target.closest('.cancel[data-modal]');
    if (cancelBtn) closeModal(cancelBtn.dataset.modal);

    const quickAmountBtn = e.target.closest('.quick-amount');
    if (quickAmountBtn) {
        const wrap = quickAmountBtn.closest('.quick-amounts');
        const targetId = wrap?.dataset?.target;
        const targetInput = targetId ? document.getElementById(targetId) : null;
        const amount = parseFloat(quickAmountBtn.dataset.amount || '0');
        if (targetInput && !isNaN(amount)) {
            const currentValue = parseFloat(targetInput.value || '0');
            const next = (isNaN(currentValue) ? 0 : currentValue) + amount;
            targetInput.value = (Math.round(next * 100) / 100).toFixed(2);
            targetInput.focus();
        }
    }
});

// ============================================
// EVENT LISTENERS — Search, category, duplicate, plan
// ============================================
let searchTimeout;
document.getElementById('search-input')?.addEventListener('input', () => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => loadData(), 300);
});
document.getElementById('category-filter')?.addEventListener('change', loadData);
document.getElementById('btn-duplicate-expense')?.addEventListener('click', duplicateLastExpense);
document.getElementById('btn-save-plan')?.addEventListener('click', async () => {
    if (await savePlanConfigFromUi()) loadData();
});

// ============================================
// EVENT LISTENERS — Export
// ============================================
function syncExportPeriodUi() {
    document.querySelectorAll('.export-period-btn').forEach(btn => {
        const active = btn.dataset.period === state.exportPeriod;
        btn.classList.toggle('active', active);
        btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
}

syncExportPeriodUi();
document.querySelectorAll('.export-period-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        state.exportPeriod = btn.dataset.period || 'semanal';
        persistUiState();
        syncExportPeriodUi();
    });
});

document.getElementById('btn-export-excel')?.addEventListener('click', () => exportToExcel(state.exportPeriod));
document.getElementById('btn-export-pdf')?.addEventListener('click', () => exportToPDF(state.exportPeriod));

// ============================================
// THEME TOGGLE
// ============================================
document.getElementById('theme-toggle-btn')?.addEventListener('click', toggleTheme);

// ============================================
// SERVICE WORKER (PWA)
// ============================================
if ('serviceWorker' in navigator) {
    const isLocal = location.hostname === '127.0.0.1' || location.hostname === 'localhost';
    if (isLocal) {
        // Evita caché agresiva en desarrollo local.
        navigator.serviceWorker.getRegistrations()
            .then(regs => Promise.all(regs.map(r => r.unregister())))
            .catch(() => { });
    } else {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/service-worker.js')
                .then(reg => {
                    reg.addEventListener('updatefound', () => {
                        const newWorker = reg.installing;
                        newWorker.addEventListener('statechange', () => {
                            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                if (confirm('Nueva versión disponible. ¿Recargar?')) {
                                    window.location.reload();
                                }
                            }
                        });
                    });
                })
                .catch(() => { });
        });
    }
}

// ============================================
// INIT
// ============================================
initTheme();

