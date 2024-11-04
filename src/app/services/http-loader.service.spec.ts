import { TestBed } from '@angular/core/testing';

import { HttpLoaderService } from './http-loader.service';

describe('HttpLoaderService', () => {
  let service: HttpLoaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HttpLoaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set loading state correctly', () => {
    const url = 'http://example.com';

    service.setLoading(true, url);
    expect(service.loadingMap.get(url)).toBe(true);
    expect(service.loadingSub.getValue()).toBe(true);

    service.setLoading(false, url);
    expect(service.loadingMap.has(url)).toBe(false);
    expect(service.loadingSub.getValue()).toBe(false);
  });
});
