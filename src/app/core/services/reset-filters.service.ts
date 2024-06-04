import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ResetFiltersService {
  resetFilters$ = new BehaviorSubject<void>(undefined);

  triggerResetFilters(): void {
    this.resetFilters$.next();
  }
}
