import {
  Component,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';

import { FormsModule } from '@angular/forms';

import {
  ActivatedRoute,
  Router,
} from '@angular/router';

import {
  IonButton,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
} from '@ionic/angular';

import { AuthService } from '../../../core/auth/auth';
import { AccountService } from '../../../core/services/account';

import {
  TransactionService,
} from '../../../core/services/transaction';

import {
  Account,
  CurrencyCode,
  Expense,
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
  private readonly authService =
    inject(AuthService);

  private readonly accountService =
    inject(AccountService);

  private readonly transactionService =
    inject(TransactionService);

  private readonly router =
    inject(Router);

  private readonly route =
    inject(ActivatedRoute);

  readonly accounts =
    signal<Account[]>([]);

  readonly isLoading =
    signal(true);

  readonly isSaving =
    signal(false);

  readonly errorMessage =
    signal('');

  readonly transactionId =
    signal<string | null>(null);

  readonly isEditMode = computed(
    () => this.transactionId() !== null,
  );

  amount: number | null = null;

  date =
    this.getTodayInputValue();

  assetId = '';

  category = '';
  merchant = '';
  method = 'efectivo';
  priority = 'media';
  note = '';

  async ngOnInit(): Promise<void> {
    const transactionId =
      this.route.snapshot.paramMap.get('id');

    this.transactionId.set(
      transactionId,
    );

    await this.loadFormData(
      transactionId,
    );
  }

  private async loadFormData(
    transactionId: string | null,
  ): Promise<void> {
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
      const accounts =
        await this.accountService
          .getAccounts(uid);

      this.accounts.set(accounts);

      if (!transactionId) {
        if (accounts.length === 1) {
          this.assetId =
            accounts[0].id;
        }

        return;
      }

      const transaction =
        await this.transactionService
          .getTransactionById(
            uid,
            'expense',
            transactionId,
          );

      if (
        !transaction ||
        transaction.type !== 'expense'
      ) {
        this.errorMessage.set(
          'No se encontró el gasto solicitado.',
        );

        return;
      }

      this.populateForm(
        transaction,
      );
    } catch (error) {
      console.error(
        'Expense form load error:',
        error,
      );

      this.errorMessage.set(
        'No se pudo cargar el gasto.',
      );
    } finally {
      this.isLoading.set(false);
    }
  }

  private populateForm(
    transaction: Expense,
  ): void {
    this.amount =
      transaction.amount;

    this.date =
      this.formatDateForInput(
        transaction.date,
      );

    this.assetId =
      transaction.assetId;

    this.category =
      transaction.category || '';

    this.merchant =
      transaction.merchant || '';

    this.method =
      transaction.method || 'efectivo';

    this.priority =
      transaction.priority || 'media';

    this.note =
      transaction.note || '';
  }

  async submit(): Promise<void> {
    this.errorMessage.set('');

    const user =
      this.authService.currentUser;

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
      this.parseLocalDate(
        this.date,
      );

    if (!transactionDate) {
      this.errorMessage.set(
        'Selecciona una fecha válida.',
      );

      return;
    }

    const transactionId =
      this.transactionId();

    this.isSaving.set(true);

    try {
      const input = {
        amount: this.amount,
        date: transactionDate,
        assetId: this.assetId,
        category:
          this.category.trim(),
        merchant: this.merchant,
        method: this.method,
        priority: this.priority,
        note: this.note,
      };

      if (transactionId) {
        await this.transactionService
          .updateExpense(
            user.uid,
            transactionId,
            input,
          );
      } else {
        await this.transactionService
          .createExpense(
            user.uid,
            input,
          );
      }

      await this.router.navigateByUrl(
        '/history',
        {
          replaceUrl: true,
        },
      );
    } catch (error) {
      console.error(
        this.isEditMode()
          ? 'Expense update error:'
          : 'Expense creation error:',
        error,
      );

      this.errorMessage.set(
        this.isEditMode()
          ? 'No se pudo actualizar el gasto.'
          : 'No se pudo registrar el gasto.',
      );
    } finally {
      this.isSaving.set(false);
    }
  }

  cancel(): void {
    void this.router.navigateByUrl(
      this.isEditMode()
        ? '/history'
        : '/home',
    );
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
    return this.formatDateForInput(
      new Date(),
    );
  }

  private formatDateForInput(
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

    if (
      !year ||
      !month ||
      !day
    ) {
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