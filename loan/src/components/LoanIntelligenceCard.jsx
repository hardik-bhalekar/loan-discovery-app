import React, { useState, useRef } from 'react';
import { computeRiskScore } from '../services/predictionApi';
import RiskGauge from './RiskGauge';
import ReasonList from './ReasonList';
import { formatCompactINR } from '../utils/formatters';
import { Link } from 'react-router-dom';
import { Zap, RefreshCw, ChevronRight } from 'lucide-react';

export default function LoanIntelligenceCard({ profile }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const idempKeyRef = useRef(crypto.randomUUID());

  const handlePredict = async () => {
    if (loading) return;
    setLoading(true);
    setError('');
    
    try {
      const payload = {
        idempotencyKey: idempKeyRef.current,
        monthlyIncome: profile.monthlyIncome || 0,
        creditScore: profile.creditScore || 300,
        existingEmi: profile.existingEmis || 0,
        loanAmount: profile.loanAmount || 10000,
        loanType: profile.loanType || 'Personal Loan',
        tenure: (profile.tenure || 1) * 12, // convert years to months
        purpose: profile.purpose || '',
      };
      
      const res = await computeRiskScore(payload);
      setResult(res);
      // Generate a new key so the next intentional calculation creates a new audit record
      idempKeyRef.current = crypto.randomUUID();
    } catch (err) {
      setError(err.message || 'Failed to compute risk score');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="luxury-panel rounded-[1.4rem] p-5 sm:p-6 transition-all hover:shadow-[0_20px_44px_rgba(7,34,59,0.16)]">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h3 className="flex items-center gap-2 text-lg font-bold tracking-wide text-[var(--text-primary)]">
            <Zap className="h-5 w-5 text-amber-500" />
            Loan Intelligence
          </h3>
          <p className="mt-1.5 text-xs text-[var(--text-muted)]">Get an AI-driven risk assessment and eligibility decision.</p>
        </div>
        <Link 
          to="/decisions" 
          className="group flex items-center gap-1 rounded-full bg-[var(--bg-secondary)] px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[var(--text-primary)] transition-colors hover:bg-[var(--border-subtle)]"
        >
          History
          <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
      
      {!result && !loading && (
        <button 
          onClick={handlePredict}
          className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-[var(--accent)] to-[var(--accent-strong)] py-3.5 text-sm font-semibold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl active:scale-[0.98]"
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            Analyze Profile
            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </span>
          <div className="absolute inset-0 -translate-x-full bg-white/20 transition-transform duration-500 ease-out group-hover:translate-x-0"></div>
        </button>
      )}

      {loading && (
        <div className="mt-4 space-y-4 animate-pulse">
          <div className="h-28 w-full rounded-2xl bg-[var(--border-subtle)]"></div>
          <div className="h-14 w-full rounded-2xl bg-[var(--border-subtle)]"></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-20 rounded-2xl bg-[var(--border-subtle)]"></div>
            <div className="h-20 rounded-2xl bg-[var(--border-subtle)]"></div>
          </div>
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 mt-4 dark:bg-red-900/20 dark:border-red-900 dark:text-red-400">
          {error}
          <button 
            onClick={handlePredict}
            className="block mt-2 text-xs font-semibold underline hover:text-red-900 dark:hover:text-red-300"
          >
            Try Again
          </button>
        </div>
      )}

      {result && !loading && (
        <div className="mt-6 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col items-center justify-center rounded-2xl bg-[var(--bg-secondary)] p-4">
              <RiskGauge score={result.riskScore} band={result.riskBand} />
            </div>
            <div className="flex flex-col justify-center">
              <ReasonList eligible={result.eligible} reason={result.eligibilityReason} />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-faint)]">Max Eligible</p>
              <p className="mt-1 text-xl font-black text-[var(--text-primary)]">{formatCompactINR(result.maxEligibleAmount)}</p>
            </div>
            <div className="border-l border-[var(--border-subtle)] pl-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-faint)]">Recommended EMI</p>
              <p className="mt-1 text-xl font-black text-[var(--text-primary)]">{formatCompactINR(result.recommendedEmi)}</p>
            </div>
          </div>
          
          <button 
            onClick={handlePredict}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--border-medium)] bg-[var(--bg-card)] py-3 text-xs font-semibold text-[var(--text-primary)] transition-all hover:bg-[var(--bg-secondary)] hover:shadow-sm active:scale-[0.98]"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Recalculate
          </button>
        </div>
      )}
    </div>
  );
}
