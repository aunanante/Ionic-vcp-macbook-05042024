import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DeleteProductModalPage } from './delete-product-modal.page';

describe('DeleteProductModalPage', () => {
  let component: DeleteProductModalPage;
  let fixture: ComponentFixture<DeleteProductModalPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(DeleteProductModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
