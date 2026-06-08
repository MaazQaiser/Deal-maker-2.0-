import type { BreadcrumbItem } from "@/types";
import {
  dynamicBreadcrumbLabels,
  routeLabels,
  segmentLabels,
} from "@/constants/navigation";
import { routes } from "@/constants/routes";

function formatSegment(segment: string): string {
  return segment.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function resolveSegmentLabel(
  path: string,
  segment: string,
  segmentIndex: number,
  allSegments: string[]
): string {
  if (routeLabels[path]) {
    return routeLabels[path];
  }

  if (segmentLabels[segment]) {
    return segmentLabels[segment];
  }

  const parentPath =
    segmentIndex > 0
      ? "/" + allSegments.slice(0, segmentIndex).join("/")
      : `/${segment}`;

  const dynamicLabel = dynamicBreadcrumbLabels[parentPath];
  if (dynamicLabel) {
    return dynamicLabel;
  }

  if (segment === "proposal") {
    return "Print Proposal";
  }

  return formatSegment(segment);
}

export function generateBreadcrumbs(pathname: string): BreadcrumbItem[] {
  if (pathname === routes.dashboard) {
    return [{ label: routeLabels[routes.dashboard] ?? "Dashboard" }];
  }

  const segments = pathname.split("/").filter(Boolean);

  return segments.map((segment, index) => {
    const href = "/" + segments.slice(0, index + 1).join("/");
    const label = resolveSegmentLabel(href, segment, index, segments);
    const isLast = index === segments.length - 1;

    return {
      label,
      href: isLast ? undefined : href,
    };
  });
}
