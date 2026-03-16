import { Star } from 'lucide-react';
import { calculateEMI, formatCurrency } from '../utils/emiCalculator';
import bankData from '../data/bankData';

export default function ComparisonTable({ loanAmount = 1000000, tenure = 5 }) {
  const tenureMonths = tenure * 12;

  const rows = bankData.map((bank) => {
    const { emi, totalInterest, totalPayment } = calculateEMI(loanAmount, bank.interestRate, tenureMonths);
    return { ...bank, emi, totalInterest, totalPayment };
  });

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
      <table className="w-full min-w-[640px]">
        <thead>
          <tr className="border-b border-gray-100">
            {['Bank', 'Interest Rate', 'EMI', 'Tenure', 'Processing Fee', 'Total Cost'].map((h) => (
              <th key={h} className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-5 py-3">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((bank) => (
            <tr key={bank.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
              <td className="px-5 py-3.5">
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-7 h-7 rounded flex items-center justify-center text-white text-[10px] font-bold"
                    style={{ backgroundColor: bank.color }}
                  >
                    {bank.shortName.slice(0, 2)}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-800">{bank.shortName}</div>
                    <div className="flex items-center gap-0.5">
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                      <span className="text-[10px] text-gray-400">{bank.rating}</span>
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-5 py-3.5 text-sm font-semibold text-blue-600">{bank.interestRate}%</td>
              <td className="px-5 py-3.5 text-sm font-medium text-gray-800">{formatCurrency(bank.emi)}</td>
              <td className="px-5 py-3.5 text-sm text-gray-500">{bank.tenureRange.min}–{bank.tenureRange.max} yrs</td>
              <td className="px-5 py-3.5">
                <span className="text-xs bg-amber-50 text-amber-600 px-2 py-0.5 rounded font-medium">{bank.processingFee}%</span>
              </td>
              <td className="px-5 py-3.5 text-sm font-medium text-gray-800">{formatCurrency(bank.totalPayment)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
