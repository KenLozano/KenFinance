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
import { ProfileService } from '../../core/services/profile';

import {
  CurrencyCode,
  UserProfile,
} from '../../shared/models';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
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
export class ProfileComponent implements OnInit {
  private readonly authService =
    inject(AuthService);

  private readonly profileService =
    inject(ProfileService);

  private readonly router =
    inject(Router);

  readonly isLoading =
    signal(true);

  readonly isSaving =
    signal(false);

  readonly errorMessage =
    signal('');

  readonly successMessage =
    signal('');

  readonly accountEmail =
    signal('');

  name = '';
  phone = '';
  birthday = '';
  city = '';
  country = '';
  occupation = '';

  currency: CurrencyCode =
    'PEN';

  monthlyTarget: number | null =
    null;

  bio = '';
  recoveryEmail = '';
  emergencyContact = '';

  async ngOnInit(): Promise<void> {
    await this.loadProfile();
  }

  private async loadProfile(): Promise<void> {
    const user =
      this.authService.currentUser;

    if (!user) {
      this.errorMessage.set(
        'No se encontró una sesión activa.',
      );

      this.isLoading.set(false);
      return;
    }

    this.accountEmail.set(
      user.email ?? '',
    );

    try {
      const profile =
        await this.profileService.getProfile(
          user.uid,
        );

      if (!profile) {
        this.loadDefaultsFromAuth();
        return;
      }

      this.populateForm(profile);
    } catch (error) {
      console.error(
        'Profile load error:',
        error,
      );

      this.errorMessage.set(
        'No se pudo cargar el perfil.',
      );
    } finally {
      this.isLoading.set(false);
    }
  }

  private populateForm(
    profile: UserProfile,
  ): void {
    this.name =
      profile.name;

    this.phone =
      profile.phone;

    this.birthday =
      profile.birthday;

    this.city =
      profile.city;

    this.country =
      profile.country;

    this.occupation =
      profile.occupation;

    this.currency =
      profile.currency;

    this.monthlyTarget =
      profile.monthlyTarget;

    this.bio =
      profile.bio;

    this.recoveryEmail =
      profile.recoveryEmail;

    this.emergencyContact =
      profile.emergencyContact;
  }

  private loadDefaultsFromAuth(): void {
    const user =
      this.authService.currentUser;

    this.name =
      user?.displayName ?? '';

    this.currency = 'PEN';
    this.monthlyTarget = 0;
  }

  async saveProfile(): Promise<void> {
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

    const name =
      this.name.trim();

    if (!name) {
      this.errorMessage.set(
        'Ingresa tu nombre.',
      );

      return;
    }

    const monthlyTarget =
      this.monthlyTarget ?? 0;

    if (
      !Number.isFinite(monthlyTarget) ||
      monthlyTarget < 0
    ) {
      this.errorMessage.set(
        'La meta mensual no puede ser negativa.',
      );

      return;
    }

    if (
      this.recoveryEmail &&
      !this.isValidEmail(
        this.recoveryEmail,
      )
    ) {
      this.errorMessage.set(
        'Ingresa un correo de recuperación válido.',
      );

      return;
    }

    const profile: UserProfile = {
      name,
      phone:
        this.phone.trim(),

      birthday:
        this.birthday,

      city:
        this.city.trim(),

      country:
        this.country.trim(),

      occupation:
        this.occupation.trim(),

      currency:
        this.currency,

      monthlyTarget,

      bio:
        this.bio.trim(),

      recoveryEmail:
        this.recoveryEmail.trim(),

      emergencyContact:
        this.emergencyContact.trim(),
    };

    this.isSaving.set(true);

    try {
      await this.profileService.saveProfile(
        user.uid,
        profile,
      );

      this.successMessage.set(
        'Perfil actualizado correctamente.',
      );
    } catch (error) {
      console.error(
        'Profile save error:',
        error,
      );

      this.errorMessage.set(
        'No se pudo guardar el perfil.',
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

  private isValidEmail(
    value: string,
  ): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      .test(value.trim());
  }
}