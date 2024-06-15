import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { CustomerResponse } from '../../interfaces/interfaces';
import { SnackbarService } from '../mat-snackbar.service';
import { environment } from '../../../environment/environment';
import { HttpHeaderService } from './http-headers.service';

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

  constructor(
    private http: HttpClient,
    private snackbarService: SnackbarService,
    private headerService: HttpHeaderService,
  ) {}

  createCustomer(body: CustomerRegistrationForm): Observable<CustomerResponse> {
    const headers = this.headerService.getHeader();

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
    const headers = this.headerService.getHeader();

    return this.http
      .post<CustomerResponse>(
        `${this.apiUrl}/login`,
        { email, password },
        { headers },
      )
      .pipe(
        tap((response) => {
          localStorage.setItem('userId', response.customer.id);
        }),
        catchError((error: HttpErrorResponse) => {
          this.snackbarService.show(error.error.message, 'Close', 3000);
          return throwError(() => new Error(error.error.message));
        }),
      );
  }
}
