export default function SectionHeader({ eyebrow, title, description, align = 'left', className = '' }) {
  return (
    <div className={[align === 'center' ? 'text-center' : '', className].join(' ')}>
      {eyebrow && <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">{eyebrow}</p>}
      <h2 className="text-balance text-2xl font-semibold leading-tight tracking-tight text-[var(--text-primary)] sm:text-3xl">{title}</h2>
      {description && <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[var(--text-muted)] sm:text-base">{description}</p>}
    </div>
  );
}
