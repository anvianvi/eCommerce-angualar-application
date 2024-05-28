import { Injectable, signal } from '@angular/core';
import { ObtainAccessTokenService } from './api/obtain-access-token';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  isAuthenticated = signal(false);

  constructor(
    private router: Router,
    private obtainAccessTokenService: ObtainAccessTokenService,
  ) {
    const isCustomerTokenExpired =
      this.obtainAccessTokenService.isAccessTokenExpired(
        'CustomerTokenExpirationTime',
      );
    this.isAuthenticated.set(!isCustomerTokenExpired);
  }

  async login(email: string, password: string): Promise<void> {
    await this.obtainAccessTokenService.getCustomerAccessToken(email, password);

    this.isAuthenticated.set(true);
  }

  logout(): void {
    localStorage.removeItem('userId');
    localStorage.removeItem('CustomerAccessToken');
    localStorage.removeItem('CustomerTokenExpirationTime');
    this.isAuthenticated.set(false);
    this.router.navigate(['/']);
  }
}
