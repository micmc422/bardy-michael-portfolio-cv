import { describe, it, expect } from 'vitest'
import { isValidUrl, normalizeUrl } from '@/core/utils/urlUtils'

describe('isValidUrl', () => {
  it('should return true for valid https URL', () => {
    expect(isValidUrl('https://example.com')).toBe(true)
  })

  it('should return true for valid http URL', () => {
    expect(isValidUrl('http://example.com')).toBe(true)
  })

  it('should return true for URL with path', () => {
    expect(isValidUrl('https://example.com/path/to/page')).toBe(true)
  })

  it('should return true for URL with query params', () => {
    expect(isValidUrl('https://example.com?foo=bar&baz=qux')).toBe(true)
  })

  it('should return true for URL with port', () => {
    expect(isValidUrl('https://example.com:8080')).toBe(true)
  })

  it('should return false for invalid URL', () => {
    expect(isValidUrl('not-a-url')).toBe(false)
  })

  it('should return false for URL without protocol', () => {
    expect(isValidUrl('example.com')).toBe(false)
  })

  it('should return false for ftp protocol', () => {
    expect(isValidUrl('ftp://example.com')).toBe(false)
  })

  it('should return false for empty string', () => {
    expect(isValidUrl('')).toBe(false)
  })

  it('should return false for whitespace only', () => {
    expect(isValidUrl('   ')).toBe(false)
  })
})

describe('normalizeUrl', () => {
  it('should add https:// if protocol missing', () => {
    expect(normalizeUrl('example.com')).toBe('https://example.com/')
  })

  it('should keep existing https:// protocol', () => {
    expect(normalizeUrl('https://example.com')).toBe('https://example.com/')
  })

  it('should keep existing http:// protocol', () => {
    expect(normalizeUrl('http://example.com')).toBe('http://example.com/')
  })

  it('should handle URL with path', () => {
    expect(normalizeUrl('example.com/path')).toBe('https://example.com/path')
  })

  it('should handle URL with query params', () => {
    expect(normalizeUrl('example.com?foo=bar')).toBe('https://example.com/?foo=bar')
  })

  it('should handle URL with port', () => {
    expect(normalizeUrl('example.com:8080')).toBe('https://example.com:8080/')
  })

  it('should handle invalid URL gracefully', () => {
    expect(normalizeUrl('not a url')).toBe('https://not a url')
  })

  it('should handle empty string', () => {
    expect(normalizeUrl('')).toBe('https://')
  })
})
