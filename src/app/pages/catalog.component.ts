import { Component, OnInit, computed } from '@angular/core';
import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { AuthenticationService } from '../core/services/authentication.service';
import { MatButton } from '@angular/material/button';
import { SnackbarService } from '../core/services/mat-snackbar.service';
import { GetProductsService } from '../core/services/api/get-products.service';
import { ProductCardComponent } from '../components/product-card.component';

@Component({
  imports: [
    MatButton,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    ProductCardComponent,
  ],
  standalone: true,
  selector: 'app-catalog-page',
  template: `
    <div class="products-list">
      @for (product of products(); track $index) {
        <app-product-card [product]="product"></app-product-card>
      }
    </div>
  `,
  styles: `
    ::ng-deep app-main {
    }

    .products-list {
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      gap: 37px;
      margin-bottom: 100px;
    }
  `,
})
export class CatalogComponent implements OnInit {
  isAuthenticated = computed(() => {
    return this.authenticationService.isAuthenticated();
  });

  products = computed(() => {
    return this.getProductsService.productsInStore();
  });

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
    private getProductsService: GetProductsService,
    private snackbarService: SnackbarService,
  ) {}

  ngOnInit(): void {
    if (!this.isAuthenticated()) {
      this.router.navigate(['/']);
    }

    if (this.products().length === 0) {
      this.getProductsService.queryProducts().subscribe({
        next: () => {
          this.snackbarService.show(
            'Customer token fetched successfully',
            'Ok',
            2000,
          );
        },
        error: (err) => {
          this.snackbarService.show(
            `Failed to fetch Customer AccessToken, ${err}`,
            'Ok',
            2000,
          );
        },
      });
    }
  }
}
