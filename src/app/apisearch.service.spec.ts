import { TestBed } from '@angular/core/testing';

import { ApisearchService } from './apisearch.service';

describe('ApisearchService', () => {
  let service: ApisearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApisearchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
