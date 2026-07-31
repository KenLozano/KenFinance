// js/ui/charts.js — Chart.js rendering

const charts = { incomeExpense: null, category: null };

/** Returns theme-aware colors for Chart.js */
function getChartColors() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    return {
        tick: isDark ? '#9ca3af' : '#64748b',
        grid: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.07)',
        legend: isDark ? '#9ca3af' : '#64748b',
        emptyText: isDark ? '#4b5563' : '#94a3b8'
    };
}

/** Renders a "Sin datos" placeholder over an empty chart canvas */
function renderEmptyState(ctx, message = 'Sin datos para este período') {
    const colors = getChartColors();
    const parent = ctx.parentElement;
    let placeholder = parent.querySelector('.chart-empty');
    if (!placeholder) {
        placeholder = document.createElement('div');
        placeholder.className = 'chart-empty';
        placeholder.style.cssText = `
            position:absolute; inset:0; display:flex; flex-direction:column;
            align-items:center; justify-content:center; gap:8px;
            color:${colors.emptyText}; font-size:13px; font-weight:600;
            pointer-events:none;
        `;
        const icon = document.createElement('span');
        icon.style.fontSize = '28px';
        icon.textContent = '📊';
        const txt = document.createElement('span');
        txt.textContent = message;
        placeholder.append(icon, txt);
        // Make parent relative for absolute positioning
        parent.style.position = 'relative';
        parent.appendChild(placeholder);
    }
    ctx.style.opacity = '0';
}

function clearEmptyState(ctx) {
    const parent = ctx.parentElement;
    const placeholder = parent.querySelector('.chart-empty');
    if (placeholder) placeholder.remove();
    ctx.style.opacity = '';
}

export function renderCharts(totalIncome, totalExpenses, expenseItems) {
    if (typeof Chart === 'undefined') return;

    const colors = getChartColors();
    const hasData = totalIncome > 0 || totalExpenses > 0;

    const ctx1 = document.getElementById('incomeExpenseChart');
    if (ctx1) {
        if (charts.incomeExpense) charts.incomeExpense.destroy();
        if (!hasData) {
            renderEmptyState(ctx1);
        } else {
            clearEmptyState(ctx1);
            charts.incomeExpense = new Chart(ctx1, {
                type: 'bar',
                data: {
                    labels: ['Ingresos', 'Gastos'],
                    datasets: [{
                        label: 'Monto (S/)',
                        data: [totalIncome, totalExpenses],
                        backgroundColor: ['#34d399', '#f87171'],
                        borderRadius: 8
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: { color: colors.tick },
                            grid: { color: colors.grid }
                        },
                        x: {
                            ticks: { color: colors.tick },
                            grid: { display: false }
                        }
                    }
                }
            });
        }
    }

    const categoryTotals = { green: 0, yellow: 0, red: 0 };
    expenseItems.forEach(item => {
        if (categoryTotals[item.category] !== undefined) {
            categoryTotals[item.category] += Number(item.amount) || 0;
        }
    });
    const hasExpenses = expenseItems.length > 0;

    const ctx2 = document.getElementById('categoryChart');
    if (ctx2) {
        if (charts.category) charts.category.destroy();
        if (!hasExpenses) {
            renderEmptyState(ctx2);
        } else {
            clearEmptyState(ctx2);
            charts.category = new Chart(ctx2, {
                type: 'doughnut',
                data: {
                    labels: ['🟢 Fijo', '🟡 Necesario', '🔴 Antojo'],
                    datasets: [{
                        data: [categoryTotals.green, categoryTotals.yellow, categoryTotals.red],
                        backgroundColor: ['#34d399', '#fbbf24', '#f87171'],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: { color: colors.legend, padding: 16 }
                        }
                    }
                }
            });
        }
    }
}
