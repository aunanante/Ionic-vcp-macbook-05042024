import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EnterCustomRenewalValuesModalPage } from './enter-custom-renewal-values-modal.page';

describe('EnterCustomRenewalValuesModalPage', () => {
  let component: EnterCustomRenewalValuesModalPage;
  let fixture: ComponentFixture<EnterCustomRenewalValuesModalPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(EnterCustomRenewalValuesModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
