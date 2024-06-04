import { Injectable, signal } from '@angular/core';

type Locale = 'en';

@Injectable({
  providedIn: 'root',
})
export class LocalSettingsService {
  currentLocation = signal<Locale>('en');
}
