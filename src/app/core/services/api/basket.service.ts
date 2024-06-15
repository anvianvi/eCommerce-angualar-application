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
import { GetProductsService } from './get-products.service';
import { Cart } from '../../models/cart';

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

  getBasket(): void {
    this.getMyActiveCart().subscribe({
      next: () => {
        this.snackbarService.show('Basket fetched successfully', 'Ok', 2000);
      },
      error: (err) => {
        console.log(`smth go wrong`);
        console.log(err);

        this.createMyCart().subscribe({
          next: () => {
            this.snackbarService.show('Basket creted successfully', 'Ok', 2000);
          },
        });
      },
    });
  }

  getMyActiveCart(): Observable<Cart> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.accessToken}`,
    });

    return this.http
      .get<Cart>(`${this.apiUrl}/me/active-cart`, {
        headers,
      })
      .pipe(
        tap((responseData) => {
          console.log(responseData);
          console.log(responseData.id);
          localStorage.setItem('cartId', responseData.id);
          this.storageService.myBasket.set(responseData);
        }),
        catchError((error: HttpErrorResponse) => {
          this.snackbarService.show(error.error.message, 'Close', 3000);
          return throwError(() => new Error(error.error.message));
        }),
      );
  }

  createMyCart(): Observable<Cart> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.accessToken}`,
    });

    const body = {
      currency: 'EUR',
    };

    return this.http
      .post<Cart>(`${this.apiUrl}/me/carts`, body, { headers })
      .pipe(
        tap((responseData) => {
          console.log(responseData);
          console.log(responseData.id);
          this.storageService.myBasket.set(responseData);
          localStorage.setItem('cartId', responseData.id);
        }),
        catchError((error: HttpErrorResponse) => {
          this.snackbarService.show(error.error.message, 'Close', 3000);
          return throwError(() => new Error(error.error.message));
        }),
      );
  }

  addItemToMyCart(
    productId: string,
    // action: | 'removeLineItem',
  ): Observable<Cart> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.accessToken}`,
    });

    const body = {
      version: this.storageService.myBasket().version,
      actions: [
        {
          action: 'addLineItem',
          productId: productId,
          // lineItemId: productId,
          variantId: 1,
          quantity: 1,
        },
      ],
    };

    const cartId = localStorage.getItem('cartId');

    return this.http
      .post<Cart>(`${this.apiUrl}/me/carts/${cartId}`, body, { headers })
      .pipe(
        tap((responseData) => {
          console.log(responseData);
          console.log(responseData.id);
          this.storageService.myBasket.set(responseData);
          // localStorage.setItem('cartId', responseData.id);
        }),
        catchError((error: HttpErrorResponse) => {
          this.snackbarService.show(error.error.message, 'Close', 3000);
          return throwError(() => new Error(error.error.message));
        }),
      );
  }

  removeItemFromMyCart(productId: string): Observable<Cart> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.accessToken}`,
    });

    const body = {
      version: this.storageService.myBasket().version,
      actions: [
        {
          action: 'removeLineItem',
          // productId: productId,
          lineItemId: productId,
          variantId: 1,
          // quantity: 1,
        },
      ],
    };

    const cartId = localStorage.getItem('cartId');

    return this.http
      .post<Cart>(`${this.apiUrl}/me/carts/${cartId}`, body, { headers })
      .pipe(
        tap((responseData) => {
          console.log(responseData);
          console.log(responseData.id);
          this.storageService.myBasket.set(responseData);
          // localStorage.setItem('cartId', responseData.id);
        }),
        catchError((error: HttpErrorResponse) => {
          this.snackbarService.show(error.error.message, 'Close', 3000);
          return throwError(() => new Error(error.error.message));
        }),
      );
  }
}
