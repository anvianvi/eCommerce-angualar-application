import { Component, OnInit, computed, effect } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GetProductsService } from '../core/services/api/get-products.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { StorageService } from '../core/storage/storage.service';
import { ResetFiltersService } from '../core/services/reset-filters.service';

@Component({
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  selector: 'app-filter-author-select',
  standalone: true,
  template: `<mat-form-field>
    <mat-label>Authors:</mat-label>
    <mat-select
      [formControl]="authors"
      multiple
      (selectionChange)="applyFilters()"
    >
      <mat-select-trigger>
        {{ authors.value?.[0] || '' }}
        @if ((authors.value?.length || 0) > 1) {
          <span class="example-additional-selection">
            (+{{ (authors.value?.length || 0) - 1 }}
            {{ authors.value?.length === 2 ? 'other' : 'others' }})
          </span>
        }
      </mat-select-trigger>
      @for (author of authorList(); track author) {
        <mat-option [value]="author">{{ author }}</mat-option>
      }
    </mat-select></mat-form-field
  >`,
  styles: `
    .example-additional-selection {
      opacity: 0.75;
      font-size: 0.75em;
    }
  `,
})
export class FilterAuthorSelectComponent implements OnInit {
  authors = new FormControl<string[]>([]);
  authorList = computed(() => {
    return this.storage.authors();
  });

  constructor(
    private getProductsService: GetProductsService,
    private storage: StorageService,
    private resetFiltersService: ResetFiltersService,
  ) {
    effect(() => {
      this.authors.setValue(this.storage.authors());
    });
  }

  ngOnInit(): void {
    this.resetFiltersService.resetFilters$.subscribe(() => {
      this.authors.setValue(this.storage.authors());
    });
  }

  applyFilters(): void {
    if (this.authors.value) {
      this.getProductsService.filterAuthorsList.set(this.authors.value);
      this.getProductsService.queryProducts().subscribe();
    }
  }
}
