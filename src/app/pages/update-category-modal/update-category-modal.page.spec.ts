import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UpdateCategoryModalPage } from './update-category-modal.page';

describe('UpdateCategoryModalPage', () => {
  let component: UpdateCategoryModalPage;
  let fixture: ComponentFixture<UpdateCategoryModalPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(UpdateCategoryModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
