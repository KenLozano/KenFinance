import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseDistributionComponent } from './expense-distribution.component';

describe('ExpenseDistributionComponent', () => {
  let component: ExpenseDistributionComponent;
  let fixture: ComponentFixture<ExpenseDistributionComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpenseDistributionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
