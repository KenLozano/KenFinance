import {
  Component,
  Input,
  } from '@angular/core';

export interface MonthlyFlowPoint {
  day: number;
  income: number;
  expenses: number;
}

@Component({
  selector: 'app-monthly-flow',
  templateUrl: './monthly-flow.component.html',
  styleUrls: ['./monthly-flow.component.scss'],
  standalone: true,
})
export class MonthlyFlowComponent {
  @Input() points: MonthlyFlowPoint[] = [];
  @Input() currencySymbol = 'S/';

  readonly width = 800;
  readonly height = 260;

  readonly paddingLeft = 44;
  readonly paddingRight = 20;
  readonly paddingTop = 20;
  readonly paddingBottom = 34;

  get incomePoints(): string {
    return this.buildPolyline('income');
  }

  get expensePoints(): string {
    return this.buildPolyline('expenses');
  }

  get maxValue(): number {
    let max = 0;

    for (const point of this.points) {
      max = Math.max(
        max,
        point.income,
        point.expenses,
      );
    }

    return max > 0 ? max : 1;
  }

  get lastPoint(): MonthlyFlowPoint | null {
    return this.points.at(-1) ?? null;
  }

  private buildPolyline(
    field: 'income' | 'expenses',
  ): string {
    if (!this.points.length) {
      return '';
    }

    const chartWidth =
      this.width -
      this.paddingLeft -
      this.paddingRight;

    const chartHeight =
      this.height -
      this.paddingTop -
      this.paddingBottom;

    const maxDay = Math.max(
      ...this.points.map(
        (point) => point.day,
      ),
      1,
    );

    return this.points
      .map((point) => {
        const x =
          this.paddingLeft +
          (
            (point.day - 1) /
            Math.max(maxDay - 1, 1)
          ) *
          chartWidth;

        const value = point[field];

        const y =
          this.paddingTop +
          chartHeight -
          (
            value /
            this.maxValue
          ) *
          chartHeight;

        return `${x},${y}`;
      })
      .join(' ');
  }
}