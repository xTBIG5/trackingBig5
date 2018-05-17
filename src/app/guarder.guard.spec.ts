import { TestBed, async, inject } from '@angular/core/testing';

import { GuarderGuard } from './guarder.guard';

describe('GuarderGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GuarderGuard]
    });
  });

  it('should ...', inject([GuarderGuard], (guard: GuarderGuard) => {
    expect(guard).toBeTruthy();
  }));
});
