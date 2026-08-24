import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncomeExpenseChartComponent } from './income-expense-chart.component';

describe('IncomeExpenseChartComponent', () => {
  let component: IncomeExpenseChartComponent;
  let fixture: ComponentFixture<IncomeExpenseChartComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(IncomeExpenseChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
