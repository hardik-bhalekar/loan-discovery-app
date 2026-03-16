import { Star } from 'lucide-react';
import { formatCurrency } from '../utils/emiCalculator';

export default function LoanCard({ bank }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded flex items-center justify-center text-white font-bold text-[10px]"
            style={{ backgroundColor: bank.color }}
          >
            {bank.shortName.slice(0, 2)}
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-800">{bank.bankName}</h3>
            <div className="flex items-center gap-0.5">
              <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
              <span className="text-xs text-gray-400">{bank.rating}</span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-lg font-semibold text-blue-600">{bank.interestRate}%</div>
          <div className="text-[10px] text-gray-400 uppercase">per annum</div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">Max Amount</div>
          <div className="text-sm font-medium text-gray-800">{formatCurrency(bank.maxLoanAmount)}</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">Tenure</div>
          <div className="text-sm font-medium text-gray-800">{bank.tenureRange.min}–{bank.tenureRange.max} yrs</div>
        </div>
      </div>

      {/* Features */}
      {bank.features && (
        <div className="flex flex-wrap gap-1.5">
          {bank.features.map((f) => (
            <span key={f} className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded font-medium">{f}</span>
          ))}
        </div>
      )}
    </div>
  );
}
