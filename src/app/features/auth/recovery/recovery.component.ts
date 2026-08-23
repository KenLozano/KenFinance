import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import {
  IonButton,
  IonContent,
  IonInput,
  IonItem,
  IonLabel,
  IonSpinner,
} from '@ionic/angular';

import { AuthService } from '../../../core/auth/auth';

@Component({
  selector: 'app-recovery',
  templateUrl: './recovery.component.html',
  styleUrls: ['./recovery.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    IonButton,
    IonContent,
    IonInput,
    IonItem,
    IonLabel,
    IonSpinner,
  ],
})
export class RecoveryComponent {
  private readonly authService = inject(AuthService);

  email = '';

  isLoading = false;
  errorMessage = '';
  successMessage = '';

  async sendRecovery(): Promise<void> {
    this.errorMessage = '';
    this.successMessage = '';

    const email = this.email.trim();

    if (!email) {
      this.errorMessage = 'Ingresa tu correo electrónico.';
      return;
    }

    this.isLoading = true;

    try {
      await this.authService.sendPasswordReset(email);

      this.successMessage =
        'Si el correo corresponde a una cuenta válida, recibirás un enlace de recuperación.';
    } catch (error) {
      console.error('Recovery error:', error);

      this.errorMessage =
        'No se pudo procesar la recuperación en este momento.';
    } finally {
      this.isLoading = false;
    }
  }
}