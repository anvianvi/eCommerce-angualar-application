import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { CustomerResponse } from '../interfaces/interfaces';
import { SnackbarService } from './mat-snackbar.service';
import { environment } from '../../environment/environment';

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
  // private apiUrl =
  //   'https://api.europe-west1.gcp.commercetools.com/ecommerce-application-rsschool-1905';
  // https://auth.europe-west1.gcp.commercetools.com/ecommerce-application-rsschool-1905
  private apiUrl = `${environment.host}/${environment.project_key}`;

  constructor(
    private http: HttpClient,
    private snackbarService: SnackbarService,
  ) {}

  createCustomer(body: CustomerRegistrationForm): Observable<CustomerResponse> {
    const accessToken = localStorage.getItem('accessToken');

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    });

    return this.http
      .post<CustomerResponse>(`${this.apiUrl}/customers`, body, { headers })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this.snackbarService.show(error.error.message, 'Close', 3000);
          return throwError(() => new Error(error.error.message));
        }),
      );
  }

  customerLogin(email: string, password: string): Observable<CustomerResponse> {
    console.log(this.apiUrl);

    const accessToken = localStorage.getItem('accessToken');

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    });

    return this.http
      .post<CustomerResponse>(
        `${this.apiUrl}/login`,
        { email, password },
        { headers },
      )
      .pipe(
        tap((response) => {
          console.log('here is response from customerLogin');
          console.log(response);
          // sessionStorage.setItem('auth_token', response.access_token); // Store the token
        }),
        catchError((error: HttpErrorResponse) => {
          this.snackbarService.show(error.error.message, 'Close', 3000);
          return throwError(() => new Error(error.error.message));
        }),
      );
  }
}
