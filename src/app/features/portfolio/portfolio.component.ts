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
  AccountType,
  CurrencyCode,
} from '../../shared/models';

import {
  fromMinorUnits,
} from '../../shared/utils/money';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
  ],
})
export class PortfolioComponent implements OnInit {
  private readonly authService =
    inject(AuthService);

  private readonly accountService =
    inject(AccountService);

  private readonly transactionService =
    inject(TransactionService);

  readonly accounts =
    signal<Account[]>([]);

  readonly transactions =
    signal<Transaction[]>([]);

  readonly balances =
    signal<Record<string, number>>({});

  readonly totalsByCurrency =
    signal<Record<string, number>>({});

  readonly isLoading =
    signal(true);

  readonly errorMessage =
    signal('');

  readonly accountFormOpen =
    signal(false);

  readonly isSavingAccount =
    signal(false);

  readonly accountFormError =
    signal('');

  readonly editingAccountId =
    signal<string | null>(null);
    
  readonly accountActionError =
  signal('');

readonly archivingAccountId =
  signal<string | null>(null);  

  readonly isEditMode = computed(
    () =>
      this.editingAccountId() !== null,
  );

  accountName = '';

  accountType: AccountType =
    'bank_account';

  accountCurrency: CurrencyCode =
    'PEN';

  initialBalance: number | null =
    null;

  async ngOnInit(): Promise<void> {
    await this.loadPortfolio();
  }

