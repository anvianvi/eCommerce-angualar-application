import { Component, Input, OnInit, computed, signal } from '@angular/core';
import { Product } from '../core/models/products';
import { CurrencyFormatterPipe } from '../core/pipes/currency-formatter.pipe';
import { StorageService } from '../core/storage/storage.service';
import { GetProductsDiscountsService } from '../core/services/api/get-discounts.service';

@Component({
  imports: [CurrencyFormatterPipe],
  selector: 'app-product-price-bar',
  standalone: true,
  template: `
    <div class="price-container">
      @if (isDiscounted()) {
        <div class="discounted-price">
          {{
            discountedPrice()
              | currencyFormatter
                : product.masterVariant.prices[0].value.currencyCode
                : product.masterVariant.prices[0].value.fractionDigits
          }}
        </div>
        <div class="original-discounted-price">
          <span>{{
            product.masterVariant.prices[0].value.centAmount
              | currencyFormatter
                : product.masterVariant.prices[0].value.currencyCode
                : product.masterVariant.prices[0].value.fractionDigits
          }}</span>
          <span> -{{ discountAmount() }} %</span>
        </div>
      } @else {
        <div>
          {{
            product.masterVariant.prices[0].value.centAmount
              | currencyFormatter
                : product.masterVariant.prices[0].value.currencyCode
                : product.masterVariant.prices[0].value.fractionDigits
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
      .discounted-price {
        font-size: 14px;
        color: red;
        font-weight: 500;
      }
      .original-discounted-price {
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
export class ProductPriceBarComponent implements OnInit {
  @Input() product!: Product;
  isDiscounted = signal(false);
  discountedPrice = signal(0);
  discountAmount = signal(0);

  productDiscounts = computed(() => {
    return this.storageService.productDiscounts();
  });

  constructor(
    private storageService: StorageService,
    private getProductsDiscountsService: GetProductsDiscountsService,
  ) {}

  ngOnInit(): void {
    this.getProductsDiscountsService.queryProductsDiscounts().subscribe();
    const productCategory = this.product.categories[0]?.id;
    const productDiscount = this.productDiscounts()[0];

    if (productDiscount.references[0]?.id === productCategory) {
      this.isDiscounted.set(true);
    }

    if (this.productDiscounts()[0].value.type === 'relative') {
      const price = Number(
        this.product.masterVariant.prices[0].value.centAmount,
      );
      const discount = productDiscount.value.permyriad / 100;

      this.discountedPrice.set((price * (100 - discount)) / 100);
      this.discountAmount.set(discount);
    }
  }
}
