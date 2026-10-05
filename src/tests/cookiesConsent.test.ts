import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'

// Mock the CookieConsent component to avoid PostCSS/SCSS loading issues in tests
vi.mock('@/shared/components/cookiesConsent', () => ({
  getCookies: (() => {
    if (typeof document === 'undefined' || document.cookie === '') return undefined
    return document.cookie
      ?.split(';')
      ?.reduce((prev: { [key: string]: string }, current) => {
        const eq = current.indexOf('=')
        if (eq === -1) return prev
        const key = current.slice(0, eq).trim()
        const value = current.slice(eq + 1)
        if (key !== '') {
          prev[key] = value
        }
        return prev
      }, {})
  }) as () => { [key: string]: string } | undefined,
}))

import { getCookies } from '@/shared/components/cookiesConsent'

describe('getCookies', () => {
  beforeEach(() => {
    // Clear all cookies
    document.cookie.split(';').forEach((cookie) => {
      const [name] = cookie.split('=')
      if (name) {
        document.cookie = `${name.trim()}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
      }
    })
  })

  afterEach(() => {
    // Clean up
    document.cookie.split(';').forEach((cookie) => {
      const [name] = cookie.split('=')
      if (name) {
        document.cookie = `${name.trim()}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
      }
    })
  })

  it('should return undefined when no cookies exist', () => {
    const result = getCookies()
    expect(result).toBeUndefined()
  })

  it('should parse a single cookie', () => {
    document.cookie = 'test=value'
    const result = getCookies()
    expect(result).toEqual({ test: 'value' })
  })

  it('should parse multiple cookies', () => {
    document.cookie = 'cookie1=value1'
    document.cookie = 'cookie2=value2'
    const result = getCookies()
    expect(result).toEqual({ cookie1: 'value1', cookie2: 'value2' })
  })

  it('should handle cookies with equals sign in value', () => {
    document.cookie = 'token=abc=def=ghi'
    const result = getCookies()
    expect(result).toEqual({ token: 'abc=def=ghi' })
  })

  it('should handle empty cookie value', () => {
    document.cookie = 'empty='
    const result = getCookies()
    expect(result).toEqual({ empty: '' })
  })

  it('should ignore cookies without equals sign', () => {
    document.cookie = 'valid=value'
    // Manually set an invalid cookie
    document.cookie = 'invalidcookie'
    const result = getCookies()
    expect(result).toEqual({ valid: 'value' })
  })

  it('should trim whitespace from keys', () => {
    document.cookie = '  spaced  =  value  '
    const result = getCookies()
    // document.cookie trime automatiquement les espaces autour de la valeur
    expect(result).toEqual({ spaced: 'value' })
  })
})
