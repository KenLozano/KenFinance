import {
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-transaction-quick-menu',
  templateUrl: './transaction-quick-menu.component.html',
  styleUrls: ['./transaction-quick-menu.component.scss'],
  standalone: true,
  imports: [
    RouterLink,
  ],
})
export class TransactionQuickMenuComponent {
  @Input() open = false;

  @Output()
  closed = new EventEmitter<void>();

  close(): void {
    this.closed.emit();
  }
}