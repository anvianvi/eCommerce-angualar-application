import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatSliderModule } from '@angular/material/slider';
import { MatInputModule } from '@angular/material/input';
import { Subject, of } from 'rxjs';
import { FilterPriceSliderComponent } from './filter-price-slider.component';
import { GetProductsService } from '../core/services/api/get-products.service';
import { ResetFiltersService } from '../core/services/reset-filters.service';

describe('FilterPriceSliderComponent', () => {
  let component: FilterPriceSliderComponent;
  let fixture: ComponentFixture<FilterPriceSliderComponent>;
  let getProductsService: GetProductsService;
  let resetFiltersService: ResetFiltersService;

  beforeEach(async () => {
    getProductsService = {
      filterMinPrice: {
        set: jest.fn(),
      },
      filterMaxPrice: {
        set: jest.fn(),
      },
      queryProducts: jest.fn(() => of({})),
    } as unknown as GetProductsService;

    resetFiltersService = {
      resetFilters$: new Subject<void>(),
    } as unknown as ResetFiltersService;

    await TestBed.configureTestingModule({
      imports: [
        MatSliderModule,
        MatInputModule,
        FormsModule,
        FilterPriceSliderComponent,
      ],
      providers: [
        { provide: GetProductsService, useValue: getProductsService },
        { provide: ResetFiltersService, useValue: resetFiltersService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FilterPriceSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.startValue).toBe(0);
    expect(component.endValue).toBe(30);
  });

  it('should subscribe to input changes with debounce', () => {
    jest.useFakeTimers();
    const spy = jest.spyOn(component, 'applyFilters');

    component.ngOnInit();

    component.onInputChange();
    jest.advanceTimersByTime(component.debounceTimeMs);

    expect(spy).toHaveBeenCalled();
    jest.useRealTimers();
  });

  it('should clean up subscription on destroy', () => {
    component.ngOnInit();
    const unsubscribeSpy = jest.spyOn(
      component.inputChangeSubscription!,
      'unsubscribe',
    );

    component.ngOnDestroy();

    expect(unsubscribeSpy).toHaveBeenCalled();
  });

  it('should reset values on reset event', () => {
    component.ngOnInit();
    component.startValue = 10;
    component.endValue = 20;

    (resetFiltersService.resetFilters$ as Subject<void>).next();

    expect(component.startValue).toBe(0);
    expect(component.endValue).toBe(30);
  });

  it('should apply filters correctly', () => {
    component.startValue = 5;
    component.endValue = 25;
    component.applyFilters();

    expect(getProductsService.filterMinPrice.set).toHaveBeenCalledWith(500);
    expect(getProductsService.filterMaxPrice.set).toHaveBeenCalledWith(2500);
    expect(getProductsService.queryProducts).toHaveBeenCalled();
  });
});
