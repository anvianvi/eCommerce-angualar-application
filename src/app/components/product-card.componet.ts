import { Component, Input } from '@angular/core';
import { Product } from '../core/models/products';

@Component({
  imports: [],
  standalone: true,
  selector: 'app-product-card',
  template: `
    <div class="product-card">
      <div class="img-container">
        <img
          class="photo"
          src="{{ product.masterData.current.masterVariant.images[0].url }}"
          alt="phoppppppppppppppt"
          loading="lazy"
        />
      </div>
      <div class="text-container">
        <h3 class="h3">{{ product.masterData.current.name['en-GB'] }}</h3>
        <p class="description">
          {{ product.masterData.current.description['en-GB'] }}
        </p>
      </div>
    </div>
  `,
  styles: ``,
})
export class ProductCardComponent {
  @Input() product!: Product;

  onCardClick(): void {
    console.log('card-clicked');
  }
}
