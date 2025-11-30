import { describe, it, expect } from 'vitest'
import { slugify, delay, convertirTimestampGoogle, getRandomSixDigitNumber, isValidEmail, toQueryParams } from '../utils/utils'

describe('slugify', () => {
  it('should convert a simple string to lowercase with dashes', () => {
    expect(slugify('Hello World')).toBe('hello-world')
  })

  it('should replace & with -and-', () => {
    expect(slugify('Tom & Jerry')).toBe('tom-and-jerry')
  })

  it('should remove non-word characters except dashes', () => {
    expect(slugify('Hello! World?')).toBe('hello-world')
  })

  it('should replace multiple dashes with single dash', () => {
    expect(slugify('Hello   World')).toBe('hello-world')
  })

  it('should handle empty string', () => {
    expect(slugify('')).toBe('')
  })

  it('should handle special characters', () => {
    expect(slugify('Café résumé')).toBe('caf-rsum')
  })
})

describe('delay', () => {
  it('should return a promise that resolves after specified time', async () => {
    const start = Date.now()
    await delay(100)
    const elapsed = Date.now() - start
    expect(elapsed).toBeGreaterThanOrEqual(90) // Allow some tolerance
    expect(elapsed).toBeLessThan(200)
  })
})

describe('convertirTimestampGoogle', () => {
  it('should convert a Google timestamp to ISO date format', () => {
    // 1704067200 = 2024-01-01T00:00:00Z
    const result = convertirTimestampGoogle(1704067200)
    expect(result).toBe('2024-01-01')
  })

  it('should handle timestamp from different year', () => {
    // 1640995200 = 2022-01-01T00:00:00Z
    const result = convertirTimestampGoogle(1640995200)
    expect(result).toBe('2022-01-01')
  })
})

describe('getRandomSixDigitNumber', () => {
  it('should return a 6-digit number', () => {
    const num = getRandomSixDigitNumber()
    expect(num).toBeGreaterThanOrEqual(100000)
    expect(num).toBeLessThan(1000000)
  })

  it('should return different numbers on multiple calls', () => {
    const numbers = new Set()
    for (let i = 0; i < 10; i++) {
      numbers.add(getRandomSixDigitNumber())
    }
    // It's very unlikely to get 10 identical random numbers
    expect(numbers.size).toBeGreaterThan(1)
  })
})

describe('isValidEmail', () => {
  it('should return true for a valid email', () => {
    expect(isValidEmail('test@example.com')).toBe(true)
  })

  it('should return true for email with subdomain', () => {
    expect(isValidEmail('user@mail.example.com')).toBe(true)
  })

  it('should return false for email without @', () => {
    expect(isValidEmail('testexample.com')).toBe(false)
  })

  it('should return false for email without domain', () => {
    expect(isValidEmail('test@')).toBe(false)
  })

  it('should return false for email without extension', () => {
    expect(isValidEmail('test@example')).toBe(false)
  })

  it('should return false for undefined', () => {
    expect(isValidEmail(undefined)).toBe(false)
  })

  it('should return false for empty string', () => {
    expect(isValidEmail('')).toBe(false)
  })
})

describe('toQueryParams', () => {
  it('should convert key-value pairs to query string', () => {
    const result = toQueryParams('tag', ['javascript', 'typescript'])
    expect(result).toBe('tag=javascript&tag=typescript')
  })

  it('should handle single value', () => {
    const result = toQueryParams('category', ['web'])
    expect(result).toBe('category=web')
  })

  it('should handle empty values array', () => {
    const result = toQueryParams('tag', [])
    expect(result).toBe('')
  })
})
