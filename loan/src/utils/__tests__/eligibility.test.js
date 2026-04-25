import { describe, it, expect } from 'vitest';
import { checkEligibility } from '../eligibility';

describe('checkEligibility', () => {
  it('eligible for all loan types with strong profile', () => {
    const results = checkEligibility({
      age: 30, occupation: 'Salaried', monthlyIncome: 80000,
      creditScore: 780, loanAmount: 2000000,
    });
    expect(results).toHaveLength(4);
    const types = results.filter(r => r.eligible).map(r => r.type);
    expect(types).toContain('Personal Loan');
    expect(types).toContain('Home Loan');
    expect(types).toContain('Education Loan');
    expect(types).toContain('Vehicle Loan');
  });

  it('ineligible personal loan with low credit score', () => {
    const results = checkEligibility({
      age: 30, occupation: 'Salaried', monthlyIncome: 80000,
      creditScore: 600, loanAmount: 500000,
    });
    const personal = results.find(r => r.type === 'Personal Loan');
    expect(personal.eligible).toBe(false);
    expect(personal.reason).toContain('Credit score below 650');
  });

  it('ineligible home loan with low income', () => {
    const results = checkEligibility({
      age: 30, occupation: 'Salaried', monthlyIncome: 20000,
      creditScore: 750, loanAmount: 2000000,
    });
    const home = results.find(r => r.type === 'Home Loan');
    expect(home.eligible).toBe(false);
    expect(home.reason).toContain('income below');
  });

  it('ineligible education loan for older applicant', () => {
    const results = checkEligibility({
      age: 40, occupation: 'Salaried', monthlyIncome: 80000,
      creditScore: 750, loanAmount: 500000,
    });
    const edu = results.find(r => r.type === 'Education Loan');
    expect(edu.eligible).toBe(false);
  });

  it('max amount capped for personal loan', () => {
    const results = checkEligibility({
      age: 30, occupation: 'Salaried', monthlyIncome: 100000,
      creditScore: 750, loanAmount: 500000,
    });
    const personal = results.find(r => r.type === 'Personal Loan');
    expect(personal.maxAmount).toBeLessThanOrEqual(2500000);
  });

  it('confidence is High for credit score >= 750', () => {
    const results = checkEligibility({
      age: 30, occupation: 'Salaried', monthlyIncome: 80000,
      creditScore: 800, loanAmount: 500000,
    });
    const personal = results.find(r => r.type === 'Personal Loan');
    expect(personal.confidence).toBe('High');
  });

  it('confidence is N/A for ineligible', () => {
    const results = checkEligibility({
      age: 15, occupation: 'Student', monthlyIncome: 5000,
      creditScore: 400, loanAmount: 100000,
    });
    results.forEach(r => {
      if (!r.eligible) expect(r.confidence).toBe('N/A');
    });
  });

  it('always returns exactly 4 loan types', () => {
    const results = checkEligibility({
      age: 25, occupation: 'Salaried', monthlyIncome: 50000,
      creditScore: 700, loanAmount: 1000000,
    });
    expect(results).toHaveLength(4);
    const types = results.map(r => r.type);
    expect(types).toEqual(['Personal Loan', 'Home Loan', 'Education Loan', 'Vehicle Loan']);
  });
});
