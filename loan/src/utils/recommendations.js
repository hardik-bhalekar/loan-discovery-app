import { bankData } from '../data/bankData';
import { calculateEMI } from './emiCalculator';

/**
 * Score and rank banks based on user profile to produce recommendations.
 * Lower score = better.
 */
export function getRecommendations(profile) {
  const { loanAmount, tenure, creditScore, monthlyIncome } = profile;
  const tenureMonths = (tenure || 5) * 12;

  const scored = bankData
    .filter((bank) => loanAmount <= bank.maxLoanAmount)
    .map((bank) => {
      const { emi, totalInterest, totalPayment } = calculateEMI(
        loanAmount,
        bank.interestRate,
        tenureMonths
      );

      // Affordability ratio — EMI shouldn't exceed 40% of income
      const affordabilityRatio = emi / monthlyIncome;
      const affordable = affordabilityRatio <= 0.4;

      // Scoring: weighted sum (lower is better)
      let score = 0;
      score += bank.interestRate * 10;                   // prefer lower rates
      score += bank.processingFee * 5;                   // prefer lower fees
      score += affordable ? 0 : 30;                      // penalty if unaffordable
      score -= bank.rating * 3;                          // prefer higher ratings
      score += (bank.tenureRange.max < tenure ? 20 : 0); // penalty if tenure exceeds max

      const reasons = [];
      if (bank.interestRate <= 9.0) reasons.push('Competitive interest rate');
      if (bank.processingFee <= 0.75) reasons.push('Low processing fee');
      if (bank.rating >= 4.5) reasons.push('Highly rated bank');
      if (affordable) reasons.push('Affordable EMI within 40% of income');
      if (bank.tenureRange.max >= tenure) reasons.push('Flexible tenure options');

      return {
        ...bank,
        emi,
        totalInterest,
        totalPayment,
        tenure: tenure || 5,
        tenureMonths,
        affordable,
        score,
        reasons: reasons.length > 0 ? reasons : ['Standard loan offering'],
      };
    })
    .sort((a, b) => a.score - b.score);

  return scored.map((bank, index) => ({
    ...bank,
    rank: index + 1,
    badge: index === 0 ? 'Best Match' : index === 1 ? 'Runner Up' : index === 2 ? 'Great Option' : null,
  }));
}
