import {
  HttpEvent,
  HttpInterceptorFn,
  HttpRequest,
  HttpResponse,
  HttpErrorResponse,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, map, Observable, throwError, switchMap } from 'rxjs';
import { HttpLoaderService } from './services/http-loader.service';
import { Router } from '@angular/router';
import { BackendService } from './services/backend.service';

export const httpInterceptor: HttpInterceptorFn = <T>(
  req: HttpRequest<T>,
  next: (req: HttpRequest<T>) => Observable<HttpEvent<T>>
) => {
  const httpLoadingService = inject(HttpLoaderService);
  const backendService = inject(BackendService);
  const router = inject(Router);

  httpLoadingService.setLoading(true, req.url);

  return next(req).pipe(
    map<HttpEvent<T>, HttpEvent<T>>((evt: HttpEvent<T>) => {
      if (evt instanceof HttpResponse) {
        httpLoadingService.setLoading(false, req.url);
      }
      return evt;
    }),
    catchError((err: HttpErrorResponse) => {
      httpLoadingService.setLoading(false, req.url);
      console.log('Interceptor failed->', err.status);
      if (err.status === 412) {
        return handleRefreshToken(req, next, backendService, router);
      }

      return throwError(() => err);
    })
  );
};

const handleRefreshToken = (
  req: HttpRequest<any>,
  next: (req: HttpRequest<any>) => Observable<HttpEvent<any>>,
  backendService: BackendService,
  router: Router
) => {
  console.log('call backend again');
  return backendService.postApiCall('auth/refresh-token', {}).pipe(
    switchMap(() => {
      return next(req);
    }),
    catchError((refreshError) => {
      console.error('Token refresh failed', refreshError);
      router.navigate(['/auth/login']);
      return throwError(() => refreshError);
    })
  );
};
