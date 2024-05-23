import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FormatDataService {
  countryCodes: { [key: string]: string } = {
    Poland: 'PL',
    'United States': 'US',
    Canada: 'CA',
  };

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  getCountyCode(countryname: string): string {
    return this.countryCodes[countryname];
  }

  getFormatedDateOfBirth(dateOfBirth: Date): string {
    return dateOfBirth ? this.formatDate(new Date(dateOfBirth)) : '';
  }
}
