import { TestBed } from '@angular/core/testing';

import { ProposalLetterService } from './proposal-letter.service';

describe('ProposalLetterService', () => {
  let service: ProposalLetterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProposalLetterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
