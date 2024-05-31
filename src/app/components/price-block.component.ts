import { Component, Input, OnInit, computed, signal } from '@angular/core';
import { Product } from '../core/models/products';
import { CurrencyFormatterPipe } from '../core/pipes/currency-formatter.pipe';
import { GetProductsDiscountsService } from '../core/services/api/get-discounts.service';

@Component({
  imports: [CurrencyFormatterPipe],
  selector: 'app-product-price-bar',
  standalone: true,
  template: `
    <div class="price-container">
      @if (isDiscounted()) {
        <div class="dicsounted-price">
          {{
            discountedPrice()
              | currencyFormatter
                : product.masterData.current.masterVariant.prices[0].value
                    .currencyCode
                : product.masterData.current.masterVariant.prices[0].value
                    .fractionDigits
          }}
        </div>
        <div class="original-dicsounted-price">
          <span>{{
            product.masterData.current.masterVariant.prices[0].value.centAmount
              | currencyFormatter
                : product.masterData.current.masterVariant.prices[0].value
                    .currencyCode
                : product.masterData.current.masterVariant.prices[0].value
                    .fractionDigits
          }}</span>
          <span> -{{ discountAmount() }} %</span>
        </div>
      } @else {
        <div>
          {{
            product.masterData.current.masterVariant.prices[0].value.centAmount
              | currencyFormatter
                : product.masterData.current.masterVariant.prices[0].value
                    .currencyCode
                : product.masterData.current.masterVariant.prices[0].value
                    .fractionDigits
          }}
        </div>
      }
    </div>
  `,
  styles: [
    `
      .price-container {
        height: 40px;
        display: flex;
        flex-direction: column;
        justify-content: center;
      }
      .dicsounted-price {
        font-size: 14px;
        color: red;
        font-weight: 500;
      }
      .original-dicsounted-price {
        font-size: 12px;

        :first-child {
          text-decoration: line-through;
        }

        :last-child {
          color: red;
        }
      }
    `,
  ],
})
export class ProductPriceBarfoComponent implements OnInit {
  @Input() product!: Product;
  isDiscounted = signal(false);
  discountedPrice = signal(0);
  discountAmount = signal(0);

  productDiscounts = computed(() => {
    return this.getProductsDiscountsService.productDiscounts();
  });

  constructor(
    private getProductsDiscountsService: GetProductsDiscountsService,
  ) {}

  ngOnInit(): void {
    if (
      this.productDiscounts()[0].references[0].id ===
      this.product.masterData.current.categories[0].id
    ) {
      this.isDiscounted.set(true);
    }
    if (this.productDiscounts()[0].value.type === 'relative') {
      this.discountedPrice.set(
        (Number(
          this.product.masterData.current.masterVariant.prices[0].value
            .centAmount,
        ) *
          (10000 - this.productDiscounts()[0].value.permyriad)) /
          10000,
      );

      this.discountAmount.set(this.productDiscounts()[0].value.permyriad / 100);
    }

    console.log(
      this.product.masterData.current.masterVariant.prices[0].value.centAmount,
    );
    console.log(this.productDiscounts()[0].value.permyriad);
    console.log(10000 - this.productDiscounts()[0].value.permyriad);
  }
}
