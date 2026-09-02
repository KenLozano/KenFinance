import {
  Component,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';

import { FormsModule } from '@angular/forms';

import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
} from '@ionic/angular';

import { AuthService } from '../../core/auth/auth';
import { AccountService } from '../../core/services/account';

import {
  Transaction,
  TransactionService,
} from '../../core/services/transaction';

import {
  Account,
  CurrencyCode,
} from '../../shared/models';

import {
  MonthlyFlowComponent,
  MonthlyFlowPoint,
} from '../../shared/components/monthly-flow/monthly-flow.component';

import {
  IncomeExpenseChartComponent,
} from '../../shared/components/income-expense-chart/income-expense-chart.component';

import {
  ExpenseDistributionComponent,
  ExpenseDistributionItem,
} from '../../shared/components/expense-distribution/expense-distribution.component';

import {
  fromMinorUnits,
  toMinorUnits,
} from '../../shared/utils/money';

import { Router } from '@angular/router';

type PeriodFilter =
  | 'today'
  | 'week'
  | 'month'
  | 'custom';

type SortOption =
  | 'date_desc'
  | 'date_asc'
  | 'amount_desc'
  | 'amount_asc';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    MonthlyFlowComponent,
    IncomeExpenseChartComponent,
    ExpenseDistributionComponent,
  ],
})
export class HistoryComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly accountService = inject(AccountService);
  private readonly transactionService =
    inject(TransactionService);
  private readonly router = inject(Router);

  readonly accounts = signal<Account[]>([]);
  readonly transactions = signal<Transaction[]>([]);

  readonly isLoading = signal(true);
  readonly errorMessage = signal('');

  readonly deletingTransactionId = signal<string | null>(null);

  readonly searchTerm = signal('');
  readonly period = signal<PeriodFilter>('month');

  readonly selectedAccountId = signal('all');
  readonly selectedCategory = signal('all');

  readonly sort = signal<SortOption>('date_desc');

  readonly customStart = signal('');
  readonly customEnd = signal('');

  readonly availableCategories = computed(() => {
    const categories = new Set<string>();

    for (const transaction of this.transactions()) {
      if (
        transaction.type === 'expense' &&
        transaction.category
      ) {
        categories.add(transaction.category);
      }
    }

    return Array.from(categories).sort(
      (a, b) =>
        a.localeCompare(
          b,
          'es',
          {
            sensitivity: 'base',
          },
        ),
    );
  });

  readonly filteredTransactions = computed(() => {
    const search =
      this.searchTerm()
        .trim()
        .toLocaleLowerCase('es');

    const accountId =
      this.selectedAccountId();

    const category =
      this.selectedCategory();

    const filtered =
      this.transactions().filter(
        (transaction) => {
          if (
            !this.matchesPeriod(transaction)
          ) {
            return false;
          }

          if (
            accountId !== 'all' &&
            transaction.assetId !== accountId
          ) {
            return false;
          }

          if (category !== 'all') {
            if (category === 'income') {
              if (
                transaction.type !== 'income'
              ) {
                return false;
              }
            } else {
              if (
                transaction.type !== 'expense' ||
                transaction.category !== category
              ) {
                return false;
              }
            }
          }

          if (!search) {
            return true;
          }

          const amount =
            transaction.amount.toFixed(2);

          const note =
            transaction.note
              ?.toLocaleLowerCase('es') ?? '';

          const account =
            this.getAccountName(
              transaction.assetId,
            ).toLocaleLowerCase('es');

          const extraText =
            transaction.type === 'expense'
              ? [
                  transaction.category,
                  transaction.merchant,
                  transaction.method,
                ]
                  .filter(Boolean)
                  .join(' ')
                  .toLocaleLowerCase('es')
              : [
                  transaction.source,
                  transaction.tags,
                ]
                  .filter(Boolean)
                  .join(' ')
                  .toLocaleLowerCase('es');

          return (
            note.includes(search) ||
            amount.includes(search) ||
            account.includes(search) ||
            extraText.includes(search)
          );
        },
      );

    return [...filtered].sort(
      (a, b) => {
        switch (this.sort()) {
          case 'date_asc':
            return (
              a.date.getTime() -
              b.date.getTime()
            );

          case 'amount_desc':
            return b.amount - a.amount;

          case 'amount_asc':
            return a.amount - b.amount;

          case 'date_desc':
          default:
            return (
              b.date.getTime() -
              a.date.getTime()
            );
        }
      },
    );
  });

  readonly visibleIncomeCount = computed(
    () =>
      this.filteredTransactions().filter(
        (transaction) =>
          transaction.type === 'income',
      ).length,
  );

  readonly visibleExpenseCount = computed(
    () =>
      this.filteredTransactions().filter(
        (transaction) =>
          transaction.type === 'expense',
      ).length,
  );

  readonly activeTab =
  signal<'movements' | 'analysis'>(
    'movements',
  );
  readonly analysisTransactions =
  computed(() =>
    this.filteredTransactions().filter(
      (transaction) =>
        this.getTransactionCurrency(
          transaction,
        ) ===
        this.analysisCurrency(),
    ),
  );
  readonly analysisSummary = computed(() => {
  let incomeMinor = 0;
  let expensesMinor = 0;

  for (
    const transaction
    of this.analysisTransactions()
  ) {
    if (
      transaction.type === 'income' &&
      transaction.isInitialBalance
    ) {
      continue;
    }

    const amountMinor =
      toMinorUnits(
        transaction.amount,
      );

    if (
      transaction.type === 'income'
    ) {
      incomeMinor += amountMinor;
    } else {
      expensesMinor += amountMinor;
    }
  }

  const balanceMinor =
    incomeMinor - expensesMinor;

  const income =
    fromMinorUnits(incomeMinor);

  const expenses =
    fromMinorUnits(expensesMinor);

  const balance =
    fromMinorUnits(balanceMinor);

  const savingsRate =
    incomeMinor > 0
      ? (
          balanceMinor /
          incomeMinor
        ) * 100
      : null;

  return {
    income,
    expenses,
    balance,
    savingsRate,
  };
});
readonly expenseDistribution =
  computed<ExpenseDistributionItem[]>(
    () => {
      const categories =
        new Map<string, number>();

      for (
        const transaction
        of this.analysisTransactions()
      ) {
        if (
          transaction.type !== 'expense'
        ) {
          continue;
        }

        const category =
  this.getCategoryLabel(
    transaction.category,
  );

        const current =
          categories.get(category) ?? 0;

        categories.set(
          category,
          current +
            toMinorUnits(
              transaction.amount,
            ),
        );
      }

      return Array.from(
        categories.entries(),
      )
        .map(
          ([
            category,
            amountMinor,
          ]) => ({
            category,
            amount:
              fromMinorUnits(
                amountMinor,
              ),
          }),
        )
        .sort(
          (a, b) =>
            b.amount - a.amount,
        );
    },
  );

  readonly analysisFlow =
  computed<MonthlyFlowPoint[]>(() => {
    const transactions =
      this.analysisTransactions();

    if (!transactions.length) {
      return [];
    }

    const sorted =
      [...transactions].sort(
        (a, b) =>
          a.date.getTime() -
          b.date.getTime(),
      );

    const buckets =
      new Map<
        string,
        {
          date: Date;
          income: number;
          expenses: number;
        }
      >();

    for (const transaction of sorted) {
      if (
        transaction.type === 'income' &&
        transaction.isInitialBalance
      ) {
        continue;
      }

      const key =
        this.toDateKey(
          transaction.date,
        );

      const bucket =
        buckets.get(key) ?? {
          date: transaction.date,
          income: 0,
          expenses: 0,
        };

      const amount =
        toMinorUnits(
          transaction.amount,
        );

      if (
        transaction.type === 'income'
      ) {
        bucket.income += amount;
      } else {
        bucket.expenses += amount;
      }

      buckets.set(
        key,
        bucket,
      );
    }

    const ordered =
      Array.from(
        buckets.values(),
      ).sort(
        (a, b) =>
          a.date.getTime() -
          b.date.getTime(),
      );

    let income = 0;
    let expenses = 0;

    return ordered.map(
      (bucket, index) => {
        income += bucket.income;
        expenses += bucket.expenses;

        return {
          day: index + 1,
          income:
            fromMinorUnits(
              income,
            ),
          expenses:
            fromMinorUnits(
              expenses,
            ),
        };
      },
    );
  });

  private toDateKey(
  date: Date,
): string {
  const year =
    date.getFullYear();

  const month =
    String(
      date.getMonth() + 1,
    ).padStart(2, '0');

  const day =
    String(
      date.getDate(),
    ).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

setActiveTab(
  tab: 'movements' | 'analysis',
): void {
  this.activeTab.set(tab);
}

readonly analysisCurrency =
  signal<CurrencyCode>('PEN');

updateAnalysisCurrency(
  currency: CurrencyCode,
): void {
  this.analysisCurrency.set(currency);
}

readonly availableCurrencies = computed<
  CurrencyCode[]
>(() => {
  const currencies =
    new Set<CurrencyCode>();

  for (const account of this.accounts()) {
    currencies.add(
      account.currency,
    );
  }

  return [
    'PEN',
    'USD',
    'EUR',
  ].filter(
    (currency) =>
      currencies.has(
        currency as CurrencyCode,
      ),
  ) as CurrencyCode[];
});
  async ngOnInit(): Promise<void> {
    await this.loadHistory();
  }

  private async loadHistory(): Promise<void> {
    const user =
      this.authService.currentUser;

    if (!user) {
      this.errorMessage.set(
        'No se encontró una sesión activa.',
      );

      this.isLoading.set(false);
      return;
    }

    const uid = user.uid;

    try {
      const [
        accounts,
        transactions,
      ] = await Promise.all([
        this.accountService.getAllAccounts(uid),
        this.transactionService
          .getAllTransactions(uid),
      ]);

      this.accounts.set(accounts);
      this.transactions.set(transactions);

      const firstCurrency =
  accounts[0]?.currency;

if (firstCurrency) {
  this.analysisCurrency.set(
    accounts.some(
      (account) =>
        account.currency === 'PEN',
    )
      ? 'PEN'
      : firstCurrency,
  );
}


    } catch (error) {
      console.error(
        'History load error:',
        error,
      );

      this.errorMessage.set(
        'No se pudo cargar el historial.',
      );
    } finally {
      this.isLoading.set(false);
      
    }
  }

  setPeriod(
    period: PeriodFilter,
  ): void {
    this.period.set(period);
  }

  updateSearch(
    value: string,
  ): void {
    this.searchTerm.set(value);
  }

  updateAccount(
    value: string,
  ): void {
    this.selectedAccountId.set(value);
  }

  updateCategory(
    value: string,
  ): void {
    this.selectedCategory.set(value);
  }

  updateSort(
    value: SortOption,
  ): void {
    this.sort.set(value);
  }

  updateCustomStart(
    value: string,
  ): void {
    this.customStart.set(value);
  }

  updateCustomEnd(
    value: string,
  ): void {
    this.customEnd.set(value);
  }

  getAccountName(
    assetId: string,
  ): string {
    return (
      this.accounts().find(
        (account) =>
          account.id === assetId,
      )?.name ??
      'Cuenta no identificada'
    );
  }

  getTransactionCurrency(
    transaction: Transaction,
  ): CurrencyCode {
    return (
      this.accounts().find(
        (account) =>
          account.id ===
          transaction.assetId,
      )?.currency ??
      'PEN'
    );
  }

  getCurrencySymbol(
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
    
}getCategoryLabel(
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
      return category || 'Sin categoría';
  }
  }

  getTransactionTitle(
    transaction: Transaction,
  ): string {
    if (transaction.note) {
      return transaction.note;
    }

    if (
      transaction.type === 'expense' &&
      transaction.merchant
    ) {
      return transaction.merchant;
    }

    return transaction.type === 'income'
      ? 'Ingreso'
      : 'Gasto';
  }

  formatDate(
    date: Date,
  ): string {
    return new Intl.DateTimeFormat(
      'es-PE',
      {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      },
    ).format(date);
  }

 

