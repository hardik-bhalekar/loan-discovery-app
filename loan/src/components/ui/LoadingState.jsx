import { Loader2 } from 'lucide-react';

export default function LoadingState({ label = 'Loading' }) {
  return (
    <div className="flex min-h-40 items-center justify-center rounded-[1.4rem] border border-dashed border-[var(--border-strong)] bg-[color-mix(in_oklab,var(--bg-card)_94%,transparent)] p-6 text-sm text-[var(--text-muted)] shadow-[0_14px_32px_rgba(7,34,59,0.08)]">
      <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-secondary)] px-4 py-2 font-medium text-[var(--text-primary)]">
        <Loader2 className="h-4 w-4 animate-spin text-[var(--accent)]" />
        {label}
      </span>
    </div>
  );
}
