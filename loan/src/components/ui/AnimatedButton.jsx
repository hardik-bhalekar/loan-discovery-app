import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const variants = {
  primary: 'bg-[var(--accent)] text-white hover:bg-[var(--accent-strong)] shadow-[0_8px_24px_rgba(17,95,89,0.25)]',
  secondary: 'bg-[var(--gold)] text-[var(--ink-900)] hover:bg-[#efc86a] shadow-[0_8px_20px_rgba(224,172,54,0.25)]',
  outline: 'border border-[var(--border-strong)] text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]',
  ghost: 'text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]',
};

const AnimatedButton = forwardRef(function AnimatedButton({
  children,
  type = 'button',
  variant = 'primary',
  loading = false,
  disabled = false,
  className = '',
  ...props
}, ref) {
  const isDisabled = disabled || loading;

  return (
    <motion.button
      ref={ref}
      type={type}
      whileHover={isDisabled ? {} : { y: -1, scale: 1.01 }}
      whileTap={isDisabled ? {} : { y: 0, scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 450, damping: 28 }}
      className={[
        'inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold',
        'transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-primary)]',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant] || variants.primary,
        className,
      ].join(' ')}
      disabled={isDisabled}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </motion.button>
  );
});

export default AnimatedButton;
