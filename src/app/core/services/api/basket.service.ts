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
import { queryAuthorsResponse } from '../../models/author';
import { GetProductsService } from './get-products.service';
import { CustomerResponse } from '../../interfaces/interfaces';

@Injectable({
  providedIn: 'root',
})
export class BasketService {
  private apiUrl = `${environment.host}/${environment.project_key}`;
  private accessToken = localStorage.getItem('CustomerAccessToken') || '';
  constructor(
    private http: HttpClient,
    private snackbarService: SnackbarService,
    private storageService: StorageService,
    private getProductsService: GetProductsService,
  ) {}

  getMyActiveCart(): Observable<queryAuthorsResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.accessToken}`,
    });

    return this.http
      .get<queryAuthorsResponse>(`${this.apiUrl}/me/active-cart`, {
        headers,
      })
      .pipe(
        tap((responseData) => {
          console.log(responseData);
        }),
        catchError((error: HttpErrorResponse) => {
          this.snackbarService.show(error.error.message, 'Close', 3000);
          return throwError(() => new Error(error.error.message));
        }),
      );
  }

  createMyCart(): Observable<CustomerResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.accessToken}`,
    });

    const body = {
      currency: 'EUR',
    };

    return this.http
      .post<CustomerResponse>(`${this.apiUrl}/me/carts`, body, { headers })
      .pipe(
        tap((responseData) => {
          console.log(responseData);
        }),
        catchError((error: HttpErrorResponse) => {
          this.snackbarService.show(error.error.message, 'Close', 3000);
          return throwError(() => new Error(error.error.message));
        }),
      );
  }
}
