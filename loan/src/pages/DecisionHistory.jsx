import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getDecisionHistory } from '../services/predictionApi';
import { formatCompactINR } from '../utils/formatters';
import EmptyState from '../components/ui/EmptyState';
import RiskGauge from '../components/RiskGauge';
import ReasonList from '../components/ReasonList';
import ThemeToggle from '../components/ThemeToggle';
import { ArrowLeft, Landmark } from 'lucide-react';

export default function DecisionHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;
    
    const fetchHistory = async () => {
      try {
        const data = await getDecisionHistory();
        if (active) {
          setHistory(data);
        }
      } catch (err) {
        if (active) {
          setError(err.message || 'Failed to fetch decision history');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };
    
    fetchHistory();
    
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-[var(--bg-main)]">
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[var(--border-subtle)] bg-[color-mix(in_oklab,var(--bg-card)_92%,transparent)] px-4 sm:px-6 backdrop-blur">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/dashboard')} className="p-2 -ml-2 rounded-lg hover:bg-[var(--bg-secondary)] transition-colors">
            <ArrowLeft className="w-5 h-5 text-[var(--text-primary)]" />
          </button>
          <Link to="/" className="flex items-center gap-2">
            <Landmark className="h-5 w-5 text-[var(--accent)]" />
            <span className="text-sm font-semibold text-[var(--text-primary)] hidden sm:block">LoanSmart</span>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm font-semibold text-[var(--text-primary)]">Decision History</span>
          <ThemeToggle />
        </div>
      </header>

      <main className="mx-auto w-full max-w-4xl p-4 sm:p-6 lg:p-8">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-4">
            <div className="w-8 h-8 border-4 border-[var(--accent)] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm text-[var(--text-muted)] font-medium">Loading history...</p>
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center dark:bg-red-900/20 dark:border-red-900">
            <p className="text-sm font-semibold text-red-700 dark:text-red-400">{error}</p>
          </div>
        ) : history.length === 0 ? (
          <div className="luxury-panel rounded-[1.4rem] p-8">
            <EmptyState 
              title="No decisions yet" 
              description="Run an analysis in the Loan Intelligence tab to see your history here."
            />
          </div>
        ) : (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <p className="text-sm text-[var(--text-muted)]">
              Showing your {history.length} most recent loan intelligence decisions.
            </p>
            
            <div className="grid grid-cols-1 gap-6">
              {history.map((decision) => (
                <div key={decision.decisionId} className="luxury-panel rounded-[1.4rem] p-5 sm:p-6 transition-all hover:shadow-[0_20px_44px_rgba(7,34,59,0.16)]">
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-[var(--border-subtle)] pb-4">
                    <div>
                      <p className="text-xs font-semibold text-[var(--text-faint)] uppercase tracking-wider">
                        {new Date(decision.decidedAt).toLocaleString()}
                      </p>
                      <p className="text-sm font-medium text-[var(--text-muted)] mt-1">
                        ID: <span className="font-mono text-xs text-[var(--text-primary)]">{decision.idempotencyKey.substring(0, 8)}...</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-[var(--text-primary)]">
                        Max: {formatCompactINR(decision.maxEligibleAmount)}
                      </p>
                      <p className="text-xs text-[var(--text-muted)] mt-1">
                        Rec. EMI: {formatCompactINR(decision.recommendedEmi)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <RiskGauge score={decision.riskScore} band={decision.riskBand} />
                    <div className="flex flex-col justify-center">
                      <ReasonList eligible={decision.eligible} reason={decision.eligibilityReason} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
