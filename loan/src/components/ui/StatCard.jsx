import PremiumCard from './PremiumCard';

export default function StatCard({ label, value, hint, tone = 'default' }) {
  const toneClasses = {
    default: 'text-[var(--text-primary)]',
    accent: 'text-[var(--accent)]',
    warning: 'text-[#c07d09]',
    success: 'text-[#047857]',
  };

  return (
    <PremiumCard className="h-full p-5" hover={false}>
      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--text-faint)]">{label}</p>
      <p className={`mt-2 text-2xl font-semibold ${toneClasses[tone] || toneClasses.default}`}>{value}</p>
      {hint && <p className="mt-2 text-xs text-[var(--text-muted)]">{hint}</p>}
    </PremiumCard>
  );
}
