import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthServiceService {
  public username: string = '';
  public email: string = '';
  constructor() {}
  setDetails(data: { username: string; email: string }) {
    this.username = data.username;
    this.email = data.email;
  }
}
