import { Injectable } from '@angular/core';

import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';

import {
  Account,
  CurrencyCode,
  Expense,
  Income,
  UserProfile,
} from '../../shared/models';

import {
  fromMinorUnits,
  toMinorUnits,
} from '../../shared/utils/money';

export type ReportTransaction =
  Income | Expense;

export interface ReportPeriod {
  startDate: Date;
  endDate: Date;
  label: string;
}

export interface ReportCurrencySummary {
  currency: CurrencyCode;

  income: number;
  expenses: number;
  balance: number;

  savingsRate: number | null;

  incomeCount: number;
  expenseCount: number;
}

export interface ReportData {
  profile: UserProfile | null;

  email: string;

  period: ReportPeriod;

  generatedAt: Date;

  transactions: ReportTransaction[];

  summaries: ReportCurrencySummary[];
}

@Injectable({
  providedIn: 'root',
})
export class ReportService {

  buildReportData(
    transactions: ReportTransaction[],
    accounts: Account[],
    profile: UserProfile | null,
    email: string,
    period: ReportPeriod,
  ): ReportData {
    const start =
      this.startOfDay(
        period.startDate,
      );

    const end =
      this.endOfDay(
        period.endDate,
      );

    const selected =
      transactions.filter(
        (transaction) =>
          transaction.date >= start &&
          transaction.date <= end,
      );

    const currencies: CurrencyCode[] = [
      'PEN',
      'USD',
      'EUR',
    ];

    const summaries =
      currencies
        .map((currency) =>
          this.buildCurrencySummary(
            selected,
            accounts,
            profile,
            currency,
          ),
        )
        .filter(
          (summary) =>
            summary.incomeCount > 0 ||
            summary.expenseCount > 0,
        );

    return {
      profile,
      email,
      period: {
        startDate: start,
        endDate: end,
        label: period.label,
      },
      generatedAt:
        new Date(),
      transactions:
        selected,
      summaries,
    };
  }

  exportExcel(
    data: ReportData,
    accounts: Account[],
  ): void {
    const workbook =
      XLSX.utils.book_new();

    const summarySheet =
      XLSX.utils.aoa_to_sheet(
        this.createSummaryRows(
          data,
        ),
      );

    summarySheet['!cols'] = [
      { wch: 30 },
      { wch: 22 },
      { wch: 22 },
    ];

    XLSX.utils.book_append_sheet(
      workbook,
      summarySheet,
      'Resumen',
    );

    const incomes =
      data.transactions.filter(
        (
          transaction,
        ): transaction is Income =>
          transaction.type ===
          'income' &&
          !transaction
            .isInitialBalance,
      );

    const incomeSheet =
      XLSX.utils.aoa_to_sheet(
        this.createIncomeRows(
          incomes,
          accounts,
          data.profile,
        ),
      );

    incomeSheet['!cols'] = [
      { wch: 14 },
      { wch: 14 },
      { wch: 15 },
      { wch: 24 },
      { wch: 24 },
      { wch: 35 },
      { wch: 24 },
    ];

    XLSX.utils.book_append_sheet(
      workbook,
      incomeSheet,
      'Ingresos',
    );

    const expenses =
      data.transactions.filter(
        (
          transaction,
        ): transaction is Expense =>
          transaction.type ===
          'expense',
      );

    const expenseSheet =
      XLSX.utils.aoa_to_sheet(
        this.createExpenseRows(
          expenses,
          accounts,
          data.profile,
        ),
      );

    expenseSheet['!cols'] = [
      { wch: 14 },
      { wch: 14 },
      { wch: 15 },
      { wch: 24 },
      { wch: 18 },
      { wch: 24 },
      { wch: 18 },
      { wch: 16 },
      { wch: 35 },
    ];

    XLSX.utils.book_append_sheet(
      workbook,
      expenseSheet,
      'Gastos',
    );

    const analysisSheet =
      XLSX.utils.aoa_to_sheet(
        this.createCategoryRows(
          expenses,
          accounts,
          data.profile,
        ),
      );

    analysisSheet['!cols'] = [
      { wch: 18 },
      { wch: 18 },
      { wch: 18 },
      { wch: 18 },
    ];

    XLSX.utils.book_append_sheet(
      workbook,
      analysisSheet,
      'Análisis',
    );

    XLSX.writeFile(
      workbook,
      this.buildFilename(
        'xlsx',
        data,
      ),
    );
  }

