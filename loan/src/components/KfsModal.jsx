import { useState } from 'react';
import { X, CheckCircle2, ShieldAlert, FileText, Download } from 'lucide-react';
import { recordConsent } from '../utils/api';
import { formatCompactINR } from '../utils/formatters';

export default function KfsModal({ loan, onClose, onAccept }) {
  const [acknowledged, setAcknowledged] = useState(false);
  const [coolingOff, setCoolingOff] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAccept = async () => {
    setLoading(true);
    try {
      await recordConsent('KFS_ACCEPTED');
      await recordConsent('COOLING_OFF_ACKNOWLEDGED');
      onAccept(loan);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (!loan) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-2xl bg-[var(--bg-card)] rounded-[1.5rem] border border-[var(--border-subtle)] shadow-2xl overflow-hidden animate-in zoom-in-95">
        <div className="flex items-center justify-between p-5 border-b border-[var(--border-subtle)] bg-[var(--bg-secondary)]">
          <div>
            <h2 className="text-lg font-bold text-[var(--text-primary)] flex items-center gap-2">
              <FileText className="w-5 h-5 text-[var(--accent)]" />
              Key Fact Statement (KFS)
            </h2>
            <p className="text-xs text-[var(--text-muted)] mt-1">Review your standardized loan terms before acceptance</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-[var(--border-subtle)] rounded-xl transition-colors">
            <X className="w-5 h-5 text-[var(--text-faint)]" />
          </button>
        </div>

        <div className="p-6 max-h-[60vh] overflow-y-auto space-y-6">
          <div className="p-4 rounded-xl bg-sky-50 dark:bg-sky-900/20 border border-sky-100 dark:border-sky-800">
            <p className="text-sm font-medium text-sky-800 dark:text-sky-300">
              As per regulatory guidelines, this statement highlights the key facts of your loan from {loan.bankName}.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)]">
              <p className="text-xs font-semibold text-[var(--text-faint)] uppercase tracking-wider">Loan Amount</p>
              <p className="text-xl font-bold text-[var(--text-primary)] mt-1">{formatCompactINR(loan.loanAmount || 0)}</p>
            </div>
            <div className="p-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)]">
              <p className="text-xs font-semibold text-[var(--text-faint)] uppercase tracking-wider">Annual Interest Rate</p>
              <p className="text-xl font-bold text-[var(--text-primary)] mt-1">{loan.interestRate}%</p>
            </div>
            <div className="p-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)]">
              <p className="text-xs font-semibold text-[var(--text-faint)] uppercase tracking-wider">Monthly EMI</p>
              <p className="text-xl font-bold text-[var(--text-primary)] mt-1">{formatCompactINR(loan.emi)}</p>
            </div>
            <div className="p-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)]">
              <p className="text-xs font-semibold text-[var(--text-faint)] uppercase tracking-wider">Total Repayment</p>
              <p className="text-xl font-bold text-[var(--text-primary)] mt-1">{formatCompactINR(loan.totalPayment)}</p>
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-[var(--border-subtle)]">
            <label className="flex items-start gap-3 cursor-pointer group">
              <div className="pt-1">
                <input 
                  type="checkbox" 
                  checked={acknowledged}
                  onChange={(e) => setAcknowledged(e.target.checked)}
                  className="w-4 h-4 rounded border-[var(--border-medium)] text-[var(--accent)] focus:ring-[var(--accent)]"
                />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">I have read and understood the KFS</p>
                <p className="text-xs text-[var(--text-muted)] mt-1">I acknowledge the interest rate, processing fees, and penalties as outlined.</p>
              </div>
            </label>

            <label className="flex items-start gap-3 cursor-pointer group">
              <div className="pt-1">
                <input 
                  type="checkbox" 
                  checked={coolingOff}
                  onChange={(e) => setCoolingOff(e.target.checked)}
                  className="w-4 h-4 rounded border-[var(--border-medium)] text-[var(--accent)] focus:ring-[var(--accent)]"
                />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">Cooling-off Period Acknowledgment</p>
                <p className="text-xs text-[var(--text-muted)] mt-1 flex items-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  I understand I have a 3-day cooling-off period to exit this loan without penalty.
                </p>
              </div>
            </label>
          </div>
        </div>

        <div className="flex items-center justify-between p-5 border-t border-[var(--border-subtle)] bg-[var(--bg-secondary)]">
          <button className="text-xs font-semibold text-[var(--accent)] flex items-center gap-1 hover:underline">
            <Download className="w-4 h-4" /> Download KFS PDF
          </button>
          
          <div className="flex gap-3">
            <button 
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-[var(--border-medium)] text-sm font-semibold text-[var(--text-primary)] hover:bg-[var(--border-subtle)] transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={handleAccept}
              disabled={!acknowledged || !coolingOff || loading}
              className="px-5 py-2.5 rounded-xl bg-[var(--accent)] text-white text-sm font-semibold hover:bg-[var(--accent-strong)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg"
            >
              {loading ? 'Processing...' : 'Accept & Proceed'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
