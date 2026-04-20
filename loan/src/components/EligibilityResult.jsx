import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { checkEligibility } from '../utils/eligibility';
import { formatCurrency } from '../utils/emiCalculator';
import PremiumCard from './ui/PremiumCard';

export default function EligibilityResult({ profile }) {
  const results = checkEligibility(profile);
  const eligible = results.filter((r) => r.eligible);
  const notEligible = results.filter((r) => !r.eligible);

  return (
    <div className="space-y-6">
      <div className="luxury-panel rounded-[1.4rem] p-5">
        <h3 className="text-base font-semibold text-[var(--text-primary)]">Eligibility Summary</h3>
        <p className="mt-1 text-sm text-[var(--text-muted)]">
          You are eligible for{' '}
          <span className="text-base font-bold text-[var(--text-primary)]">{eligible.length}</span> out of{' '}
          <span className="text-base font-bold text-[var(--text-primary)]">{results.length}</span> loan types.
        </p>
      </div>

      {eligible.length > 0 && (
        <div>
          <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-[var(--text-muted)]">
            <CheckCircle className="h-4 w-4 text-emerald-500" /> Eligible For
          </h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:gap-5">
            {eligible.map((item) => (
              <PremiumCard
                key={item.type}
                className="h-full p-5"
              >
                <div className="mb-3 flex items-start justify-between gap-3">
                  <h4 className="text-base font-semibold text-[var(--text-primary)]">{item.type}</h4>
                  <span className="inline-flex items-center gap-1 rounded-full border border-emerald-400/40 bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-500">
                    <CheckCircle className="h-3.5 w-3.5" /> Eligible
                  </span>
                </div>
                <p className="mb-4 text-sm leading-6 text-[var(--text-muted)]">{item.reason}</p>

                <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)]/55 p-3.5">
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--text-faint)]">Max Amount</span>
                    <span className={`rounded-full border px-2 py-1 text-[10px] font-semibold ${
                      item.confidence === 'High'
                        ? 'border-emerald-400/40 bg-emerald-500/10 text-emerald-500'
                        : item.confidence === 'Medium'
                          ? 'border-amber-400/40 bg-amber-500/10 text-amber-500'
                          : 'border-orange-400/40 bg-orange-500/10 text-orange-500'
                    }`}>
                      {item.confidence} Confidence
                    </span>
                  </div>
                  <div className="text-xl font-bold text-[var(--text-primary)]">{formatCurrency(item.maxAmount)}</div>
                </div>
              </PremiumCard>
            ))}
          </div>
        </div>
      )}

      {notEligible.length > 0 && (
        <div>
          <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-[var(--text-muted)]">
            <AlertCircle className="h-4 w-4 text-[var(--text-faint)]" /> Not Eligible
          </h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:gap-5">
            {notEligible.map((item) => (
              <PremiumCard key={item.type} className="p-5 opacity-75" hover={false}>
                <div className="mb-2 flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-[var(--text-muted)]">{item.type}</h4>
                  <span className="inline-flex items-center gap-1 rounded-full border border-rose-400/35 bg-rose-500/10 px-2 py-1 text-xs font-semibold text-rose-500">
                    <XCircle className="h-3.5 w-3.5" /> Not Eligible
                  </span>
                </div>
                <p className="text-sm text-[var(--text-faint)]">{item.reason}</p>
              </PremiumCard>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
