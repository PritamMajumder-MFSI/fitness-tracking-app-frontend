import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BackendService {
  private httpHeaders = new HttpHeaders();

  constructor(private _http: HttpClient) {
    this.httpHeaders.set('Content-Type', 'application/json');
  }

  public postApiCall<T, B>(
    route: string,
    payload: B
  ): Observable<{ success: boolean; data: T; message: string }> {
    return this._http.post<{ success: boolean; data: T; message: string }>(
      environment.backendUri + route,
      payload,
      {
        headers: this.httpHeaders,
        withCredentials: true,
      }
    );
  }
  public getApi<T>(
    route: string,
    params: Record<string, string> = {}
  ): Observable<{ success: boolean; data: T; message: string }> {
    return this._http.get<{ success: boolean; data: T; message: string }>(
      environment.backendUri + route,
      { params, headers: this.httpHeaders, withCredentials: true }
    );
  }
  public patchApiCall<T, B>(
    route: string,
    payload: B
  ): Observable<{ success: boolean; data: T; message: string }> {
    return this._http.patch<{ success: boolean; data: T; message: string }>(
      environment.backendUri + route,
      payload,
      {
        headers: this.httpHeaders,
        withCredentials: true,
      }
    );
  }
}
