import {
  HttpEvent,
  HttpInterceptorFn,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { HttpLoaderService } from './services/http-loader.service';

// Define the interceptor
export const httpInterceptor: HttpInterceptorFn = <T>(
  req: HttpRequest<T>,
  next: (req: HttpRequest<T>) => Observable<HttpEvent<T>>
) => {
  const httpLoadingService = inject(HttpLoaderService);
  httpLoadingService.setLoading(true, req.url);

  return next(req).pipe(
    map<HttpEvent<T>, HttpEvent<T>>((evt: HttpEvent<T>) => {
      if (evt instanceof HttpResponse) {
        httpLoadingService.setLoading(false, req.url);
      }
      return evt;
    }),
    catchError((err) => {
      httpLoadingService.setLoading(false, req.url);
      return throwError(() => err);
    })
  );
};
