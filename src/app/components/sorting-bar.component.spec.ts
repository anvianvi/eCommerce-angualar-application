import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { GetProductsService } from '../core/services/api/get-products.service';
import { SortingBarComponent } from './sorting-bar.component';

describe('SortingBarComponent', () => {
  let component: SortingBarComponent;
  let fixture: ComponentFixture<SortingBarComponent>;
  let getProductsService: GetProductsService;

  beforeEach(async () => {
    getProductsService = {
      sortBy: { set: jest.fn() },
      sortOrder: { set: jest.fn() },
      queryProducts: jest.fn(() => of({})),
    } as unknown as GetProductsService;

    await TestBed.configureTestingModule({
      imports: [SortingBarComponent, BrowserAnimationsModule],
      providers: [
        { provide: GetProductsService, useValue: getProductsService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SortingBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
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
