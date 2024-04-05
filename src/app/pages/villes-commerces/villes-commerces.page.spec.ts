import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VillesCommercesPage } from './villes-commerces.page';

describe('VillesCommercesPage', () => {
  let component: VillesCommercesPage;
  let fixture: ComponentFixture<VillesCommercesPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(VillesCommercesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
