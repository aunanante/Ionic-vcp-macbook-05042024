import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetailAddModalPage } from './detail-add-modal.page';

describe('DetailAddModalPage', () => {
  let component: DetailAddModalPage;
  let fixture: ComponentFixture<DetailAddModalPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(DetailAddModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
