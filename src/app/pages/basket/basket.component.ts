import { Component, OnInit, computed } from '@angular/core';
import { BasketService } from '../../core/services/api/basket.service';
import { MatButtonModule } from '@angular/material/button';
import { StorageService } from '../../core/storage/storage.service';
import { CurrencyFormatterPipe } from '../../core/pipes/currency-formatter.pipe';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-basket',
  standalone: true,
  imports: [
    MatButtonModule,
    CurrencyFormatterPipe,
    RouterLinkActive,
    RouterOutlet,
    RouterLink,
  ],
  template: `<button
      mat-flat-button
      color="primary"
      (click)="getMyActiveCart()"
    >
      get Cart
    </button>
    <button mat-flat-button color="primary" (click)="createmycart()">
      createmycart
    </button>

    <div class="products-container">
      <table>
        @if (cart().lineItems.length > 0) {
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Author</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
        }

        <tbody>
          @for (item of cart().lineItems; track $index) {
            <tr>
              <td>
                <img
                  [src]="item.variant.images[0].url"
                  alt="{{ item.name }}"
                  width="50"
                />
              </td>
              <td>{{ item.name['en'] }}</td>
              <td>{{ item.variant.attributes[0].value }}</td>

              <td>
                {{
                  item.price.value.centAmount
                    | currencyFormatter
                      : item.price.value.currencyCode
                      : item.price.value.fractionDigits
                }}
              </td>
              <td>
                <button mat-button (click)="removeItemFromCart(item.productId)">
                  Remove from basket
                </button>
              </td>
            </tr>
          } @empty {
            <h3 style="text-align: center;">
              Your cart is empty. Continue shopping in our
              <button mat-button routerLink="/" color="primary">catalog</button>
            </h3>
          }
        </tbody>
      </table>
    </div>
    @if (cart().lineItems.length > 0) {
      <div style="width:fit-content;margin-left: auto;padding: 20px">
        <div style="margin-bottom: 20px;">
          <strong>Total Price: </strong>
          {{
            cart().totalPrice.centAmount
              | currencyFormatter
                : cart().totalPrice.currencyCode
                : cart().totalPrice.fractionDigits
          }}
        </div>
        <button mat-button color="warn" (click)="clearBasket()">
          Clear Shopping Cart
        </button>
      </div>
    }`,
  styleUrl: './basket.component.scss',
})
export class BasketComponent implements OnInit {
  cart = computed(() => {
    return this.storage.myBasket();
  });

  constructor(
    private basketService: BasketService,
    private storage: StorageService,
  ) {}

  ngOnInit(): void {
    this.basketService.getBasket();
    console.log('init');
    console.log(this.cart());
  }

  removeItemFromCart(productId: string): void {
    this.basketService.removeItemFromMyCart(productId).subscribe();
  }

  clearBasket(): void {
    this.basketService.clearMyCart().subscribe();
  }
  getMyActiveCart(): void {
    console.log('test fetch');
    this.basketService.getMyActiveCart().subscribe({
      next: () => {},
      error: (err) => {
        console.log(err);
      },
    });
  }
  createmycart(): void {
    console.log('test fetch');
    this.basketService.createMyCart().subscribe({
      next: () => {},
      error: (err) => {
        console.log(err);
      },
    });
  }
}
