import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { USElectionsService } from './uselections.service';

describe('USElectionsService', () => {
  let service: USElectionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(USElectionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
