import {
  HttpEvent,
  HttpInterceptorFn,
  HttpResponse,
} from '@angular/common/http';
import { inject } from '@angular/core';

import { catchError, map, throwError } from 'rxjs';
import { HttpLoaderService } from './services/http-loader.service';

export const httpInterceptor: HttpInterceptorFn = (req, next) => {
  const httpLoadingService = inject(HttpLoaderService);
  httpLoadingService.setLoading(true, req.url);
  return next(req).pipe(
    map<HttpEvent<any>, any>((evt: HttpEvent<any>) => {
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
