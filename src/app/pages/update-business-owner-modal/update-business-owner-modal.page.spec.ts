import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UpdateBusinessOwnerModalPage } from './update-business-owner-modal.page';

describe('UpdateBusinessOwnerModalPage', () => {
  let component: UpdateBusinessOwnerModalPage;
  let fixture: ComponentFixture<UpdateBusinessOwnerModalPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(UpdateBusinessOwnerModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
