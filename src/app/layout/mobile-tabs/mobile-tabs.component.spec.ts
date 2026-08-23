import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileTabsComponent } from './mobile-tabs.component';

describe('MobileTabsComponent', () => {
  let component: MobileTabsComponent;
  let fixture: ComponentFixture<MobileTabsComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MobileTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
