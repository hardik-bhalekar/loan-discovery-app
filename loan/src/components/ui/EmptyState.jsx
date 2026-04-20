import { Inbox } from 'lucide-react';

export default function EmptyState({ title = 'No data available', description = 'Try adjusting filters or inputs.' }) {
  return (
    <div className="rounded-[1.4rem] border border-dashed border-[var(--border-strong)] bg-[color-mix(in_oklab,var(--bg-card)_95%,transparent)] p-8 text-center shadow-[0_14px_32px_rgba(7,34,59,0.08)]">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--bg-secondary)] text-[var(--accent)]">
        <Inbox className="h-6 w-6" />
      </div>
      <h3 className="mt-4 text-sm font-semibold text-[var(--text-primary)]">{title}</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-[var(--text-muted)]">{description}</p>
    </div>
  );
}
