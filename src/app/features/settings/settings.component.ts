import {
  Component,
  inject,
  signal,
} from '@angular/core';

import {
  Router,
  RouterLink,
} from '@angular/router';

import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
} from '@ionic/angular';

import { AuthService } from '../../core/auth/auth';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  standalone: true,
  imports: [
    RouterLink,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
  ],
})
export class SettingsComponent {
  private readonly authService =
    inject(AuthService);

  private readonly router =
    inject(Router);

  readonly isLoggingOut =
    signal(false);

  readonly errorMessage =
    signal('');

  async logout(): Promise<void> {
    if (this.isLoggingOut()) {
      return;
    }

    const confirmed =
      window.confirm(
        '¿Seguro que deseas cerrar sesión?',
      );

    if (!confirmed) {
      return;
    }

    this.errorMessage.set('');
    this.isLoggingOut.set(true);

    try {
      await this.authService.logout();

      await this.router.navigateByUrl(
        '/login',
        {
          replaceUrl: true,
        },
      );
    } catch (error) {
      console.error(
        'Logout error:',
        error,
      );

      this.errorMessage.set(
        'No se pudo cerrar la sesión.',
      );
    } finally {
      this.isLoggingOut.set(false);
    }
  }
}