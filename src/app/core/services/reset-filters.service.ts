import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ResetFiltersService {
  resetFilters$ = new Subject<void>();

  triggerResetFilters(): void {
    this.resetFilters$.next();
  }
}
