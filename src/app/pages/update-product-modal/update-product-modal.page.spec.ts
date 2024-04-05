import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UpdateProductModalPage } from './update-product-modal.page';

describe('UpdateProductModalPage', () => {
  let component: UpdateProductModalPage;
  let fixture: ComponentFixture<UpdateProductModalPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(UpdateProductModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
