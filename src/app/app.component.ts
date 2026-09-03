import {
  Component,
  inject,
} from '@angular/core';

import {
  IonApp,
  IonRouterOutlet,
} from '@ionic/angular';

import {
  addCircleOutline,
  addOutline,
  chevronForwardOutline,
  ellipsisHorizontalOutline,
  homeOutline,
  removeCircleOutline,
  timeOutline,
  walletOutline,
} from 'ionicons/icons';

import {
  addIcons,
} from 'ionicons';

import {
  ThemeService,
} from './core/services/theme';

addIcons({
  'add-outline':
    addOutline,

  'home-outline':
    homeOutline,

  'time-outline':
    timeOutline,

  'wallet-outline':
    walletOutline,

  'ellipsis-horizontal-outline':
    ellipsisHorizontalOutline,

  'add-circle-outline':
    addCircleOutline,

  'remove-circle-outline':
    removeCircleOutline,

  'chevron-forward-outline':
    chevronForwardOutline,
});

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