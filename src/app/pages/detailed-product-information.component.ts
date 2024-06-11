import { Location } from '@angular/common';
import { Component, OnInit, computed } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GetProductService } from '../core/services/api/get-product-by-id.service';
import { SnackbarService } from '../core/services/mat-snackbar.service';
import { CarouselComponent } from '../components/img-carusel/carousel.component';
import { StorageService } from '../core/storage/storage.service';
import { LocalSettingsService } from '../core/services/local-settings.service';
import { MatButtonModule } from '@angular/material/button';
import { ProductPriceBarComponent } from '../components/price-block.component';

@Component({
  imports: [MatButtonModule, CarouselComponent, ProductPriceBarComponent],
  standalone: true,
  selector: 'app-detailed-product-information',
  template: `<div class="page-conteiner">
    <h1>Title: {{ this.currentProduct().name[currentLocation()] }}</h1>
    <h2>
      Author: {{ this.currentProduct().masterVariant.attributes[0].value }}
    </h2>
    <h3>
      Published: {{ this.currentProduct().masterVariant.attributes[2].value }}
    </h3>
    <p class="description">
      {{ this.currentProduct().description[currentLocation()] }}
    </p>
    <app-product-price-bar
      [product]="this.currentProduct()"
    ></app-product-price-bar>
    <app-carousel></app-carousel>
    <button mat-raised-button color="primary" (click)="goBack()">
      Go Back
    </button>
  </div>`,
  styles: `
    .page-conteiner {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      padding-block: 20px;
      max-width: 500px;
      margin-inline: auto;
    }
  `,
})
export class DetailedProductInformationComponent implements OnInit {
  productId = '';
  currentProduct = computed(() => {
    return this.storage.currentProduct();
  });
  currentLocation = computed(() => {
    return this.localSettingsService.currentLocation();
  });

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private getProductService: GetProductService,
    private snackbarService: SnackbarService,
    private storage: StorageService,
    private localSettingsService: LocalSettingsService,
  ) {}

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id') || '';

    this.getProductService.queryProduct(this.productId).subscribe({
      next: () => {
        this.snackbarService.show(
          'Product details fetched successfully ',
          'Ok',
          2000,
        );
      },
      error: (err) => {
        this.snackbarService.show(
          `Failed to fetch Product details, ${err}`,
          'Ok',
          2000,
        );
      },
    });
  }

  goBack(): void {
    this.location.back();
  }
}
