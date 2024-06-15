import { Injectable } from '@angular/core';
import { SnackbarService } from '../mat-snackbar.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { environment } from '../../../environment/environment';
import { queryDiscountsResponse } from '../../models/discounts';
import { StorageService } from '../../storage/storage.service';
import { HttpHeaderService } from './http-headers.service';

@Injectable({
  providedIn: 'root',
})
export class GetProductsDiscountsService {
  private apiUrl = `${environment.host}/${environment.project_key}`;

  constructor(
    private http: HttpClient,
    private snackbarService: SnackbarService,
    private storageService: StorageService,
    private headerService: HttpHeaderService,
  ) {}

  queryProductsDiscounts(): Observable<queryDiscountsResponse> {
    const headers = this.headerService.getHeader();

    return this.http
      .get<queryDiscountsResponse>(`${this.apiUrl}/product-discounts`, {
        headers,
      })
      .pipe(
        tap((responseData) => {
          this.storageService.productDiscounts.set(responseData.results);
        }),
        catchError((error: HttpErrorResponse) => {
          this.snackbarService.show(error.error.message, 'Close', 3000);
          return throwError(() => new Error(error.error.message));
        }),
      );
  }
}
