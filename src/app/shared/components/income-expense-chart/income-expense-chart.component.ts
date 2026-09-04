import {
  Component,
  Input,
} from '@angular/core';

@Component({
  selector: 'app-income-expense-chart',
  templateUrl: './income-expense-chart.component.html',
  styleUrls: ['./income-expense-chart.component.scss'],
  standalone: true,
})
export class IncomeExpenseChartComponent {
  @Input() income = 0;
  @Input() expenses = 0;
  @Input() currencySymbol = 'S/';

  get maxValue(): number {
    return Math.max(
      this.income,
      this.expenses,
      1,
    );
  }

  get incomeWidth(): number {
    return (
      this.income /
      this.maxValue
    ) * 100;
  }

  get expenseWidth(): number {
    return (
      this.expenses /
      this.maxValue
    ) * 100;
  }
}