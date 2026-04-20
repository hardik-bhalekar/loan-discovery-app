import { forwardRef } from 'react';
import { cva } from 'class-variance-authority';

const inputVariants = cva(
  'w-full rounded-xl border border-[var(--border-medium)] bg-[color-mix(in_oklab,var(--bg-card)_92%,var(--bg-secondary)_8%)] px-4 py-3 text-[var(--text-primary)] placeholder:text-[var(--text-faint)] shadow-[0_1px_0_rgba(255,255,255,0.25)] transition-all duration-200 focus:outline-none focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent)]/15',
  {
    variants: {
      size: {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2.5 text-sm',
        lg: 'px-5 py-3 text-base',
      },
      variant: {
        default: 'border-[var(--border-medium)]',
        error: 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
        success: 'border-emerald-500 focus:border-emerald-500 focus:ring-emerald-500/20',
      },
    },
    defaultVariants: {
      size: 'md',
      variant: 'default',
    },
  }
);

const Input = forwardRef(({ className = '', size, variant, type = 'text', ...props }, ref) => (
  <input
    ref={ref}
    type={type}
    className={inputVariants({ size, variant, className })}
    {...props}
  />
));

Input.displayName = 'Input';

export default Input;
export { inputVariants };
