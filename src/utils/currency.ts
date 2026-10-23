export type CurrencyCode = 'USD' | 'KHR';

export const KHR_RATE = 4100; // 1 USD = 4,100 KHR

export function formatPrice(amountInUSD: number, currency: CurrencyCode = 'USD'): string {
  if (currency === 'KHR') {
    const khrAmount = Math.round(amountInUSD * KHR_RATE);
    return `${khrAmount.toLocaleString('en-US')} ៛`;
  }
  return `$${amountInUSD.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
}

export function convertPrice(amountInUSD: number, toCurrency: CurrencyCode): number {
  if (toCurrency === 'KHR') {
    return Math.round(amountInUSD * KHR_RATE);
  }
  return amountInUSD;
}
