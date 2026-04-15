import { Inbox } from 'lucide-react';

export default function EmptyState({ title = 'No data available', description = 'Try adjusting filters or inputs.' }) {
  return (
    <div className="rounded-2xl border border-dashed border-[var(--border-strong)] bg-[var(--bg-card)] p-8 text-center">
      <Inbox className="mx-auto h-7 w-7 text-[var(--text-faint)]" />
      <h3 className="mt-3 text-sm font-semibold text-[var(--text-primary)]">{title}</h3>
      <p className="mt-1 text-xs text-[var(--text-muted)]">{description}</p>
    </div>
  );
}
