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

import { AuthService } from '../../core/auth/auth';
import { PlanService } from '../../core/services/plan';
import { ProfileService } from '../../core/services/profile';

import {
  CurrencyCode,
  FinancialPlan,
} from '../../shared/models';

@Component({
  selector: 'app-plan',
  templateUrl: './plan.component.html',
  styleUrls: ['./plan.component.scss'],
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
export class PlanComponent implements OnInit {
  private readonly authService =
    inject(AuthService);

  private readonly planService =
    inject(PlanService);

  private readonly profileService =
    inject(ProfileService);

  private readonly router =
    inject(Router);

  readonly isLoading = signal(true);
  readonly isSaving = signal(false);

  readonly errorMessage = signal('');
  readonly successMessage = signal('');

  readonly currency =
    signal<CurrencyCode>('PEN');

  incomeTarget: number | null = null;
  expenseLimit: number | null = null;

  async ngOnInit(): Promise<void> {
    await this.loadPlan();
  }

  private async loadPlan(): Promise<void> {
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
        plan,
        profile,
      ] = await Promise.all([
        this.planService.getPlan(
          user.uid,
        ),
        this.profileService.getProfile(
          user.uid,
        ),
      ]);

      this.incomeTarget =
        plan.incomeTarget;

      this.expenseLimit =
        plan.expenseLimit;

      if (profile) {
        this.currency.set(
          profile.currency,
        );
      }
    } catch (error) {
      console.error(
        'Plan load error:',
        error,
      );

      this.errorMessage.set(
        'No se pudo cargar el plan mensual.',
      );
    } finally {
      this.isLoading.set(false);
    }
  }

  async savePlan(): Promise<void> {
    this.errorMessage.set('');
    this.successMessage.set('');

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

    const incomeTarget =
      this.incomeTarget ?? 0;

    const expenseLimit =
      this.expenseLimit ?? 0;

    if (
      !Number.isFinite(incomeTarget) ||
      incomeTarget < 0
    ) {
      this.errorMessage.set(
        'El objetivo de ingresos no puede ser negativo.',
      );

      return;
    }

    if (
      !Number.isFinite(expenseLimit) ||
      expenseLimit < 0
    ) {
      this.errorMessage.set(
        'El límite de gastos no puede ser negativo.',
      );

      return;
    }

    const plan: FinancialPlan = {
      incomeTarget,
      expenseLimit,
    };

    this.isSaving.set(true);

    try {
      await this.planService.savePlan(
        user.uid,
        plan,
      );

      this.successMessage.set(
        'Plan mensual actualizado correctamente.',
      );
    } catch (error) {
      console.error(
        'Plan save error:',
        error,
      );

      this.errorMessage.set(
        'No se pudo guardar el plan mensual.',
      );
    } finally {
      this.isSaving.set(false);
    }
  }

  cancel(): void {
    void this.router.navigateByUrl(
      '/settings',
    );
  }

  getCurrencySymbol(): string {
    switch (this.currency()) {
      case 'USD':
        return '$';

      case 'EUR':
        return '€';

      case 'PEN':
      default:
        return 'S/';
    }
  }
}