import { useState } from 'react';
import { User, Briefcase, IndianRupee, MapPin, Target, Clock, CreditCard, FileText, CheckCircle } from 'lucide-react';
import Button from './Button';

const occupations = ['Salaried', 'Self-Employed', 'Student', 'Business Owner', 'Freelancer'];
const loanPurposes = ['Home Purchase', 'Education', 'Vehicle', 'Personal Expenses', 'Business', 'Debt Consolidation', 'Medical', 'Wedding'];
const loanTypeOptions = ['Personal Loan', 'Home Loan', 'Education Loan', 'Vehicle Loan'];
const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow'];

export default function LoanForm({ onSubmit }) {
  const [form, setForm] = useState({
    age: 30, occupation: 'Salaried', monthlyIncome: 50000,
    creditScore: 750, city: 'Mumbai', loanAmount: 1000000,
    purpose: 'Home Purchase', loanType: 'Personal Loan', tenure: 5,
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const update = (field, value) => {
    setForm((p) => ({ ...p, [field]: value }));
    if (errors[field]) setErrors((p) => ({ ...p, [field]: null }));
  };

  const validate = () => {
    const e = {};
    if (form.age < 18 || form.age > 70) e.age = 'Age must be 18-70';
    if (form.monthlyIncome < 5000) e.monthlyIncome = 'Min ₹5,000';
    if (form.loanAmount < 10000) e.loanAmount = 'Min ₹10,000';
    if (form.tenure < 1 || form.tenure > 30) e.tenure = '1-30 years';
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const v = validate();
    if (Object.keys(v).length) { setErrors(v); return; }
    setSubmitted(true);
    onSubmit?.(form);
  };

  const getCreditLabel = (score) => {
    if (score >= 750) return { text: 'Excellent', color: 'text-green-600' };
    if (score >= 700) return { text: 'Good', color: 'text-blue-600' };
    if (score >= 650) return { text: 'Fair', color: 'text-amber-500' };
    return { text: 'Poor', color: 'text-red-500' };
  };

  const creditLabel = getCreditLabel(form.creditScore);
  const inputClass = 'border border-gray-200 rounded-lg px-4 py-2.5 w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500';

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-6">
      {/* Personal Details */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <User className="w-4 h-4 text-blue-600" /> Personal Details
        </h3>
        <div className="space-y-4">
          <InputField label="Age" icon={<User />} error={errors.age}>
            <input type="number" value={form.age} onChange={(e) => update('age', +e.target.value)} className={inputClass} min="18" max="70" />
          </InputField>
          <InputField label="Occupation" icon={<Briefcase />}>
            <select value={form.occupation} onChange={(e) => update('occupation', e.target.value)} className={inputClass}>
              {occupations.map((o) => <option key={o}>{o}</option>)}
            </select>
          </InputField>
          <InputField label="Monthly Income (₹)" icon={<IndianRupee />} error={errors.monthlyIncome}>
            <input type="number" value={form.monthlyIncome} onChange={(e) => update('monthlyIncome', +e.target.value)} className={inputClass} min="5000" step="1000" />
          </InputField>
          <InputField label="City" icon={<MapPin />}>
            <select value={form.city} onChange={(e) => update('city', e.target.value)} className={inputClass}>
              {cities.map((c) => <option key={c}>{c}</option>)}
            </select>
          </InputField>
        </div>
      </div>

      {/* Credit Score */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-blue-600" /> Credit Score
        </h3>
        <div className="flex items-center justify-between mb-2">
          <span className="text-2xl font-semibold text-gray-800">{form.creditScore}</span>
          <span className={`text-sm font-medium ${creditLabel.color}`}>{creditLabel.text}</span>
        </div>
        <input type="range" min="300" max="900" step="10" value={form.creditScore}
          onChange={(e) => update('creditScore', +e.target.value)} className="w-full" />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>300</span><span>900</span>
        </div>
      </div>

      {/* Loan Details */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <FileText className="w-4 h-4 text-blue-600" /> Loan Details
        </h3>
        <div className="space-y-4">
          <InputField label="Loan Amount (₹)" icon={<IndianRupee />} error={errors.loanAmount}>
            <input type="number" value={form.loanAmount} onChange={(e) => update('loanAmount', +e.target.value)} className={inputClass} min="10000" step="10000" />
          </InputField>
          <InputField label="Purpose" icon={<Target />}>
            <select value={form.purpose} onChange={(e) => update('purpose', e.target.value)} className={inputClass}>
              {loanPurposes.map((p) => <option key={p}>{p}</option>)}
            </select>
          </InputField>
          <InputField label="Loan Type" icon={<FileText />}>
            <select value={form.loanType} onChange={(e) => update('loanType', e.target.value)} className={inputClass}>
              {loanTypeOptions.map((t) => <option key={t}>{t}</option>)}
            </select>
          </InputField>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-400" /> Tenure: <span className="text-blue-600 font-semibold">{form.tenure} yrs</span>
            </label>
            <input type="range" min="1" max="30" step="1" value={form.tenure}
              onChange={(e) => update('tenure', +e.target.value)} className="w-full" />
            <div className="flex justify-between text-xs text-gray-400">
              <span>1 yr</span><span>30 yrs</span>
            </div>
            {errors.tenure && <p className="text-xs text-red-500">{errors.tenure}</p>}
          </div>
        </div>
      </div>

      {/* Submit */}
      <div className="flex items-center gap-4">
        <Button type="submit">
          {submitted ? <><CheckCircle className="w-4 h-4" /> Saved</> : 'Save Profile'}
        </Button>
        {submitted && (
          <span className="text-sm text-green-600 font-medium">✓ Profile saved — check other tabs</span>
        )}
      </div>
    </form>
  );
}

function InputField({ label, icon, error, children }) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
        <span className="text-gray-400 [&_svg]:w-4 [&_svg]:h-4">{icon}</span>
        {label}
      </label>
      {children}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
