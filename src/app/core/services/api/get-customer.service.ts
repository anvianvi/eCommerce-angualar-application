import { Injectable } from '@angular/core';
import { SnackbarService } from '../mat-snackbar.service';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { environment } from '../../../environment/environment';
import { StorageService } from '../../storage/storage.service';
import { Customer } from '../../models/customer';

@Injectable({
  providedIn: 'root',
})
export class GetCustomerService {
  private apiUrl = `${environment.host}/${environment.project_key}`;
  private accessToken = localStorage.getItem('AppAccessToken') || '';

  constructor(
    private http: HttpClient,
    private snackbarService: SnackbarService,
    private storageService: StorageService,
  ) {}

  queryCustomer(customerId: string): Observable<Customer> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.accessToken}`,
    });

    return this.http
      .get<Customer>(`${this.apiUrl}/customers/${customerId}`, {
        headers,
      })
      .pipe(
        tap((responseData) => {
          console.log(responseData);
          this.storageService.CurrentCustomer.set(responseData);
        }),
        catchError((error: HttpErrorResponse) => {
          this.snackbarService.show(error.error.message, 'Close', 3000);
          return throwError(() => new Error(error.error.message));
        }),
      );
  }
}
