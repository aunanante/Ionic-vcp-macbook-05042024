import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommerceModalPage } from './commerce-modal.page';

describe('CommerceModalPage', () => {
  let component: CommerceModalPage;
  let fixture: ComponentFixture<CommerceModalPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CommerceModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
