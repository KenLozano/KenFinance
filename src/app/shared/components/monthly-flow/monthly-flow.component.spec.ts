import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlyFlowComponent } from './monthly-flow.component';

describe('MonthlyFlowComponent', () => {
  let component: MonthlyFlowComponent;
  let fixture: ComponentFixture<MonthlyFlowComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MonthlyFlowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
