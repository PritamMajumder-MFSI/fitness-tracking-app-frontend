import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BackendService {
  private httpHeaders = new HttpHeaders();

  private backendUri = 'http://localhost:3000/api/v1/';
  constructor(private _http: HttpClient) {
    this.httpHeaders.set('Content-Type', 'application/json');
  }

  public postApiCall<T, B>(
    route: string,
    payload: B
  ): Observable<{ success: boolean; data: T; message: string }> {
    return this._http.post<{ success: boolean; data: T; message: string }>(
      this.backendUri + route,
      payload,
      {
        headers: this.httpHeaders,
        withCredentials: true,
      }
    );
  }
  public getApi<T>(
    route: string,
    params: { [key: string]: string } = {}
  ): Observable<{ success: boolean; data: T; message: string }> {
    return this._http.get<{ success: boolean; data: T; message: string }>(
      this.backendUri + route,
      { params, headers: this.httpHeaders, withCredentials: true }
    );
  }
  public patchApiCall<T, B>(
    route: string,
    payload: B
  ): Observable<{ success: boolean; data: T; message: string }> {
    return this._http.patch<{ success: boolean; data: T; message: string }>(
      this.backendUri + route,
      payload,
      {
        headers: this.httpHeaders,
        withCredentials: true,
      }
    );
  }
}
