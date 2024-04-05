import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DeleteDetailModalPage } from './delete-detail-modal.page';

describe('DeleteDetailModalPage', () => {
  let component: DeleteDetailModalPage;
  let fixture: ComponentFixture<DeleteDetailModalPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(DeleteDetailModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
