import { PageContainer } from "@/components/layouts/page-container";
import { WelcomeHeader } from "@/components/dashboard/welcome-header";
import { RecentDealsTable } from "@/components/dashboard/recent-deals-table";

export function DashboardScreen() {
  return (
    <div className="flex h-full flex-col overflow-hidden">
      <PageContainer className="shrink-0 border-b border-border py-4">
        <WelcomeHeader />
      </PageContainer>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <PageContainer className="space-y-6 py-6 sm:space-y-8">
          <RecentDealsTable />
        </PageContainer>
      </div>
    </div>
  );
}
