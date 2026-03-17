import { TestBed } from '@angular/core/testing';

import { AccesExterneService } from './acces-externe';

describe('AccesExterne', () => {
  let service: AccesExterneService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AccesExterneService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
