import { cn } from "@/lib/cn";

type PageHeaderProps = {
  title: string;
  description?: string;
  titleClassName?: string;
  actions?: React.ReactNode;
  breadcrumbs?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  sticky?: boolean;
};

export function PageHeader({
  title,
  description,
  titleClassName,
  actions,
  breadcrumbs,
  footer,
  className,
  sticky = false,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "space-y-4 pb-6",
        sticky &&
          "sticky top-0 z-20 -mx-4 border-b border-border bg-background/95 px-4 pt-2 backdrop-blur supports-[backdrop-filter]:bg-background/90 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8",
        className,
      )}
    >
      {breadcrumbs}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className={cn("text-heading-1", titleClassName)}>{title}</h1>
          {description && (
            <p className="text-body text-muted-foreground">{description}</p>
          )}
          {footer}
        </div>
        {actions && (
          <div className="flex shrink-0 items-center gap-2">{actions}</div>
        )}
      </div>
    </div>
  );
}
