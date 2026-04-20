import { motion } from 'framer-motion';

export default function PremiumCard({ className = '', children, hover = true }) {
  const Comp = hover ? motion.div : 'div';

  return (
    <Comp
      whileHover={hover ? { y: -4 } : undefined}
      transition={{ type: 'spring', stiffness: 320, damping: 26 }}
      className={[
        'rounded-[1.4rem] border border-[var(--border-subtle)] bg-[color-mix(in_oklab,var(--bg-card)_95%,transparent)] p-6',
        'shadow-[0_14px_32px_rgba(7,34,59,0.11)] backdrop-blur-sm',
        hover ? 'hover:border-[var(--border-medium)] hover:shadow-[0_22px_46px_rgba(7,34,59,0.18)]' : '',
        className,
      ].join(' ')}
    >
      {children}
    </Comp>
  );
}
