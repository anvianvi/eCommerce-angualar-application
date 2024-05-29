import { Component, Input, computed } from '@angular/core';
import { Product } from '../core/models/products';
import { LocalSettingsService } from '../core/services/local-settings.service';
import { Router } from '@angular/router';

@Component({
  imports: [],
  standalone: true,
  selector: 'app-product-card',
  template: `
    <div class="product-card" role="none" (click)="onClick()">
      <div class="img-container">
        <img
          class="photo"
          src="{{ product.masterData.current.masterVariant.images[0].url }}"
          alt="photo of  {{
            product.masterData.current.name[currentLocation()]
          }} "
          loading="lazy"
        />
      </div>
      <div class="text-container">
        <h3 class="h3">
          {{ product.masterData.current.name[currentLocation()] }}
        </h3>
        <p class="description">
          {{ product.masterData.current.description[currentLocation()] }}
        </p>
      </div>
    </div>
  `,
  styles: `
    .product-card {
      box-sizing: border-box;
      border-radius: 40px;
      border: 1px solid #e1d4c9;
      cursor: pointer;

      .img-container {
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 40px;
        width: 310px;
        height: 310px;

        .photo {
          transition: transform 1.5s ease;
          width: 100%;
        }
      }

      &:hover .photo {
        transform: scale(1.1);
      }

      .text-container {
        box-sizing: border-box;
        padding: 20px;
        max-width: 310px;

        .h3 {
          font-size: 24px;
          font-weight: 600;
          line-height: 125%;
          margin-bottom: 12px;
        }
        .description {
          display: -webkit-box;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
          -webkit-line-clamp: 4;
          line-height: 1.2;
          max-height: calc(1.2em * 4);
        }
        .price {
          font-size: 24px;
          font-weight: 600;
          line-height: 125%;
        }
      }
    }
  `,
})
export class ProductCardComponent {
  @Input() product!: Product;

  currentLocation = computed(() => {
    return this.localSettingsService.currentLocation();
  });

  constructor(
    private localSettingsService: LocalSettingsService,
    private router: Router,
  ) {}

  onClick(): void {
    this.router.navigate([`/product/${this.product.id}`]);
  }
}
