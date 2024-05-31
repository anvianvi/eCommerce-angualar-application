import { Injectable, signal } from '@angular/core';
import { SnackbarService } from '../mat-snackbar.service';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { environment } from '../../../environment/environment';
import { Discount, queryDiscountsResponse } from '../../models/discounts';

@Injectable({
  providedIn: 'root',
})
export class GetProductsDiscountsService {
  productDiscounts = signal<Discount[] | []>([]);

  private apiUrl = `${environment.host}/${environment.project_key}`;
  private accessToken = localStorage.getItem('AppAccessToken') || '';

  constructor(
    private http: HttpClient,
    private snackbarService: SnackbarService,
  ) {}

  queryProductsDiscounts(): Observable<queryDiscountsResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.accessToken}`,
    });

    return this.http
      .get<queryDiscountsResponse>(`${this.apiUrl}/product-discounts`, {
        headers,
      })
      .pipe(
        tap((responseData) => {
          this.productDiscounts.set(responseData.results);
          console.log(responseData.results);
          console.log(responseData);
        }),
        catchError((error: HttpErrorResponse) => {
          this.snackbarService.show(error.error.message, 'Close', 3000);
          return throwError(() => new Error(error.error.message));
        }),
      );
  }
}
