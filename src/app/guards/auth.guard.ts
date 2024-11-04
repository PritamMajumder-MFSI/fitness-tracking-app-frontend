import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';
import { BackendService } from '../services/backend.service';
import { lastValueFrom } from 'rxjs';
import { AuthServiceService } from '../services/auth-service.service';

export const authGuardFn: CanActivateFn = async () => {
  const router = inject(Router);
  const backendService = inject(BackendService);
  const authService = inject(AuthServiceService);
  try {
    const res = await lastValueFrom(
      backendService.getApi<{ user: { username: string; email: string } }>(
        'auth/validate-token'
      )
    );
    authService.setDetails(res.data.user);
    return true;
  } catch {
    router.navigate(['/auth/login']);
    return false;
  }
};
