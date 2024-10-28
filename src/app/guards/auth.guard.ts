import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';
import { BackendService } from '../services/backend.service';
import { lastValueFrom } from 'rxjs';

export const authGuardFn: CanActivateFn = async (route, state) => {
  const router = inject(Router);
  const backendService = inject(BackendService);
  try {
    await lastValueFrom(backendService.getApi('auth/validate-token'));
    return true;
  } catch {
    router.navigate(['/auth/login']);
    return false;
  }
};
