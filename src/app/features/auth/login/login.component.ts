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
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
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
export class LoginComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  email = '';
  password = '';

  isLoading = false;
  errorMessage = '';

  async login(): Promise<void> {
    this.errorMessage = '';

    const email = this.email.trim();

    if (!email || !this.password) {
      this.errorMessage = 'Ingresa tu correo y contraseña.';
      return;
    }

    this.isLoading = true;

    try {
      await this.authService.login(email, this.password);

      await this.router.navigateByUrl('/home', {
        replaceUrl: true,
      });
    } catch (error) {
      console.error('Login error:', error);

      this.errorMessage =
        'No se pudo iniciar sesión. Verifica tus datos.';
    } finally {
      this.isLoading = false;
    }
  }

  async loginWithGoogle(): Promise<void> {
    this.errorMessage = '';
    this.isLoading = true;

    try {
      await this.authService.loginWithGoogle();

      await this.router.navigateByUrl('/home', {
        replaceUrl: true,
      });
    } catch (error) {
      console.error('Google login error:', error);

      this.errorMessage =
        'No se pudo iniciar sesión con Google.';
    } finally {
      this.isLoading = false;
    }
  }
}