  private async loadPortfolio(): Promise<void> {
    const user =
      this.authService.currentUser;

    if (!user) {
      this.errorMessage.set(
        'No se encontró una sesión activa.',
      );

      this.isLoading.set(false);
      return;
    }

    try {
      const [
        accounts,
        transactions,
      ] = await Promise.all([
        this.accountService
          .getAccounts(user.uid),

        this.transactionService
          .getAllTransactions(user.uid),
      ]);

      this.accounts.set(accounts);

      this.transactions.set(
        transactions,
      );

      const balances:
        Record<string, number> = {};

      const totalsMinorUnits:
        Record<string, number> = {};

      for (const account of accounts) {
        const balanceMinorUnits =
          this.transactionService
            .calculateAccountBalanceMinorUnits(
              transactions,
              account.id,
            );

        balances[account.id] =
          fromMinorUnits(
            balanceMinorUnits,
          );

        totalsMinorUnits[
          account.currency
        ] =
          (
            totalsMinorUnits[
              account.currency
            ] ?? 0
          ) +
          balanceMinorUnits;
      }

      const totals:
        Record<string, number> = {};

      for (
        const [
          currency,
          amountMinorUnits,
        ]
        of Object.entries(
          totalsMinorUnits,
        )
      ) {
        totals[currency] =
          fromMinorUnits(
            amountMinorUnits,
          );
      }

      this.balances.set(
        balances,
      );

      this.totalsByCurrency.set(
        totals,
      );
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

  getBalance(
    accountId: string,
  ): number {
    return (
      this.balances()[accountId] ??
      0
    );
  }

  hasTransactions(
    accountId: string,
  ): boolean {
    return this.transactions().some(
      (transaction) =>
        transaction.assetId ===
        accountId,
    );
  }

  openCreateAccount(): void {
    this.editingAccountId.set(
      null,
    );

    this.accountName = '';
    this.accountType =
      'bank_account';

    this.accountCurrency =
      'PEN';

    this.initialBalance =
      null;

    this.accountFormError.set(
      '',
    );

    this.accountFormOpen.set(
      true,
    );
  }

  openEditAccount(
    account: Account,
  ): void {
    this.editingAccountId.set(
      account.id,
    );

    this.accountName =
      account.name;

    this.accountType =
      account.type;

    this.accountCurrency =
      account.currency;

    this.initialBalance =
      null;

    this.accountFormError.set(
      '',
    );

    this.accountFormOpen.set(
      true,
    );
  }

  closeAccountForm(): void {
    if (this.isSavingAccount()) {
      return;
    }

    this.accountFormOpen.set(
      false,
    );

    this.editingAccountId.set(
      null,
    );

    this.accountFormError.set(
      '',
    );
  }

  async archiveAccount(
  account: Account,
): Promise<void> {
  this.accountActionError.set('');

  const user =
    this.authService.currentUser;

  if (!user) {
    this.accountActionError.set(
      'No se encontró una sesión activa.',
    );

    return;
  }

  if (
    this.archivingAccountId() !== null ||
    this.isSavingAccount()
  ) {
    return;
  }

  const balanceMinorUnits =
    this.transactionService
      .calculateAccountBalanceMinorUnits(
        this.transactions(),
        account.id,
      );

  if (balanceMinorUnits !== 0) {
    this.accountActionError.set(
      `No puedes archivar "${account.name}" porque su saldo no es cero.`,
    );

    return;
  }

  const confirmed =
    window.confirm(
      `¿Archivar la cuenta "${account.name}"?\n\n` +
      'Sus movimientos históricos se conservarán.',
    );

  if (!confirmed) {
    return;
  }

  this.archivingAccountId.set(
    account.id,
  );

  try {
    await this.accountService
      .archiveAccount(
        user.uid,
        account.id,
      );

    if (
      this.editingAccountId() ===
      account.id
    ) {
      this.accountFormOpen.set(
        false,
      );

      this.editingAccountId.set(
        null,
      );
    }

    await this.loadPortfolio();
  } catch (error) {
    console.error(
      'Account archive error:',
      error,
    );

    this.accountActionError.set(
      'No se pudo archivar la cuenta.',
    );
  } finally {
    this.archivingAccountId.set(
      null,
    );
  }
}

  async saveAccount(): Promise<void> {
    this.accountFormError.set('');

    const user =
      this.authService.currentUser;

    if (!user) {
      this.accountFormError.set(
        'No se encontró una sesión activa.',
      );

      return;
    }

    if (this.isSavingAccount()) {
      return;
    }

    const name =
      this.accountName.trim();

    if (!name) {
      this.accountFormError.set(
        'Ingresa un nombre para la cuenta.',
      );

      return;
    }

    const editingAccountId =
      this.editingAccountId();

    if (editingAccountId) {
      await this.updateExistingAccount(
        user.uid,
        editingAccountId,
        name,
      );

      return;
    }

    await this.createNewAccount(
      user.uid,
      name,
    );
  }

  private async updateExistingAccount(
    uid: string,
    accountId: string,
    name: string,
  ): Promise<void> {
    const originalAccount =
      this.accounts().find(
        (account) =>
          account.id === accountId,
      );

    if (!originalAccount) {
      this.accountFormError.set(
        'No se encontró la cuenta que deseas editar.',
      );

      return;
    }

    if (
      this.hasTransactions(
        accountId,
      ) &&
      this.accountCurrency !==
        originalAccount.currency
    ) {
      this.accountFormError.set(
        'No se puede cambiar la moneda de una cuenta que ya tiene movimientos.',
      );

      return;
    }

    this.isSavingAccount.set(
      true,
    );

    try {
      await this.accountService
        .updateAccount(
          uid,
          accountId,
          {
            name,
            type:
              this.accountType,
            currency:
              this.accountCurrency,
          },
        );

      this.accountFormOpen.set(
        false,
      );

      this.editingAccountId.set(
        null,
      );

      await this.loadPortfolio();
    } catch (error) {
      console.error(
        'Account update error:',
        error,
      );

      this.accountFormError.set(
        'No se pudo actualizar la cuenta.',
      );
    } finally {
      this.isSavingAccount.set(
        false,
      );
    }
  }

  private async createNewAccount(
    uid: string,
    name: string,
  ): Promise<void> {
    const initialBalance =
      this.initialBalance ?? 0;

    if (
      !Number.isFinite(
        initialBalance,
      ) ||
      initialBalance < 0
    ) {
      this.accountFormError.set(
        'El saldo inicial no puede ser negativo.',
      );

      return;
    }

    this.isSavingAccount.set(
      true,
    );

    let accountId:
      string | null = null;

    try {
      accountId =
        await this.accountService
          .createAccount(
            uid,
            {
              name,
              type:
                this.accountType,
              currency:
                this.accountCurrency,
            },
          );

      if (initialBalance > 0) {
        await this.transactionService
          .createIncome(
            uid,
            {
              amount:
                initialBalance,

              date:
                new Date(),

              assetId:
                accountId,

              note:
                'Saldo inicial',

              source:
                'otros',

              tags:
                'saldo-inicial',

              isInitialBalance:
                true,

              account:
                name,
            },
          );
      }

      this.accountFormOpen.set(
        false,
      );

      await this.loadPortfolio();
    } catch (error) {
      console.error(
        'Account creation error:',
        error,
      );

      if (accountId) {
        try {
          await this.accountService
            .archiveAccount(
              uid,
              accountId,
            );
        } catch (
          rollbackError
        ) {
          console.error(
            'Account creation rollback error:',
            rollbackError,
          );
        }
      }

      this.accountFormError.set(
        'No se pudo crear la cuenta.',
      );
    } finally {
      this.isSavingAccount.set(
        false,
      );
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

  getTypeLabel(
    type: string,
  ): string {
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