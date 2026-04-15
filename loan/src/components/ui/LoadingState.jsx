import { Loader2 } from 'lucide-react';

export default function LoadingState({ label = 'Loading' }) {
  return (
    <div className="flex min-h-36 items-center justify-center rounded-2xl border border-dashed border-[var(--border-strong)] bg-[var(--bg-card)] p-6 text-sm text-[var(--text-muted)]">
      <span className="inline-flex items-center gap-2">
        <Loader2 className="h-4 w-4 animate-spin" />
        {label}
      </span>
    </div>
  );
}
