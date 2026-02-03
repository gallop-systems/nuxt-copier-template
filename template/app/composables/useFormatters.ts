import { parseISO, format } from "date-fns";

export function useFormatters() {
  function formatDate(dateString: string) {
    return format(parseISO(dateString), "MMM d, yyyy");
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
    formatCurrency,
    formatNumber,
    getInitials,
  };
}
