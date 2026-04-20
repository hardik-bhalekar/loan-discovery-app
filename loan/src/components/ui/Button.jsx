import { forwardRef } from 'react';
import { cva } from 'class-variance-authority';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-[var(--accent)] text-white shadow-[0_14px_26px_rgba(15,118,110,0.28)] hover:-translate-y-0.5 hover:bg-[var(--accent-strong)] hover:shadow-[0_18px_32px_rgba(15,118,110,0.34)] focus:ring-[var(--accent)]',
        secondary: 'border border-[var(--border-subtle)] bg-[var(--bg-card)] text-[var(--text-primary)] hover:-translate-y-0.5 hover:border-[var(--border-medium)] hover:bg-[var(--bg-secondary)] focus:ring-[var(--accent)]',
        outline: 'border border-[var(--border-medium)] bg-transparent text-[var(--text-primary)] hover:-translate-y-0.5 hover:bg-[var(--bg-secondary)] focus:ring-[var(--accent)]',
        ghost: 'bg-transparent text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] focus:ring-[var(--accent)]',
        danger: 'bg-red-600 text-white shadow-[0_14px_26px_rgba(220,38,38,0.22)] hover:-translate-y-0.5 hover:bg-red-700 focus:ring-red-600',
        success: 'bg-emerald-600 text-white shadow-[0_14px_26px_rgba(16,185,129,0.22)] hover:-translate-y-0.5 hover:bg-emerald-700 focus:ring-emerald-600',
      },
      size: {
        xs: 'px-3 py-1.5 text-xs',
        sm: 'px-3 py-2 text-sm',
        md: 'px-4 py-2.5 text-sm',
        lg: 'px-6 py-3 text-base',
        xl: 'px-8 py-3.5 text-base',
      },
      fullWidth: {
        true: 'w-full',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      fullWidth: false,
    },
  }
);

const Button = forwardRef(({ className, variant, size, fullWidth, ...props }, ref) => (
  <button ref={ref} className={buttonVariants({ variant, size, fullWidth, className })} {...props} />
));

Button.displayName = 'Button';

export default Button;
export { buttonVariants };
