import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VillesModalPage } from './villes-modal.page';

describe('VillesModalPage', () => {
  let component: VillesModalPage;
  let fixture: ComponentFixture<VillesModalPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(VillesModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
