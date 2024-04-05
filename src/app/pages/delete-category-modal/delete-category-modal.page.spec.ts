import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DeleteCategoryModalPage } from './delete-category-modal.page';

describe('DeleteCategoryModalPage', () => {
  let component: DeleteCategoryModalPage;
  let fixture: ComponentFixture<DeleteCategoryModalPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(DeleteCategoryModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
