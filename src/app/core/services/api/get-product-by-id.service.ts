import { Injectable } from '@angular/core';
import { SnackbarService } from '../mat-snackbar.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { Product } from '../../models/products';
import { environment } from '../../../environment/environment';
import { StorageService } from '../../storage/storage.service';
import { HttpHeaderService } from './http-headers.service';

@Injectable({
  providedIn: 'root',
})
export class GetProductService {
  private apiUrl = `${environment.host}/${environment.project_key}`;
  constructor(
    private http: HttpClient,
    private snackbarService: SnackbarService,
    private storageService: StorageService,
    private headerService: HttpHeaderService,
  ) {}

  queryProduct(productId: string): Observable<Product> {
    const headers = this.headerService.getHeader();

    return this.http
      .get<Product>(`${this.apiUrl}/product-projections/${productId}`, {
        headers,
      })
      .pipe(
        tap((responseData) => {
          this.storageService.currentProduct.set(responseData);
        }),
        catchError((error: HttpErrorResponse) => {
          this.snackbarService.show(error.error.message, 'Close', 3000);
          return throwError(() => new Error(error.error.message));
        }),
      );
  }
}
