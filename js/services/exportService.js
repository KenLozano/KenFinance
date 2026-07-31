// js/services/exportService.js - Excel & PDF export with lazy-loaded libs

import { state } from '../state.js';
import { showToast } from '../ui/toast.js';
import { getAllTransactionsOrdered } from './dbService.js';

function loadScript(src) {
    return new Promise((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) {
            resolve();
            return;
        }
        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        script.onerror = () => reject(new Error(`No se pudo cargar: ${src}`));
        document.head.appendChild(script);
    });
}

async function ensureSheetJS() {
    if (!window.XLSX) {
        await loadScript('https://cdn.sheetjs.com/xlsx-0.20.1/package/dist/xlsx.full.min.js');
    }
}

async function ensureJsPDF() {
    if (!window.jspdf) {
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');
    }
}

function safeNum(value) {
    const n = Number(value);
    return Number.isFinite(n) ? n : 0;
}

function txDate(item) {
    return item?.date?.toDate?.() || item?.createdAt?.toDate?.() || new Date(0);
}

function inPeriod(date, period) {
    const now = new Date();
    if (period === 'semanal') {
        const start = new Date(now);
        // Hoy + 6 dias previos = 7 dias calendario.
        start.setDate(start.getDate() - 6);
        start.setHours(0, 0, 0, 0);
        return date >= start;
    }
    if (period === 'mensual') {
        const start = new Date(now.getFullYear(), now.getMonth(), 1);
        return date >= start;
    }
    return true;
}

async function getFilteredDataForExport(uid, period) {
    const txs = await getAllTransactionsOrdered(uid);
    const selected = txs.filter((t) => inPeriod(txDate(t), period));
    return {
        income: selected.filter(t => t.type === 'income'),
        expenses: selected.filter(t => t.type === 'expense')
    };
}

function createSummarySheet(data, period, email) {
    const totalIncome = data.income.reduce((sum, i) => sum + safeNum(i.amount), 0);
    const totalExpenses = data.expenses.reduce((sum, e) => sum + safeNum(e.amount), 0);
    const balance = totalIncome - totalExpenses;
    const greenExp = data.expenses.filter(e => e.category === 'green').reduce((s, e) => s + safeNum(e.amount), 0);
    const yellowExp = data.expenses.filter(e => e.category === 'yellow').reduce((s, e) => s + safeNum(e.amount), 0);
    const redExp = data.expenses.filter(e => e.category === 'red').reduce((s, e) => s + safeNum(e.amount), 0);
    const savingsRate = totalIncome > 0 ? ((balance / totalIncome) * 100).toFixed(1) : '0.0';
    const periodName = period === 'semanal' ? 'SEMANAL' : 'MENSUAL';

    return [
        ['KONTEO 05 - REPORTE FINANCIERO ' + periodName],
        ['Generado:', new Date().toLocaleString('es-PE')],
        ['Usuario:', email],
        [],
        ['RESUMEN'],
        [], ['Concepto', 'Monto (S/)'],
        ['Total Ingresos', totalIncome.toFixed(2)],
        ['Total Gastos', totalExpenses.toFixed(2)],
        ['Balance', balance.toFixed(2)],
        [],
        ['DISTRIBUCION DE GASTOS'],
        [], ['Categoria', 'Monto (S/)'],
        ['Fijo', greenExp.toFixed(2)],
        ['Necesario', yellowExp.toFixed(2)],
        ['Antojo', redExp.toFixed(2)],
        [],
        ['Tasa de Ahorro', savingsRate + '%'],
        ['Transacciones', data.income.length + data.expenses.length]
    ];
}

function createIncomeSheet(income) {
    const days = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];
    const rows = income
        .map(item => {
            const date = txDate(item);
            return {
                ts: date.getTime(),
                row: [date.toLocaleDateString('es-PE'), safeNum(item.amount).toFixed(2), item.note || '-', days[date.getDay()]]
            };
        })
        .sort((a, b) => b.ts - a.ts)
        .map(x => x.row);

    return [['INGRESOS'], [], ['Fecha', 'Monto', 'Nota', 'Dia'], ...rows, [], ['TOTAL', income.reduce((s, i) => s + safeNum(i.amount), 0).toFixed(2)]];
}

function createExpenseSheet(expenses) {
    const catNames = { green: 'Fijo', yellow: 'Necesario', red: 'Antojo' };
    const days = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];
    const rows = expenses
        .map(item => {
            const date = txDate(item);
            return {
                ts: date.getTime(),
                row: [date.toLocaleDateString('es-PE'), safeNum(item.amount).toFixed(2), catNames[item.category] || item.category, item.note || '-', days[date.getDay()]]
            };
        })
        .sort((a, b) => b.ts - a.ts)
        .map(x => x.row);

    return [['GASTOS'], [], ['Fecha', 'Monto', 'Categoria', 'Nota', 'Dia'], ...rows, [], ['TOTAL', expenses.reduce((s, e) => s + safeNum(e.amount), 0).toFixed(2)]];
}

function createCategorySheet(expenses) {
    const cats = {
        green: { name: 'Fijo', items: [] },
        yellow: { name: 'Necesario', items: [] },
        red: { name: 'Antojo', items: [] }
    };
    expenses.forEach(e => { if (cats[e.category]) cats[e.category].items.push(e); });

    const result = [['ANALISIS POR CATEGORIA'], []];
    Object.values(cats).forEach(cat => {
        const total = cat.items.reduce((s, i) => s + safeNum(i.amount), 0);
        result.push([cat.name], ['Total:', 'S/ ' + total.toFixed(2)], ['Cantidad:', cat.items.length], []);
    });
    return result;
}

