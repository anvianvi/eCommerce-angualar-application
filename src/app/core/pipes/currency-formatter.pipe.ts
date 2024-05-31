import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currencyFormatter',
  standalone: true,
})
export class CurrencyFormatterPipe implements PipeTransform {
  transform(
    centAmount: string,
    currencyCode: string,
    fractionDigits: string,
  ): string {
    const amount = Number(centAmount) / Math.pow(10, Number(fractionDigits));
    const formattedAmount = amount.toFixed(Number(fractionDigits));
    return `${formattedAmount} ${currencyCode.toUpperCase()}`;
  }
}
