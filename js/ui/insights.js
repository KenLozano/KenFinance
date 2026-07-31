// js/ui/insights.js — Financial insights & strategy panel

import { median } from './helpers.js';
import { state } from '../state.js';
import { showToast } from './toast.js';
import * as dbService from '../services/dbService.js';

export function updateInsights({ totalIncome, totalExpenses, balance, expenseItems, periodDays }) {
    const savingsRate = totalIncome > 0 ? ((balance / totalIncome) * 100) : 0;
    const dailyBurn = periodDays > 0 ? totalExpenses / periodDays : 0;
    const runway = dailyBurn > 0 ? Math.max(0, Math.floor(balance / dailyBurn)) : 0;

    const categoryTotals = { green: 0, yellow: 0, red: 0 };
    expenseItems.forEach(item => {
        if (categoryTotals[item.category] !== undefined) categoryTotals[item.category] += item.amount;
    });
    const topCategoryKey = Object.keys(categoryTotals).sort((a, b) => categoryTotals[b] - categoryTotals[a])[0];
    const categoryLabel = { green: 'Fijo', yellow: 'Necesario', red: 'Antojo' }[topCategoryKey] || 'Sin datos';
    const med = median(expenseItems.map(e => e.amount));
    const anomalies = med > 0 ? expenseItems.filter(e => e.amount >= med * 2).length : 0;

    const elSavings = document.getElementById('insight-savings-rate');
    const elRunway = document.getElementById('insight-runway');
    const elTop = document.getElementById('insight-top-category');
    const elBurn = document.getElementById('insight-daily-burn');
    const elAnomalies = document.getElementById('insight-anomalies');
    if (elSavings) elSavings.textContent = `${savingsRate.toFixed(1)}%`;
    if (elRunway) elRunway.textContent = `${runway} días`;
    if (elTop) elTop.textContent = categoryTotals[topCategoryKey] > 0 ? categoryLabel : 'Sin datos';
    if (elBurn) elBurn.textContent = `S/ ${dailyBurn.toFixed(2)}`;
    if (elAnomalies) elAnomalies.textContent = String(anomalies);
}

export function updateStrategyPanel({ totalIncome, totalExpenses, balance, periodDays }) {
    const monthlyProjectedBalance = periodDays > 0 ? (balance / periodDays) * 30 : balance;
    const targetVariance = state.planConfig.incomeTarget > 0 ? (totalIncome - state.planConfig.incomeTarget) : 0;
    const expenseRisk = state.planConfig.expenseLimit > 0 ? (totalExpenses / state.planConfig.expenseLimit) : 0;
    const savingsRate = totalIncome > 0 ? (balance / totalIncome) : 0;

    let score = 50;
    score += Math.max(-20, Math.min(25, Math.round(savingsRate * 40)));
    score += expenseRisk > 0 ? Math.max(-25, Math.min(20, Math.round((1 - expenseRisk) * 20))) : 0;
    score += targetVariance !== 0 ? Math.max(-10, Math.min(10, Math.round(targetVariance / 200))) : 0;
    score = Math.max(0, Math.min(100, score));

    const statusEl = document.getElementById('strategy-status');
    const forecastEl = document.getElementById('strategy-forecast');
    const varianceEl = document.getElementById('strategy-variance');
    const scoreEl = document.getElementById('strategy-score');

    if (forecastEl) forecastEl.textContent = `S/ ${monthlyProjectedBalance.toFixed(2)}`;
    if (varianceEl) varianceEl.textContent = `S/ ${targetVariance.toFixed(2)}`;
    if (scoreEl) scoreEl.textContent = `${score}/100`;

    if (!statusEl) return;
    if (state.planConfig.incomeTarget <= 0 && state.planConfig.expenseLimit <= 0) {
        statusEl.textContent = 'Configura objetivos para obtener recomendaciones.';
        return;
    }
    if (expenseRisk > 1.05) {
        statusEl.textContent = 'Riesgo alto: vas por encima del límite de gasto. Ajusta categorías no esenciales.';
        statusEl.style.color = 'var(--expense)';
    } else if (savingsRate < 0.1) {
        statusEl.textContent = 'Aviso: el ahorro es bajo. Revisa gastos fijos y define un tope semanal por categoría.';
        statusEl.style.color = '#d97706'; // yellow
    } else {
        statusEl.textContent = 'Buen ritmo: mantienes una trayectoria saludable frente al plan mensual.';
        statusEl.style.color = 'var(--income)';
    }

    // UPDATE UNIFIED BUDGET PROGRESS BAR
    const progressBar = document.getElementById('budget-progress-bar');
    const budgetStatusText = document.getElementById('budget-status');

    if (state.planConfig.expenseLimit > 0) {
        const pct = Math.min((totalExpenses / state.planConfig.expenseLimit) * 100, 100);
        if (progressBar) progressBar.style.width = `${Math.max(0, pct)}%`;

        if (totalExpenses > state.planConfig.expenseLimit) {
            if (progressBar) progressBar.style.background = 'var(--expense)';
            if (budgetStatusText) budgetStatusText.textContent = `Excedido por S/ ${(totalExpenses - state.planConfig.expenseLimit).toFixed(2)}`;
            if (budgetStatusText) budgetStatusText.style.color = 'var(--expense)';
        } else {
            if (progressBar) progressBar.style.background = 'var(--income)';
            if (budgetStatusText) budgetStatusText.textContent = `S/ ${(state.planConfig.expenseLimit - totalExpenses).toFixed(2)} disponibles`;
            if (budgetStatusText) budgetStatusText.style.color = 'var(--income)';
        }
    } else {
        if (progressBar) progressBar.style.width = '0%';
        if (budgetStatusText) budgetStatusText.textContent = 'Sin límite';
        if (budgetStatusText) budgetStatusText.style.color = 'var(--muted)';
    }
}

export function loadPlanConfigToUi() {
    const incomeInput = document.getElementById('plan-income-target');
    const expenseInput = document.getElementById('plan-expense-limit');
    if (incomeInput) incomeInput.value = state.planConfig.incomeTarget > 0 ? String(state.planConfig.incomeTarget) : '';
    if (expenseInput) expenseInput.value = state.planConfig.expenseLimit > 0 ? String(state.planConfig.expenseLimit) : '';
}

export async function savePlanConfigFromUi() {
    const incomeInput = document.getElementById('plan-income-target');
    const expenseInput = document.getElementById('plan-expense-limit');
    const incomeTarget = Number(incomeInput?.value || 0);
    const expenseLimit = Number(expenseInput?.value || 0);

    if (incomeTarget < 0 || expenseLimit < 0) {
        showToast('Los objetivos no pueden ser negativos', 'error');
        return false;
    }

    if (!state.currentUser) {
        showToast('Error de autenticación', 'error');
        return false;
    }

    state.planConfig.incomeTarget = incomeTarget;
    state.planConfig.expenseLimit = expenseLimit;

    try {
        await dbService.savePlan(state.currentUser.uid, { incomeTarget, expenseLimit });
        showToast('Plan financiero actualizado 🎯', 'success');
        return true;
    } catch (err) {
        showToast('Error guardando en la nube: ' + err.message, 'error');
        return false;
    }
}
