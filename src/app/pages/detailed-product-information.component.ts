import { Location } from '@angular/common';
import { Component, OnInit, computed } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StorageService } from '../core/storage/storage.service';

@Component({
  imports: [],
  standalone: true,
  selector: 'app-detailed-product-information',
  template: `<div>
    <h1>Here should be page about product id = {{ productId }}</h1>
    <button (click)="goBack()">Back</button>
  </div>`,
  styles: ``,
})
export class DetailedProductInformationComponent implements OnInit {
  productId = '';

  products = computed(() => {
    return this.storageService.productsInStore();
  });

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private storageService: StorageService,
  ) {}

  ngOnInit(): void {
    console.log(this.products());
    this.productId = this.route.snapshot.paramMap.get('id') || '';
  }

  goBack(): void {
    this.location.back();
  }
}
