import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommercesPage } from './commerces.page';

describe('CommercesPage', () => {
  let component: CommercesPage;
  let fixture: ComponentFixture<CommercesPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CommercesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
