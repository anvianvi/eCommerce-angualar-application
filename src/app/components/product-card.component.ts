import { Component, Input, OnInit, computed, signal } from '@angular/core';
import { Product } from '../core/models/products';
import { LocalSettingsService } from '../core/services/local-settings.service';
import { Router } from '@angular/router';
import { ProductPriceBarComponent } from './price-block.component';
import { MatButtonModule } from '@angular/material/button';
import { BasketService } from '../core/services/api/basket.service';
import { StorageService } from '../core/storage/storage.service';

@Component({
  standalone: true,
  selector: 'app-product-card',
  template: `
    <div class="product-card" role="none" (click)="openDetailedProductPage()">
      <div class="img-container">
        <img
          class="photo"
          [src]="product.masterVariant.images[0].url"
          [alt]="'photo of ' + product.name[currentLocation()]"
        />
      </div>
      <app-product-price-bar [product]="product"></app-product-price-bar>
      <div class="text-container">
        <h3 class="h3">
          {{ product.name[currentLocation()] }}
        </h3>
        <p class="description">
          {{ product.description[currentLocation()] }}
        </p>
        <div class="product-card-btn-container">
          @if (isItemInBasket()) {
            <button mat-flat-button color="primary" disabled="">
              Already in cart 💰
            </button>
          } @else {
            <button mat-flat-button color="primary" (click)="addToCart($event)">
              Add to Cart 🛒
            </button>
          }
        </div>
      </div>
    </div>
  `,
  styles: `
    .product-card {
      box-sizing: border-box;
      padding: 10px 20px;
      border-radius: 40px;
      border: 2px solid #e1d4c9;
      cursor: pointer;
      transition: box-shadow 0.3s ease-in-out;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

      .img-container {
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 40px;
        width: 310px;
        height: 260px;
        margin-bottom: 10px;

        .photo {
          transition: transform 1.5s ease;
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
      }

      &:hover .photo {
        transform: scale(1.1);
      }

      &:hover {
        background: #e1d4c9;
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.4);
        border: 2px solid #b0907a;
      }

      .text-container {
        box-sizing: border-box;
        max-width: 310px;

        .h3 {
          font-size: 24px;
          font-weight: 600;
          line-height: 125%;
          margin-bottom: 12px;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
          -webkit-line-clamp: 1;
          line-height: 1.2;
          max-height: calc(1.2em * 4);
        }
        .description {
          display: -webkit-box;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
          -webkit-line-clamp: 3;
          line-height: 1.2;
          max-height: calc(1.2em * 4);
        }
      }
    }

    .product-card-btn-container {
      display: flex;
      justify-content: end;
      padding: 10px;
    }
  `,
  imports: [ProductPriceBarComponent, MatButtonModule],
})
export class ProductCardComponent implements OnInit {
  @Input() product!: Product;

  currentLocation = computed(() => {
    return this.localSettingsService.currentLocation();
  });

  cart = computed(() => {
    return this.storage.myBasket();
  });
  isItemInBasket = signal(false);

  constructor(
    private localSettingsService: LocalSettingsService,
    private router: Router,
    private basketService: BasketService,
    private storage: StorageService,
  ) {}

  ngOnInit(): void {
    this.isItemInBasket.set(this.findItemInBasket());
  }
  findItemInBasket(): boolean {
    return this.cart().lineItems.some(
      (item) => item.productId === this.product.id,
    );
  }

  openDetailedProductPage(): void {
    this.router.navigate([`/product/${this.product.id}`]);
  }

  addToCart(event: Event): void {
    event.stopPropagation();
    console.log('Add to cart button clicked');
    console.log(`add item id: ${this.product.id} to cart`);
    this.basketService.addItemToMyCart(this.product.id).subscribe();
    this.isItemInBasket.set(this.findItemInBasket());
  }
}
