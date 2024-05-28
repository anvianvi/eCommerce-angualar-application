import { Injectable } from '@angular/core';
import { environment } from '../../../environment/environment';

type ApplicationAccessTokenResponse = {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
};

type CustomerAccessTokenResponse = {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
  token_type: string;
};

@Injectable({
  providedIn: 'root',
})
export class ObtainAccessTokenService {
  async getApplicationAccessToken(): Promise<void> {
    const accessTokenExpired = this.isAccessTokenExpired(
      'AppTokenExpirationTime',
    );
    if (accessTokenExpired) {
      await this.fetchAppAccessToken();
    }
  }

  async getCustomerAccessToken(
    username: string,
    password: string,
  ): Promise<void> {
    const accessTokenExpired = this.isAccessTokenExpired(
      'CustomerTokenExpirationTime',
    );
    if (accessTokenExpired) {
      await this.fetchCustomersAccessToken(username, password);
      console.log('token setuped');
    }
  }

  async fetchAppAccessToken(): Promise<ApplicationAccessTokenResponse> {
    const myHeaders = new Headers();
    myHeaders.append(
      'Authorization',
      `Basic ${btoa(`${environment.client_id}:${environment.client_secret}`)}`,
    );

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: '',
      redirect: 'follow' as RequestRedirect,
    };

    const response = await fetch(
      `${environment.auth_url}/oauth/token?grant_type=client_credentials`,
      requestOptions,
    );

    if (!response.ok) {
      throw new Error('Failed to fetch new App AccessToken');
    }

    const responseData: ApplicationAccessTokenResponse = await response.json();

    localStorage.setItem('AppAccessToken', responseData.access_token);
    localStorage.setItem(
      'AppTokenExpirationTime',
      (Date.now() + responseData.expires_in * 1000).toString(),
    );

    return responseData;
  }

  async fetchCustomersAccessToken(
    username: string,
    password: string,
  ): Promise<CustomerAccessTokenResponse> {
    const myHeaders = new Headers();
    myHeaders.append(
      'Authorization',
      `Basic ${btoa(`${environment.client_id}:${environment.client_secret}`)}`,
    );
    myHeaders.append('Content-Type', 'application/x-www-form-urlencoded');

    const body = new URLSearchParams();
    body.set('grant_type', 'password');
    body.set('username', username);
    body.set('password', password);

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: body.toString(),
      redirect: 'follow' as RequestRedirect,
    };

    const response = await fetch(
      `${environment.auth_url}/oauth/${environment.project_key}/customers/token`,
      requestOptions,
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const responseData: CustomerAccessTokenResponse = await response.json();

    localStorage.setItem('CustomerAccessToken', responseData.access_token);
    localStorage.setItem(
      'CustomerTokenExpirationTime',
      (Date.now() + responseData.expires_in * 1000).toString(),
    );

    return responseData;
  }

  isAccessTokenExpired(tokenExpirationTime: string): boolean {
    const currentTime = new Date().getTime();
    const storedExpirationTime = parseInt(
      localStorage.getItem(tokenExpirationTime) || '0',
      10,
    );

    if (currentTime > storedExpirationTime) {
      return true;
    } else {
      return false;
    }
  }
}
