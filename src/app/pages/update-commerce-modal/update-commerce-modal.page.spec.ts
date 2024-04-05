import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UpdateCommerceModalPage } from './update-commerce-modal.page';

describe('UpdateCommerceModalPage', () => {
  let component: UpdateCommerceModalPage;
  let fixture: ComponentFixture<UpdateCommerceModalPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(UpdateCommerceModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
