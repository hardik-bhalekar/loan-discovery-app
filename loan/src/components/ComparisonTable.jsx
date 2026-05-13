import { useMemo, useState, useEffect } from 'react';
import { ExternalLink, Star, RefreshCw, Wifi, WifiOff } from 'lucide-react';
import { bankData as staticBankData } from '../data/bankData';
import { getLiveBankData } from '../services/bankDataService';
import { calculateEMI, formatCurrency } from '../utils/emiCalculator';
import { formatCompactINR } from '../utils/formatters';

export default function ComparisonTable({ loanAmount = 1000000, tenure = 5, selectedTypes = [] }) {
  const [bankData, setBankData] = useState(staticBankData);
  const [dataSource, setDataSource] = useState('static');
  const [lastUpdated, setLastUpdated] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function loadLiveRates() {
      setLoading(true);
      try {
        const result = await getLiveBankData();
        if (!cancelled) {
          setBankData(result.data);
          setDataSource(result.source);
          setLastUpdated(result.lastUpdated);
        }
      } catch {
        // Fallback already handled by service
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    loadLiveRates();
    return () => { cancelled = true; };
  }, []);

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
  }, [loanAmount, tenure, selectedTypes, bankData]);

  const formattedDate = lastUpdated
    ? new Date(lastUpdated).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    : null;

  return (
    <div className="table-frame">
      {/* Live rates status bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '8px 16px',
        borderBottom: '1px solid var(--border-subtle)',
        fontSize: '11px',
        color: 'var(--text-faint)',
        background: 'color-mix(in oklab, var(--bg-secondary) 60%, transparent)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {loading ? (
            <RefreshCw className="h-3 w-3 animate-spin" style={{ color: 'var(--accent)' }} />
          ) : dataSource === 'live' ? (
            <Wifi className="h-3 w-3" style={{ color: '#22c55e' }} />
          ) : (
            <WifiOff className="h-3 w-3" style={{ color: '#f59e0b' }} />
          )}
          <span>
            {loading
              ? 'Fetching live rates…'
              : dataSource === 'live'
                ? 'Live rates from BankBazaar'
                : 'Using cached rates'}
          </span>
        </div>
        {formattedDate && !loading && (
          <span>Last updated: {formattedDate}</span>
        )}
      </div>

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
                          {bank.liveData && (
                            <>
                              <span>•</span>
                              <span style={{ color: '#22c55e', fontWeight: 600 }}>LIVE</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-4 text-sm text-[var(--text-primary)]">
                    <span className="luxury-chip rounded-full px-2.5 py-1 text-xs font-semibold text-[var(--text-muted)]">
                      {bank.loanType}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-sm font-semibold text-[var(--accent)]">
                    {bank.interestRate}%
                    {bank.interestRateMax && bank.interestRateMax !== bank.interestRate && (
                      <span className="text-xs text-[var(--text-faint)]"> – {bank.interestRateMax}%</span>
                    )}
                  </td>

                  <td className="px-5 py-4 text-sm font-semibold text-[var(--text-primary)]">{formatCurrency(bank.emi)}</td>

                  <td className="px-5 py-4 text-sm text-[var(--text-muted)]">
                    {bank.processingFeeText || `${bank.processingFee}% (${formatCurrency(bank.processingFeeAmount)})`}
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

