import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DeleteBusinessOwnerModalPage } from './delete-business-owner-modal.page';

describe('DeleteBusinessOwnerModalPage', () => {
  let component: DeleteBusinessOwnerModalPage;
  let fixture: ComponentFixture<DeleteBusinessOwnerModalPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(DeleteBusinessOwnerModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
