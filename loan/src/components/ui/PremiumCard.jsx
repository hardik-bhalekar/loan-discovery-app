import { motion } from 'framer-motion';

export default function PremiumCard({ className = '', children, hover = true }) {
  const Comp = hover ? motion.div : 'div';

  return (
    <Comp
      whileHover={hover ? { y: -4 } : undefined}
      transition={{ type: 'spring', stiffness: 360, damping: 24 }}
      className={[
        'rounded-2xl border border-[var(--border-medium)] bg-[var(--bg-card)] p-6',
        'shadow-[0_8px_24px_rgba(7,34,59,0.06)]',
        hover ? 'hover:border-[var(--accent-soft)] hover:shadow-[0_12px_36px_rgba(8,95,132,0.14)]' : '',
        className,
      ].join(' ')}
    >
      {children}
    </Comp>
  );
}
