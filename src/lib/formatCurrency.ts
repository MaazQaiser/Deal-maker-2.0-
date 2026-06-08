type FormatCurrencyOptions = {
  currency?: string;
  locale?: string;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
};

export function formatCurrency(
  value: number,
  options: FormatCurrencyOptions = {}
): string {
  const {
    currency = "USD",
    locale = "en-US",
    minimumFractionDigits: minimumFractionDigitsOption,
    maximumFractionDigits: maximumFractionDigitsOption,
  } = options;

  const maximumFractionDigits = maximumFractionDigitsOption ?? 2;
  const minimumFractionDigits = Math.min(
    minimumFractionDigitsOption ?? maximumFractionDigits,
    maximumFractionDigits
  );

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(value);
}
