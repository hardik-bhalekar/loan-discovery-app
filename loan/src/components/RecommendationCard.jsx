import { useState } from 'react';
import { Trophy, Award, Medal, CheckCircle, ArrowRight } from 'lucide-react';
import { formatCurrency } from '../utils/emiCalculator';
import KfsModal from './KfsModal';

const badgeConfig = {
  'Best Match': {
    icon: Trophy,
    label: 'Best Match',
    tone: 'border-amber-400/40 bg-amber-500/15 text-amber-400',
  },
  'Runner Up': {
    icon: Award,
    label: 'Runner Up',
    tone: 'border-sky-400/40 bg-sky-500/15 text-sky-400',
  },
  'Great Option': {
    icon: Medal,
    label: 'Great Option',
    tone: 'border-emerald-400/40 bg-emerald-500/15 text-emerald-400',
  },
};

export default function RecommendationCard({ loan }) {
  const badge = loan.badge ? badgeConfig[loan.badge] : null;
  const BadgeIcon = badge?.icon;
  const isBest = loan.badge === 'Best Match';
  const [showKfs, setShowKfs] = useState(false);
  const [accepted, setAccepted] = useState(false);

  return (
    <article
      className={[
        'group rounded-[1.35rem] border bg-[color-mix(in_oklab,var(--bg-card)_88%,transparent)] p-6 transition-all duration-300',
        'shadow-[0_14px_34px_rgba(7,34,59,0.10)] hover:-translate-y-1 hover:shadow-[0_24px_48px_rgba(7,34,59,0.20)]',
        isBest ? 'border-[var(--accent)]/70' : 'border-[var(--border-subtle)]',
      ].join(' ')}
    >
      {badge && (
        <div className={`mb-4 inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold ${badge.tone}`}>
          <BadgeIcon className="h-3.5 w-3.5" />
          {badge.label}
        </div>
      )}

      <div className="mb-5 flex items-center gap-3">
        <div
          className="flex h-9 w-9 items-center justify-center rounded-lg text-[10px] font-bold text-white shadow-[0_6px_14px_rgba(0,0,0,0.25)]"
          style={{ backgroundColor: loan.color }}
        >
          {loan.shortName?.slice(0, 2) || '#'}
        </div>
        <div>
          <h3 className="text-sm font-semibold text-[var(--text-primary)]">{loan.bankName}</h3>
          <p className="text-xs text-[var(--text-faint)]">Rank #{loan.rank}</p>
        </div>
      </div>

      <div className="mb-5 grid grid-cols-2 gap-3">
        <Stat label="Interest Rate" value={`${loan.interestRate}%`} highlight />
        <Stat label="Monthly EMI" value={formatCurrency(loan.emi)} highlight />
        <Stat label="Total Repayment" value={formatCurrency(loan.totalPayment)} />
        <Stat label="Total Interest" value={formatCurrency(loan.totalInterest)} />
      </div>

      <div>
        <h4 className="mb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--text-faint)]">
          Why Recommended
        </h4>
        <ul className="space-y-1.5">
          {loan.reasons.map((reason, i) => (
            <li key={i} className="flex items-start gap-2 text-xs leading-5 text-[var(--text-muted)]">
              <CheckCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" />
              {reason}
            </li>
          ))}
        </ul>
      </div>
      
      <div className="mt-5">
        <button 
          onClick={() => setShowKfs(true)}
          disabled={accepted}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[var(--accent)] text-white text-sm font-semibold hover:bg-[var(--accent-strong)] transition-all shadow-lg active:scale-[0.98] disabled:opacity-50 disabled:bg-emerald-600 disabled:cursor-not-allowed"
        >
          {accepted ? 'Application Started' : 'Apply Now'}
          {!accepted && <ArrowRight className="w-4 h-4" />}
        </button>
      </div>

      {showKfs && (
        <KfsModal 
          loan={loan} 
          onClose={() => setShowKfs(false)} 
          onAccept={(acceptedLoan) => {
            setShowKfs(false);
            setAccepted(true);
            alert(`Application started for ${acceptedLoan.bankName}!`);
          }}
        />
      )}
    </article>
  );
}

function Stat({ label, value, highlight }) {
  return (
    <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)]/55 p-3 shadow-[0_8px_18px_rgba(7,34,59,0.06)]">
      <div className="mb-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--text-faint)]">{label}</div>
      <div className={`text-sm font-semibold ${highlight ? 'text-[var(--accent)]' : 'text-[var(--text-primary)]'}`}>{value}</div>
    </div>
  );
}
