import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { CustomerResponse } from '../../interfaces/interfaces';
import { SnackbarService } from '../mat-snackbar.service';
import { environment } from '../../../environment/environment';

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
export class CustomerAuthService {
  private apiUrl = `${environment.host}/${environment.project_key}`;
  private accessToken = localStorage.getItem('AppAccessToken');

  constructor(
    private http: HttpClient,
    private snackbarService: SnackbarService,
  ) {}

  createCustomer(body: CustomerRegistrationForm): Observable<CustomerResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.accessToken}`,
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
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.accessToken}`,
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
          sessionStorage.setItem('userId', response.customer.id); // Store the token
        }),
        catchError((error: HttpErrorResponse) => {
          this.snackbarService.show(error.error.message, 'Close', 3000);
          return throwError(() => new Error(error.error.message));
        }),
      );
  }
}
