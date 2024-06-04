import { Component, OnInit, computed } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatButton } from '@angular/material/button';
import { SnackbarService } from '../core/services/mat-snackbar.service';
import { GetProductsService } from '../core/services/api/get-products.service';
import { ProductCardComponent } from '../components/product-card.component';
import { GetProductsDiscountsService } from '../core/services/api/get-discounts.service';
import { StorageService } from '../core/storage/storage.service';
import { SortingBarComponent } from '../components/sorting-bar.component';
import { FilterPriceSliderComponent } from '../components/filter-price-slider.component';
import { GetAuthorService } from '../core/services/api/get-author.services';
import { FilterAuthorSelectComponent } from '../components/filter-author-select.component';
import { ResetAllFiltersButtonComponent } from '../components/reset-filtres-button.component';

@Component({
  standalone: true,
  selector: 'app-catalog-page',
  template: `
    <div class="filters-container">
      <app-filter-author-select></app-filter-author-select>
      <app-filter-price-slider></app-filter-price-slider>
      <app-reset-all-filters-button></app-reset-all-filters-button>
      <app-sorting-bar></app-sorting-bar>
    </div>

    <div class="products-list">
      @for (product of products(); track $index) {
        <app-product-card [product]="product"></app-product-card>
      }
    </div>
  `,
  styles: `
    ::ng-deep app-catalog-page {
      padding: 20px;
    }

    .filters-container {
      padding-inline: 20px;
      display: flex;
      justify-content: center;
      gap: 40px;
      flex-wrap: wrap;
    }

    .products-list {
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      gap: 37px;
    }
  `,
  imports: [
    MatButton,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    ProductCardComponent,
    SortingBarComponent,
    FilterPriceSliderComponent,
    FilterAuthorSelectComponent,
    ResetAllFiltersButtonComponent,
  ],
})
export class CatalogComponent implements OnInit {
  products = computed(() => {
    return this.storageService.productsInStore();
  });

  constructor(
    private storageService: StorageService,
    private getProductsService: GetProductsService,
    private getProductsDiscountsService: GetProductsDiscountsService,
    private snackbarService: SnackbarService,
    private getAuthorService: GetAuthorService,
  ) {}

  ngOnInit(): void {
    this.getAuthorService.queryAuthors().subscribe({
      next: () => {
        this.snackbarService.show('Authors fetched successfully', 'Ok', 2000);
        this.getProductsDiscountsService.queryProductsDiscounts().subscribe({
          next: () => {
            this.snackbarService.show(
              'Products Discounts fetched successfully',
              'Ok',
              2000,
            );
            if (this.products().length === 0) {
              this.getProductsService.queryProducts().subscribe({
                next: () => {
                  this.snackbarService.show(
                    'Products list fetched successfully',
                    'Ok',
                    2000,
                  );
                },
                error: (err) => {
                  this.snackbarService.show(
                    `Failed to fetch Products list, ${err}`,
                    'Ok',
                    2000,
                  );
                },
              });
            }
          },
          error: (err) => {
            this.snackbarService.show(
              `Failed to fetch Products Discounts, ${err}`,
              'Ok',
              2000,
            );
          },
        });
      },
      error: (err) => {
        this.snackbarService.show(
          `Failed to fetch Authors list, ${err}`,
          'Ok',
          2000,
        );
      },
    });
  }
}
