import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currencyFormatter',
  standalone: true,
})
export class CurrencyFormatterPipe implements PipeTransform {
  transform(
    centAmount: number,
    currencyCode: string,
    fractionDigits: number,
  ): string {
    const amount = Number(centAmount) / Math.pow(10, fractionDigits);
    const formattedAmount = amount.toFixed(fractionDigits);
    return `${formattedAmount} ${currencyCode.toUpperCase()}`;
  }
}
