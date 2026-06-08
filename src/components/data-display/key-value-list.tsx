import type { KeyValueItem } from "@/types";
import { cn } from "@/lib/cn";
import { Separator } from "@/components/ui/separator";

type KeyValueListProps = {
  items: KeyValueItem[];
  className?: string;
  orientation?: "horizontal" | "vertical";
};

export function KeyValueList({
  items,
  className,
  orientation = "horizontal",
}: KeyValueListProps) {
  return (
    <dl
      className={cn(
        orientation === "horizontal" ? "space-y-0" : "space-y-4",
        className
      )}
    >
      {items.map((item, index) => (
        <div key={item.key}>
          <div
            className={cn(
              orientation === "horizontal"
                ? "flex items-center justify-between py-3"
                : "space-y-1"
            )}
          >
            <dt className="text-caption font-medium">{item.key}</dt>
            <dd className="text-body">{item.value}</dd>
          </div>
          {index < items.length - 1 && orientation === "horizontal" && (
            <Separator />
          )}
        </div>
      ))}
    </dl>
  );
}
