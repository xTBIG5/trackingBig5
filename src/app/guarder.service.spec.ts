import { TestBed, inject } from '@angular/core/testing';

import { GuarderService } from './guarder.service';

describe('GuarderService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GuarderService]
    });
  });

  it('should be created', inject([GuarderService], (service: GuarderService) => {
    expect(service).toBeTruthy();
  }));
});
