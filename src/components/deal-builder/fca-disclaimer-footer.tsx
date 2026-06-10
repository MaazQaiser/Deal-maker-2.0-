import { formatGbp } from "@/lib/formatGbp";

type FcaDisclaimerFooterProps = {
  apr: string;
  totalCredit: number;
  totalPayable: number;
  monthlyPayment: number;
  termMonths: number;
  finalPayment?: number;
};

export function FcaDisclaimerFooter({
  apr,
  totalCredit,
  totalPayable,
  monthlyPayment,
  termMonths,
  finalPayment,
}: FcaDisclaimerFooterProps) {
  return (
    <div className="rounded-[16px] border border-border bg-muted/30 px-4 py-4 text-xs leading-relaxed text-muted-foreground">
      <p className="font-semibold text-foreground">Representative example</p>
      <p className="mt-2">
        {formatGbp(totalCredit)} amount of credit over {termMonths} monthly
        payments of {formatGbp(monthlyPayment)}
        {finalPayment != null && finalPayment > 0
          ? `, plus a final payment of ${formatGbp(finalPayment)}`
          : ""}
        . Total amount payable {formatGbp(totalPayable)}. {apr} APR
        representative. Finance subject to status.
      </p>
      <p className="mt-2">
        Oakwood Motor Company Ltd is authorised and regulated by the Financial
        Conduct Authority.
      </p>
    </div>
  );
}
