import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { environment } from '../../environment/environment';

type CustomersAccessTokenResponse = {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
  token_type: string;
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isAuthenticated = signal(false);

  constructor(private http: HttpClient) {
    const token = localStorage.getItem('my_auth_token');
    this.isAuthenticated.set(!!token);
  }

  login(userId: string): void {
    localStorage.setItem('userId', userId);
    this.isAuthenticated.set(true);
  }

  logout(): void {
    localStorage.removeItem('userId');
    this.isAuthenticated.set(false);
  }

  async getCustomersAccessToken(
    username: string,
    password: string,
  ): Promise<unknown> {
    console.log('getCustomersAccessToken is triggered');

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

    try {
      const response = await fetch(
        `${environment.auth_url}/oauth/${environment.project_key}/customers/token`,
        requestOptions,
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const responseData: CustomersAccessTokenResponse = await response.json();
      console.log(responseData);
      console.log(responseData.access_token);
      console.log(responseData.expires_in);
      console.log(responseData.refresh_token);
      console.log(responseData.scope);
      console.log(responseData.token_type);

      return responseData;
    } catch (error) {
      console.error('Error fetching access token:');
      console.error(error);

      throw error;
    }
  }
}
