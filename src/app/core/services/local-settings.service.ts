import { Injectable, signal } from '@angular/core';

type Locale = 'en-US' | 'en-GB' | 'de-DE';

@Injectable({
  providedIn: 'root',
})
export class LocalSettingsService {
  currentLocation = signal<Locale>('en-GB');
}
