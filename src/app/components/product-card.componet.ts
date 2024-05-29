import { Component, Input, computed } from '@angular/core';
import { Product } from '../core/models/products';
import { LocalSettingsService } from '../core/services/local-settings.service';

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
          alt="photo of  {{
            product.masterData.current.name[curretLocation()]
          }} "
          loading="lazy"
        />
      </div>
      <div class="text-container">
        <h3 class="h3">
          {{ product.masterData.current.name[curretLocation()] }}
        </h3>
        <p class="description">
          {{ product.masterData.current.description[curretLocation()] }}
        </p>
      </div>
    </div>
  `,
  styles: ``,
})
export class ProductCardComponent {
  @Input() product!: Product;

  curretLocation = computed(() => {
    return this.localSettingsService.currentLocation();
  });

  constructor(private localSettingsService: LocalSettingsService) {}
}
