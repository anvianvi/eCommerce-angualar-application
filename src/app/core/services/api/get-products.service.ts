import { Injectable } from '@angular/core';
import { SnackbarService } from '../mat-snackbar.service';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { queryProductsResponse } from '../../models/products';
import { environment } from '../../../environment/environment';
import { StorageService } from '../../storage/storage.service';

@Injectable({
  providedIn: 'root',
})
export class GetProductsService {
  private apiUrl = `${environment.host}/${environment.project_key}`;
  private accessToken = localStorage.getItem('AppAccessToken') || '';

  constructor(
    private http: HttpClient,
    private snackbarService: SnackbarService,
    private storageService: StorageService,
  ) {}

  queryProducts(): Observable<queryProductsResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.accessToken}`,
    });

    return this.http
      .get<queryProductsResponse>(`${this.apiUrl}/products?limit=10`, {
        headers,
      })
      .pipe(
        tap((responseData) => {
          this.storageService.productsInStore.set(responseData.results);
        }),
        catchError((error: HttpErrorResponse) => {
          this.snackbarService.show(error.error.message, 'Close', 3000);
          return throwError(() => new Error(error.error.message));
        }),
      );
  }
}
