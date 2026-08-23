import {
  Component,
  OnInit,
  inject,
  signal,
} from '@angular/core';

import { Router } from '@angular/router';

import {
  IonButton,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
} from '@ionic/angular';

import { AuthService } from '../../core/auth/auth';
import { ProfileService } from '../../core/services/profile';
import { UserProfile } from '../../shared/models';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
  ],
})
export class HomePage implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly profileService = inject(ProfileService);
  private readonly router = inject(Router);

  readonly profile = signal<UserProfile | null>(null);
  readonly isLoadingProfile = signal(true);
  readonly profileError = signal('');

  readonly isLoggingOut = signal(false);

  async ngOnInit(): Promise<void> {
    await this.loadProfile();
  }

  private async loadProfile(): Promise<void> {
    const user = this.authService.currentUser;

    if (!user) {
      this.profileError.set(
        'No se encontró una sesión activa.',
      );

      this.isLoadingProfile.set(false);
      return;
    }

    try {
      const profile =
        await this.profileService.getProfile(user.uid);

      this.profile.set(profile);
    } catch (error) {
      console.error(
        'Profile load error:',
        error,
      );

      this.profileError.set(
        'No se pudo cargar el perfil.',
      );
    } finally {
      this.isLoadingProfile.set(false);
    }
  }

  async logout(): Promise<void> {
    if (this.isLoggingOut()) {
      return;
    }

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
    } finally {
      this.isLoggingOut.set(false);
    }
  }
}