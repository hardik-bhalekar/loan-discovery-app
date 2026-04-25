import { useEffect, useState } from 'react';
import { getConsentHistory, exportAccountData, deleteAccountData } from '../utils/api';
import { ShieldCheck, Download, Trash2, Clock } from 'lucide-react';

export default function ComplianceHub() {
  const [consents, setConsents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getConsentHistory().then(setConsents).finally(() => setLoading(false));
  }, []);

  const handleExport = async () => {
    try {
      const data = await exportAccountData();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'loan_smart_my_data.json';
      a.click();
    } catch (e) {
      alert("Failed to export data");
    }
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to permanently delete your account and all associated data? This action is irreversible.")) {
      try {
        await deleteAccountData();
        window.location.reload();
      } catch (e) {
        alert("Failed to delete account");
      }
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
      <div className="luxury-panel rounded-[1.4rem] p-5 sm:p-6 transition-all hover:shadow-[0_20px_44px_rgba(7,34,59,0.16)]">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[var(--text-primary)]">Consent History & Audit Log</h2>
            <p className="text-xs text-[var(--text-muted)]">Track every consent action requested and given.</p>
          </div>
        </div>

        {loading ? (
          <div className="py-8 text-center text-sm text-[var(--text-faint)]">Loading history...</div>
        ) : (
          <div className="space-y-3 mt-6">
            {consents.length === 0 && <p className="text-sm text-[var(--text-muted)]">No active consents found.</p>}
            {consents.map(consent => (
              <div key={consent.id} className="flex items-center justify-between p-4 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)]">
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-[var(--text-faint)]" />
                  <div>
                    <p className="text-sm font-semibold text-[var(--text-primary)]">{consent.consentType.replace(/_/g, ' ')}</p>
                    <p className="text-xs text-[var(--text-muted)]">IP: {consent.ipAddress}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-block px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-[10px] font-bold uppercase tracking-wider">
                    {consent.status}
                  </span>
                  <p className="text-[10px] text-[var(--text-faint)] mt-1">{new Date(consent.givenAt).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="luxury-panel rounded-[1.4rem] p-5 sm:p-6">
        <h2 className="text-lg font-bold text-[var(--text-primary)] mb-4">Data Rights (GDPR / DPDP)</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button onClick={handleExport} className="flex items-center justify-center gap-2 p-4 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors group">
            <Download className="w-5 h-5 text-[var(--text-muted)] group-hover:text-[var(--accent)]" />
            <span className="text-sm font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent)]">Export My Data</span>
          </button>
          
          <button onClick={handleDelete} className="flex items-center justify-center gap-2 p-4 rounded-2xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/10 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors group">
            <Trash2 className="w-5 h-5 text-red-500" />
            <span className="text-sm font-semibold text-red-600 dark:text-red-400">Delete Account</span>
          </button>
        </div>
      </div>
    </div>
  );
}
