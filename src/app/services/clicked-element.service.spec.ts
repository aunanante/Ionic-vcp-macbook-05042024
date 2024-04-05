import { TestBed } from '@angular/core/testing';

import { ClickedElementService } from './clicked-element.service';

describe('ClickedElementService', () => {
  let service: ClickedElementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClickedElementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
