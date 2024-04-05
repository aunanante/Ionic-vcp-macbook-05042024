import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EnterCustomValuesModalPage } from './enter-custom-values-modal.page';

describe('EnterCustomValuesModalPage', () => {
  let component: EnterCustomValuesModalPage;
  let fixture: ComponentFixture<EnterCustomValuesModalPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(EnterCustomValuesModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
