import { Car } from "lucide-react";
import { getCarBrandLogo } from "@/lib/car-brand-logo";
import { cn } from "@/lib/cn";

type CarBrandLogoProps = {
  make: string;
  className?: string;
  iconClassName?: string;
};

export function CarBrandLogo({
  make,
  className,
  iconClassName,
}: CarBrandLogoProps) {
  const src = getCarBrandLogo(make);

  if (!src) {
    return (
      <span
        className={cn(
          "flex size-8 shrink-0 items-center justify-center rounded-full bg-muted",
          className
        )}
        aria-hidden="true"
      >
        <Car className={cn("size-4 text-muted-foreground", iconClassName)} />
      </span>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      width={32}
      height={32}
      className={cn("size-8 shrink-0 rounded-full object-contain", className)}
      decoding="async"
    />
  );
}
