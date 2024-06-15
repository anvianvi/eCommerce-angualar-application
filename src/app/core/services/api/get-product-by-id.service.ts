import { Injectable } from '@angular/core';
import { SnackbarService } from '../mat-snackbar.service';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { Product } from '../../models/products';
import { environment } from '../../../environment/environment';
import { StorageService } from '../../storage/storage.service';

@Injectable({
  providedIn: 'root',
})
export class GetProductService {
  private apiUrl = `${environment.host}/${environment.project_key}`;
  private accessToken = localStorage.getItem('AppAccessToken') || '';
  constructor(
    private http: HttpClient,
    private snackbarService: SnackbarService,
    private storageService: StorageService,
  ) {}

  queryProduct(productId: string): Observable<Product> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.accessToken}`,
    });

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
