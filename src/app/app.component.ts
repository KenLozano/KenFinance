import {
  Component,
  inject,
} from '@angular/core';

import {
  IonApp,
  IonRouterOutlet,
} from '@ionic/angular';

import {
  ThemeService,
} from './core/services/theme';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [
    IonApp,
    IonRouterOutlet,
  ],
})
export class AppComponent {
  private readonly themeService =
    inject(ThemeService);
}