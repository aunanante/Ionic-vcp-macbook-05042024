import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreatePaymentPage } from './create-payment.page';

describe('CreatePaymentPage', () => {
  let component: CreatePaymentPage;
  let fixture: ComponentFixture<CreatePaymentPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CreatePaymentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
