import { TestBed, inject } from '@angular/core/testing';

import { ApartmentResolverService } from './apartment-resolver.service';

describe('ApartmentResolverService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ApartmentResolverService]
    });
  });

  it('should be created', inject([ApartmentResolverService], (service: ApartmentResolverService) => {
    expect(service).toBeTruthy();
  }));
});