  exportPdf(
    data: ReportData,
    accounts: Account[],
  ): void {
    const document =
      new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

    const pageWidth =
      document.internal
        .pageSize
        .getWidth();

    const pageHeight =
      document.internal
        .pageSize
        .getHeight();

    const margin = 18;

    let y = 20;

    document.setFontSize(20);
    document.text(
      'KenFinance',
      margin,
      y,
    );

    y += 8;

    document.setFontSize(13);
    document.text(
      'Reporte financiero',
      margin,
      y,
    );

    y += 10;

    document.setFontSize(10);

    const userName =
      data.profile?.name ||
      'Usuario';

    document.text(
      `Usuario: ${userName}`,
      margin,
      y,
    );

    y += 6;

    document.text(
      `Correo: ${data.email || 'No disponible'}`,
      margin,
      y,
    );

    y += 6;

    document.text(
      `Moneda base: ${data.profile?.currency ?? 'PEN'}`,
      margin,
      y,
    );

    y += 6;

    document.text(
      `Periodo: ${data.period.label}`,
      margin,
      y,
    );

    y += 6;

    document.text(
      `Generado: ${this.formatDateTime(data.generatedAt)}`,
      margin,
      y,
    );

    y += 12;

    document.setFontSize(13);
    document.text(
      'Resumen',
      margin,
      y,
    );

    y += 8;

    document.setFontSize(10);

    if (
      data.summaries.length === 0
    ) {
      document.text(
        'No existen movimientos en el periodo seleccionado.',
        margin,
        y,
      );

      y += 8;
    }

    for (
      const summary
      of data.summaries
    ) {
      if (
        y >
        pageHeight - 45
      ) {
        document.addPage();
        y = 20;
      }

      document.setFontSize(11);

      document.text(
        summary.currency,
        margin,
        y,
      );

      y += 6;

      document.setFontSize(10);

      document.text(
        `Ingresos: ${this.formatMoney(
          summary.income,
          summary.currency,
        )}`,
        margin + 4,
        y,
      );

      y += 5;

      document.text(
        `Gastos: ${this.formatMoney(
          summary.expenses,
          summary.currency,
        )}`,
        margin + 4,
        y,
      );

      y += 5;

      document.text(
        `Balance: ${this.formatMoney(
          summary.balance,
          summary.currency,
        )}`,
        margin + 4,
        y,
      );

      y += 5;

      document.text(
        `Tasa de ahorro: ${
          summary.savingsRate ===
          null
            ? '-'
            : `${summary.savingsRate.toFixed(1)}%`
        }`,
        margin + 4,
        y,
      );

      y += 9;
    }

    document.setFontSize(13);

    document.text(
      'Movimientos',
      margin,
      y,
    );

    y += 8;

    const reportTransactions =
      data.transactions.filter(
        (transaction) =>
          !(
            transaction.type ===
              'income' &&
            transaction
              .isInitialBalance
          ),
      );

    if (
      reportTransactions.length === 0
    ) {
      document.setFontSize(10);

      document.text(
        'No hay movimientos para mostrar.',
        margin,
        y,
      );
    } else {
      document.setFontSize(9);

      for (
        const transaction
        of reportTransactions
      ) {
        if (
          y >
          pageHeight - 25
        ) {
          document.addPage();
          y = 20;
        }

        const currency =
          this.getTransactionCurrency(
            transaction,
            accounts,
            data.profile,
          );

        const accountName =
          this.getAccountName(
            transaction.assetId,
            accounts,
          );

        const type =
          transaction.type ===
          'income'
            ? 'Ingreso'
            : 'Gasto';

        const description =
          this.getTransactionDescription(
            transaction,
          );

        document.text(
          `${this.formatDate(
            transaction.date,
          )} · ${type}`,
          margin,
          y,
        );

        document.text(
          this.formatMoney(
            transaction.amount,
            currency,
          ),
          pageWidth - margin,
          y,
          {
            align: 'right',
          },
        );

        y += 5;

        const detail =
          `${accountName} · ${description}`;

        const lines =
          document.splitTextToSize(
            detail,
            pageWidth -
              margin * 2,
          );

        document.text(
          lines,
          margin,
          y,
        );

        y +=
          lines.length * 4 +
          4;
      }
    }

    const pageCount =
      document.getNumberOfPages();

    for (
      let page = 1;
      page <= pageCount;
      page++
    ) {
      document.setPage(page);

      document.setFontSize(8);

      document.text(
        `Página ${page}/${pageCount}`,
        pageWidth / 2,
        pageHeight - 8,
        {
          align: 'center',
        },
      );

      document.text(
        'KenFinance',
        margin,
        pageHeight - 8,
      );
    }

    document.save(
      this.buildFilename(
        'pdf',
        data,
      ),
    );
  }

