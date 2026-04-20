import { useState } from 'react';
import { Search, Building2, MapPin, Phone, Check, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { lookupIfsc } from '../utils/api';
import { Card, CardBody } from './ui/Card';
import Input from './ui/Input';
import Button from './ui/Button';
import Spinner from './ui/Spinner';
import Alert from './ui/Alert';
import Badge from './ui/Badge';

export default function IfscLookup() {
  const [code, setCode] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const isValid = /^[A-Za-z]{4}0[A-Za-z0-9]{6}$/.test(code.trim());

  const handleLookup = async (e) => {
    e?.preventDefault();
    if (!isValid) { 
      setError('Enter a valid 11-character IFSC code (e.g., SBIN0001234)'); 
      return; 
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const data = await lookupIfsc(code);
      setResult(data);
    } catch (err) {
      setError(err.message || 'Lookup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Search Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card>
          <CardBody className="p-8">
            <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">IFSC Code Lookup</h3>
            <p className="mb-6 text-sm text-[var(--text-muted)]">
              Enter any IFSC code to get branch details and supported payment methods
            </p>

            <form onSubmit={handleLookup} className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="e.g. SBIN0001234"
                  value={code}
                  onChange={(e) => { setCode(e.target.value.toUpperCase()); setError(''); }}
                  maxLength={11}
                  style={{ letterSpacing: '0.1em', fontFamily: 'monospace' }}
                />
              </div>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  type="submit"
                  disabled={loading || !isValid}
                  className="min-w-[140px]"
                >
                  {loading ? (
                    <span className="inline-flex items-center gap-2">
                      <Spinner size="sm" />
                      Searching…
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Search className="w-4 h-4" />
                      Lookup
                    </span>
                  )}
                </Button>
              </motion.div>
            </form>

            {/* Validation hint */}
            <AnimatePresence>
              {code.length > 0 && code.length < 11 && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-xs text-[var(--text-faint)] mt-2"
                >
                  {11 - code.length} more character{11 - code.length > 1 ? 's' : ''} needed
                </motion.p>
              )}
            </AnimatePresence>
          </CardBody>
        </Card>
      </motion.div>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <Alert type="error" title="Lookup Failed" message={error} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Result Card */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <Card interactive>
              <CardBody className="p-8 space-y-6">
                {/* Bank Header */}
                <div className="flex items-start gap-4">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Infinity, repeatType: 'loop' }}
                    className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[var(--accent)] to-blue-600 flex items-center justify-center shrink-0 shadow-lg shadow-[var(--accent)]/20"
                  >
                    <Building2 className="w-6 h-6 text-white" />
                  </motion.div>
                  <div>
                    <h4 className="text-xl font-bold text-[var(--text-primary)]">{result.BANK}</h4>
                    <p className="mt-1 text-sm text-[var(--text-muted)]">{result.BRANCH}</p>
                    <code className="text-sm font-mono font-semibold text-[var(--accent)] mt-2 block">{result.IFSC}</code>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Address */}
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex items-start gap-3 p-4 rounded-xl bg-[var(--bg-secondary)]"
                  >
                    <MapPin className="w-4 h-4 shrink-0 mt-0.5 text-[var(--accent)]" />
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-faint)] mb-1">Address</p>
                      <p className="text-sm text-[var(--text-primary)]">{result.ADDRESS}</p>
                    </div>
                  </motion.div>

                  {/* Location */}
                  <motion.div
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex items-start gap-3 p-4 rounded-xl bg-[var(--bg-secondary)]"
                  >
                    <MapPin className="w-4 h-4 shrink-0 mt-0.5 text-[var(--accent)]" />
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-faint)] mb-1">Location</p>
                      <p className="text-sm text-[var(--text-primary)]">{result.CITY}, {result.DISTRICT}</p>
                      <p className="text-xs text-[var(--text-muted)]">{result.STATE}</p>
                    </div>
                  </motion.div>

                  {result.CONTACT && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                      className="flex items-start gap-3 p-4 rounded-xl bg-[var(--bg-secondary)]"
                    >
                      <Phone className="w-4 h-4 shrink-0 mt-0.5 text-[var(--accent)]" />
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-faint)] mb-1">Contact</p>
                        <p className="text-sm text-[var(--text-primary)]">{result.CONTACT}</p>
                      </div>
                    </motion.div>
                  )}

                  {result.MICR && (
                    <motion.div
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                      className="flex items-start gap-3 p-4 rounded-xl bg-[var(--bg-secondary)]"
                    >
                      <Building2 className="w-4 h-4 shrink-0 mt-0.5 text-[var(--accent)]" />
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-faint)] mb-1">MICR Code</p>
                        <code className="text-sm font-mono text-[var(--text-primary)]">{result.MICR}</code>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Payment Methods */}
                <div className="pt-4 border-t border-[var(--border-subtle)]">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-faint)] mb-3">Supported Transfers</p>
                  <motion.div
                    className="flex flex-wrap gap-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    {[
                      { label: 'NEFT', enabled: result.NEFT },
                      { label: 'RTGS', enabled: result.RTGS },
                      { label: 'IMPS', enabled: result.IMPS },
                      { label: 'UPI', enabled: result.UPI },
                    ].map(({ label, enabled }) => (
                      <Badge
                        key={label}
                        variant={enabled ? 'success' : 'secondary'}
                        className="flex items-center gap-1.5"
                      >
                        {enabled ? <Check className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3 opacity-50" />}
                        {label}
                      </Badge>
                    ))}
                  </motion.div>
                </div>
              </CardBody>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
