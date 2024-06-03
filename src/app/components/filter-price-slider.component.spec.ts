import { of, Subject, Subscription } from 'rxjs';
import { FilterPriceSliderComponent } from './filter-price-slider.component';
import { GetProductsService } from '../core/services/api/get-products.service';

describe('FilterPriceSliderComponent', () => {
  let component: FilterPriceSliderComponent;
  let getProductsService: GetProductsService;

  beforeEach(() => {
    getProductsService = {
      sortBy: { set: jest.fn() },
      sortOrder: { set: jest.fn() },
      queryProducts: jest.fn(() => of({})),
    } as unknown as GetProductsService;

    component = new FilterPriceSliderComponent(getProductsService);
    component.startValue = 0;
    component.endValue = 30;
    component.debounceTimeMs = 900;
    component.inputChangeSubject = new Subject<void>();
    component.inputChangeSubscription = new Subscription();
  });

  afterEach(() => {
    if (component.inputChangeSubscription) {
      component.inputChangeSubscription.unsubscribe();
    }
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
    const spy = jest.spyOn(component, 'onSliderInputChange');

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
});
