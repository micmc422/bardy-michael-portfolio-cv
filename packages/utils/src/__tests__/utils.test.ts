import { describe, it, expect } from 'vitest';
import { 
  slugify, 
  convertirTimestampGoogle, 
  getRandomSixDigitNumber, 
  isValidEmail, 
  toQueryParams 
} from '../utils';

describe('slugify', () => {
  it('should convert a simple string to slug', () => {
    expect(slugify('Hello World')).toBe('hello-world');
  });

  it('should replace & with -and-', () => {
    expect(slugify('Salt & Pepper')).toBe('salt-and-pepper');
  });

  it('should remove special characters', () => {
    expect(slugify('Hello! World?')).toBe('hello-world');
  });

  it('should handle multiple spaces', () => {
    expect(slugify('Hello   World')).toBe('hello-world');
  });

  it('should handle already slugified strings', () => {
    expect(slugify('hello-world')).toBe('hello-world');
  });

  it('should handle French accented characters', () => {
    expect(slugify('Création de site')).toBe('cration-de-site');
  });
});

describe('convertirTimestampGoogle', () => {
  it('should convert a timestamp to ISO date string', () => {
    // January 15, 2024 at midnight UTC
    const timestamp = 1705276800;
    expect(convertirTimestampGoogle(timestamp)).toBe('2024-01-15');
  });

  it('should handle different timestamps', () => {
    // December 25, 2023
    const timestamp = 1703462400;
    expect(convertirTimestampGoogle(timestamp)).toBe('2023-12-25');
  });
});

describe('getRandomSixDigitNumber', () => {
  it('should return a 6-digit number', () => {
    const result = getRandomSixDigitNumber();
    expect(result).toBeGreaterThanOrEqual(100000);
    expect(result).toBeLessThanOrEqual(999999);
  });

  it('should return different values on multiple calls', () => {
    const results = new Set<number>();
    for (let i = 0; i < 10; i++) {
      results.add(getRandomSixDigitNumber());
    }
    // At least some should be different
    expect(results.size).toBeGreaterThan(1);
  });
});

describe('isValidEmail', () => {
  it('should return true for valid emails', () => {
    expect(isValidEmail('test@example.com')).toBe(true);
    expect(isValidEmail('user.name@domain.fr')).toBe(true);
    expect(isValidEmail('user+tag@example.org')).toBe(true);
  });

  it('should return false for invalid emails', () => {
    expect(isValidEmail('invalid')).toBe(false);
    expect(isValidEmail('invalid@')).toBe(false);
    expect(isValidEmail('@domain.com')).toBe(false);
    expect(isValidEmail('test@domain')).toBe(false);
  });

  it('should return false for undefined or empty', () => {
    expect(isValidEmail(undefined)).toBe(false);
    expect(isValidEmail('')).toBe(false);
  });
});

describe('toQueryParams', () => {
  it('should convert values to query params', () => {
    const result = toQueryParams('tag', ['web', 'design']);
    expect(result).toBe('tag=web&tag=design');
  });

  it('should handle single value', () => {
    const result = toQueryParams('category', ['portfolio']);
    expect(result).toBe('category=portfolio');
  });

  it('should handle empty array', () => {
    const result = toQueryParams('tag', []);
    expect(result).toBe('');
  });
});
