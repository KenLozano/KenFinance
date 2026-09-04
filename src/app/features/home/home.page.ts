import {
  Component,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';

import { RouterLink } from '@angular/router';

import {
  IonButton,
  IonContent,
  IonHeader,
  IonIcon,
  IonTitle,
  IonToolbar,
} from '@ionic/angular';

import { AuthService } from '../../core/auth/auth';
import { AccountService } from '../../core/services/account';
import { ProfileService } from '../../core/services/profile';

import {
  Transaction,
  TransactionService,
} from '../../core/services/transaction';

import {
  Account,
  CurrencyCode,
  UserProfile,
} from '../../shared/models';

import {
  fromMinorUnits,
  toMinorUnits,
} from '../../shared/utils/money';

import { PlanService } from '../../core/services/plan';

import {
  FinancialPlan,
} from '../../shared/models';

import {
  MonthlyFlowComponent,
  MonthlyFlowPoint,
} from '../../shared/components/monthly-flow/monthly-flow.component';

import {
  PlanSummaryComponent,
} from '../../shared/components/plan-summary/plan-summary.component';

import {
  RecommendationCardComponent,
  RecommendationTone,
} from '../../shared/components/recommendation-card/recommendation-card.component';

interface PeriodSummary {
  income: number;
  expenses: number;
  balance: number;
  savingsRate: number | null;
}

type SummaryByCurrency =
  Partial<Record<CurrencyCode, PeriodSummary>>;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    IonIcon,
    RouterLink,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    MonthlyFlowComponent,
PlanSummaryComponent,
RecommendationCardComponent,
  ],
})
export class HomePage implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly profileService = inject(ProfileService);
  private readonly accountService = inject(AccountService);
  private readonly transactionService = inject(TransactionService);

  readonly Math = Math;

  readonly profile = signal<UserProfile | null>(null);
  readonly accounts = signal<Account[]>([]);
  readonly allAccounts = signal<Account[]>([]);
  readonly transactions = signal<Transaction[]>([]);

  readonly isLoading = signal(true);
  readonly errorMessage = signal('');

  readonly currencies: CurrencyCode[] = [
    'PEN',
    'USD',
    'EUR',
  ];

  readonly dailySummary = computed<SummaryByCurrency>(
    () =>
      this.buildSummary(
        (transaction) =>
          this.isToday(transaction.date),
      ),
  );

  readonly monthlySummary = computed<SummaryByCurrency>(
    () =>
      this.buildSummary(
        (transaction) =>
          this.isCurrentMonth(transaction.date),
      ),
  );
  readonly monthlyFlow = computed<
  MonthlyFlowPoint[]
>(() => {
  const baseCurrency =
    this.profile()?.currency ?? 'PEN';

  const today = new Date();

  const currentYear =
    today.getFullYear();

  const currentMonth =
    today.getMonth();

  const currentDay =
    today.getDate();

  const dailyMinorUnits =
    new Map<
      number,
      {
        income: number;
        expenses: number;
      }
    >();

  for (let day = 1; day <= currentDay; day++) {
    dailyMinorUnits.set(
      day,
      {
        income: 0,
        expenses: 0,
      },
    );
  }

  for (const transaction of this.transactions()) {
    const date =
      transaction.date;

    if (
      date.getFullYear() !== currentYear ||
      date.getMonth() !== currentMonth
    ) {
      continue;
    }

    if (
      this.getTransactionCurrency(
        transaction,
      ) !== baseCurrency
    ) {
      continue;
    }

    if (
      transaction.type === 'income' &&
      transaction.isInitialBalance
    ) {
      continue;
    }

    const day =
      date.getDate();

    const bucket =
      dailyMinorUnits.get(day);

    if (!bucket) {
      continue;
    }

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
  }

  let accumulatedIncome = 0;
  let accumulatedExpenses = 0;

  const points: MonthlyFlowPoint[] = [];

  for (
    let day = 1;
    day <= currentDay;
    day++
  ) {
    const bucket =
      dailyMinorUnits.get(day);

    if (!bucket) {
      continue;
    }

    accumulatedIncome +=
      bucket.income;

    accumulatedExpenses +=
      bucket.expenses;

    points.push({
      day,
      income:
        fromMinorUnits(
          accumulatedIncome,
        ),
      expenses:
        fromMinorUnits(
          accumulatedExpenses,
        ),
    });
  }

  return points;
});
  readonly totalsByCurrency = computed(() => {
    const totalsMinorUnits: Record<string, number> = {};

    for (const account of this.accounts()) {
      const balanceMinorUnits =
        this.transactionService
          .calculateAccountBalanceMinorUnits(
            this.transactions(),
            account.id,
          );

      totalsMinorUnits[account.currency] =
        (totalsMinorUnits[account.currency] ?? 0) +
        balanceMinorUnits;
    }

    

    const totals: Partial<
      Record<CurrencyCode, number>
    > = {};

    for (
      const [currency, amountMinorUnits]
      of Object.entries(totalsMinorUnits)
    ) {
      totals[currency as CurrencyCode] =
        fromMinorUnits(amountMinorUnits);
    }

    return totals;
  });

  readonly recentTransactions = computed(() =>
    this.transactions().slice(0, 5),
  );

  async ngOnInit(): Promise<void> {
    await this.loadHome();
  }

  private async loadHome(): Promise<void> {
  const user = this.authService.currentUser;

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
  profile,
  allAccounts,
  transactions,
  plan,
] = await Promise.all([
  this.profileService.getProfile(uid),
  this.accountService.getAllAccounts(uid),
  this.transactionService.getAllTransactions(uid),
  this.planService.getPlan(uid),
]);

    this.profile.set(profile);

