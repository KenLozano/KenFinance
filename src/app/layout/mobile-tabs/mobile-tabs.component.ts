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

@Component({
  selector: 'app-mobile-tabs',
  templateUrl: './mobile-tabs.component.html',
  styleUrls: ['./mobile-tabs.component.scss'],
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    TransactionQuickMenuComponent,
  ],
})
export class MobileTabsComponent {
  readonly quickMenuOpen =
    signal(false);

  openQuickMenu(): void {
    this.quickMenuOpen.set(true);
  }

  closeQuickMenu(): void {
    this.quickMenuOpen.set(false);
  }
}