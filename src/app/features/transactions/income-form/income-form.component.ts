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
  selector: 'app-income-form',
  templateUrl: './income-form.component.html',
  styleUrls: ['./income-form.component.scss'],
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
export class IncomeFormComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly accountService = inject(AccountService);
  private readonly transactionService =
    inject(TransactionService);
  private readonly router = inject(Router);

  readonly accounts = signal<Account[]>([]);
  readonly isLoading = signal(true);
  readonly isSaving = signal(false);

  readonly errorMessage = signal('');
  readonly successMessage = signal('');

  amount: number | null = null;
  date = this.getTodayInputValue();
  assetId = '';

  source = 'otros';
  note = '';
  tags = '';

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
        'Income accounts load error:',
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
    this.successMessage.set('');

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
        'Selecciona la cuenta que recibirá el ingreso.',
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
      await this.transactionService.createIncome(
        user.uid,
        {
          amount: this.amount,
          date: transactionDate,
          assetId: this.assetId,
          note: this.note,
          source: this.source.trim() || 'otros',
          tags: this.tags,
        },
      );

      this.successMessage.set(
        'Ingreso registrado correctamente.',
      );

      await this.router.navigateByUrl(
        '/history',
        {
          replaceUrl: true,
        },
      );
    } catch (error) {
      console.error(
        'Income creation error:',
        error,
      );

      this.errorMessage.set(
        'No se pudo registrar el ingreso.',
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