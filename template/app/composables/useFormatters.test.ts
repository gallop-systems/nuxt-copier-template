import { describe, it, expect } from 'vitest'
import { useFormatters } from './useFormatters'

describe('useFormatters', () => {
  const { formatDate, formatCurrency, formatNumber, getInitials } = useFormatters()

  it('formats date correctly', () => {
    expect(formatDate('2025-01-15')).toContain('Jan')
    expect(formatDate('2025-01-15')).toContain('15')
  })

  it('formats currency', () => {
    expect(formatCurrency(100)).toBe('$100.00')
  })

  it('formats numbers with locale separators', () => {
    expect(formatNumber(1234567)).toBe('1,234,567')
    expect(formatNumber('9876.54')).toBe('9,876.54')
  })

  it('gets initials', () => {
    expect(getInitials('John Doe')).toBe('JD')
  })
})
