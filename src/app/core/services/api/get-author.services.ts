import { Injectable, signal } from '@angular/core';
import { SnackbarService } from '../mat-snackbar.service';
import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { environment } from '../../../environment/environment';
import { StorageService } from '../../storage/storage.service';
import { queryAuthorsResponse } from '../../models/author';
import { GetProductsService } from './get-products.service';
import { HttpHeaderService } from './http-headers.service';

@Injectable({
  providedIn: 'root',
})
export class GetAuthorService {
  filterAuthor = signal(``);
  private apiUrl = `${environment.host}/${environment.project_key}`;

  constructor(
    private http: HttpClient,
    private snackbarService: SnackbarService,
    private storageService: StorageService,
    private getProductsService: GetProductsService,
    private headerService: HttpHeaderService,
  ) {}

  queryAuthors(): Observable<queryAuthorsResponse> {
    const headers = this.headerService.getHeader();

    const params = new HttpParams().set('facet', `variants.attributes.author`);

    return this.http
      .get<queryAuthorsResponse>(`${this.apiUrl}/product-projections/search`, {
        headers,
        params,
      })
      .pipe(
        tap((responseData) => {
          const authors = responseData.facets[
            'variants.attributes.author'
          ].terms.map((term) => term.term);
          this.storageService.authors.set(authors);
          this.getProductsService.filterAuthorsList.set(authors);
        }),
        catchError((error: HttpErrorResponse) => {
          this.snackbarService.show(error.error.message, 'Close', 3000);
          return throwError(() => new Error(error.error.message));
        }),
      );
  }
}
