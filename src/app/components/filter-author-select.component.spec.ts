import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { FilterAuthorSelectComponent } from './filter-author-select.component';
import { GetProductsService } from '../core/services/api/get-products.service';
import { StorageService } from '../core/storage/storage.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('FilterAuthorSelectComponent', () => {
  let component: FilterAuthorSelectComponent;
  let fixture: ComponentFixture<FilterAuthorSelectComponent>;
  let getProductsService: GetProductsService;
  let storageService: StorageService;

  beforeEach(async () => {
    getProductsService = {
      filterAuthorsList: {
        set: jest.fn(),
      },
      queryProducts: jest.fn(() => of({})),
    } as unknown as GetProductsService;

    storageService = {
      authors: jest.fn(() => ['Author1', 'Author2']),
    } as unknown as StorageService;

    await TestBed.configureTestingModule({
      imports: [
        MatFormFieldModule,
        MatSelectModule,
        FormsModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        FilterAuthorSelectComponent,
      ],
      providers: [
        { provide: GetProductsService, useValue: getProductsService },
        { provide: StorageService, useValue: storageService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FilterAuthorSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should update selected authors and call queryProducts on selection change', () => {
    const newAuthors = ['Author1'];
    component.authors.setValue(newAuthors);
    component.applyFilters();

    expect(getProductsService.filterAuthorsList.set).toHaveBeenCalledWith(
      newAuthors,
    );
    expect(getProductsService.queryProducts).toHaveBeenCalled();
  });

  it('should set the authors value based on storage service', () => {
    expect(component.authors.value).toEqual(['Author1', 'Author2']);
  });
});
