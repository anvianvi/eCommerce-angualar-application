// src/app/auth.service.ts
import { Injectable } from '@angular/core';
import { environment } from '../../../environment/environment';

type AccessTokenResponse = {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
};

@Injectable({
  providedIn: 'root',
})
export class ObtainAccessTokenService {
  private clientID = environment.client_id;
  private clientSecret = environment.client_secret;

  async configureAccessToken(): Promise<void> {
    const accessTokenExpired = this.isAccessTokenExpired();
    if (accessTokenExpired) {
      const response = await this.fetchNewAccessToken();
      console.log(response);
    }
  }

  async fetchNewAccessToken(): Promise<AccessTokenResponse> {
    const myHeaders = new Headers();
    myHeaders.append(
      'Authorization',
      `Basic ${btoa(`${this.clientID}:${this.clientSecret}`)}`,
    );

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: '',
      redirect: 'follow' as RequestRedirect,
    };

    const response = await fetch(
      'https://auth.europe-west1.gcp.commercetools.com/oauth/token?grant_type=client_credentials',
      requestOptions,
    );

    if (!response.ok) {
      throw new Error('Failed to fetch new AccessToken');
    }

    const responseData: AccessTokenResponse = await response.json();

    localStorage.setItem('accessToken', responseData.access_token);
    localStorage.setItem(
      'expirationTime',
      (Date.now() + responseData.expires_in * 1000).toString(),
    );

    return responseData;
  }

  isAccessTokenExpired(): boolean {
    const currentTime = new Date().getTime();
    const storedExpirationTime = parseInt(
      localStorage.getItem('accessTokenExpirationTime') || '0',
      10,
    );

    if (currentTime > storedExpirationTime) {
      return true;
    } else {
      return false;
    }
  }
}
