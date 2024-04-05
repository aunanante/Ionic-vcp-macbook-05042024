import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DeleteCommerceModalPage } from './delete-commerce-modal.page';

describe('DeleteCommerceModalPage', () => {
  let component: DeleteCommerceModalPage;
  let fixture: ComponentFixture<DeleteCommerceModalPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(DeleteCommerceModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
