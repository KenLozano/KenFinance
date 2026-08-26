import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionQuickMenuComponent } from './transaction-quick-menu.component';

describe('TransactionQuickMenuComponent', () => {
  let component: TransactionQuickMenuComponent;
  let fixture: ComponentFixture<TransactionQuickMenuComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionQuickMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
