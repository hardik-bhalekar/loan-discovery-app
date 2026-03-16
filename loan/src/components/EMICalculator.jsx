import { useState, useMemo } from 'react';
import { IndianRupee, Percent, Clock } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { calculateEMI, generateAmortization, formatCurrency } from '../utils/emiCalculator';

export default function EMICalculator() {
  const [amount, setAmount] = useState(1000000);
  const [rate, setRate] = useState(9);
  const [tenure, setTenure] = useState(5);

  const tenureMonths = tenure * 12;
  const result = useMemo(() => calculateEMI(amount, rate, tenureMonths), [amount, rate, tenureMonths]);
  const amortization = useMemo(() => generateAmortization(amount, rate, tenureMonths), [amount, rate, tenureMonths]);

  const yearlyData = useMemo(() => {
    const years = [];
    for (let y = 0; y < tenure; y++) {
      const slice = amortization.slice(y * 12, (y + 1) * 12);
      years.push({
        year: `Y${y + 1}`,
        Principal: Math.round(slice.reduce((s, m) => s + m.principalPaid, 0)),
        Interest: Math.round(slice.reduce((s, m) => s + m.interestPaid, 0)),
      });
    }
    return years;
  }, [amortization, tenure]);

  const pieData = [
    { name: 'Principal', value: amount },
    { name: 'Interest', value: result.totalInterest },
  ];

  return (
    <div className="max-w-3xl space-y-6">
      {/* ── Sliders ──── */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-sm font-semibold text-gray-800 mb-6">Adjust Parameters</h3>
        <div className="space-y-6">
          <SliderInput icon={<IndianRupee />} label="Loan Amount" value={amount}
            displayValue={formatCurrency(amount)} min={50000} max={10000000} step={50000}
            onChange={setAmount} minLabel="₹50K" maxLabel="₹1 Cr" />
          <SliderInput icon={<Percent />} label="Interest Rate" value={rate}
            displayValue={`${rate}%`} min={5} max={20} step={0.25}
            onChange={setRate} minLabel="5%" maxLabel="20%" />
          <SliderInput icon={<Clock />} label="Loan Tenure" value={tenure}
            displayValue={`${tenure} yrs`} min={1} max={30} step={1}
            onChange={setTenure} minLabel="1 yr" maxLabel="30 yrs" />
        </div>
      </div>

      {/* ── Results ──── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-blue-600 rounded-xl p-5 text-white">
          <div className="text-xs uppercase tracking-wider text-blue-100 mb-1">Monthly EMI</div>
          <div className="text-2xl font-semibold">{formatCurrency(result.emi)}</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="text-xs uppercase tracking-wider text-gray-400 mb-1">Total Interest</div>
          <div className="text-xl font-semibold text-amber-500">{formatCurrency(result.totalInterest)}</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="text-xs uppercase tracking-wider text-gray-400 mb-1">Total Payment</div>
          <div className="text-xl font-semibold text-gray-800">{formatCurrency(result.totalPayment)}</div>
        </div>
      </div>

      {/* ── Charts ──── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h4 className="text-sm font-semibold text-gray-800 mb-4">Payment Breakdown</h4>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={3} dataKey="value" stroke="none">
                  <Cell fill="#2563eb" />
                  <Cell fill="#f59e0b" />
                </Pie>
                <Tooltip formatter={(val) => formatCurrency(val)} contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '13px' }} />
                <Legend verticalAlign="bottom" iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h4 className="text-sm font-semibold text-gray-800 mb-4">Yearly Breakdown</h4>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={yearlyData.slice(0, 10)} barGap={2}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="year" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(val) => formatCurrency(val)} contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '13px' }} />
                <Bar dataKey="Principal" fill="#2563eb" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Interest" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

function SliderInput({ icon, label, value, displayValue, min, max, step, onChange, minLabel, maxLabel }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <span className="text-gray-400 [&_svg]:w-4 [&_svg]:h-4">{icon}</span>
          {label}
        </label>
        <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-lg">
          {displayValue}
        </span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(Number(e.target.value))} className="w-full" />
      <div className="flex justify-between text-xs text-gray-400 mt-1">
        <span>{minLabel}</span><span>{maxLabel}</span>
      </div>
    </div>
  );
}
