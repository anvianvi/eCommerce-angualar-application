import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isAuthenticated = signal(false);

  constructor() {
    const token = localStorage.getItem('my_auth_token');
    this.isAuthenticated.set(!!token);
  }

  login(token: string): void {
    localStorage.setItem('my_auth_token', token);
    this.isAuthenticated.set(true);
  }

  logout(): void {
    localStorage.removeItem('my_auth_token');
    this.isAuthenticated.set(false);
  }
}
