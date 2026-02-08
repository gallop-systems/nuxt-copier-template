import { describe, it, expect } from "vitest";
import { useFormatters } from "./useFormatters";

describe("useFormatters", () => {
  const { formatDate, formatTime, formatCurrency, formatNumber, getInitials } = useFormatters();

  describe("formatDate", () => {
    it("formats date correctly with default format", () => {
      expect(formatDate("2025-01-15")).toBe("Jan 15, 2025");
    });

    it("formats date with custom format string", () => {
      expect(formatDate("2025-01-15", "MMMM d, yyyy")).toBe("January 15, 2025");
      expect(formatDate("2025-01-15", "yyyy-MM-dd")).toBe("2025-01-15");
    });

    it("handles date-only strings without timezone shift", () => {
      // This is the key test - date-only strings should not shift days
      // regardless of the user's timezone
      expect(formatDate("2025-01-28")).toBe("Jan 28, 2025");
    });
  });

  describe("formatTime", () => {
    it("formats time correctly", () => {
      expect(formatTime("2025-01-15T14:30:00")).toBe("2:30 PM");
      expect(formatTime("2025-01-15T09:05:00")).toBe("9:05 AM");
    });
  });

  it("formats currency", () => {
    expect(formatCurrency(100)).toBe("$100.00");
  });

  it("formats numbers with locale separators", () => {
    expect(formatNumber(1234567)).toBe("1,234,567");
    expect(formatNumber("9876.54")).toBe("9,876.54");
  });

  it("gets initials", () => {
    expect(getInitials("John Doe")).toBe("JD");
  });
});
