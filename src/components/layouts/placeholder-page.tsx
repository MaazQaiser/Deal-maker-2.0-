import type { LucideIcon } from "lucide-react";
import { PageContainer } from "@/components/layouts/page-container";
import { PageHeader } from "@/components/layouts/page-header";
import { EmptyState } from "@/components/layouts/empty-state";
import { BreadcrumbNav } from "@/components/navigation/breadcrumb-nav";

type PlaceholderPageProps = {
  title: string;
  description: string;
  icon: LucideIcon;
  emptyTitle?: string;
  emptyDescription?: string;
};

export function PlaceholderPage({
  title,
  description,
  icon: Icon,
  emptyTitle,
  emptyDescription,
}: PlaceholderPageProps) {
  return (
    <PageContainer className="py-6">
      <PageHeader
        title={title}
        description={description}
        breadcrumbs={<BreadcrumbNav />}
      />
      <EmptyState
        icon={Icon}
        title={emptyTitle ?? `No ${title.toLowerCase()} yet`}
        description={
          emptyDescription ??
          "This is a placeholder page. Business features will be built here."
        }
      />
    </PageContainer>
  );
}
