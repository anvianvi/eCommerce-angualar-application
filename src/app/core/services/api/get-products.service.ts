import { Injectable, signal } from '@angular/core';
import { SnackbarService } from '../mat-snackbar.service';
import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { queryProductsResponse } from '../../models/products';
import { environment } from '../../../environment/environment';
import { StorageService } from '../../storage/storage.service';
import { HttpHeaderService } from './http-headers.service';

@Injectable({
  providedIn: 'root',
})
export class GetProductsService {
  sortBy = signal('name.en');
  sortOrder = signal('asc');
  filterMinPrice = signal(0);
  filterMaxPrice = signal(3000);
  filterAuthorsList = signal<string[]>([]);

  private apiUrl = `${environment.host}/${environment.project_key}`;

  constructor(
    private http: HttpClient,
    private snackbarService: SnackbarService,
    private storageService: StorageService,
    private headerService: HttpHeaderService,
  ) {}

  queryProducts(): Observable<queryProductsResponse> {
    const headers = this.headerService.getHeader();

    const quotedAuthors = this.filterAuthorsList()
      .map((author) => `"${author}"`)
      .join(', ');

    const params = new HttpParams()
      .set(
        'filter',
        `variants.price.centAmount:range (${this.filterMinPrice()} to ${this.filterMaxPrice()})`,
      )
      .append('filter', `variants.attributes.author:${quotedAuthors}`)
      .set('sort', `${this.sortBy()} ${this.sortOrder()}`);

    return this.http
      .get<queryProductsResponse>(`${this.apiUrl}/product-projections/search`, {
        headers,
        params,
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
