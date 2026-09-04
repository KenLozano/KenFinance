import {
  Component,
  signal,
} from '@angular/core';

import {
  RouterLink,
  RouterLinkActive,
} from '@angular/router';

import {
  TransactionQuickMenuComponent,
} from '../../shared/components/transaction-quick-menu/transaction-quick-menu.component';


import {
  IonIcon,
} from '@ionic/angular';

@Component({
  selector: 'app-desktop-sidebar',
  templateUrl: './desktop-sidebar.component.html',
  styleUrls: ['./desktop-sidebar.component.scss'],
  standalone: true,
  imports: [
    IonIcon,
    RouterLink,
    RouterLinkActive,
    TransactionQuickMenuComponent,
  ],
})
export class DesktopSidebarComponent {
  readonly quickMenuOpen = signal(false);

  openQuickMenu(): void {
    this.quickMenuOpen.set(true);
  }

  closeQuickMenu(): void {
    this.quickMenuOpen.set(false);
  }
}