import { Location } from '@angular/common';
import { Component, OnInit, computed, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GetProductService } from '../../core/services/api/get-product-by-id.service';
import { ProductPriceBarComponent } from '../../components/price-block.component';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { StorageService } from '../../core/storage/storage.service';
import { CarouselComponent } from '../../components/img-carusel/carousel.component';
import { LocalSettingsService } from '../../core/services/local-settings.service';
import { BasketService } from '../../core/services/api/basket.service';

@Component({
  imports: [
    ProductPriceBarComponent,
    MatButton,
    MatButtonModule,
    CarouselComponent,
  ],
  standalone: true,
  selector: 'app-detailed-product-information',
  template: `<div class="page-conteiner">
    <app-carousel></app-carousel>
    <div class="description-container">
      <h1>Title: {{ this.currentProduct().name[currentLocation()] }}</h1>
      <h2>
        Author: {{ this.currentProduct().masterVariant.attributes[0].value }}
      </h2>
      <h3>
        Published:
        {{ this.currentProduct().masterVariant.attributes[2].value }}
      </h3>
      <app-product-price-bar
        [product]="this.currentProduct()"
      ></app-product-price-bar>
      <p class="description">
        {{ this.currentProduct().description[currentLocation()] }}
      </p>
      <div class="buttons-container">
        <button mat-button (click)="goBack()">Back</button>
        @if (this.isItemInBasket()) {
          <button mat-button (click)="removeItemFromCart()">
            Remove from basket
          </button>
        } @else {
          <button mat-button (click)="addItemToCart()">Add to basket</button>
        }
      </div>
    </div>
  </div>`,
  styles: `
    .page-conteiner {
      padding: 20px;
      display: flex;
      gap: 20px;
      flex-wrap: wrap;
    }
    .description-container {
      max-width: 400px;
    }
  `,
})
export class DetailedProductInformationComponent implements OnInit {
  currentProduct = computed(() => {
    return this.storage.currentProduct();
  });
  currentLocation = computed(() => {
    return this.localSettingsService.currentLocation();
  });

  cart = computed(() => {
    return this.storage.myBasket();
  });

  isItemInBasket = signal(false);
  productId = '';

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private getProductService: GetProductService,
    private storage: StorageService,
    private localSettingsService: LocalSettingsService,
    private basketService: BasketService,
  ) {}

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id') || '';
    this.getProductService.queryProduct(this.productId).subscribe();
    this.isItemInBasket.set(this.findItemInBasket());
  }

  findItemInBasket(): boolean {
    const foundItem = this.cart().lineItems.find(
      (item) => item.productId === this.productId,
    );
    if (foundItem) {
      return true;
    }
    return false;
  }

  goBack(): void {
    this.location.back();
  }

  addItemToCart(): void {
    this.basketService.addItemToMyCart(this.productId).subscribe();
    this.isItemInBasket.set(this.findItemInBasket());
  }

  removeItemFromCart(): void {
    this.basketService.removeItemFromMyCart(this.productId).subscribe();
    this.isItemInBasket.set(this.findItemInBasket());
  }
}
