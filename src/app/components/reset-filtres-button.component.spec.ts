import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { of } from 'rxjs';
import { GetProductsService } from '../core/services/api/get-products.service';
import { StorageService } from '../core/storage/storage.service';
import { ResetFiltersService } from '../core/services/reset-filters.service';
import { ResetAllFiltersButtonComponent } from './reset-filtres-button.component';

describe('ResetAllFiltersButtonComponent', () => {
  let component: ResetAllFiltersButtonComponent;
  let fixture: ComponentFixture<ResetAllFiltersButtonComponent>;
  let getProductsService: GetProductsService;
  let storageService: StorageService;
  let resetFiltersService: ResetFiltersService;

  beforeEach(async () => {
    getProductsService = {
      sortBy: { set: jest.fn() },
      sortOrder: { set: jest.fn() },
      filterMinPrice: { set: jest.fn() },
      filterMaxPrice: { set: jest.fn() },
      filterAuthorsList: { set: jest.fn() },
      queryProducts: jest.fn(() => of({})),
    } as unknown as GetProductsService;

    storageService = {
      authors: jest.fn(() => ['Author1', 'Author2']),
    } as unknown as StorageService;

    resetFiltersService = {
      triggerResetFilters: jest.fn(),
    } as unknown as ResetFiltersService;

    await TestBed.configureTestingModule({
      imports: [MatButtonModule, ResetAllFiltersButtonComponent],
      providers: [
        { provide: GetProductsService, useValue: getProductsService },
        { provide: StorageService, useValue: storageService },
        { provide: ResetFiltersService, useValue: resetFiltersService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ResetAllFiltersButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call resetAllFilters when button is clicked', () => {
    const spy = jest.spyOn(component, 'resetAllFilters');
    const button = fixture.nativeElement.querySelector('button');
    button.click();
    expect(spy).toHaveBeenCalled();
  });

  it('should reset all filters correctly', () => {
    component.resetAllFilters();

    expect(resetFiltersService.triggerResetFilters).toHaveBeenCalled();
    expect(getProductsService.sortBy.set).toHaveBeenCalledWith('name.en');
    expect(getProductsService.sortOrder.set).toHaveBeenCalledWith('asc');
    expect(getProductsService.filterMinPrice.set).toHaveBeenCalledWith(0);
    expect(getProductsService.filterMaxPrice.set).toHaveBeenCalledWith(5000);
    expect(getProductsService.filterAuthorsList.set).toHaveBeenCalledWith([
      'Author1',
      'Author2',
    ]);
    expect(getProductsService.queryProducts).toHaveBeenCalled();
  });
});
