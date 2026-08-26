import {
  Component,
  Input,
} from '@angular/core';

export interface ExpenseDistributionItem {
  category: string;
  amount: number;
}

@Component({
  selector: 'app-expense-distribution',
  templateUrl: './expense-distribution.component.html',
  styleUrls: ['./expense-distribution.component.scss'],
  standalone: true,
})
export class ExpenseDistributionComponent {
  @Input() items: ExpenseDistributionItem[] = [];
  @Input() currencySymbol = 'S/';

  get total(): number {
    return this.items.reduce(
      (sum, item) =>
        sum + item.amount,
      0,
    );
  }

  getPercentage(
    amount: number,
  ): number {
    if (this.total <= 0) {
      return 0;
    }

    return (
      amount /
      this.total
    ) * 100;
  }
}