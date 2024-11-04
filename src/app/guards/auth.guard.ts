import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';
import { BackendService } from '../services/backend.service';
import { lastValueFrom } from 'rxjs';
import { AuthServiceService } from '../services/auth-service.service';
import { isPlatformServer } from '@angular/common';

export const authGuardFn: CanActivateFn = async () => {
  const router = inject(Router);
  const backendService = inject(BackendService);
  const authService = inject(AuthServiceService);

  const platformId = inject(PLATFORM_ID);
  if (isPlatformServer(platformId)) {
    await router.navigate(['/loading']);
    return false;
  }
  try {
    const res = await lastValueFrom(
      backendService.getApi<{ user: { username: string; email: string } }>(
        'auth/validate-token'
      )
    );
    authService.setDetails(res.data.user);
    return true;
  } catch {
    console.log('Auth guard triggered', isPlatformServer(platformId));
    if (router.url !== '/auth/login') {
      await router.navigate(['/auth/login']);
    }
    return false;
  }
};
