import { TestBed } from '@angular/core/testing';

import { AuthServiceService } from './auth-service.service';

describe('AuthServiceService', () => {
  let service: AuthServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('should set username and email correctly', () => {
    const userData = { username: 'testUser', email: 'test@example.com' };
    service.setDetails(userData);

    expect(service.username).toBe('testUser');
    expect(service.email).toBe('test@example.com');
  });
});
