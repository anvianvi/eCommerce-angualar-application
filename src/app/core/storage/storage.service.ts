import { Injectable, signal } from '@angular/core';
import { Product } from '../models/products';
import { Discount } from '../models/discounts';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  productsInStore = signal<Product[] | []>([]);
  productDiscounts = signal<Discount[] | []>([]);

}
