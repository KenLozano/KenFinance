// js/state.js — Centralized application state

export const state = {
    currentUser: null,
    currentFilter: 'today',
    currentBudget: 0,
    currentLoadToken: 0,
    isOnline: navigator.onLine,
    currentSort: localStorage.getItem('KenFinance.sort') || 'date_desc',
    exportPeriod: localStorage.getItem('KenFinance.export.period') || 'semanal',
    customRangeStart: localStorage.getItem('KenFinance.range.start') || '',
    customRangeEnd: localStorage.getItem('KenFinance.range.end') || '',
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
    localStorage.setItem('KenFinance.sort', state.currentSort);
    localStorage.setItem('KenFinance.export.period', state.exportPeriod || 'semanal');
    localStorage.setItem('KenFinance.range.start', state.customRangeStart || '');
    localStorage.setItem('KenFinance.range.end', state.customRangeEnd || '');
}
