import { Component } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { GetProductsService } from '../core/services/api/get-products.service';

@Component({
  imports: [MatFormFieldModule, MatSelectModule],
  selector: 'app-sorting-bar',
  standalone: true,
  template: `<mat-form-field>
    <mat-label>Select an option</mat-label>
    <mat-select
      [(value)]="selected"
      (selectionChange)="onSortChange($event.value)"
    >
      <mat-option value="nameAsc">Name (A-Z)</mat-option>
      <mat-option value="nameDesc">Name (Z-A)</mat-option>
      <mat-option value="priceAsc">Price &#8593;</mat-option>
      <mat-option value="priceDesc">Price &#8595;</mat-option>
    </mat-select>
  </mat-form-field>`,
})
export class SortingBarComponent {
  selected = 'nameAsc';

  constructor(private getProductsService: GetProductsService) {}

  onSortChange(value: string): void {
    let sortBy: string;
    let sortOrder: 'asc' | 'desc';

    switch (value) {
      case 'nameAsc':
        sortBy = 'name.en';
        sortOrder = 'asc';
        break;
      case 'nameDesc':
        sortBy = 'name.en';
        sortOrder = 'desc';
        break;
      case 'priceAsc':
        sortBy = 'price';
        sortOrder = 'asc';
        break;
      case 'priceDesc':
        sortBy = 'price';
        sortOrder = 'desc';
        break;
      default:
        sortBy = 'name.en';
        sortOrder = 'asc';
    }
    this.getProductsService.sortBy.set(sortBy);
    this.getProductsService.sortOrder.set(sortOrder);
    this.getProductsService.queryProducts().subscribe();
  }
}
