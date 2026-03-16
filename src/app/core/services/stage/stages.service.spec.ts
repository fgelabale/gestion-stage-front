import { TestBed } from '@angular/core/testing';

import { StagesService } from './stages.service';

describe('Stages', () => {
  let service: StagesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StagesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
