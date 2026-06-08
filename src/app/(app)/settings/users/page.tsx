import type { Metadata } from "next";
import { RoutePlaceholder } from "@/components/routing/route-placeholder";
import { routes } from "@/constants/routes";

export const metadata: Metadata = {
  title: "Users",
};

export default function SettingsUsersPage() {
  return <RoutePlaceholder path={routes.settings.users} />;
}
