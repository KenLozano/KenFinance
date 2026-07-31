// js/state.js — Centralized application state

export const state = {
    currentUser: null,
    currentFilter: 'today',
    currentBudget: 0,
    currentLoadToken: 0,
    isOnline: navigator.onLine,
    currentSort: localStorage.getItem('konteo.sort') || 'date_desc',
    exportPeriod: localStorage.getItem('konteo.export.period') || 'semanal',
    customRangeStart: localStorage.getItem('konteo.range.start') || '',
    customRangeEnd: localStorage.getItem('konteo.range.end') || '',
    latestExpenseItem: null,
    planConfig: {
        incomeTarget: 0,
        expenseLimit: 0
    },
    userProfile: {
        name: '', phone: '', birthday: '', city: '', country: '',
        occupation: '', currency: 'PEN', monthlyTarget: 0,
        bio: '', recoveryEmail: '', emergencyContact: ''
    }
};

export function persistUiState() {
    localStorage.setItem('konteo.sort', state.currentSort);
    localStorage.setItem('konteo.export.period', state.exportPeriod || 'semanal');
    localStorage.setItem('konteo.range.start', state.customRangeStart || '');
    localStorage.setItem('konteo.range.end', state.customRangeEnd || '');
}
