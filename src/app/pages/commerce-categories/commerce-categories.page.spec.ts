import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommerceCategoriesPage } from './commerce-categories.page';

describe('CommerceCategoriesPage', () => {
  let component: CommerceCategoriesPage;
  let fixture: ComponentFixture<CommerceCategoriesPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CommerceCategoriesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
