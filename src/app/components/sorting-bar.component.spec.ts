import { of } from 'rxjs';
import { GetProductsService } from '../core/services/api/get-products.service';
import { SortingBarComponent } from './soring-bar.component';

describe('SortingBarComponent', () => {
  let component: SortingBarComponent;
  let getProductsService: GetProductsService;

  beforeEach(() => {
    getProductsService = {
      sortBy: { set: jest.fn() },
      sortOrder: { set: jest.fn() },
      queryProducts: jest.fn(() => of({})),
    } as unknown as GetProductsService;

    component = new SortingBarComponent(getProductsService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call queryProducts when onSortChange is triggered', () => {
    const value = 'nameAsc';
    component.onSortChange(value);
    expect(getProductsService.queryProducts).toHaveBeenCalled();
  });

  it('should set sortBy and sortOrder when onSortChange is triggered', () => {
    const value = 'priceDesc';
    component.onSortChange(value);
    expect(getProductsService.sortBy.set).toHaveBeenCalledWith('price');
    expect(getProductsService.sortOrder.set).toHaveBeenCalledWith('desc');
  });
});
