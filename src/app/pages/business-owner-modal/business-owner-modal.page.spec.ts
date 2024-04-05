import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BusinessOwnerModalPage } from './business-owner-modal.page';

describe('BusinessOwnerModalPage', () => {
  let component: BusinessOwnerModalPage;
  let fixture: ComponentFixture<BusinessOwnerModalPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(BusinessOwnerModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
