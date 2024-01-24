import { TestBed } from '@angular/core/testing';

import { GeneralAPIService } from './general-api.service';

describe('GeneralAPIService', () => {
  let service: GeneralAPIService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GeneralAPIService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
