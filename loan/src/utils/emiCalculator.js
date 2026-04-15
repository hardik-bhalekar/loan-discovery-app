import { formatCompactINR, toSafeNumber } from './formatters';

/**
 * EMI = P * r * (1+r)^n / ((1+r)^n - 1)
 */
export function calculateEMI(principal, annualRate, tenureMonths) {
  const p = Math.max(0, toSafeNumber(principal, 0));
  const annual = Math.max(0, toSafeNumber(annualRate, 0));
  const n = Math.max(0, Math.round(toSafeNumber(tenureMonths, 0)));

  if (p <= 0 || n <= 0) {
    return { emi: 0, totalInterest: 0, totalPayment: 0, monthlyRate: 0 };
  }

  const monthlyRate = annual / 12 / 100;
  const emi = monthlyRate === 0
    ? p / n
    : (p * monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1);

  const totalPayment = emi * n;
  const totalInterest = totalPayment - p;

  return {
    emi: Math.round(emi),
    totalInterest: Math.max(0, Math.round(totalInterest)),
    totalPayment: Math.round(totalPayment),
    monthlyRate,
  };
}

/**
 * Generate monthly amortization schedule
 */
export function generateAmortization(principal, annualRate, tenureMonths) {
  const p = Math.max(0, toSafeNumber(principal, 0));
  const annual = Math.max(0, toSafeNumber(annualRate, 0));
  const n = Math.max(0, Math.round(toSafeNumber(tenureMonths, 0)));

  if (p <= 0 || n <= 0) return [];

  const monthlyRate = annual / 12 / 100;
  const { emi } = calculateEMI(p, annual, n);

  let balance = p;
  const schedule = [];

  for (let month = 1; month <= n; month++) {
    const interestPaid = Math.round(monthlyRate === 0 ? 0 : balance * monthlyRate);
    const principalPaid = Math.min(balance, Math.max(0, emi - interestPaid));
    balance = Math.max(0, balance - principalPaid);

    schedule.push({
      month,
      emi,
      principalPaid,
      interestPaid,
      balance: Math.round(balance),
    });
  }

  return schedule;
}

/**
 * Format currency in Indian format
 */
export function formatCurrency(amount) {
  return formatCompactINR(amount);
}
