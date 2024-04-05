import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateCategoryModalPage } from './create-category-modal.page';

describe('CreateCategoryModalPage', () => {
  let component: CreateCategoryModalPage;
  let fixture: ComponentFixture<CreateCategoryModalPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CreateCategoryModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
