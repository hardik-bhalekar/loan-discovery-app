/**
 * Calculate EMI using the standard formula:
 * EMI = P × r × (1 + r)^n / ((1 + r)^n - 1)
 *
 * @param {number} principal - Loan amount
 * @param {number} annualRate - Annual interest rate (%)
 * @param {number} tenureMonths - Tenure in months
 * @returns {{ emi: number, totalInterest: number, totalPayment: number }}
 */
export function calculateEMI(principal, annualRate, tenureMonths) {
  if (principal <= 0 || annualRate <= 0 || tenureMonths <= 0) {
    return { emi: 0, totalInterest: 0, totalPayment: 0 };
  }

  const monthlyRate = annualRate / 12 / 100;
  const factor = Math.pow(1 + monthlyRate, tenureMonths);
  const emi = (principal * monthlyRate * factor) / (factor - 1);
  const totalPayment = emi * tenureMonths;
  const totalInterest = totalPayment - principal;

  return {
    emi: Math.round(emi),
    totalInterest: Math.round(totalInterest),
    totalPayment: Math.round(totalPayment),
  };
}

/**
 * Generate monthly amortization schedule
 */
export function generateAmortization(principal, annualRate, tenureMonths) {
  const monthlyRate = annualRate / 12 / 100;
  const { emi } = calculateEMI(principal, annualRate, tenureMonths);

  let balance = principal;
  const schedule = [];

  for (let month = 1; month <= tenureMonths; month++) {
    const interestPaid = Math.round(balance * monthlyRate);
    const principalPaid = emi - interestPaid;
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
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)} Cr`;
  }
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)} L`;
  }
  return `₹${amount.toLocaleString('en-IN')}`;
}
