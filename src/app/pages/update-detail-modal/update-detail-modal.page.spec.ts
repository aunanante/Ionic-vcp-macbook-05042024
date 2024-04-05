import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UpdateDetailModalPage } from './update-detail-modal.page';

describe('UpdateDetailModalPage', () => {
  let component: UpdateDetailModalPage;
  let fixture: ComponentFixture<UpdateDetailModalPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(UpdateDetailModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
