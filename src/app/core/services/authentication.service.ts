import { Injectable, signal } from '@angular/core';
import { ObtainAccessTokenService } from './api/obtain-access-token';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  isAuthenticated = signal(false);

  constructor(
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
    localStorage.clear();
    window.location.reload();
    this.isAuthenticated.set(false);
  }
}