  private buildCurrencySummary(
    transactions:
      ReportTransaction[],
    accounts: Account[],
    profile:
      UserProfile | null,
    currency: CurrencyCode,
  ): ReportCurrencySummary {
    let incomeMinor = 0;
    let expensesMinor = 0;

    let incomeCount = 0;
    let expenseCount = 0;

    for (
      const transaction
      of transactions
    ) {
      if (
        this.getTransactionCurrency(
          transaction,
          accounts,
          profile,
        ) !== currency
      ) {
        continue;
      }

      if (
        transaction.type ===
          'income' &&
        transaction
          .isInitialBalance
      ) {
        continue;
      }

      const amountMinor =
        toMinorUnits(
          transaction.amount,
        );

      if (
        transaction.type ===
        'income'
      ) {
        incomeMinor +=
          amountMinor;

        incomeCount++;
      } else {
        expensesMinor +=
          amountMinor;

        expenseCount++;
      }
    }

    const balanceMinor =
      incomeMinor -
      expensesMinor;

    return {
      currency,

      income:
        fromMinorUnits(
          incomeMinor,
        ),

      expenses:
        fromMinorUnits(
          expensesMinor,
        ),

      balance:
        fromMinorUnits(
          balanceMinor,
        ),

      savingsRate:
        incomeMinor > 0
          ? (
              balanceMinor /
              incomeMinor
            ) * 100
          : null,

      incomeCount,
      expenseCount,
    };
  }

  private createSummaryRows(
    data: ReportData,
  ): unknown[][] {
    const rows:
      unknown[][] = [
        [
          'KENFINANCE - REPORTE FINANCIERO',
        ],
        [],
        [
          'Usuario',
          data.profile?.name ||
            'Usuario',
        ],
        [
          'Correo',
          data.email ||
            'No disponible',
        ],
        [
          'Moneda base',
          data.profile?.currency ??
            'PEN',
        ],
        [
          'Periodo',
          data.period.label,
        ],
        [
          'Generado',
          this.formatDateTime(
            data.generatedAt,
          ),
        ],
        [],
        [
          'RESUMEN FINANCIERO',
        ],
        [
          'Moneda',
          'Ingresos',
          'Gastos',
          'Balance',
          'Tasa de ahorro',
          'Movimientos',
        ],
      ];

    for (
      const summary
      of data.summaries
    ) {
      rows.push([
        summary.currency,
        summary.income,
        summary.expenses,
        summary.balance,
        summary.savingsRate ===
        null
          ? '-'
          : `${summary.savingsRate.toFixed(1)}%`,
        summary.incomeCount +
          summary.expenseCount,
      ]);
    }

    return rows;
  }

  private createIncomeRows(
    incomes: Income[],
    accounts: Account[],
    profile:
      UserProfile | null,
  ): unknown[][] {
    const rows:
      unknown[][] = [
        [
          'Fecha',
          'Monto',
          'Moneda',
          'Cuenta',
          'Fuente',
          'Nota',
          'Etiquetas',
        ],
      ];

    for (
      const income of incomes
    ) {
      rows.push([
        this.formatDate(
          income.date,
        ),

        income.amount,

        this.getTransactionCurrency(
          income,
          accounts,
          profile,
        ),

        this.getAccountName(
          income.assetId,
          accounts,
        ),

        income.source,

        income.note,

        income.tags,
      ]);
    }

    return rows;
  }

