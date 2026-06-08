import { routeMeta } from "@/constants/routes";
import { cn } from "@/lib/cn";

type RoutePlaceholderProps = {
  path: string;
  title?: string;
  description?: string;
  className?: string;
};

export function RoutePlaceholder({
  path,
  title,
  description,
  className,
}: RoutePlaceholderProps) {
  const meta = routeMeta[path];

  return (
    <div className={cn("p-6 sm:p-8", className)}>
      <p className="text-caption font-mono text-muted-foreground">{path}</p>
      <h1 className="text-heading-2 mt-2">
        {title ?? meta?.title ?? "Route Placeholder"}
      </h1>
      {(description ?? meta?.description) && (
        <p className="text-body text-muted-foreground mt-1">
          {description ?? meta?.description}
        </p>
      )}
      <p className="text-caption text-muted-foreground mt-6">
        Screen not implemented yet.
      </p>
    </div>
  );
}