this.allAccounts.set(
  allAccounts,
);

this.accounts.set(
  allAccounts.filter(
    (account) => account.active,
  ),
);

this.transactions.set(
  transactions,
);

this.plan.set(plan);
  } catch (error) {
    console.error(
      'Home load error:',
      error,
    );

    this.errorMessage.set(
      'No se pudo cargar la información financiera.',
    );
  } finally {
    this.isLoading.set(false);
  }
}

  private buildSummary(
    predicate: (transaction: Transaction) => boolean,
  ): SummaryByCurrency {
    const minorUnits: Record<
      CurrencyCode,
      {
        income: number;
        expenses: number;
      }
    > = {
      PEN: {
        income: 0,
        expenses: 0,
      },
      USD: {
        income: 0,
        expenses: 0,
      },
      EUR: {
        income: 0,
        expenses: 0,
      },
    };

    for (const transaction of this.transactions()) {
      if (!predicate(transaction)) {
        continue;
      }

      if (
        transaction.type === 'income' &&
        transaction.isInitialBalance
      ) {
        continue;
      }

      const currency =
        this.getTransactionCurrency(transaction);

      const amountMinorUnits =
        toMinorUnits(transaction.amount);

      if (transaction.type === 'income') {
        minorUnits[currency].income +=
          amountMinorUnits;
      } else {
        minorUnits[currency].expenses +=
          amountMinorUnits;
      }
    }

    const result: SummaryByCurrency = {};

    for (const currency of this.currencies) {
      const incomeMinorUnits =
        minorUnits[currency].income;

      const expenseMinorUnits =
        minorUnits[currency].expenses;

      if (
        incomeMinorUnits === 0 &&
        expenseMinorUnits === 0
      ) {
        continue;
      }

      const balanceMinorUnits =
        incomeMinorUnits - expenseMinorUnits;

      const income =
        fromMinorUnits(incomeMinorUnits);

      const expenses =
        fromMinorUnits(expenseMinorUnits);

      const balance =
        fromMinorUnits(balanceMinorUnits);

      const savingsRate =
        incomeMinorUnits > 0
          ? (
              balanceMinorUnits /
              incomeMinorUnits
            ) * 100
          : null;

      result[currency] = {
        income,
        expenses,
        balance,
        savingsRate,
      };
    }

    return result;
  }

    getTransactionCurrency(
  transaction: Transaction,
): CurrencyCode {
  const account =
    this.allAccounts().find(
      (item) =>
        item.id ===
        transaction.assetId,
    );

  if (account) {
    return account.currency;
  }

  // Compatibilidad con movimientos antiguos
  // que pudieran no tener una cuenta asociada.
  return (
    this.profile()?.currency ??
    'PEN'
  );
}

   

  getCurrencySymbol(
    currency: CurrencyCode | string,
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

  getTransactionAccountName(
  transaction: Transaction,
): string {
  return (
    this.allAccounts().find(
      (account) =>
        account.id ===
        transaction.assetId,
    )?.name ??
    'Cuenta no identificada'
  );
}

  formatTransactionDate(
    date: Date,
  ): string {
    return new Intl.DateTimeFormat(
      'es-PE',
      {
        day: '2-digit',
        month: 'short',
      },
    ).format(date);
  }

  private isToday(date: Date): boolean {
    const today = new Date();

    return (
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate()
    );
  }

  private isCurrentMonth(date: Date): boolean {
    const today = new Date();

    return (
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth()
    );
  }
  private readonly planService =
  inject(PlanService);

  readonly plan =
  signal<FinancialPlan>({
    incomeTarget: 0,
    expenseLimit: 0,
  });

  readonly recommendation = computed(() => {
  const currency =
    this.profile()?.currency ?? 'PEN';

  const month =
    this.monthlySummary()[currency];

  if (!month) {
    return null;
  }

  const plan =
    this.plan();

  if (
    plan.expenseLimit > 0 &&
    month.expenses >
      plan.expenseLimit
  ) {
    return {
      message:
        'Superaste el límite de gastos configurado para este mes.',
      tone: 'danger' as RecommendationTone,
    };
  }

  if (
    plan.expenseLimit > 0 &&
    month.expenses >=
      plan.expenseLimit * 0.8
  ) {
    return {
      message:
        'Ya utilizaste al menos el 80% de tu límite mensual de gastos.',
      tone: 'warning' as RecommendationTone,
    };
  }

  if (
    month.savingsRate !== null &&
    month.savingsRate < 0
  ) {
    return {
      message:
        'Tus gastos del mes superan tus ingresos. Revisa las categorías con mayor consumo.',
      tone: 'warning' as RecommendationTone,
    };
  }

  if (
    plan.incomeTarget > 0 &&
    month.income >=
      plan.incomeTarget &&
    (
      plan.expenseLimit <= 0 ||
      month.expenses <=
        plan.expenseLimit
    )
  ) {
    return {
      message:
        'Alcanzaste tu objetivo mensual de ingresos y mantienes tus gastos dentro del plan.',
      tone: 'success' as RecommendationTone,
    };
  }

  return null;
});

}