export async function exportToExcel(period) {
    if (!state.currentUser) return;
    try {
        showToast('Cargando libreria de Excel...', 'info');
        await ensureSheetJS();

        const data = await getFilteredDataForExport(state.currentUser.uid, period);
        const wb = XLSX.utils.book_new();

        const summary = createSummarySheet(data, period, state.currentUser.email);
        const ws1 = XLSX.utils.aoa_to_sheet(summary);
        ws1['!cols'] = [{ wch: 30 }, { wch: 15 }];
        XLSX.utils.book_append_sheet(wb, ws1, 'Resumen');

        const incomeSheet = createIncomeSheet(data.income);
        const ws2 = XLSX.utils.aoa_to_sheet(incomeSheet);
        ws2['!cols'] = [{ wch: 15 }, { wch: 12 }, { wch: 30 }, { wch: 15 }];
        XLSX.utils.book_append_sheet(wb, ws2, 'Ingresos');

        const expenseSheet = createExpenseSheet(data.expenses);
        const ws3 = XLSX.utils.aoa_to_sheet(expenseSheet);
        ws3['!cols'] = [{ wch: 15 }, { wch: 12 }, { wch: 18 }, { wch: 30 }, { wch: 15 }];
        XLSX.utils.book_append_sheet(wb, ws3, 'Gastos');

        const categorySheet = createCategorySheet(data.expenses);
        const ws4 = XLSX.utils.aoa_to_sheet(categorySheet);
        ws4['!cols'] = [{ wch: 30 }, { wch: 15 }];
        XLSX.utils.book_append_sheet(wb, ws4, 'Analisis');

        const periodName = period === 'semanal' ? 'Semanal' : 'Mensual';
        XLSX.writeFile(wb, `Konteo05_${periodName}_${new Date().toISOString().split('T')[0]}.xlsx`);
        showToast(`Reporte ${periodName} descargado`, 'success');
    } catch (err) {
        showToast('Error al exportar: ' + err.message, 'error');
    }
}

async function getFilteredTransactions(type) {
    if (!state.currentUser) return [];
    try {
        const txs = await getAllTransactionsOrdered(state.currentUser.uid);
        return txs.filter(t => inPeriod(txDate(t), type));
    } catch {
        return [];
    }
}

export async function exportToPDF(type) {
    try {
        showToast('Cargando libreria de PDF...', 'info');
        await ensureJsPDF();

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        const transactions = await getFilteredTransactions(type);

        let totalInc = 0;
        let totalExp = 0;
        transactions.forEach(t => {
            if (t.type === 'income') totalInc += safeNum(t.amount);
            else totalExp += safeNum(t.amount);
        });
        const bal = totalInc - totalExp;

        doc.setFontSize(20);
        doc.setTextColor(109, 91, 255);
        doc.text('Konteo 05 - Reporte Financiero', 105, 20, { align: 'center' });

        doc.setFontSize(12);
        doc.setTextColor(100);
        const typeText = type === 'semanal' ? 'Semanal' : 'Mensual';
        doc.text(`Reporte ${typeText}`, 105, 28, { align: 'center' });
        doc.text(`Generado: ${new Date().toLocaleDateString('es-PE')}`, 105, 34, { align: 'center' });

        doc.setFontSize(14);
        doc.setTextColor(0);
        doc.text('Balance:', 20, 50);
        doc.setTextColor(bal >= 0 ? 52 : 248, bal >= 0 ? 211 : 113, bal >= 0 ? 153 : 113);
        doc.text(`S/ ${bal.toFixed(2)}`, 50, 50);

        doc.setTextColor(52, 211, 153);
        doc.text(`Ingresos: S/ ${totalInc.toFixed(2)}`, 20, 62);
        doc.setTextColor(248, 113, 113);
        doc.text(`Gastos: S/ ${totalExp.toFixed(2)}`, 20, 72);

        doc.setTextColor(0);
        doc.setFontSize(12);
        doc.text('Transacciones:', 20, 88);

        let yPos = 98;
        if (transactions.length === 0) {
            doc.setFontSize(10);
            doc.setTextColor(150);
            doc.text('No hay transacciones', 20, yPos);
        } else {
            doc.setFontSize(9);
            transactions.slice(0, 25).forEach(t => {
                if (yPos > 270) {
                    doc.addPage();
                    yPos = 20;
                }
                const date = txDate(t);
                const catMark = { green: 'F', yellow: 'N', red: 'A' };
                const mark = t.type === 'income' ? 'I' : (catMark[t.category] || 'G');
                doc.setTextColor(t.type === 'income' ? 52 : 248, t.type === 'income' ? 211 : 113, t.type === 'income' ? 153 : 113);
                doc.text(`${mark} ${t.note || 'Sin nota'}`, 20, yPos);
                doc.text(`S/ ${safeNum(t.amount).toFixed(2)}`, 160, yPos);
                doc.setTextColor(150);
                doc.text(date.toLocaleDateString('es-PE'), 120, yPos);
                yPos += 7;
            });
        }

        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.setTextColor(150);
            doc.text(`Pagina ${i}/${pageCount}`, 105, 290, { align: 'center' });
            doc.text('Konteo 05 (c) 2026', 20, 290);
        }

        doc.save(`Konteo05_${typeText}_${new Date().toISOString().split('T')[0]}.pdf`);
        showToast('PDF generado', 'success');
    } catch (err) {
        showToast('Error PDF: ' + err.message, 'error');
    }
}
