import type { ActivityItem } from "@/types/dashboard";
import { dealHistoryRecords } from "@/constants/deal-history-mock-data";

export const dashboardUser = {
  firstName: "John",
  fullName: "John Smith",
  role: "Sales Manager",
} as const;

export const recentDeals = dealHistoryRecords.slice(0, 6);

export const activityFeed: ActivityItem[] = [
  {
    id: "1",
    title: "New deal created",
    description: "Sarah Johnson — BMW X3 M Sport 2022",
    timestamp: new Date(Date.now() - 1000 * 60 * 20),
    type: "deal",
  },
  {
    id: "2",
    title: "Finance approved",
    description: "Michael Carter — Audi A4 PCP agreement presented",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    type: "finance",
  },
  {
    id: "3",
    title: "Proposal printed",
    description: "Olivia Smith — VW Golf GTD draft saved",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
    type: "proposal",
  },
  {
    id: "4",
    title: "Customer added",
    description: "David Miller registered as a new customer",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12),
    type: "customer",
  },
  {
    id: "5",
    title: "Vehicle reserved",
    description: "Range Rover Evoque held for Chloe White",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 18),
    type: "vehicle",
  },
  {
    id: "6",
    title: "Deal completed",
    description: "Sarah Johnson — BMW X3 deal marked as won",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    type: "deal",
  },
  {
    id: "7",
    title: "Finance pending",
    description: "Liam Taylor — Ford Focus ST awaiting finance decision",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 36),
    type: "finance",
  },
];
