import { AlertCircle, CheckCircle, InfoIcon, AlertTriangle, X } from 'lucide-react';
import { useState } from 'react';

export default function Alert({ type = 'info', title, message, dismissible = true, icon: Icon, className = '' }) {
  const [isVisible, setIsVisible] = useState(true);

  const variants = {
    info: { bg: 'bg-[color-mix(in_oklab,var(--bg-secondary)_62%,var(--bg-card)_38%)]', border: 'border-[var(--border-subtle)]', icon: InfoIcon, iconColor: 'text-sky-500' },
    success: { bg: 'bg-[color-mix(in_oklab,rgba(16,185,129,0.12)_55%,var(--bg-card)_45%)]', border: 'border-emerald-400/30', icon: CheckCircle, iconColor: 'text-emerald-500' },
    warning: { bg: 'bg-[color-mix(in_oklab,rgba(245,158,11,0.14)_55%,var(--bg-card)_45%)]', border: 'border-amber-400/30', icon: AlertTriangle, iconColor: 'text-amber-500' },
    error: { bg: 'bg-[color-mix(in_oklab,rgba(239,68,68,0.10)_55%,var(--bg-card)_45%)]', border: 'border-rose-400/30', icon: AlertCircle, iconColor: 'text-rose-500' },
  };

  const variant = variants[type];
  const AlertIcon = Icon || variant.icon;

  if (!isVisible) return null;

  return (
    <div className={`flex gap-3 rounded-[1.15rem] border px-4 py-3.5 shadow-[0_10px_24px_rgba(7,34,59,0.08)] ${variant.bg} ${variant.border} ${className}`}>
      <AlertIcon className={`h-5 w-5 flex-shrink-0 mt-0.5 ${variant.iconColor}`} />
      <div className="flex-1">
        {title && <h4 className="mb-1 text-sm font-semibold text-[var(--text-primary)]">{title}</h4>}
        <p className="text-sm leading-relaxed text-[var(--text-muted)]">{message}</p>
      </div>
      {dismissible && (
        <button
          onClick={() => setIsVisible(false)}
          className="flex-shrink-0 text-[var(--text-faint)] transition-colors hover:text-[var(--text-primary)]"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
