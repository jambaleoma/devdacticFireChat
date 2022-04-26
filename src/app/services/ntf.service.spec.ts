import { TestBed } from '@angular/core/testing';

import { NtfService } from './ntf.service';

describe('NtfService', () => {
  let service: NtfService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NtfService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
