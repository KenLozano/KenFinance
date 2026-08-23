import {
  Component,
  OnInit,
  inject,
  signal,
} from '@angular/core';

import { Router } from '@angular/router';

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

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
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
  private readonly router = inject(Router);

  readonly profile = signal<UserProfile | null>(null);
  readonly accounts = signal<Account[]>([]);
  readonly transactions = signal<Transaction[]>([]);

  readonly accountBalances = signal<Record<string, number>>({});

  readonly isLoadingProfile = signal(true);
  readonly isLoadingPortfolio = signal(true);

  readonly profileError = signal('');
  readonly portfolioError = signal('');

  readonly isLoggingOut = signal(false);

  async ngOnInit(): Promise<void> {
    await Promise.all([
      this.loadProfile(),
      this.loadPortfolio(),
    ]);
  }

  private async loadProfile(): Promise<void> {
    const user = this.authService.currentUser;

    if (!user) {
      this.profileError.set(
        'No se encontró una sesión activa.',
      );

      this.isLoadingProfile.set(false);
      return;
    }

    try {
      const profile =
        await this.profileService.getProfile(user.uid);

      this.profile.set(profile);
    } catch (error) {
      console.error(
        'Profile load error:',
        error,
      );

      this.profileError.set(
        'No se pudo cargar el perfil.',
      );
    } finally {
      this.isLoadingProfile.set(false);
    }
  }

  private async loadPortfolio(): Promise<void> {
    const user = this.authService.currentUser;

    if (!user) {
      this.portfolioError.set(
        'No se encontró una sesión activa.',
      );

      this.isLoadingPortfolio.set(false);
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

      for (const account of accounts) {
        balances[account.id] =
          this.transactionService.calculateAccountBalance(
            transactions,
            account.id,
          );
      }

      this.accountBalances.set(balances);
    } catch (error) {
      console.error(
        'Portfolio load error:',
        error,
      );

      this.portfolioError.set(
        'No se pudo cargar el portafolio.',
      );
    } finally {
      this.isLoadingPortfolio.set(false);
    }
  }

  getAccountBalance(accountId: string): number {
    return this.accountBalances()[accountId] ?? 0;
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

  getAccountTypeLabel(type: string): string {
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

  async logout(): Promise<void> {
    if (this.isLoggingOut()) {
      return;
    }

    this.isLoggingOut.set(true);

    try {
      await this.authService.logout();

      await this.router.navigateByUrl(
        '/login',
        {
          replaceUrl: true,
        },
      );
    } catch (error) {
      console.error(
        'Logout error:',
        error,
      );
    } finally {
      this.isLoggingOut.set(false);
    }
  }
}