  private createExpenseRows(
    expenses: Expense[],
    accounts: Account[],
    profile:
      UserProfile | null,
  ): unknown[][] {
    const rows:
      unknown[][] = [
        [
          'Fecha',
          'Monto',
          'Moneda',
          'Cuenta',
          'Categoría',
          'Comercio',
          'Método',
          'Prioridad',
          'Nota',
        ],
      ];

    for (
      const expense
      of expenses
    ) {
      rows.push([
        this.formatDate(
          expense.date,
        ),

        expense.amount,

        this.getTransactionCurrency(
          expense,
          accounts,
          profile,
        ),

        this.getAccountName(
          expense.assetId,
          accounts,
        ),

        this.getCategoryLabel(
          expense.category,
        ),

        expense.merchant,

        expense.method,

        expense.priority,

        expense.note,
      ]);
    }

    return rows;
  }

  private createCategoryRows(
    expenses: Expense[],
    accounts: Account[],
    profile:
      UserProfile | null,
  ): unknown[][] {
    const totals =
      new Map<
        string,
        number
      >();

    for (
      const expense
      of expenses
    ) {
      const currency =
        this.getTransactionCurrency(
          expense,
          accounts,
          profile,
        );

      const category =
        this.getCategoryLabel(
          expense.category,
        );

      const key =
        `${currency}|${category}`;

      totals.set(
        key,
        (
          totals.get(key) ??
          0
        ) +
          toMinorUnits(
            expense.amount,
          ),
      );
    }

    const rows:
      unknown[][] = [
        [
          'Moneda',
          'Categoría',
          'Total',
        ],
      ];

    for (
      const [
        key,
        amountMinor,
      ]
      of totals.entries()
    ) {
      const [
        currency,
        category,
      ] = key.split('|');

      rows.push([
        currency,
        category,
        fromMinorUnits(
          amountMinor,
        ),
      ]);
    }

    return rows;
  }

  private getTransactionCurrency(
    transaction:
      ReportTransaction,
    accounts: Account[],
    profile:
      UserProfile | null,
  ): CurrencyCode {
    const account =
      accounts.find(
        (item) =>
          item.id ===
          transaction.assetId,
      );

    if (account) {
      return account.currency;
    }

    return (
      profile?.currency ??
      'PEN'
    );
  }

  private getAccountName(
    accountId: string,
    accounts: Account[],
  ): string {
    return (
      accounts.find(
        (account) =>
          account.id ===
          accountId,
      )?.name ??
      'Cuenta no identificada'
    );
  }

  private getTransactionDescription(
    transaction:
      ReportTransaction,
  ): string {
    if (transaction.note) {
      return transaction.note;
    }

    if (
      transaction.type ===
      'expense'
    ) {
      return (
        transaction.merchant ||
        this.getCategoryLabel(
          transaction.category,
        ) ||
        'Gasto'
      );
    }

    return (
      transaction.source ||
      'Ingreso'
    );
  }

  private getCategoryLabel(
    category: string,
  ): string {
    switch (category) {
      case 'green':
        return 'Fijo';

      case 'yellow':
        return 'Necesario';

      case 'red':
        return 'Antojo';

      default:
        return (
          category ||
          'Sin categoría'
        );
    }
  }

  private formatMoney(
    amount: number,
    currency: CurrencyCode,
  ): string {
    return `${this.getCurrencySymbol(
      currency,
    )} ${amount.toFixed(2)}`;
  }

  private getCurrencySymbol(
    currency: CurrencyCode,
  ): string {
    switch (currency) {
      case 'USD':
        return '$';

      case 'EUR':
        return '€';

      case 'PEN':
      default:
        return 'S/';
    }
  }

  private formatDate(
    date: Date,
  ): string {
    return new Intl
      .DateTimeFormat(
        'es-PE',
        {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        },
      )
      .format(date);
  }

  private formatDateTime(
    date: Date,
  ): string {
    return new Intl
      .DateTimeFormat(
        'es-PE',
        {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        },
      )
      .format(date);
  }

  private startOfDay(
    value: Date,
  ): Date {
    const date =
      new Date(value);

    date.setHours(
      0,
      0,
      0,
      0,
    );

    return date;
  }

  private endOfDay(
    value: Date,
  ): Date {
    const date =
      new Date(value);

    date.setHours(
      23,
      59,
      59,
      999,
    );

    return date;
  }

  private buildFilename(
    extension:
      'pdf' | 'xlsx',
    data: ReportData,
  ): string {
    const date =
      new Date()
        .toISOString()
        .split('T')[0];

    return (
      `KenFinance_Reporte_` +
      `${date}.${extension}`
    );
  }
}