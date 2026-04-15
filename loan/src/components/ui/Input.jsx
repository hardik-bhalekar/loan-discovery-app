import { forwardRef } from 'react';
import { cva } from 'class-variance-authority';

const inputVariants = cva(
  'w-full px-4 py-2.5 rounded-lg border border-[var(--border-medium)] bg-[var(--bg-secondary)] text-[var(--text-primary)] placeholder:text-[var(--text-faint)] transition-colors focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20',
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
