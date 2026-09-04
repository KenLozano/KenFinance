import {
  Component,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';

import { FormsModule } from '@angular/forms';

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
  ReportData,
  ReportPeriod,
  ReportService,
} from '../../core/services/report';

import {
  Account,
  UserProfile,
} from '../../shared/models';

type ReportPeriodType =
  'week' |
  'month' |
  'custom';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
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
export class ReportsComponent
  implements OnInit {

  private readonly authService =
    inject(AuthService);

  private readonly profileService =
    inject(ProfileService);

  private readonly accountService =
    inject(AccountService);

  private readonly transactionService =
    inject(TransactionService);

  private readonly reportService =
    inject(ReportService);

  readonly profile =
    signal<UserProfile | null>(
      null,
    );

  readonly accounts =
    signal<Account[]>([]);

  readonly transactions =
    signal<Transaction[]>([]);

  readonly isLoading =
    signal(true);

  readonly isExporting =
    signal(false);

  readonly errorMessage =
    signal('');

  readonly periodType =
    signal<ReportPeriodType>(
      'month',
    );

  customStart = '';
  customEnd = '';

  readonly reportData =
    computed<ReportData | null>(
      () => {
        const period =
          this.buildPeriod();

        if (!period) {
          return null;
        }

        const user =
          this.authService.currentUser;

        return this.reportService
          .buildReportData(
            this.transactions(),
            this.accounts(),
            this.profile(),
            user?.email ?? '',
            period,
          );
      },
    );

  async ngOnInit():
    Promise<void> {
    await this.loadReports();
  }

  private async loadReports():
    Promise<void> {
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
        profile,
        accounts,
        transactions,
      ] = await Promise.all([
        this.profileService
          .getProfile(
            user.uid,
          ),

        this.accountService
          .getAllAccounts(
            user.uid,
          ),

        this.transactionService
          .getAllTransactions(
            user.uid,
          ),
      ]);

      this.profile.set(
        profile,
      );

      this.accounts.set(
        accounts,
      );

      this.transactions.set(
        transactions,
      );
    } catch (error) {
      console.error(
        'Reports load error:',
        error,
      );

      this.errorMessage.set(
        'No se pudo cargar la información para los reportes.',
      );
    } finally {
      this.isLoading.set(
        false,
      );
    }
  }

  setPeriod(
    period:
      ReportPeriodType,
  ): void {
    this.periodType.set(
      period,
    );
  }

  async exportPdf():
    Promise<void> {
    const data =
      this.reportData();

    if (!data) {
      this.errorMessage.set(
        'Selecciona un periodo válido.',
      );

      return;
    }

    if (
      this.isExporting()
    ) {
      return;
    }

    this.errorMessage.set('');
    this.isExporting.set(true);

    try {
      this.reportService
        .exportPdf(
          data,
          this.accounts(),
        );
    } catch (error) {
      console.error(
        'PDF export error:',
        error,
      );

      this.errorMessage.set(
        'No se pudo generar el PDF.',
      );
    } finally {
      this.isExporting.set(
        false,
      );
    }
  }

  async exportExcel():
    Promise<void> {
    const data =
      this.reportData();

    if (!data) {
      this.errorMessage.set(
        'Selecciona un periodo válido.',
      );

      return;
    }

    if (
      this.isExporting()
    ) {
      return;
    }

    this.errorMessage.set('');
    this.isExporting.set(true);

    try {
      this.reportService
        .exportExcel(
          data,
          this.accounts(),
        );
    } catch (error) {
      console.error(
        'Excel export error:',
        error,
      );

      this.errorMessage.set(
        'No se pudo generar el archivo Excel.',
      );
    } finally {
      this.isExporting.set(
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

  private buildPeriod():
    ReportPeriod | null {
    const now =
      new Date();

    switch (
      this.periodType()
    ) {
      case 'week': {
        const start =
          new Date(now);

        start.setDate(
          start.getDate() -
            6,
        );

        return {
          startDate:
            start,

          endDate:
            now,

          label:
            'Últimos 7 días',
        };
      }

      case 'custom': {
        const start =
          this.parseLocalDate(
            this.customStart,
          );

        const end =
          this.parseLocalDate(
            this.customEnd,
          );

        if (
          !start ||
          !end ||
          start > end
        ) {
          return null;
        }

        return {
          startDate:
            start,

          endDate:
            end,

          label:
            `${this.formatPeriodDate(
              start,
            )} - ${this.formatPeriodDate(
              end,
            )}`,
        };
      }

      case 'month':
      default: {
        const start =
          new Date(
            now.getFullYear(),
            now.getMonth(),
            1,
          );

        return {
          startDate:
            start,

          endDate:
            now,

          label:
            new Intl
              .DateTimeFormat(
                'es-PE',
                {
                  month:
                    'long',

                  year:
                    'numeric',
                },
              )
              .format(now),
        };
      }
    }
  }

  private parseLocalDate(
    value: string,
  ): Date | null {
    if (!value) {
      return null;
    }

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

  private formatPeriodDate(
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
}