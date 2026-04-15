import { forwardRef } from 'react';
import { cva } from 'class-variance-authority';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
  {
    variants: {
      variant: {
        primary: 'bg-[var(--accent)] text-white hover:bg-[var(--accent)]/90 focus:ring-[var(--accent)]',
        secondary: 'bg-[var(--bg-secondary)] text-[var(--text-primary)] hover:bg-[var(--border-medium)] focus:ring-[var(--accent)]',
        outline: 'bg-transparent border border-[var(--border-medium)] text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] focus:ring-[var(--accent)]',
        ghost: 'bg-transparent text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] focus:ring-[var(--accent)]',
        danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-600',
        success: 'bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-600',
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
