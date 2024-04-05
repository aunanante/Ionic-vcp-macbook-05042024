import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductModalAddPage } from './product-modal-add.page';

describe('ProductModalAddPage', () => {
  let component: ProductModalAddPage;
  let fixture: ComponentFixture<ProductModalAddPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ProductModalAddPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