private async deleteTransaction(
  transaction: Transaction,
): Promise<void> {
  const user =
    this.authService.currentUser;

  if (!user) {
    this.errorMessage.set(
      'No se encontró una sesión activa.',
    );

    return;
  }

  if (
    this.deletingTransactionId() !== null
  ) {
    return;
  }

  const uid = user.uid;

  this.deletingTransactionId.set(
    transaction.id,
  );

  this.errorMessage.set('');

  try {
    await this.transactionService
      .deleteTransaction(
        uid,
        transaction.type,
        transaction.id,
      );

    this.transactions.update(
      (transactions) =>
        transactions.filter(
          (item) =>
            !(
              item.id === transaction.id &&
              item.type === transaction.type
            ),
        ),
    );

    
  } catch (error) {
    console.error(
      'Transaction deletion error:',
      error,
    );

    this.errorMessage.set(
      'No se pudo eliminar el movimiento.',
    );
  } finally {
    this.deletingTransactionId.set(null);
  }
}

editTransaction(
  transaction: Transaction,
): void {
  if (
    transaction.type === 'income' &&
    transaction.isInitialBalance
  ) {
    return;
  }

  const route =
    transaction.type === 'income'
      ? `/transactions/income/${transaction.id}`
      : `/transactions/expense/${transaction.id}`;

  void this.router.navigateByUrl(route);
}

