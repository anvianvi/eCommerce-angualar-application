import { Injectable, signal } from '@angular/core';
import { SnackbarService } from '../mat-snackbar.service';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { Product, queryProductsResponse } from '../../models/products';
import { environment } from '../../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class GetProductsService {
  productsInStore = signal<Product[] | []>([]);

  private apiUrl = `${environment.host}/${environment.project_key}`;
  private accessToken = localStorage.getItem('AppAccessToken');

  constructor(
    private http: HttpClient,
    private snackbarService: SnackbarService,
  ) {}

  queryProducts(): Observable<queryProductsResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.accessToken}`,
    });

    return this.http
      .get<queryProductsResponse>(`${this.apiUrl}/products`, { headers })
      .pipe(
        tap((responseData) => {
          console.log(responseData);
          this.productsInStore.set(responseData.results);
          console.log(this.productsInStore());
        }),
        catchError((error: HttpErrorResponse) => {
          this.snackbarService.show(error.error.message, 'Close', 3000);
          return throwError(() => new Error(error.error.message));
        }),
      );
  }
}
