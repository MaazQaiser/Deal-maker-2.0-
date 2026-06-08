"use client";

import { usePathname } from "next/navigation";
import type { BreadcrumbItem as BreadcrumbNavItem } from "@/types";
import { appConfig } from "@/constants/navigation";
import { routes } from "@/constants/routes";
import { generateBreadcrumbs } from "@/lib/routing/breadcrumbs";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

type BreadcrumbNavProps = {
  items?: BreadcrumbNavItem[];
  className?: string;
};

export function BreadcrumbNav({ items, className }: BreadcrumbNavProps) {
  const pathname = usePathname();
  const breadcrumbs = items ?? generateBreadcrumbs(pathname);

  return (
    <Breadcrumb className={className}>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href={routes.dashboard}>
            {appConfig.name}
          </BreadcrumbLink>
        </BreadcrumbItem>
        {breadcrumbs.map((item, index) => (
          <span key={`${item.label}-${index}`} className="contents">
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              {item.href ? (
                <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
              ) : (
                <BreadcrumbPage>{item.label}</BreadcrumbPage>
              )}
            </BreadcrumbItem>
          </span>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
