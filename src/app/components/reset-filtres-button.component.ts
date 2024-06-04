import { Component } from '@angular/core';
import { GetProductsService } from '../core/services/api/get-products.service';
import { StorageService } from '../core/storage/storage.service';
import { MatButtonModule } from '@angular/material/button';
import { FilterAuthorSelectComponent } from './filter-author-select.component';
import { ResetFiltersService } from '../core/services/reset-filters.service';

@Component({
  imports: [MatButtonModule, FilterAuthorSelectComponent],
  selector: 'app-reset-all-ailters-button',
  standalone: true,
  template: `
    <button mat-raised-button color="primary" (click)="resetAllFilters()">
      Reset All Filters
    </button>
  `,
})
export class ResetAllFiltersButtonComponent {
  constructor(
    private getProductsService: GetProductsService,
    private storageService: StorageService,
    private resetFiltresService: ResetFiltersService,
  ) {}

  resetAllFilters(): void {
    this.resetFiltresService.triggerResetFilters();
    this.getProductsService.sortBy.set('name.en');
    this.getProductsService.sortOrder.set('asc');
    this.getProductsService.filterMinPrice.set(0);
    this.getProductsService.filterMaxPrice.set(5000);
    this.getProductsService.filterAuthorsList.set(
      this.storageService.authors(),
    );

    this.getProductsService.queryProducts().subscribe();
  }
}
