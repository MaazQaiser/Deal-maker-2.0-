import type { Notification, UserProfile } from "@/types";

export const mockUser: UserProfile = {
  name: "Alex Morgan",
  email: "alex.morgan@example.com",
  role: "Administrator",
  avatarUrl:
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
};

export const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "Welcome to Deal Builder",
    description: "Your workspace is ready. Start exploring the foundation.",
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    read: false,
    type: "info",
  },
  {
    id: "2",
    title: "System update completed",
    description: "The latest design system update has been applied.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    read: false,
    type: "success",
  },
  {
    id: "3",
    title: "Storage limit approaching",
    description: "You have used 85% of your available storage.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    read: true,
    type: "warning",
  },
  {
    id: "4",
    title: "Failed backup attempt",
    description: "Last night's backup could not be completed.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48),
    read: true,
    type: "danger",
  },
];
