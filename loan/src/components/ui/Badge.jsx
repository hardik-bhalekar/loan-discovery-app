import { forwardRef } from 'react';
import { cva } from 'class-variance-authority';

const badgeVariants = cva(
  'inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap',
  {
    variants: {
      variant: {
        default: 'bg-[var(--accent)] text-white',
        secondary: 'bg-[var(--bg-secondary)] text-[var(--text-primary)]',
        outline: 'border border-[var(--border-medium)] text-[var(--text-primary)]',
        success: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
        warning: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
        danger: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

const Badge = forwardRef(({ className = '', variant, ...props }, ref) => (
  <span ref={ref} className={badgeVariants({ variant, className })} {...props} />
));

Badge.displayName = 'Badge';

export default Badge;
export { badgeVariants };
