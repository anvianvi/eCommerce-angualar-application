import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GetProductService } from '../../core/services/api/get-product-by-id.service';
import { Product } from '../../core/models/products';
import { ProductPriceBarComponent } from '../../components/price-block.component';
import { MatButton } from '@angular/material/button';

@Component({
  imports: [ProductPriceBarComponent, MatButton],
  standalone: true,
  selector: 'app-detailed-product-information',
  templateUrl: './detailed-product-information.component.html',
  styleUrls: ['./detailed-product-information.component.scss'],
})
export class DetailedProductInformationComponent implements OnInit {
  productId = '';
  product!: Product;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private getProductService: GetProductService,
  ) {}

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id') || '';
    this.getProductService
      .queryProduct(this.productId)
      .subscribe((response) => {
        this.product = response;
      });
  }

  goBack(): void {
    this.location.back();
  }

  addToBasket(): void {
    console.log('added');
  }
}
