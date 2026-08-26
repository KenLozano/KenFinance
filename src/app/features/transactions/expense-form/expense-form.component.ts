import {
  Component,
  OnInit,
  inject,
  signal,
} from '@angular/core';

import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import {
  IonButton,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
} from '@ionic/angular';

import { AuthService } from '../../../core/auth/auth';
import { AccountService } from '../../../core/services/account';
import { TransactionService } from '../../../core/services/transaction';

import {
  Account,
  CurrencyCode,
} from '../../../shared/models';

@Component({
  selector: 'app-expense-form',
  templateUrl: './expense-form.component.html',
  styleUrls: ['./expense-form.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
  ],
})
export class ExpenseFormComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly accountService = inject(AccountService);
  private readonly transactionService =
    inject(TransactionService);
  private readonly router = inject(Router);

  readonly accounts = signal<Account[]>([]);
  readonly isLoading = signal(true);
  readonly isSaving = signal(false);
  readonly errorMessage = signal('');

  amount: number | null = null;
  date = this.getTodayInputValue();
  assetId = '';

  category = '';
  merchant = '';
  method = 'efectivo';
  priority = 'media';
  note = '';

  async ngOnInit(): Promise<void> {
    await this.loadAccounts();
  }

  private async loadAccounts(): Promise<void> {
    const user = this.authService.currentUser;

    if (!user) {
      this.errorMessage.set(
        'No se encontró una sesión activa.',
      );

      this.isLoading.set(false);
      return;
    }

    try {
      const accounts =
        await this.accountService.getAccounts(
          user.uid,
        );

      this.accounts.set(accounts);

      if (accounts.length === 1) {
        this.assetId = accounts[0].id;
      }
    } catch (error) {
      console.error(
        'Expense accounts load error:',
        error,
      );

      this.errorMessage.set(
        'No se pudieron cargar las cuentas.',
      );
    } finally {
      this.isLoading.set(false);
    }
  }

  async submit(): Promise<void> {
    this.errorMessage.set('');

    const user = this.authService.currentUser;

    if (!user) {
      this.errorMessage.set(
        'No se encontró una sesión activa.',
      );
      return;
    }

    if (this.isSaving()) {
      return;
    }

    if (
      this.amount === null ||
      !Number.isFinite(this.amount) ||
      this.amount <= 0
    ) {
      this.errorMessage.set(
        'Ingresa un monto válido mayor a cero.',
      );
      return;
    }

    if (!this.assetId) {
      this.errorMessage.set(
        'Selecciona la cuenta desde la que salió el dinero.',
      );
      return;
    }

    if (!this.category.trim()) {
      this.errorMessage.set(
        'Selecciona una categoría.',
      );
      return;
    }

    const transactionDate =
      this.parseLocalDate(this.date);

    if (!transactionDate) {
      this.errorMessage.set(
        'Selecciona una fecha válida.',
      );
      return;
    }

    this.isSaving.set(true);

    try {
      await this.transactionService.createExpense(
        user.uid,
        {
          amount: this.amount,
          date: transactionDate,
          assetId: this.assetId,
          category: this.category.trim(),
          merchant: this.merchant,
          method: this.method,
          priority: this.priority,
          note: this.note,
        },
      );

      await this.router.navigateByUrl(
        '/history',
        {
          replaceUrl: true,
        },
      );
    } catch (error) {
      console.error(
        'Expense creation error:',
        error,
      );

      this.errorMessage.set(
        'No se pudo registrar el gasto.',
      );
    } finally {
      this.isSaving.set(false);
    }
  }

  cancel(): void {
    void this.router.navigateByUrl('/home');
  }

  getSelectedCurrency(): CurrencyCode {
    return (
      this.accounts().find(
        (account) =>
          account.id === this.assetId,
      )?.currency ?? 'PEN'
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
  }

  private getTodayInputValue(): string {
    const today = new Date();

    const year = today.getFullYear();

    const month = String(
      today.getMonth() + 1,
    ).padStart(2, '0');

    const day = String(
      today.getDate(),
    ).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  private parseLocalDate(
    value: string,
  ): Date | null {
    const [
      year,
      month,
      day,
    ] = value
      .split('-')
      .map(Number);

    if (!year || !month || !day) {
      return null;
    }

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

    return date;
  }
}