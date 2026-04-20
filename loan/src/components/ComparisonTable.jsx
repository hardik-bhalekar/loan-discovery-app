import { useMemo } from 'react';
import { ExternalLink, Star } from 'lucide-react';
import bankData from '../data/bankData';
import { calculateEMI, formatCurrency } from '../utils/emiCalculator';
import { formatCompactINR } from '../utils/formatters';

export default function ComparisonTable({ loanAmount = 1000000, tenure = 5, selectedTypes = [] }) {
  const rows = useMemo(() => {
    const principal = Number(loanAmount) || 0;
    const tenureYears = Number(tenure) || 0;
    const tenureMonths = tenureYears * 12;

    const filteredBanks = selectedTypes.length
      ? bankData.filter((bank) => selectedTypes.includes(bank.loanType))
      : bankData;

    return filteredBanks
      .map((bank) => {
        const { emi, totalPayment } = calculateEMI(principal, bank.interestRate, tenureMonths);
        const processingFeeAmount = Math.round((principal * (Number(bank.processingFee) || 0)) / 100);
        const totalCost = totalPayment + processingFeeAmount;

        return {
          ...bank,
          emi,
          totalPayment,
          processingFeeAmount,
          totalCost,
        };
      })
      .sort((a, b) => a.emi - b.emi);
  }, [loanAmount, tenure, selectedTypes]);

  return (
    <div className="table-frame">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[920px]">
          <thead className="sticky top-0 z-10">
            <tr className="border-b border-[var(--border-subtle)] bg-[color-mix(in_oklab,var(--bg-secondary)_82%,var(--bg-card)_18%)] backdrop-blur">
              {['Bank', 'Loan Type', 'Interest Rate', 'EMI', 'Processing Fee', 'Total Cost', 'Action'].map((heading) => (
                <th
                  key={heading}
                  className="px-5 py-3.5 text-left text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--text-faint)]"
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-5 py-12 text-center text-sm text-[var(--text-muted)]">
                  No lenders found for selected loan type filters.
                </td>
              </tr>
            ) : (
              rows.map((bank, index) => (
                <tr key={bank.id} className={["align-top transition-colors duration-200", index % 2 === 0 ? 'bg-transparent' : 'bg-[color-mix(in_oklab,var(--bg-secondary)_20%,transparent)]', 'hover:bg-[color-mix(in_oklab,var(--bg-secondary)_60%,var(--bg-card)_40%)]'].join(' ')}>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-[10px] font-bold text-white shadow-[0_6px_14px_rgba(0,0,0,0.25)]"
                        style={{ backgroundColor: bank.color }}
                      >
                        {bank.shortName.slice(0, 2)}
                      </div>
                      <div>
                        <a
                          href={bank.redirectUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--text-primary)] transition-colors hover:text-[var(--accent)]"
                        >
                          {bank.bankName}
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                        <div className="mt-0.5 flex items-center gap-1 text-[10px] text-[var(--text-faint)]">
                          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                          <span>{bank.rating}</span>
                          <span>•</span>
                          <span>Max {formatCompactINR(bank.maxLoanAmount)}</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-4 text-sm text-[var(--text-primary)]">
                    <span className="luxury-chip rounded-full px-2.5 py-1 text-xs font-semibold text-[var(--text-muted)]">
                      {bank.loanType}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-sm font-semibold text-[var(--accent)]">{bank.interestRate}%</td>

                  <td className="px-5 py-4 text-sm font-semibold text-[var(--text-primary)]">{formatCurrency(bank.emi)}</td>

                  <td className="px-5 py-4 text-sm text-[var(--text-muted)]">
                    {bank.processingFee}% ({formatCurrency(bank.processingFeeAmount)})
                  </td>

                  <td className="px-5 py-4 text-sm font-semibold text-[var(--text-primary)]">{formatCurrency(bank.totalCost)}</td>

                  <td className="px-5 py-4">
                    <a
                      href={bank.applyUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center rounded-full border border-[var(--accent)] bg-[var(--accent)] px-3.5 py-2 text-xs font-semibold text-white shadow-[0_12px_22px_rgba(15,118,110,0.24)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[var(--accent-strong)] hover:shadow-[0_16px_28px_rgba(15,118,110,0.32)]"
                    >
                      Apply
                    </a>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
