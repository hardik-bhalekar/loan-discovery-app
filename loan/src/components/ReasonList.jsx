import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

export default function ReasonList({ eligible, reason }) {
  return (
    <div className={`p-4 rounded-xl border ${eligible ? 'bg-emerald-50/50 border-emerald-100 dark:bg-emerald-950/20 dark:border-emerald-900' : 'bg-red-50/50 border-red-100 dark:bg-red-950/20 dark:border-red-900'} flex items-start gap-3`}>
      {eligible ? (
        <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
      ) : (
        <XCircle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
      )}
      <div>
        <h4 className={`text-sm font-semibold ${eligible ? 'text-emerald-900 dark:text-emerald-400' : 'text-red-900 dark:text-red-400'}`}>
          {eligible ? 'Eligible' : 'Not Eligible'}
        </h4>
        <p className={`text-xs mt-1 ${eligible ? 'text-emerald-700 dark:text-emerald-500' : 'text-red-700 dark:text-red-500'}`}>
          {reason}
        </p>
      </div>
    </div>
  );
}
