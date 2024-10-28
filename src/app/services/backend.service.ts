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

  public postApiCall<T, B>(route: string, payload: B): Observable<T> {
    return this._http.post<T>(this.backendUri + route, payload, {
      headers: this.httpHeaders,
      withCredentials: true,
    });
  }
  public getApi<T>(route: string): Observable<T> {
    return this._http.get<T>(this.backendUri + route, {
      headers: this.httpHeaders,
      withCredentials: true,
    });
  }
}
