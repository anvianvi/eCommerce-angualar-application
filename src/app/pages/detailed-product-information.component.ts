import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  imports: [],
  standalone: true,
  selector: 'app-detailed-product-information',
  template: `<div>
    <h1>Here shoud be page about product id = {{ productId }}</h1>
    <button (click)="goBack()">Back</button>
  </div>`,
  styles: ``,
})
export class DetailedProductInformationComponent implements OnInit {
  productId = '';

  constructor(
    private route: ActivatedRoute,
    private location: Location,
  ) {}

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id') || '';
  }

  goBack(): void {
    this.location.back();
  }
}
