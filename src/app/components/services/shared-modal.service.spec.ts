import { TestBed } from '@angular/core/testing';

import { SharedModalService } from './shared-modal.service';

describe('SharedModalService', () => {
  let service: SharedModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SharedModalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
