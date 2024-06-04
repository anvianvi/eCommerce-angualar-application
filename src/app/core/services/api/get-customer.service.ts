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

type updateBody = {
  version: number;
  actions: action[];
};

type action = {
  [key: string]: string;
  action: string;
};

@Injectable({
  providedIn: 'root',
})
export class GetCustomerService {
  private apiUrl = `${environment.host}/${environment.project_key}`;
  private accessToken = localStorage.getItem('AppAccessToken') || '';
  private currentCustomer: Customer = this.storageService.CurrentCustomer();

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
          this.storageService.CurrentCustomer.set(responseData);
          this.currentCustomer = this.storageService.CurrentCustomer();
        }),
        catchError((error: HttpErrorResponse) => {
          this.snackbarService.show(error.error.message, 'Close', 3000);
          return throwError(() => new Error(error.error.message));
        }),
      );
  }

  setDefaultShippingAddress(customer: Customer): Observable<Customer> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.accessToken}`,
    });

    const body: updateBody = {
      version: customer.version,
      actions: [
        {
          action: 'setDefaultShippingAddress',
          addressId: customer.addresses[0].id,
        },
      ],
    };
    return this.http.post<Customer>(
      `${this.apiUrl}/customers/${customer.id}`,
      body,
      {
        headers,
      },
    );
  }

  setDefaultBillingAddress(customer: Customer): Observable<Customer> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.accessToken}`,
    });

    const body: updateBody = {
      version: customer.version,
      actions: [
        {
          action: 'setDefaultBillingAddress',
          addressId: customer.addresses[0].id,
        },
      ],
    };
    return this.http.post<Customer>(
      `${this.apiUrl}/customers/${customer.id}`,
      body,
      {
        headers,
      },
    );
  }
}
