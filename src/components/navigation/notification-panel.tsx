"use client";

import { Bell, CheckCheck, X } from "lucide-react";
import { useState } from "react";
import type { Notification } from "@/types";
import { formatRelativeDate } from "@/lib/formatDate";
import { cn } from "@/lib/cn";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useUIStore } from "@/store/uiStore";

const typeVariantMap = {
  info: "info",
  success: "success",
  warning: "warning",
  danger: "danger",
} as const;

type NotificationPanelProps = {
  notifications: Notification[];
};

export function NotificationPanel({ notifications: initial }: NotificationPanelProps) {
  const { notificationPanelOpen, setNotificationPanelOpen } = useUIStore();
  const [notifications, setNotifications] = useState(initial);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        className="relative size-9 p-0"
        onClick={() => setNotificationPanelOpen(true)}
        aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ""}`}
      >
        <Bell className="size-4" />
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-danger text-[10px] font-medium text-danger-foreground">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </Button>

      <Drawer
        open={notificationPanelOpen}
        onOpenChange={setNotificationPanelOpen}
      >
        <DrawerContent side="right" className="flex flex-col">
          <DrawerHeader className="border-b border-border">
            <div className="flex items-center justify-between">
              <div>
                <DrawerTitle>Notifications</DrawerTitle>
                <DrawerDescription>
                  {unreadCount > 0
                    ? `${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}`
                    : "You're all caught up"}
                </DrawerDescription>
              </div>
              {unreadCount > 0 && (
                <Button variant="ghost" size="sm" onClick={markAllRead}>
                  <CheckCheck className="size-4" />
                  Mark all read
                </Button>
              )}
            </div>
          </DrawerHeader>

          <div className="flex-1 overflow-y-auto scrollbar-thin">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <Bell className="size-8 text-muted-foreground mb-3" />
                <p className="text-body text-muted-foreground">
                  No notifications yet
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-border">
                {notifications.map((notification) => (
                  <li
                    key={notification.id}
                    className={cn(
                      "relative px-6 py-4 transition-colors hover:bg-muted/50",
                      !notification.read && "bg-primary/5"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium">
                            {notification.title}
                          </p>
                          {!notification.read && (
                            <span className="size-2 rounded-full bg-primary" />
                          )}
                        </div>
                        <p className="text-caption">{notification.description}</p>
                        <div className="flex items-center gap-2 pt-1">
                          <Badge
                            variant={typeVariantMap[notification.type]}
                          >
                            {notification.type}
                          </Badge>
                          <span className="text-caption">
                            {formatRelativeDate(notification.timestamp)}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="size-7 p-0"
                            onClick={() => markAsRead(notification.id)}
                            aria-label="Mark as read"
                          >
                            <CheckCheck className="size-3.5" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="size-7 p-0"
                          onClick={() => removeNotification(notification.id)}
                          aria-label="Dismiss notification"
                        >
                          <X className="size-3.5" />
                        </Button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}
