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
  AlertController,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
} from '@ionic/angular';

import {
  AuthService,
} from '../../core/auth/auth';

import {
  ThemePreference,
  ThemeService,
} from '../../core/services/theme';

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
  
  private readonly alertController =
  inject(AlertController);  

  readonly themeService =
    inject(ThemeService);

  readonly isLoggingOut =
    signal(false);

  readonly errorMessage =
    signal('');

  setTheme(
    preference: ThemePreference,
  ): void {
    this.themeService.setPreference(
      preference,
    );
  }

  async logout(): Promise<void> {
    if (this.isLoggingOut()) {
      return;
    }

    const alert =
  await this.alertController.create({
    header: 'Cerrar sesión',
    message:
      '¿Seguro que deseas cerrar tu sesión en KenFinance?',
    buttons: [
      {
        text: 'Cancelar',
        role: 'cancel',
      },
      {
        text: 'Cerrar sesión',
        role: 'destructive',
      },
    ],
  });

await alert.present();

const result =
  await alert.onDidDismiss();

if (result.role !== 'destructive') {
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