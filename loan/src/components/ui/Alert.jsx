import { AlertCircle, CheckCircle, InfoIcon, AlertTriangle, X } from 'lucide-react';
import { useState } from 'react';

export default function Alert({ type = 'info', title, message, dismissible = true, icon: Icon, className = '' }) {
  const [isVisible, setIsVisible] = useState(true);

  const variants = {
    info: { bg: 'bg-blue-50 dark:bg-blue-900/20', border: 'border-blue-200 dark:border-blue-800', icon: InfoIcon, iconColor: 'text-blue-600 dark:text-blue-400' },
    success: { bg: 'bg-emerald-50 dark:bg-emerald-900/20', border: 'border-emerald-200 dark:border-emerald-800', icon: CheckCircle, iconColor: 'text-emerald-600 dark:text-emerald-400' },
    warning: { bg: 'bg-amber-50 dark:bg-amber-900/20', border: 'border-amber-200 dark:border-amber-800', icon: AlertTriangle, iconColor: 'text-amber-600 dark:text-amber-400' },
    error: { bg: 'bg-red-50 dark:bg-red-900/20', border: 'border-red-200 dark:border-red-800', icon: AlertCircle, iconColor: 'text-red-600 dark:text-red-400' },
  };

  const variant = variants[type];
  const AlertIcon = Icon || variant.icon;

  if (!isVisible) return null;

  return (
    <div className={`rounded-lg border ${variant.bg} ${variant.border} p-4 flex gap-3 ${className}`}>
      <AlertIcon className={`h-5 w-5 flex-shrink-0 mt-0.5 ${variant.iconColor}`} />
      <div className="flex-1">
        {title && <h4 className="font-semibold text-sm mb-1 text-[var(--text-primary)]">{title}</h4>}
        <p className="text-sm text-[var(--text-primary)]">{message}</p>
      </div>
      {dismissible && (
        <button
          onClick={() => setIsVisible(false)}
          className="text-[var(--text-faint)] hover:text-[var(--text-primary)] flex-shrink-0"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
