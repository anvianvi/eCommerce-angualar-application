import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, tap, throwError } from 'rxjs';
import { AuthResponse, CustomerResponse } from '../interfaces';
import { SnackbarService } from './mat-snackbar.service';

export type CustomerRegistrationForm = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  addresses: [
    {
      streetName: string;
      city: string;
      postalCode: string;
      country: string;
    },
  ];
};

@Injectable({
  providedIn: 'root',
})
export class AuthCustomerService {
  private apiUrl =
    'https://api.europe-west1.gcp.commercetools.com/ecommerce-application-rsschool-1905';

  constructor(
    private http: HttpClient,
    private snackbarService: SnackbarService,
  ) {}

  createCustomer(body: CustomerRegistrationForm): Observable<CustomerResponse> {
    return this.http
      .post<CustomerResponse>(`${this.apiUrl}/customers`, body)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401) {
            return this.http.post<CustomerResponse>(
              `${this.apiUrl}/customers`,
              body,
            );
          } else {
            this.snackbarService.show(error.error.message, 'Close', 3000);
            return throwError(() => new Error(error.error.message));
          }
        }),
      );
  }

  customerLogin(email: string, password: string): Observable<CustomerResponse> {
    return this.http
      .post<CustomerResponse>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        tap((response) => {
          console.log('here is response from customerLogin');
          console.log(response);
          // sessionStorage.setItem('auth_token', response.access_token); // Store the token
        }),
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401) {
            return this.http.post<CustomerResponse>(`${this.apiUrl}/login`, {
              email,
              password,
            });
          } else {
            this.snackbarService.show(error.error.message, 'Close', 3000);
            return throwError(() => new Error(error.error.message));
          }
        }),
      );
  }

  tokenForAnanimus(): Observable<AuthResponse> {
    // const myHeaders = new HttpHeaders({
    //   'Content-Type': 'application/x-www-form-urlencoded',
    //   // Add any additional headers if needed
    // });

    const body = new URLSearchParams({
      grant_type: 'client_credentials',
      // Add any additional body parameters if needed
    }).toString();

    return this.http
      .post<AuthResponse>(
        `https://auth.europe-west1.gcp.commercetools.com/oauth/ecommerce-application-rsschool-1905/anonymous/token?grant_type=client_credentials`,
        body,
      )
      .pipe(
        map((response: AuthResponse) => response),
        tap((response: AuthResponse) => {
          console.log('Here is the access_token response:');
          console.log(response);
          // sessionStorage.setItem('auth_token', response.access_token); // Store the token
        }),
        catchError((error) => {
          console.error('Error during authentication', error);
          return throwError(() => new Error('Error during authentication'));
        }),
      );
  }
}
