import { CurrencyFormatterPipe } from './currency-formatter.pipe';

describe('CurrencyFormatterPipe', () => {
  let pipe: CurrencyFormatterPipe;

  beforeEach(() => {
    pipe = new CurrencyFormatterPipe();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should format the amount correctly with 2 fraction digits', () => {
    const result = pipe.transform(12345, 'usd', 2);
    expect(result).toBe('123.45 USD');
  });

  it('should format the amount correctly with 0 fraction digits', () => {
    const result = pipe.transform(12345, 'usd', 0);
    expect(result).toBe('12345 USD');
  });

  it('should format the amount correctly with 3 fraction digits', () => {
    const result = pipe.transform(12345, 'usd', 3);
    expect(result).toBe('12.345 USD');
  });

  it('should handle lower case currency codes', () => {
    const result = pipe.transform(12345, 'eur', 2);
    expect(result).toBe('123.45 EUR');
  });

  it('should handle upper case currency codes', () => {
    const result = pipe.transform(12345, 'EUR', 2);
    expect(result).toBe('123.45 EUR');
  });
});
