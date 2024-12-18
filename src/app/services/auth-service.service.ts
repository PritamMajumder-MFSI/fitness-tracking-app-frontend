import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthServiceService {
  public username = '';
  public email = '';
  setDetails(data: { username: string; email: string }) {
    this.username = data.username;
    this.email = data.email;
  }
}
