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
  arrowDownOutline,
  arrowUpOutline,
  chevronForwardOutline,
  ellipsisHorizontalOutline,
  homeOutline,
  removeCircleOutline,
  timeOutline,
  walletOutline,
} from 'ionicons/icons';

import {
  logoGoogle,
} from 'ionicons/icons';

import {
  addIcons,

  
} from 'ionicons';

import {
  ThemeService,
} from './core/services/theme';

addIcons({

   'logo-google': 
   logoGoogle,

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

    'arrow-down-outline':
  arrowDownOutline,

'arrow-up-outline':
  arrowUpOutline,

    
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