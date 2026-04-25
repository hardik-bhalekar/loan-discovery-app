import { describe, it, expect } from 'vitest';
import { toSafeNumber, formatCompactINR, formatPercent, formatYearsMonths } from '../formatters';

describe('toSafeNumber', () => {
  it('parses number', () => expect(toSafeNumber(42)).toBe(42));
  it('parses string', () => expect(toSafeNumber('1,00,000')).toBe(100000));
  it('returns fallback for NaN', () => expect(toSafeNumber('abc', 0)).toBe(0));
  it('returns 0 for null (Number(null)=0)', () => expect(toSafeNumber(null, 5)).toBe(0));
  it('returns fallback for undefined', () => expect(toSafeNumber(undefined, 10)).toBe(10));
  it('handles Infinity', () => expect(toSafeNumber(Infinity, 0)).toBe(0));
});

describe('formatCompactINR', () => {
  it('formats crores', () => expect(formatCompactINR(10000000)).toBe('Rs 1.00 Cr'));
  it('formats lakhs', () => expect(formatCompactINR(500000)).toBe('Rs 5.00 L'));
  it('formats small amounts as currency', () => {
    const result = formatCompactINR(5000);
    expect(result).toContain('5,000');
  });
});

describe('formatPercent', () => {
  it('formats percentage', () => expect(formatPercent(8.5)).toBe('8.50%'));
  it('handles zero', () => expect(formatPercent(0)).toBe('0.00%'));
});

describe('formatYearsMonths', () => {
  it('formats years only', () => expect(formatYearsMonths(24)).toBe('2 years'));
  it('formats months only', () => expect(formatYearsMonths(5)).toBe('5 months'));
  it('formats mixed', () => expect(formatYearsMonths(14)).toBe('1y 2m'));
  it('formats 1 month', () => expect(formatYearsMonths(1)).toBe('1 month'));
  it('formats 1 year', () => expect(formatYearsMonths(12)).toBe('1 year'));
});
