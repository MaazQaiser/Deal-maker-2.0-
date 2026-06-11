import Link from "next/link";
import {
  ArrowRight,
  ClipboardCheck,
  Car,
  Gauge,
  PenLine,
  Plus,
  Sparkles,
  SlidersHorizontal,
  UserPlus,
  type LucideIcon,
} from "lucide-react";
import { routes } from "@/constants/routes";
import { PageContainer } from "@/components/layouts/page-container";
import { WelcomeHeader } from "@/components/dashboard/welcome-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/data-display/card";

type JourneyStage = {
  label: string;
  description: string;
  icon: LucideIcon;
};

const journeyStages: JourneyStage[] = [
  {
    label: "Arrival & intake",
    description: "Customer, part exchange, and vehicle",
    icon: UserPlus,
  },
  {
    label: "Pre-test-drive",
    description: "Compliance checklist",
    icon: ClipboardCheck,
  },
  {
    label: "Test drive",
    description: "Capture buying motives",
    icon: Car,
  },
  {
    label: "Trial close",
    description: "Score before presenting",
    icon: Gauge,
  },
  {
    label: "0% presentation",
    description: "Sell the package",
    icon: Sparkles,
  },
  {
    label: "Finance fit",
    description: "Find an affordable plan",
    icon: SlidersHorizontal,
  },
  {
    label: "Summary & sign",
    description: "Confirm and commit",
    icon: PenLine,
  },
];

export function DashboardScreen() {
  return (
    <div className="flex h-full flex-col overflow-hidden">
      <PageContainer className="shrink-0 border-b border-border py-4">
        <WelcomeHeader />
      </PageContainer>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <PageContainer className="flex min-h-full flex-col justify-center py-10">
          <div className="mx-auto w-full max-w-4xl space-y-8">
            <Card className="overflow-hidden border-border/70">
              <div className="relative isolate overflow-hidden bg-gradient-to-br from-primary via-primary to-primary-hover px-6 py-12 text-center text-primary-foreground sm:px-12 sm:py-16">
                <div
                  aria-hidden
                  className="pointer-events-none absolute -right-16 -top-16 size-56 rounded-full bg-primary-foreground/10 blur-2xl"
                />
                <div
                  aria-hidden
                  className="pointer-events-none absolute -bottom-20 -left-12 size-56 rounded-full bg-primary-foreground/10 blur-2xl"
                />
                <div className="relative mx-auto max-w-xl space-y-5">
                  <span className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/15 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em]">
                    <Sparkles className="size-3.5" aria-hidden />
                    On-site deal builder
                  </span>
                  <h2 className="text-heading-1">Ready to start a new deal?</h2>
                  <p className="text-body-lg text-primary-foreground/85">
                    Guide your customer from arrival to signature — capture
                    intake, run the test drive, present the 0% package, and build
                    a finance plan that fits.
                  </p>
                  <div className="flex justify-center pt-1">
                    <Button
                      asChild
                      size="lg"
                      variant="secondary"
                      className="min-w-[220px] bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                    >
                      <Link href={routes.deals.new.index}>
                        <Plus className="size-5" aria-hidden="true" />
                        Start New Deal
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </Card>

            <div className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-heading-4">The journey</h3>
                <span className="text-caption">7 guided steps</span>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {journeyStages.map((stage, index) => (
                  <Card
                    key={stage.label}
                    className="border-border/70 transition-shadow hover:shadow-md"
                  >
                    <CardContent className="space-y-3 p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10">
                          <stage.icon
                            className="size-4 text-primary"
                            aria-hidden
                          />
                        </div>
                        <span className="text-caption font-medium">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-sm font-semibold leading-snug">
                          {stage.label}
                        </p>
                        <p className="text-caption">{stage.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                <Link
                  href={routes.deals.new.index}
                  className="group flex flex-col justify-between rounded-[24px] border border-dashed border-primary/40 bg-primary/5 p-4 transition-colors hover:border-primary hover:bg-primary/10"
                >
                  <div className="flex size-9 items-center justify-center rounded-lg bg-primary/15">
                    <ArrowRight
                      className="size-4 text-primary transition-transform group-hover:translate-x-0.5"
                      aria-hidden
                    />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-sm font-semibold leading-snug text-primary">
                      Begin now
                    </p>
                    <p className="text-caption">Start at arrival & intake</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </PageContainer>
      </div>
    </div>
  );
}
