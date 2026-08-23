import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import {
  IonButton,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
} from '@ionic/angular';

import { AuthService } from '../../core/auth/auth';

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
export class HomePage {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  isLoggingOut = false;

  async logout(): Promise<void> {
    if (this.isLoggingOut) {
      return;
    }

    this.isLoggingOut = true;

    try {
      await this.authService.logout();

      await this.router.navigateByUrl('/login', {
        replaceUrl: true,
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.isLoggingOut = false;
    }
  }
}