import { cn } from "@/lib/cn";

type PageHeaderProps = {
  title: string;
  description?: string;
  titleClassName?: string;
  actions?: React.ReactNode;
  breadcrumbs?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
};

export function PageHeader({
  title,
  description,
  titleClassName,
  actions,
  breadcrumbs,
  footer,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn("space-y-4 pb-6", className)}>
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
