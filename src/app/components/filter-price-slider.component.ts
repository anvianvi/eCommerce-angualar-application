import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatSliderModule } from '@angular/material/slider';
import { Subject, Subscription, debounceTime } from 'rxjs';
import { GetProductsService } from '../core/services/api/get-products.service';
import { MatInputModule } from '@angular/material/input';
import { ResetFiltersService } from '../core/services/reset-filters.service';

@Component({
  imports: [MatSliderModule, MatInputModule, FormsModule],
  selector: 'app-filter-price-slider',
  standalone: true,

  template: `<span>Price: </span>
    <mat-slider min="0" max="30" step="0.5" showTickMarks="true" discrete>
      <input
        [(ngModel)]="startValue"
        matSliderStartThumb
        (input)="onInputChange()"
      />
      <input
        [(ngModel)]="endValue"
        matSliderEndThumb
        (input)="onInputChange()"
      />
    </mat-slider>`,
  styles: [``],
})
export class FilterPriceSliderComponent implements OnInit, OnDestroy {
  startValue = 0;
  endValue = 30;

  debounceTimeMs = 900;
  inputChangeSubject = new Subject<void>();
  inputChangeSubscription: Subscription | undefined;

  constructor(
    private getProductsService: GetProductsService,
    private resetFiltresService: ResetFiltersService,
  ) {}

  ngOnInit(): void {
    this.inputChangeSubscription = this.inputChangeSubject
      .pipe(debounceTime(this.debounceTimeMs))
      .subscribe(() => this.applyFilters());

    this.resetFiltresService.resetFilters$.subscribe(() => {
      this.startValue = 0;
      this.endValue = 30;
    });
  }

  ngOnDestroy(): void {
    this.inputChangeSubscription?.unsubscribe();
  }

  onInputChange(): void {
    this.inputChangeSubject.next();
  }

  applyFilters(): void {
    this.getProductsService.filterMinPrice.set(this.startValue * 100);
    this.getProductsService.filterMaxPrice.set(this.endValue * 100);
    this.getProductsService.queryProducts().subscribe();
  }
}
