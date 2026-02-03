import { parseISO, format } from "date-fns";

export function useFormatters() {
  /**
   * Format a date string. Uses parseISO from date-fns to correctly handle
   * date-only strings like "2025-01-28" without timezone shifting issues.
   * @param dateString - ISO date string (e.g., "2025-01-28" or "2025-01-28T12:00:00Z")
   * @param formatStr - Optional date-fns format string (default: "MMM d, yyyy")
   */
  function formatDate(dateString: string, formatStr = "MMM d, yyyy") {
    return format(parseISO(dateString), formatStr);
  }

  /**
   * Format a date string as time only.
   * @param dateString - ISO date string with time component
   */
  function formatTime(dateString: string) {
    return format(parseISO(dateString), "h:mm a");
  }

  function formatCurrency(amount: number | string) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(Number(amount));
  }

  function formatNumber(value: number | string) {
    return new Intl.NumberFormat("en-US").format(Number(value));
  }

  function getInitials(name: string) {
    return name
      .split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }

  return {
    formatDate,
    formatTime,
    formatCurrency,
    formatNumber,
    getInitials,
  };
}
