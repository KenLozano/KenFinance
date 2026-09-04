import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

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
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
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
export class RegisterComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  name = '';
  email = '';
  password = '';
  confirmPassword = '';

  isLoading = false;
  errorMessage = '';

  async register(): Promise<void> {
    this.errorMessage = '';

    const name = this.name.trim();
    const email = this.email.trim();

    if (name.length < 2 || name.length > 50) {
      this.errorMessage = 'El nombre debe tener entre 2 y 50 caracteres.';
      return;
    }

    if (!email) {
      this.errorMessage = 'Ingresa un correo válido.';
      return;
    }

    if (this.password.length < 6) {
      this.errorMessage = 'La contraseña debe tener al menos 6 caracteres.';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Las contraseñas no coinciden.';
      return;
    }

    this.isLoading = true;

    try {
      const credential = await this.authService.register(
        email,
        this.password,
      );

      await this.authService.updateDisplayName(
        credential.user,
        name,
      );

      await this.router.navigateByUrl('/home', {
        replaceUrl: true,
      });
    } catch (error) {
      console.error('Register error:', error);

      this.errorMessage =
        'No se pudo crear la cuenta. Revisa los datos ingresados.';
    } finally {
      this.isLoading = false;
    }
  }
}