async confirmDeleteTransaction(
  transaction: Transaction,
): Promise<void> {
  if (
    transaction.type === 'income' &&
    transaction.isInitialBalance
  ) {
    return;
  }

  if (
    this.deletingTransactionId() !== null
  ) {
    return;
  }

  const confirmed =
    window.confirm(
      '¿Seguro que deseas eliminar este movimiento?\n\n' +
      'Esta acción modificará el saldo de la cuenta.',
    );

  if (!confirmed) {
    return;
  }

  const user =
    this.authService.currentUser;

  if (!user) {
    this.errorMessage.set(
      'No se encontró una sesión activa.',
    );

    return;
  }

  this.deletingTransactionId.set(
    transaction.id,
  );

  try {
    await this.transactionService
      .deleteTransaction(
        user.uid,
        transaction.type,
        transaction.id,
      );

    this.transactions.update(
      (transactions) =>
        transactions.filter(
          (item) =>
            !(
              item.id === transaction.id &&
              item.type === transaction.type
            ),
        ),
    );
  } catch (error) {
    console.error(
      'Transaction deletion error:',
      error,
    );

    this.errorMessage.set(
      'No se pudo eliminar el movimiento.',
    );
  } finally {
    this.deletingTransactionId.set(null);
  }
}



  private matchesPeriod(
    transaction: Transaction,
  ): boolean {
    const date =
      transaction.date;

    const now =
      new Date();

    switch (this.period()) {
      case 'today':
        return this.isSameDay(
          date,
          now,
        );

      case 'week': {
        const start =
          new Date();

        start.setDate(
          start.getDate() - 6,
        );

        start.setHours(
          0,
          0,
          0,
          0,
        );

        const end =
          new Date();

        end.setHours(
          23,
          59,
          59,
          999,
        );

        return (
          date >= start &&
          date <= end
        );
      }

      case 'custom': {
        const startValue =
          this.customStart();

        const endValue =
          this.customEnd();

        if (
          !startValue ||
          !endValue
        ) {
          return false;
        }

        const start =
          this.parseLocalDate(
            startValue,
            false,
          );

        const end =
          this.parseLocalDate(
            endValue,
            true,
          );

        if (!start || !end) {
          return false;
        }

        return (
          date >= start &&
          date <= end
        );
      }

      case 'month':
      default:
        return (
          date.getFullYear() ===
            now.getFullYear() &&
          date.getMonth() ===
            now.getMonth()
        );
    }
  }

  private isSameDay(
    first: Date,
    second: Date,
  ): boolean {
    return (
      first.getFullYear() ===
        second.getFullYear() &&
      first.getMonth() ===
        second.getMonth() &&
      first.getDate() ===
        second.getDate()
    );
  }

  private parseLocalDate(
    value: string,
    endOfDay: boolean,
  ): Date | null {
    const parts =
      value
        .split('-')
        .map(Number);

    if (parts.length !== 3) {
      return null;
    }

    const [
      year,
      month,
      day,
    ] = parts;

    const date =
      new Date(
        year,
        month - 1,
        day,
      );

    if (
      Number.isNaN(
        date.getTime(),
      )
    ) {
      return null;
    }

    if (endOfDay) {
      date.setHours(
        23,
        59,
        59,
        999,
      );
    } else {
      date.setHours(
        0,
        0,
        0,
        0,
      );
    }

    return date;
  }
}