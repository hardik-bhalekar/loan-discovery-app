/**
 * Determine eligible loan types based on user profile
 */
export function checkEligibility(profile) {
  const results = [];

  const { age, occupation, monthlyIncome, creditScore, loanAmount } = profile;

  // Personal Loan
  if (age >= 21 && age <= 60 && creditScore >= 650 && monthlyIncome >= 15000) {
    results.push({
      type: 'Personal Loan',
      eligible: true,
      maxAmount: Math.min(monthlyIncome * 30, 2500000),
      reason: 'You meet the income, age, and credit score requirements.',
      confidence: creditScore >= 750 ? 'High' : creditScore >= 700 ? 'Medium' : 'Low',
    });
  } else {
    results.push({
      type: 'Personal Loan',
      eligible: false,
      reason: creditScore < 650
        ? 'Credit score below 650 required minimum.'
        : monthlyIncome < 15000
        ? 'Monthly income below ₹15,000 minimum.'
        : 'Age must be between 21-60.',
      confidence: 'N/A',
    });
  }

  // Home Loan
  if (age >= 21 && age <= 65 && creditScore >= 700 && monthlyIncome >= 25000) {
    results.push({
      type: 'Home Loan',
      eligible: true,
      maxAmount: Math.min(monthlyIncome * 60, 50000000),
      reason: 'Strong financial profile for home loan approval.',
      confidence: creditScore >= 750 ? 'High' : 'Medium',
    });
  } else {
    results.push({
      type: 'Home Loan',
      eligible: false,
      reason: creditScore < 700
        ? 'Credit score below 700 required minimum.'
        : monthlyIncome < 25000
        ? 'Monthly income below ₹25,000 minimum.'
        : 'Age must be between 21-65.',
      confidence: 'N/A',
    });
  }

  // Education Loan
  if (age >= 18 && age <= 35) {
    results.push({
      type: 'Education Loan',
      eligible: true,
      maxAmount: 7500000,
      reason: 'Education loans available for students and young professionals.',
      confidence: creditScore >= 700 ? 'High' : 'Medium',
    });
  } else {
    results.push({
      type: 'Education Loan',
      eligible: false,
      reason: 'Age must be between 18-35 for education loans.',
      confidence: 'N/A',
    });
  }

  // Vehicle Loan
  if (age >= 21 && age <= 65 && creditScore >= 650 && monthlyIncome >= 20000) {
    results.push({
      type: 'Vehicle Loan',
      eligible: true,
      maxAmount: Math.min(monthlyIncome * 24, 10000000),
      reason: 'You qualify for vehicle financing.',
      confidence: creditScore >= 750 ? 'High' : creditScore >= 700 ? 'Medium' : 'Low',
    });
  } else {
    results.push({
      type: 'Vehicle Loan',
      eligible: false,
      reason: creditScore < 650
        ? 'Credit score below 650 required minimum.'
        : monthlyIncome < 20000
        ? 'Monthly income below ₹20,000 minimum.'
        : 'Age must be between 21-65.',
      confidence: 'N/A',
    });
  }

  return results;
}
