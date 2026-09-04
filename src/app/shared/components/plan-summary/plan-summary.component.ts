import {
  Component,
  Input,
} from '@angular/core';

@Component({
  selector: 'app-plan-summary',
  templateUrl: './plan-summary.component.html',
  styleUrls: ['./plan-summary.component.scss'],
  standalone: true,
})
export class PlanSummaryComponent {
  @Input() incomeTarget = 0;
  @Input() expenseLimit = 0;

  @Input() currentIncome = 0;
  @Input() currentExpenses = 0;

  @Input() currencySymbol = 'S/';

  get incomeProgress(): number {
    if (this.incomeTarget <= 0) {
      return 0;
    }

    return (
      this.currentIncome /
      this.incomeTarget
    ) * 100;
  }

  get expenseProgress(): number {
    if (this.expenseLimit <= 0) {
      return 0;
    }

    return (
      this.currentExpenses /
      this.expenseLimit
    ) * 100;
  }

  get incomeBarWidth(): number {
    return Math.min(
      Math.max(this.incomeProgress, 0),
      100,
    );
  }

  get expenseBarWidth(): number {
    return Math.min(
      Math.max(this.expenseProgress, 0),
      100,
    );
  }

  get hasPlan(): boolean {
    return (
      this.incomeTarget > 0 ||
      this.expenseLimit > 0
    );
  }
}