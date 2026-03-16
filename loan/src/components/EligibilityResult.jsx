import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { checkEligibility } from '../utils/eligibility';
import { formatCurrency } from '../utils/emiCalculator';

export default function EligibilityResult({ profile }) {
  const results = checkEligibility(profile);
  const eligible = results.filter((r) => r.eligible);
  const notEligible = results.filter((r) => !r.eligible);

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="bg-blue-600 rounded-xl p-5 text-white">
        <h3 className="text-sm font-semibold mb-1">Eligibility Summary</h3>
        <p className="text-sm text-blue-100">
          You are eligible for <span className="font-bold text-white">{eligible.length}</span> out of{' '}
          <span className="font-bold text-white">{results.length}</span> loan types.
        </p>
      </div>

      {/* Eligible */}
      {eligible.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-4 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-500" /> Eligible For
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {eligible.map((item) => (
              <div key={item.type} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-semibold text-gray-800">{item.type}</h4>
                  <span className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded font-medium">
                    <CheckCircle className="w-3 h-3" /> Eligible
                  </span>
                </div>
                <p className="text-sm text-gray-500 mb-4">{item.reason}</p>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">Max Amount</span>
                    <div className="text-lg font-semibold text-gray-800">{formatCurrency(item.maxAmount)}</div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded font-medium ${
                    item.confidence === 'High' ? 'bg-green-50 text-green-600 border border-green-100' :
                    item.confidence === 'Medium' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                    'bg-orange-50 text-orange-500 border border-orange-100'
                  }`}>
                    {item.confidence} Confidence
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Not Eligible */}
      {notEligible.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-4 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-gray-400" /> Not Eligible
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {notEligible.map((item) => (
              <div key={item.type} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 opacity-60">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-gray-500">{item.type}</h4>
                  <span className="flex items-center gap-1 text-xs text-red-400 bg-red-50 px-2 py-0.5 rounded font-medium">
                    <XCircle className="w-3 h-3" /> Not Eligible
                  </span>
                </div>
                <p className="text-sm text-gray-400">{item.reason}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
