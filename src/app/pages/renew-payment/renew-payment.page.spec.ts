import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RenewPaymentPage } from './renew-payment.page';

describe('RenewPaymentPage', () => {
  let component: RenewPaymentPage;
  let fixture: ComponentFixture<RenewPaymentPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(RenewPaymentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
