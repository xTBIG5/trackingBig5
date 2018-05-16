import { TestBed, inject } from '@angular/core/testing';

import { UserChartService } from './user-chart.service';

describe('UserChartService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserChartService]
    });
  });

  it('should be created', inject([UserChartService], (service: UserChartService) => {
    expect(service).toBeTruthy();
  }));
});
