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
  UserProfile,
} from '../../shared/models';

import {
  fromMinorUnits,
  subtractMoney,
  sumMoney,
} from '../../shared/utils/money';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    RouterLink,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
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
  readonly transactions = signal<Transaction[]>([]);

  readonly isLoading = signal(true);
  readonly errorMessage = signal('');

  readonly todayIncome = computed(() =>
  sumMoney(
    this.transactions()
      .filter(
        (transaction) =>
          transaction.type === 'income' &&
          !transaction.isInitialBalance &&
          this.isToday(transaction.date),
      )
      .map(
        (transaction) =>
          transaction.amount,
      ),
  ),
);

  readonly todayExpenses = computed(() =>
  sumMoney(
    this.transactions()
      .filter(
        (transaction) =>
          transaction.type === 'expense' &&
          this.isToday(transaction.date),
      )
      .map(
        (transaction) =>
          transaction.amount,
      ),
  ),
);

  readonly todayBalance = computed(() =>
  subtractMoney(
    this.todayIncome(),
    this.todayExpenses(),
  ),
);
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

  const totals: Record<string, number> = {};

  for (
    const [currency, amountMinorUnits]
    of Object.entries(totalsMinorUnits)
  ) {
    totals[currency] =
      fromMinorUnits(amountMinorUnits);
  }

  return totals;
});

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

    try {
      const [
        profile,
        accounts,
        transactions,
      ] = await Promise.all([
        this.profileService.getProfile(user.uid),
        this.accountService.getAccounts(user.uid),
        this.transactionService.getAllTransactions(
          user.uid,
        ),
      ]);

      this.profile.set(profile);
      this.accounts.set(accounts);
      this.transactions.set(transactions);
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

  getCurrencySymbol(
    currency: string,
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

  private isToday(date: Date): boolean {
    const today = new Date();

    return (
      date.getFullYear() ===
        today.getFullYear() &&
      date.getMonth() ===
        today.getMonth() &&
      date.getDate() ===
        today.getDate()
    );
  }
}