import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

export type NavItem = {
  title: string;
  href: string;
  icon?: LucideIcon;
  badge?: string;
  disabled?: boolean;
  children?: NavItem[];
};

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

export type Notification = {
  id: string;
  title: string;
  description: string;
  timestamp: Date;
  read: boolean;
  type: "info" | "success" | "warning" | "danger";
};

export type UserProfile = {
  name: string;
  email: string;
  avatarUrl?: string;
  role?: string;
};

export type TableColumn<T> = {
  key: keyof T | string;
  header: string;
  cell?: (row: T) => ReactNode;
  className?: string;
};

export type KeyValueItem = {
  key: string;
  value: ReactNode;
};
