// Supported currencies and currency formatting utility

export const SUPPORTED_CURRENCIES = {
  INR: {
    symbol: "₹",
    name: "Indian Rupee",
    locale: "en-IN",
  },
  USD: {
    symbol: "$",
    name: "US Dollar",
    locale: "en-US",
  },
  EUR: {
    symbol: "€",
    name: "Euro",
    locale: "en-EU",
  },
} as const;

export type CurrencyCode = keyof typeof SUPPORTED_CURRENCIES;

// Formats a number as a currency string based on currency code
export function formatCurrency(amount: number, currency: CurrencyCode = "INR") {
  const { locale, symbol } = SUPPORTED_CURRENCIES[currency];
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    currencyDisplay: "narrowSymbol",
  }).format(amount);
}
