import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { formatDate } from '@/app/utils/formatDate'

describe('formatDate', () => {
  beforeEach(() => {
    // Mock current date to 2024-06-15
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-06-15T12:00:00'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should format date without relative time by default', () => {
    const result = formatDate('2024-05-10')
    expect(result).toBe('10 mai 2024')
  })

  it('should handle date with time (ISO format)', () => {
    const result = formatDate('2024-05-10T14:30:00')
    expect(result).toBe('10 mai 2024')
  })

  it('should include relative time when requested', () => {
    const result = formatDate('2024-06-10', true)
    expect(result).toContain('10 juin 2024')
    expect(result).toContain('Il y a 5 jours')
  })

  it('should show "Today" for current date', () => {
    const result = formatDate('2024-06-15', true)
    expect(result).toContain('Today')
  })

  it('should show months ago when more than 30 days', () => {
    const result = formatDate('2024-05-01', true)
    expect(result).toContain('Il y a 1 mois')
  })

  it('should show years ago when more than a year', () => {
    const result = formatDate('2023-01-15', true)
    expect(result).toContain('il y a 1 an')
  })
})
