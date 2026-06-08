type FormatDateOptions = {
  locale?: string;
  dateStyle?: "full" | "long" | "medium" | "short";
  timeStyle?: "full" | "long" | "medium" | "short";
};

export function formatDate(
  date: Date | string | number,
  options: FormatDateOptions = {}
): string {
  const { locale = "en-US", dateStyle = "medium", timeStyle } = options;
  const parsedDate = date instanceof Date ? date : new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat(locale, {
    dateStyle,
    ...(timeStyle ? { timeStyle } : {}),
  }).format(parsedDate);
}

export function formatRelativeDate(date: Date | string | number): string {
  const parsedDate = date instanceof Date ? date : new Date(date);
  const now = new Date();
  const diffMs = now.getTime() - parsedDate.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMinutes < 1) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return formatDate(parsedDate, { dateStyle: "short" });
}
