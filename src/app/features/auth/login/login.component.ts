import {
  Component,
  inject,
  signal,
} from '@angular/core';

import { FormsModule } from '@angular/forms';

import {
  Router,
  RouterLink,
} from '@angular/router';

import {
  IonButton,
  IonContent,
  IonIcon,
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
    IonIcon,
  ],
})
export class LoginComponent {
  private readonly authService =
    inject(AuthService);

  private readonly router =
    inject(Router);

  email = '';
  password = '';

  readonly isLoading =
    signal(false);

  readonly errorMessage =
    signal('');

  async login(): Promise<void> {
    this.errorMessage.set('');

    const email =
      this.email.trim();

    if (!email || !this.password) {
      this.errorMessage.set(
        'Ingresa tu correo y contraseña.',
      );

      return;
    }

    if (this.isLoading()) {
      return;
    }

    this.isLoading.set(true);

    try {
      await this.authService.login(
        email,
        this.password,
      );

      await this.router.navigateByUrl(
        '/home',
        {
          replaceUrl: true,
        },
      );
    } catch (error) {
      console.error(
        'Login error:',
        error,
      );

      this.errorMessage.set(
        'No se pudo iniciar sesión. Verifica tus datos.',
      );
    } finally {
      this.isLoading.set(false);
    }
  }

  async loginWithGoogle(): Promise<void> {
    this.errorMessage.set('');

    if (this.isLoading()) {
      return;
    }

    this.isLoading.set(true);

    try {
      await this.authService
        .loginWithGoogle();

      await this.router.navigateByUrl(
        '/home',
        {
          replaceUrl: true,
        },
      );
    } catch (error) {
      console.error(
        'Google login error:',
        error,
      );

      this.errorMessage.set(
        'No se pudo iniciar sesión con Google.',
      );
    } finally {
      this.isLoading.set(false);
    }
  }
}