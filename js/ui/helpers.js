// js/ui/helpers.js — Shared utility functions

export function showPage(page) {
    document.getElementById('login-page')?.classList.add('hidden');
    document.getElementById('register-page')?.classList.add('hidden');
    document.getElementById('dashboard-page')?.classList.add('hidden');
    if (page === 'login') document.getElementById('login-page')?.classList.remove('hidden');
    if (page === 'register') document.getElementById('register-page')?.classList.remove('hidden');
    if (page === 'dashboard') document.getElementById('dashboard-page')?.classList.remove('hidden');
}

export function fmt(n) {
    return n.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function median(values) {
    if (!values.length) return 0;
    const sorted = [...values].sort((a, b) => a - b);
    const half = Math.floor(sorted.length / 2);
    return sorted.length % 2 ? sorted[half] : (sorted[half - 1] + sorted[half]) / 2;
}

export function normalizeText(rawValue, max = 100) {
    return (rawValue || '').replace(/\s+/g, ' ').trim().slice(0, max);
}

export function normalizeNote(rawValue) {
    return normalizeText(rawValue, 100);
}

export function normalizeTags(rawValue) {
    return normalizeText(rawValue, 100)
        .split(',').map(t => t.trim()).filter(Boolean).slice(0, 5).join(', ');
}

export function escapeHtml(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

export function sortTransactions(items, currentSort) {
    const toDateMs = (item) => {
        const d = item?.date?.toDate?.();
        return d instanceof Date && !Number.isNaN(d.getTime()) ? d.getTime() : 0;
    };
    const toAmount = (item) => {
        const n = Number(item?.amount);
        return Number.isFinite(n) ? n : 0;
    };

    const sorted = [...items];
    sorted.sort((a, b) => {
        if (currentSort === 'amount_desc') return toAmount(b) - toAmount(a);
        if (currentSort === 'amount_asc') return toAmount(a) - toAmount(b);
        if (currentSort === 'date_asc') return toDateMs(a) - toDateMs(b);
        return toDateMs(b) - toDateMs(a);
    });
    return sorted;
}

export function calculateProfileCompletion(profile) {
    const fields = [
        profile.name, profile.phone, profile.birthday, profile.city,
        profile.country, profile.occupation, profile.currency,
        profile.bio, profile.recoveryEmail, profile.emergencyContact
    ];
    const completed = fields.filter(v => typeof v === 'string' ? v.trim() : !!v).length;
    return Math.round((completed / fields.length) * 100);
}

export function todayString() {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}

export function toggleCustomRangePanel(currentFilter) {
    const panel = document.getElementById('custom-range-panel');
    if (panel) panel.classList.toggle('hidden', currentFilter !== 'custom');
}
