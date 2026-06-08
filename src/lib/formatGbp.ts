import { formatCurrency } from "@/lib/formatCurrency";

export function formatGbp(value: number, fractionDigits = 0): string {
  return formatCurrency(value, {
    currency: "GBP",
    locale: "en-GB",
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });
}
