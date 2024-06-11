import { Injectable, signal } from '@angular/core';
import { Product, emptyProduct } from '../models/products';
import { Discount } from '../models/discounts';
import { Customer, emptyCustomer } from '../models/customer';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  productsInStore = signal<Product[] | []>([]);
  currentProduct = signal<Product>(emptyProduct);
  productDiscounts = signal<Discount[] | []>([]);
  currentCustomer = signal<Customer>(emptyCustomer);
  authors = signal<string[]>([]);
  cartItemsCount = signal(0);
}
