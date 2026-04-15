import { useState } from 'react';
import { Search, Building2, MapPin, Phone, Wifi, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';
import { lookupIfsc } from '../utils/api';

export default function IfscLookup() {
  const [code, setCode] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const isValid = /^[A-Za-z]{4}0[A-Za-z0-9]{6}$/.test(code.trim());

  const handleLookup = async (e) => {
    e?.preventDefault();
    if (!isValid) { setError('Enter a valid 11-character IFSC code'); return; }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const data = await lookupIfsc(code);
      setResult(data);
    } catch (err) {
      setError(err.message || 'Lookup failed');
    } finally {
      setLoading(false);
    }
  };

  const textP = { color: 'var(--text-primary)' };
  const textM = { color: 'var(--text-muted)' };
  const textF = { color: 'var(--text-faint)' };
  const cardBg = { background: 'var(--bg-card)', border: '1px solid var(--border-medium)' };

  return (
    <div className="space-y-6">
      {/* Search Card */}
      <div className="p-8 glass hover-lift panel3d rounded-3xl">
        <h3 className="text-sm font-semibold mb-1" style={textP}>IFSC Code Lookup</h3>
        <p className="text-xs mb-5" style={textM}>
          Enter any IFSC code to get branch details — powered by Razorpay API
        </p>

        <form onSubmit={handleLookup} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-faint)' }} />
            <input
              type="text"
              placeholder="e.g. SBIN0001234"
              value={code}
              onChange={(e) => { setCode(e.target.value.toUpperCase()); setError(''); }}
              maxLength={11}
              className="dark-select w-full pl-10"
              style={{ letterSpacing: '0.1em', fontFamily: 'monospace' }}
            />
          </div>
          <button
            type="submit"
            disabled={loading || !isValid}
            className="px-6 py-2.5 rounded-xl text-xs font-semibold text-white transition-all duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
          >
            {loading ? (
              <span className="inline-flex items-center gap-2"><Loader2 className="w-3.5 h-3.5 animate-spin" /> Searching…</span>
            ) : (
              'Lookup'
            )}
          </button>
        </form>

        {/* Validation hint */}
        {code.length > 0 && code.length < 11 && (
          <p className="text-[10px] mt-2" style={textF}>
            {11 - code.length} more character{11 - code.length > 1 ? 's' : ''} needed
          </p>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-3 p-4 rounded-2xl animate-fade-in-up"
          style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
          <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
          <p className="text-xs text-red-400">{error}</p>
        </div>
      )}

      {/* Result Card */}
      {result && (
        <div className="p-6 glass hover-lift panel3d rounded-3xl animate-fade-in-up space-y-5">
          {/* Bank Name Header */}
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shrink-0 shadow-lg shadow-indigo-500/20">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="text-sm font-bold" style={textP}>{result.BANK}</h4>
              <p className="text-xs mt-0.5" style={textM}>{result.BRANCH}</p>
              <p className="text-[10px] mt-1 font-mono font-semibold text-indigo-400">{result.IFSC}</p>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Address */}
            <div className="flex items-start gap-3 p-4 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
              <MapPin className="w-4 h-4 shrink-0 mt-0.5" style={{ color: 'var(--text-faint)' }} />
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider mb-1" style={textF}>Address</p>
                <p className="text-xs leading-relaxed" style={textM}>{result.ADDRESS}</p>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-start gap-3 p-4 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
              <MapPin className="w-4 h-4 shrink-0 mt-0.5" style={{ color: 'var(--text-faint)' }} />
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider mb-1" style={textF}>Location</p>
                <p className="text-xs" style={textM}>{result.CITY}, {result.DISTRICT}</p>
                <p className="text-xs" style={textM}>{result.STATE}</p>
              </div>
            </div>

            {/* Contact */}
            {result.CONTACT && (
              <div className="flex items-start gap-3 p-4 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
                <Phone className="w-4 h-4 shrink-0 mt-0.5" style={{ color: 'var(--text-faint)' }} />
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider mb-1" style={textF}>Contact</p>
                  <p className="text-xs" style={textM}>{result.CONTACT}</p>
                </div>
              </div>
            )}

            {/* MICR */}
            {result.MICR && (
              <div className="flex items-start gap-3 p-4 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
                <Building2 className="w-4 h-4 shrink-0 mt-0.5" style={{ color: 'var(--text-faint)' }} />
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider mb-1" style={textF}>MICR Code</p>
                  <p className="text-xs font-mono" style={textM}>{result.MICR}</p>
                </div>
              </div>
            )}
          </div>

          {/* Payment Methods */}
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider mb-3" style={textF}>Supported Transfers</p>
            <div className="flex flex-wrap gap-2">
              {[
                { label: 'NEFT', enabled: result.NEFT },
                { label: 'RTGS', enabled: result.RTGS },
                { label: 'IMPS', enabled: result.IMPS },
                { label: 'UPI', enabled: result.UPI },
              ].map(({ label, enabled }) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-semibold"
                  style={enabled
                    ? { background: 'rgba(52,211,153,0.1)', color: '#34d399', border: '1px solid rgba(52,211,153,0.2)' }
                    : { background: 'var(--bg-secondary)', color: 'var(--text-faint)', border: '1px solid var(--border-subtle)' }
                  }
                >
                  {enabled ? <CheckCircle className="w-3 h-3" /> : <Wifi className="w-3 h-3 opacity-40" />}
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
