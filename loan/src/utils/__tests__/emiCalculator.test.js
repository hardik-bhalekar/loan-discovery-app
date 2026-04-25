import { describe, it, expect } from 'vitest';
import { calculateEMI, generateAmortization } from '../emiCalculator';

describe('calculateEMI', () => {
  // EMI-01: Standard calculation
  it('calculates standard EMI correctly', () => {
    const result = calculateEMI(1000000, 8.5, 240);
    expect(result.emi).toBeGreaterThan(8000);
    expect(result.emi).toBeLessThan(9000);
    expect(result.totalInterest).toBeGreaterThan(0);
    expect(Math.abs(result.totalPayment - result.emi * 240)).toBeLessThan(500);
  });

  // EMI-02: Zero interest rate
  it('handles zero interest rate', () => {
    const result = calculateEMI(1200000, 0, 120);
    expect(result.emi).toBe(10000);
    expect(result.totalInterest).toBe(0);
    expect(result.totalPayment).toBe(1200000);
  });

  // EMI-03: Very short tenure
  it('handles short tenure (12 months)', () => {
    const result = calculateEMI(500000, 10, 12);
    expect(result.emi).toBeGreaterThan(0);
    expect(result.totalPayment).toBeGreaterThan(500000);
  });

  // EMI-04: Very long tenure
  it('handles long tenure (360 months)', () => {
    const result = calculateEMI(5000000, 7, 360);
    expect(result.emi).toBeGreaterThan(0);
    expect(result.totalPayment).toBeGreaterThan(5000000);
  });

  // EMI-05: Small loan amount
  it('handles small loan amount', () => {
    const result = calculateEMI(10000, 12, 6);
    expect(result.emi).toBeGreaterThan(0);
  });

  // Edge: zero principal
  it('returns zero for zero principal', () => {
    const result = calculateEMI(0, 10, 120);
    expect(result.emi).toBe(0);
    expect(result.totalInterest).toBe(0);
  });

  // Edge: zero tenure
  it('returns zero for zero tenure', () => {
    const result = calculateEMI(1000000, 10, 0);
    expect(result.emi).toBe(0);
  });

  // Edge: negative values
  it('handles negative inputs gracefully', () => {
    const result = calculateEMI(-100, 10, 12);
    expect(result.emi).toBe(0);
  });

  // Edge: string inputs
  it('handles string inputs via toSafeNumber', () => {
    const result = calculateEMI('1000000', '8.5', '240');
    expect(result.emi).toBeGreaterThan(0);
  });
});

describe('generateAmortization', () => {
  it('generates correct schedule length', () => {
    const schedule = generateAmortization(1000000, 8.5, 24);
    expect(schedule.length).toBe(24);
  });

  it('ends with near-zero balance', () => {
    const schedule = generateAmortization(500000, 10, 60);
    const last = schedule[schedule.length - 1];
    expect(last.balance).toBeLessThanOrEqual(1);
  });

  it('returns empty for zero principal', () => {
    expect(generateAmortization(0, 10, 12)).toEqual([]);
  });
});
