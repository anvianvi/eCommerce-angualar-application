import { Component, Input } from '@angular/core';
import { Product } from '../core/models/products';
import { CurrencyFormatterPipe } from '../core/pipes/currency-formatter.pipe';

@Component({
  imports: [CurrencyFormatterPipe],
  selector: 'app-product-price-bar',
  standalone: true,
  template: `
    <div class="full-price">
      {{
        product.masterData.current.masterVariant.prices[0].value.centAmount
          | currencyFormatter
            : product.masterData.current.masterVariant.prices[0].value
                .currencyCode
            : product.masterData.current.masterVariant.prices[0].value
                .fractionDigits
      }}
    </div>
  `,
  styles: [
    `
      .full-price {
        padding: 15px 0;
      }
    `,
  ],
})
export class ProductPriceBarfoComponent {
  @Input() product!: Product;
}
