import {
  Component,
  OnInit,
  inject,
  signal,
} from '@angular/core';

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

import { Account } from '../../shared/models';

import {
  fromMinorUnits,
} from '../../shared/utils/money';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
  ],
})
export class PortfolioComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly accountService = inject(AccountService);
  private readonly transactionService = inject(TransactionService);

  readonly accounts = signal<Account[]>([]);
  readonly transactions = signal<Transaction[]>([]);

  readonly balances = signal<Record<string, number>>({});
  readonly totalsByCurrency = signal<Record<string, number>>({});

  readonly isLoading = signal(true);
  readonly errorMessage = signal('');

  async ngOnInit(): Promise<void> {
    await this.loadPortfolio();
  }

  private async loadPortfolio(): Promise<void> {
    const user = this.authService.currentUser;

    if (!user) {
      this.errorMessage.set(
        'No se encontró una sesión activa.',
      );

      this.isLoading.set(false);
      return;
    }

    try {
      const [accounts, transactions] =
        await Promise.all([
          this.accountService.getAccounts(user.uid),
          this.transactionService.getAllTransactions(user.uid),
        ]);

      this.accounts.set(accounts);
      this.transactions.set(transactions);

      const balances: Record<string, number> = {};
const totalsMinorUnits: Record<string, number> = {};

for (const account of accounts) {
  const balanceMinorUnits =
    this.transactionService
      .calculateAccountBalanceMinorUnits(
        transactions,
        account.id,
      );

  balances[account.id] =
    fromMinorUnits(balanceMinorUnits);

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

      this.balances.set(balances);
      this.totalsByCurrency.set(totals);
    } catch (error) {
      console.error(
        'Portfolio load error:',
        error,
      );

      this.errorMessage.set(
        'No se pudo cargar el portafolio.',
      );
    } finally {
      this.isLoading.set(false);
    }
  }

  getBalance(accountId: string): number {
    return this.balances()[accountId] ?? 0;
  }

  getCurrencySymbol(currency: string): string {
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

  getTypeLabel(type: string): string {
    switch (type) {
      case 'bank_account':
        return 'Cuenta bancaria';

      case 'wallet':
        return 'Billetera digital';

      case 'cash':
        return 'Efectivo';

      case 'credit_card':
        return 'Tarjeta de crédito';

      case 'crypto':
        return 'Criptomonedas';

      default:
        return 'Cuenta';
    }
  }
}