"use client";

import type { NavItem } from "@/types";
import { mainNavItems, secondaryNavItems } from "@/constants/navigation";
import { NavLink } from "@/components/navigation/nav-link";
import { Separator } from "@/components/ui/separator";

type SidebarContentProps = {
  collapsed?: boolean;
  onNavigate?: () => void;
};

export function SidebarContent({
  collapsed = false,
  onNavigate,
}: SidebarContentProps) {
  return (
    <nav className="flex-1 space-y-1 overflow-y-auto scrollbar-thin p-3">
      <NavSection
        items={mainNavItems}
        collapsed={collapsed}
        onNavigate={onNavigate}
      />
      <Separator className="my-3" />
      <NavSection
        items={secondaryNavItems}
        collapsed={collapsed}
        onNavigate={onNavigate}
      />
    </nav>
  );
}

function NavSection({
  items,
  collapsed,
  onNavigate,
}: {
  items: NavItem[];
  collapsed?: boolean;
  onNavigate?: () => void;
}) {
  return (
    <div className="space-y-1">
      {items.map((item) => (
        <NavLink
          key={item.href}
          item={item}
          collapsed={collapsed}
          onClick={onNavigate}
        />
      ))}
    </div>
  );
}
