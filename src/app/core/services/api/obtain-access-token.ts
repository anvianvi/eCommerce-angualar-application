import { Injectable } from '@angular/core';
import { environment } from '../../../environment/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { SnackbarService } from '../mat-snackbar.service';

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
  constructor(
    private http: HttpClient,
    private snackbarService: SnackbarService,
  ) {}

  getApplicationAccessToken(): void {
    const accessTokenExpired = this.isAccessTokenExpired(
      'AppTokenExpirationTime',
    );
    if (accessTokenExpired) {
      this.fetchAppAccessToken();
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
      this.fetchCustomersAccessToken(username, password).subscribe({
        next: () => {
          this.snackbarService.show(
            'Customer token fetched successfully',
            'Ok',
            2000,
          );
        },
        error: (err) => {
          this.snackbarService.show(
            `Failed to fetch Customer AccessToken, ${err}`,
            'Ok',
            2000,
          );
        },
      });
    }
  }

  fetchAppAccessToken(): void {
    const headers = new HttpHeaders({
      Authorization: `Basic ${btoa(`${environment.client_id}:${environment.client_secret}`)}`,
    });

    this.http
      .post<ApplicationAccessTokenResponse>(
        `${environment.auth_url}/oauth/token?grant_type=client_credentials`,
        {},
        { headers },
      )
      .pipe(
        tap((responseData) => {
          localStorage.setItem('AppAccessToken', responseData.access_token);
          localStorage.setItem(
            'AppTokenExpirationTime',
            (Date.now() + responseData.expires_in * 1000).toString(),
          );
        }),
      )
      .subscribe({
        next: () => {
          this.snackbarService.show('app token received', 'Ok', 2000);
        },
        error: (err) => {
          this.snackbarService.show(
            `Failed to fetch AppAccessToken, ${err}`,
            'Ok',
            2000,
          );
        },
      });
  }

  fetchCustomersAccessToken(
    username: string,
    password: string,
  ): Observable<CustomerAccessTokenResponse> {
    const headers = new HttpHeaders({
      Authorization: `Basic ${btoa(`${environment.client_id}:${environment.client_secret}`)}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    });

    const body = new HttpParams()
      .set('grant_type', 'password')
      .set('username', username)
      .set('password', password);

    return this.http
      .post<CustomerAccessTokenResponse>(
        `${environment.auth_url}/oauth/${environment.project_key}/customers/token`,
        body,
        { headers },
      )
      .pipe(
        tap((responseData) => {
          localStorage.setItem(
            'CustomerAccessToken',
            responseData.access_token,
          );
          localStorage.setItem(
            'CustomerTokenExpirationTime',
            (Date.now() + responseData.expires_in * 1000).toString(),
          );
        }),
      );
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
