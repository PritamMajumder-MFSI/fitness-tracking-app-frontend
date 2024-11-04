import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';

import { authGuardFn } from './auth.guard';
import { AuthServiceService } from '../services/auth-service.service';
import { BackendService } from '../services/backend.service';
import { of, throwError } from 'rxjs';

describe('authGuard', () => {
  let routerSpy: jasmine.SpyObj<Router>;
  let backendServiceSpy: jasmine.SpyObj<BackendService>;
  let authServiceSpy: jasmine.SpyObj<AuthServiceService>;
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => authGuardFn(...guardParameters));

  beforeEach(() => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    backendServiceSpy = jasmine.createSpyObj('BackendService', ['getApi']);
    authServiceSpy = jasmine.createSpyObj('AuthServiceService', ['setDetails']);
    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: BackendService, useValue: backendServiceSpy },
        { provide: AuthServiceService, useValue: authServiceSpy },
      ],
    });
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });

  it('should allow access and set user details if token validation is successful', async () => {
    const mockResponse = {
      data: { user: { username: 'testuser', email: 'test@example.com' } },
      message: 'Validation successful',
      success: true,
    };
    backendServiceSpy.getApi.and.returnValue(of(mockResponse));
    const result = await executeGuard(
      new ActivatedRouteSnapshot(),
      {} as RouterStateSnapshot
    );

    expect(result).toBeTrue();
    expect(authServiceSpy.setDetails).toHaveBeenCalledWith(
      mockResponse.data.user
    );
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });

  it('should deny access and navigate to login if token validation fails', async () => {
    backendServiceSpy.getApi.and.returnValue(
      throwError(() => new Error('Unauthorized'))
    );

    const result = await executeGuard(
      new ActivatedRouteSnapshot(),
      {} as RouterStateSnapshot
    );

    expect(result).toBeFalse();
    expect(authServiceSpy.setDetails).not.toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/auth/login']);
  });
});
