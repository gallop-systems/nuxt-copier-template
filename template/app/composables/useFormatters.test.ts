import { describe, it, expect } from 'vitest'
import { useFormatters } from './useFormatters'

describe('useFormatters', () => {
  const { formatDate, formatCurrency, getInitials } = useFormatters()

  it('formats date correctly', () => {
    expect(formatDate('2025-01-15')).toContain('Jan')
    expect(formatDate('2025-01-15')).toContain('15')
  })

  it('formats currency', () => {
    expect(formatCurrency(100)).toBe('$100.00')
  })

  it('gets initials', () => {
    expect(getInitials('John Doe')).toBe('JD')
  })
})
