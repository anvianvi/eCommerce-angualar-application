import { Injectable, signal } from '@angular/core';
import { Product } from '../models/products';
import { Discount } from '../models/discounts';
import { Customer, emptyCustomer } from '../models/customer';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  productsInStore = signal<Product[] | []>([]);
  productDiscounts = signal<Discount[] | []>([]);

  CurrentCustomer = signal<Customer>(emptyCustomer);
}
