export const pxFinanceCompanies = [
  { value: "black-horse", label: "Black Horse" },
  { value: "santander", label: "Santander" },
  { value: "motonovo", label: "MotoNovo" },
  { value: "close-brothers", label: "Close Brothers" },
  { value: "barclays-partner-finance", label: "Barclays Partner Finance" },
  { value: "other", label: "Other" },
] as const;

export type PxFinanceCompany = (typeof pxFinanceCompanies)[number]["value"];

export function getPxFinanceCompanyLabel(value: string | undefined): string | undefined {
  return pxFinanceCompanies.find((company) => company.value === value)?.label;
}
