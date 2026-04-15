import { useState, useMemo } from 'react';
import { IndianRupee, Percent, Clock } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { calculateEMI, generateAmortization, formatCurrency } from '../utils/emiCalculator';

export default function EMICalculator({ initialAmount = 1000000, initialTenure = 5 }) {
  const [amount, setAmount] = useState(initialAmount);
  const [rate, setRate] = useState(9);
  const [tenure, setTenure] = useState(initialTenure);

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
      <div className="rounded-xl border border-[var(--border-medium)] bg-[var(--bg-card)] p-6 shadow-sm">
        <h3 className="mb-6 text-sm font-semibold text-[var(--text-primary)]">Adjust Parameters</h3>
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
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl bg-[var(--accent)] p-5 text-white">
          <div className="mb-1 text-xs uppercase tracking-wider text-white/75">Monthly EMI</div>
          <div className="text-2xl font-semibold">{formatCurrency(result.emi)}</div>
        </div>
        <div className="rounded-xl border border-[var(--border-medium)] bg-[var(--bg-card)] p-5 shadow-sm">
          <div className="mb-1 text-xs uppercase tracking-wider text-[var(--text-faint)]">Total Interest</div>
          <div className="text-xl font-semibold text-amber-500">{formatCurrency(result.totalInterest)}</div>
        </div>
        <div className="rounded-xl border border-[var(--border-medium)] bg-[var(--bg-card)] p-5 shadow-sm">
          <div className="mb-1 text-xs uppercase tracking-wider text-[var(--text-faint)]">Total Payment</div>
          <div className="text-xl font-semibold text-[var(--text-primary)]">{formatCurrency(result.totalPayment)}</div>
        </div>
      </div>

      {/* ── Charts ──── */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-[var(--border-medium)] bg-[var(--bg-card)] p-6 shadow-sm">
          <h4 className="mb-4 text-sm font-semibold text-[var(--text-primary)]">Payment Breakdown</h4>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={3} dataKey="value" stroke="none">
                  <Cell fill="var(--accent)" />
                  <Cell fill="#f59e0b" />
                </Pie>
                <Tooltip formatter={(val) => formatCurrency(val)} contentStyle={{ borderRadius: '8px', border: '1px solid var(--border-medium)', fontSize: '13px', background: 'var(--bg-card)', color: 'var(--text-primary)' }} />
                <Legend verticalAlign="bottom" iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '12px', color: 'var(--text-muted)' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-[var(--border-medium)] bg-[var(--bg-card)] p-6 shadow-sm">
          <h4 className="mb-4 text-sm font-semibold text-[var(--text-primary)]">Yearly Breakdown</h4>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={yearlyData.slice(0, 10)} barGap={2}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
                <XAxis dataKey="year" tick={{ fontSize: 11, fill: 'var(--text-faint)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--text-faint)' }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(val) => formatCurrency(val)} contentStyle={{ borderRadius: '8px', border: '1px solid var(--border-medium)', fontSize: '13px', background: 'var(--bg-card)', color: 'var(--text-primary)' }} />
                <Bar dataKey="Principal" fill="var(--accent)" radius={[4, 4, 0, 0]} />
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
      <div className="mb-2 flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm font-medium text-[var(--text-primary)]">
          <span className="text-[var(--text-faint)] [&_svg]:h-4 [&_svg]:w-4">{icon}</span>
          {label}
        </label>
        <span className="rounded-lg bg-[var(--bg-secondary)] px-3 py-1 text-sm font-semibold text-[var(--accent)]">
          {displayValue}
        </span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(Number(e.target.value))} className="w-full" />
      <div className="mt-1 flex justify-between text-xs text-[var(--text-faint)]">
        <span>{minLabel}</span><span>{maxLabel}</span>
      </div>
    </div>
  );
}
