import { Trophy, Award, Medal, CheckCircle } from 'lucide-react';
import { formatCurrency } from '../utils/emiCalculator';

const badgeConfig = {
  'Best Match': { icon: Trophy, label: 'Best Match', bg: 'bg-amber-50', text: 'text-amber-600' },
  'Runner Up': { icon: Award, label: 'Runner Up', bg: 'bg-blue-50', text: 'text-blue-600' },
  'Great Option': { icon: Medal, label: 'Great Option', bg: 'bg-green-50', text: 'text-green-600' },
};

export default function RecommendationCard({ loan }) {
  const badge = loan.badge ? badgeConfig[loan.badge] : null;
  const BadgeIcon = badge?.icon;
  const isBest = loan.badge === 'Best Match';

  return (
    <div className={`bg-white rounded-xl shadow-sm border p-6 ${
      isBest ? 'border-2 border-blue-500' : 'border-gray-100'
    }`}>
      {/* Badge */}
      {badge && (
        <div className={`inline-flex items-center gap-1 ${badge.bg} ${badge.text} px-2.5 py-1 rounded text-xs font-semibold mb-4`}>
          <BadgeIcon className="w-3 h-3" />
          {badge.label}
        </div>
      )}

      {/* Bank name */}
      <div className="flex items-center gap-2.5 mb-4">
        <div
          className="w-8 h-8 rounded flex items-center justify-center text-white font-bold text-[10px]"
          style={{ backgroundColor: loan.color }}
        >
          {loan.shortName?.slice(0, 2) || '#'}
        </div>
        <div>
          <h3 className="text-sm font-semibold text-gray-800">{loan.bankName}</h3>
          <p className="text-xs text-gray-400">Rank #{loan.rank}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <Stat label="Interest Rate" value={`${loan.interestRate}%`} highlight />
        <Stat label="Monthly EMI" value={formatCurrency(loan.emi)} highlight />
        <Stat label="Total Repayment" value={formatCurrency(loan.totalPayment)} />
        <Stat label="Total Interest" value={formatCurrency(loan.totalInterest)} />
      </div>

      {/* Reasons */}
      <div>
        <h4 className="text-[10px] font-medium text-gray-400 uppercase tracking-wider mb-2">
          Why Recommended
        </h4>
        <ul className="space-y-1.5">
          {loan.reasons.map((reason, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-gray-500">
              <CheckCircle className="w-3 h-3 text-green-500 mt-0.5 shrink-0" />
              {reason}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Stat({ label, value, highlight }) {
  return (
    <div className="bg-gray-50 rounded-lg p-3">
      <div className="text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">{label}</div>
      <div className={`text-sm font-semibold ${highlight ? 'text-blue-600' : 'text-gray-800'}`}>{value}</div>
    </div>
  );
}
