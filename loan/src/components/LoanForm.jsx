import { useEffect, useState } from 'react';
import {
  Wallet,
  FileText,
  Target,
  Clock,
  IndianRupee,
  Building2,
  Briefcase,
  TrendingUp,
  CreditCard,
  BadgeCheck,
  ListChecks,
  Sparkles,
  CheckCircle,
} from 'lucide-react';
import Button from './Button';

const loanTypeOptions = ['Home Loan', 'Car Loan', 'Personal Loan', 'Education Loan', 'Business Loan'];
const loanPurposes = ['Home Purchase', 'Vehicle Purchase', 'Education', 'Business Expansion', 'Medical', 'Wedding', 'Debt Consolidation', 'Personal Use'];
const employmentTypes = ['Salaried', 'Self-Employed', 'Business Owner', 'Freelancer', 'Retired'];
const ratePreferences = ['Fixed', 'Floating', 'Either'];
const bankOptions = ['SBI', 'HDFC', 'ICICI', 'Axis', 'Kotak', 'PNB', 'Bank of Baroda', 'Canara'];

export default function LoanForm({ onSubmit, initialProfile }) {
  const [form, setForm] = useState(() => ({
    loanAmount: initialProfile?.loanAmount ?? 1000000,
    loanType: initialProfile?.loanType ?? 'Personal Loan',
    purpose: initialProfile?.purpose ?? 'Home Purchase',
    tenure: initialProfile?.tenure ?? 5,
    preferredEmiBudget: initialProfile?.preferredEmiBudget ?? 25000,

    employmentType: initialProfile?.employmentType ?? 'Salaried',
    employerName: initialProfile?.employerName ?? '',
    workExperience: initialProfile?.workExperience ?? 3,
    monthlyIncome: initialProfile?.monthlyIncome ?? 50000,
    additionalIncome: initialProfile?.additionalIncome ?? 0,

    existingEmis: initialProfile?.existingEmis ?? 0,
    creditCardOutstanding: initialProfile?.creditCardOutstanding ?? 0,
    otherActiveLoans: initialProfile?.otherActiveLoans ?? 0,

    creditScore: initialProfile?.creditScore ?? 750,
    pastDefaults: initialProfile?.pastDefaults ?? false,

    preferredBanks: initialProfile?.preferredBanks ?? [],
    ratePreference: initialProfile?.ratePreference ?? 'Either',
    fastApprovalPriority: initialProfile?.fastApprovalPriority ?? 3,
    lowestEmiPriority: initialProfile?.lowestEmiPriority ?? 4,

    panReady: initialProfile?.panReady ?? false,
    aadhaarReady: initialProfile?.aadhaarReady ?? false,
    salarySlipsReady: initialProfile?.salarySlipsReady ?? false,
    itrReady: initialProfile?.itrReady ?? false,
    bankStatementsReady: initialProfile?.bankStatementsReady ?? false,
  }));

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setForm({
      loanAmount: initialProfile?.loanAmount ?? 1000000,
      loanType: initialProfile?.loanType ?? 'Personal Loan',
      purpose: initialProfile?.purpose ?? 'Home Purchase',
      tenure: initialProfile?.tenure ?? 5,
      preferredEmiBudget: initialProfile?.preferredEmiBudget ?? 25000,

      employmentType: initialProfile?.employmentType ?? 'Salaried',
      employerName: initialProfile?.employerName ?? '',
      workExperience: initialProfile?.workExperience ?? 3,
      monthlyIncome: initialProfile?.monthlyIncome ?? 50000,
      additionalIncome: initialProfile?.additionalIncome ?? 0,

      existingEmis: initialProfile?.existingEmis ?? 0,
      creditCardOutstanding: initialProfile?.creditCardOutstanding ?? 0,
      otherActiveLoans: initialProfile?.otherActiveLoans ?? 0,

      creditScore: initialProfile?.creditScore ?? 750,
      pastDefaults: initialProfile?.pastDefaults ?? false,

      preferredBanks: initialProfile?.preferredBanks ?? [],
      ratePreference: initialProfile?.ratePreference ?? 'Either',
      fastApprovalPriority: initialProfile?.fastApprovalPriority ?? 3,
      lowestEmiPriority: initialProfile?.lowestEmiPriority ?? 4,

      panReady: initialProfile?.panReady ?? false,
      aadhaarReady: initialProfile?.aadhaarReady ?? false,
      salarySlipsReady: initialProfile?.salarySlipsReady ?? false,
      itrReady: initialProfile?.itrReady ?? false,
      bankStatementsReady: initialProfile?.bankStatementsReady ?? false,
    });
  }, [initialProfile]);

  const update = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: null }));
  };

  const toggleBank = (bank) => {
    setForm((prev) => ({
      ...prev,
      preferredBanks: prev.preferredBanks.includes(bank)
        ? prev.preferredBanks.filter((item) => item !== bank)
        : [...prev.preferredBanks, bank],
    }));
  };

  const validate = () => {
    const nextErrors = {};
    if (Number(form.loanAmount) < 10000) nextErrors.loanAmount = 'Minimum loan amount is Rs 10,000';
    if (Number(form.tenure) < 1 || Number(form.tenure) > 30) nextErrors.tenure = 'Tenure must be between 1 and 30 years';
    if (Number(form.monthlyIncome) < 5000) nextErrors.monthlyIncome = 'Monthly income should be at least Rs 5,000';
    if (Number(form.creditScore) < 300 || Number(form.creditScore) > 900) nextErrors.creditScore = 'Credit score must be between 300 and 900';
    return nextErrors;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = validate();
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setSubmitted(true);
    onSubmit?.(form);
  };

  const inputClass = 'w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-card)] px-4 py-2.5 text-sm text-[var(--text-primary)] outline-none transition focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/25';
  const panelClass = 'luxury-panel rounded-[1.4rem] p-5';
  const sectionTitleClass = 'mb-4 flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)]';

  return (
    <form onSubmit={handleSubmit} className="mx-auto w-full max-w-5xl space-y-5">
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className={`${panelClass} hover-soft`}>
          <h3 className={sectionTitleClass}>
            <Wallet className="h-4 w-4 text-[var(--accent)]" />
            Core Loan Details
          </h3>

          <div className="space-y-4">
            <InputField label="Loan Amount" icon={<IndianRupee />} error={errors.loanAmount}>
              <input
                type="number"
                min="10000"
                step="10000"
                value={form.loanAmount}
                onChange={(e) => update('loanAmount', Number(e.target.value))}
                className={inputClass}
              />
            </InputField>

            <InputField label="Loan Type" icon={<FileText />}>
              <select value={form.loanType} onChange={(e) => update('loanType', e.target.value)} className={inputClass}>
                {loanTypeOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </InputField>

            <InputField label="Purpose" icon={<Target />}>
              <select value={form.purpose} onChange={(e) => update('purpose', e.target.value)} className={inputClass}>
                {loanPurposes.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </InputField>

            <InputField label={`Tenure: ${form.tenure} years`} icon={<Clock />} error={errors.tenure}>
              <input
                type="range"
                min="1"
                max="30"
                step="1"
                value={form.tenure}
                onChange={(e) => update('tenure', Number(e.target.value))}
                className="w-full"
              />
            </InputField>

            <InputField label="Preferred EMI Budget" icon={<IndianRupee />}>
              <input
                type="number"
                min="0"
                step="1000"
                value={form.preferredEmiBudget}
                onChange={(e) => update('preferredEmiBudget', Number(e.target.value))}
                className={inputClass}
              />
            </InputField>
          </div>
        </div>

        <div className={`${panelClass} hover-soft`}>
          <h3 className={sectionTitleClass}>
            <Briefcase className="h-4 w-4 text-[var(--accent)]" />
            Employment
          </h3>

          <div className="space-y-4">
            <InputField label="Employment Type" icon={<Briefcase />}>
              <select value={form.employmentType} onChange={(e) => update('employmentType', e.target.value)} className={inputClass}>
                {employmentTypes.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </InputField>

            <InputField label="Employer Name" icon={<Building2 />}>
              <input
                type="text"
                value={form.employerName}
                onChange={(e) => update('employerName', e.target.value)}
                className={inputClass}
                placeholder="Company/Organization"
              />
            </InputField>

            <InputField label="Work Experience (years)" icon={<TrendingUp />}>
              <input
                type="number"
                min="0"
                step="0.5"
                value={form.workExperience}
                onChange={(e) => update('workExperience', Number(e.target.value))}
                className={inputClass}
              />
            </InputField>

            <InputField label="Monthly Income" icon={<IndianRupee />} error={errors.monthlyIncome}>
              <input
                type="number"
                min="0"
                step="1000"
                value={form.monthlyIncome}
                onChange={(e) => update('monthlyIncome', Number(e.target.value))}
                className={inputClass}
              />
            </InputField>

            <InputField label="Additional Income" icon={<IndianRupee />}>
              <input
                type="number"
                min="0"
                step="1000"
                value={form.additionalIncome}
                onChange={(e) => update('additionalIncome', Number(e.target.value))}
                className={inputClass}
              />
            </InputField>
          </div>
        </div>

        <div className={`${panelClass} hover-soft`}>
          <h3 className={sectionTitleClass}>
            <ListChecks className="h-4 w-4 text-[var(--accent)]" />
            Liabilities
          </h3>

          <div className="space-y-4">
            <InputField label="Existing EMIs" icon={<IndianRupee />}>
              <input
                type="number"
                min="0"
                step="1000"
                value={form.existingEmis}
                onChange={(e) => update('existingEmis', Number(e.target.value))}
                className={inputClass}
              />
            </InputField>

            <InputField label="Credit Card Outstanding" icon={<CreditCard />}>
              <input
                type="number"
                min="0"
                step="1000"
                value={form.creditCardOutstanding}
                onChange={(e) => update('creditCardOutstanding', Number(e.target.value))}
                className={inputClass}
              />
            </InputField>

            <InputField label="Other Active Loans" icon={<FileText />}>
              <input
                type="number"
                min="0"
                step="1"
                value={form.otherActiveLoans}
                onChange={(e) => update('otherActiveLoans', Number(e.target.value))}
                className={inputClass}
              />
            </InputField>
          </div>
        </div>

        <div className={`${panelClass} hover-soft`}>
          <h3 className={sectionTitleClass}>
            <BadgeCheck className="h-4 w-4 text-[var(--accent)]" />
            Credit
          </h3>

          <div className="space-y-4">
            <InputField label="Credit Score" icon={<CreditCard />} error={errors.creditScore}>
              <input
                type="number"
                min="300"
                max="900"
                step="10"
                value={form.creditScore}
                onChange={(e) => update('creditScore', Number(e.target.value))}
                className={inputClass}
              />
            </InputField>

            <ToggleRow
              label="Past Defaults"
              checked={form.pastDefaults}
              onChange={(value) => update('pastDefaults', value)}
            />
          </div>
        </div>

        <div className={`${panelClass} hover-soft`}>
          <h3 className={sectionTitleClass}>
            <Sparkles className="h-4 w-4 text-[var(--accent)]" />
            Preferences
          </h3>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-[var(--text-muted)]">Preferred Banks</label>
              <div className="flex flex-wrap gap-2">
                {bankOptions.map((bank) => {
                  const selected = form.preferredBanks.includes(bank);
                  return (
                    <button
                      key={bank}
                      type="button"
                      onClick={() => toggleBank(bank)}
                      className={[
                        'rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors sm:text-sm',
                        selected
                          ? 'border-[var(--accent)] bg-[var(--accent)] text-white'
                          : 'border-[var(--border-subtle)] bg-[var(--bg-secondary)] text-[var(--text-primary)]',
                      ].join(' ')}
                    >
                      {bank}
                    </button>
                  );
                })}
              </div>
            </div>

            <InputField label="Rate Preference" icon={<TrendingUp />}>
              <select value={form.ratePreference} onChange={(e) => update('ratePreference', e.target.value)} className={inputClass}>
                {ratePreferences.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </InputField>

            <InputField label={`Fast Approval Priority: ${form.fastApprovalPriority}/5`} icon={<Sparkles />}>
              <input
                type="range"
                min="1"
                max="5"
                step="1"
                value={form.fastApprovalPriority}
                onChange={(e) => update('fastApprovalPriority', Number(e.target.value))}
                className="w-full"
              />
            </InputField>

            <InputField label={`Lowest EMI Priority: ${form.lowestEmiPriority}/5`} icon={<IndianRupee />}>
              <input
                type="range"
                min="1"
                max="5"
                step="1"
                value={form.lowestEmiPriority}
                onChange={(e) => update('lowestEmiPriority', Number(e.target.value))}
                className="w-full"
              />
            </InputField>
          </div>
        </div>

        <div className={`${panelClass} hover-soft`}>
          <h3 className={sectionTitleClass}>
            <CheckCircle className="h-4 w-4 text-[var(--accent)]" />
            Documents
          </h3>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <ToggleRow label="PAN Ready" checked={form.panReady} onChange={(value) => update('panReady', value)} />
            <ToggleRow label="Aadhaar Ready" checked={form.aadhaarReady} onChange={(value) => update('aadhaarReady', value)} />
            <ToggleRow label="Salary Slips Ready" checked={form.salarySlipsReady} onChange={(value) => update('salarySlipsReady', value)} />
            <ToggleRow label="ITR Ready" checked={form.itrReady} onChange={(value) => update('itrReady', value)} />
            <ToggleRow label="Bank Statements Ready" checked={form.bankStatementsReady} onChange={(value) => update('bankStatementsReady', value)} />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit">Save Loan Profile</Button>
        {submitted ? <span className="text-sm font-medium text-emerald-600">Loan profile saved successfully</span> : null}
      </div>
    </form>
  );
}

function InputField({ label, icon, error, children }) {
  return (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-sm font-medium text-[var(--text-muted)]">
        <span className="text-[var(--text-faint)] [&_svg]:h-4 [&_svg]:w-4">{icon}</span>
        {label}
      </label>
      {children}
      {error ? <p className="text-xs text-red-500">{error}</p> : null}
    </div>
  );
}

function ToggleRow({ label, checked, onChange }) {
  return (
    <label className="flex items-center justify-between rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-secondary)] px-3 py-2 text-sm text-[var(--text-primary)]">
      <span>{label}</span>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="h-4 w-4" />
    </label>
  );
}
