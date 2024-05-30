import { Injectable, signal } from '@angular/core';
import { SnackbarService } from '../mat-snackbar.service';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, tap, throwError } from 'rxjs';
import { environment } from '../../../environment/environment';
import { Customer } from '../../models/customer';

@Injectable({
  providedIn: 'root',
})
export class CustomerInfoService {
  customer = signal<Customer | object>({});

  private apiUrl = `${environment.host}/${environment.project_key}`;
  private accessToken = localStorage.getItem('AppAccessToken') || '';
  private customerID = localStorage.getItem('userId');

  constructor(
    private http: HttpClient,
    private snackbarService: SnackbarService,
  ) {}

  queryCustomer(): Observable<Customer> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.accessToken}`,
    });

    return this.http
      .get<Customer>(`${this.apiUrl}/customers/${this.customerID}`, { headers })
      .pipe(
        tap((responseData) => {
          this.customer.set(responseData);
        }),
        catchError((error: HttpErrorResponse) => {
          this.snackbarService.show(error.error.message, 'Close', 3000);
          return throwError(() => new Error(error.error.message));
        }),
      );
  }
}
