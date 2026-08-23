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
import { AccountService } from '../../core/services/account';
import { ProfileService } from '../../core/services/profile';

import {
  Account,
  UserProfile,
} from '../../shared/models';

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
  private readonly accountService = inject(AccountService);
  private readonly router = inject(Router);

  readonly profile = signal<UserProfile | null>(null);
  readonly accounts = signal<Account[]>([]);

  readonly isLoadingProfile = signal(true);
  readonly isLoadingAccounts = signal(true);

  readonly profileError = signal('');
  readonly accountsError = signal('');

  readonly isLoggingOut = signal(false);

  async ngOnInit(): Promise<void> {
    await Promise.all([
      this.loadProfile(),
      this.loadAccounts(),
    ]);
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

  private async loadAccounts(): Promise<void> {
    const user = this.authService.currentUser;

    if (!user) {
      this.accountsError.set(
        'No se encontró una sesión activa.',
      );

      this.isLoadingAccounts.set(false);
      return;
    }

    try {
      const accounts =
        await this.accountService.getAccounts(user.uid);

      this.accounts.set(accounts);
    } catch (error) {
      console.error(
        'Accounts load error:',
        error,
      );

      this.accountsError.set(
        'No se pudieron cargar las cuentas.',
      );
    } finally {
      this.isLoadingAccounts.set(false);
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