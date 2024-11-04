import { TestBed } from '@angular/core/testing';

import { BackendService } from './backend.service';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { httpInterceptor } from '../interceptor.interceptor';

describe('BackendService', () => {
  let service: BackendService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(withInterceptors([httpInterceptor]))],
    });
    service = TestBed.inject(BackendService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
