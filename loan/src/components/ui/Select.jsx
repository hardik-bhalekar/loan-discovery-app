import { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';

const Select = forwardRef(({ className = '', children, variant = 'default', size = 'md', ...props }, ref) => {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-5 py-3 text-base',
  };

  return (
    <div className="relative inline-block w-full">
      <select
        ref={ref}
        className={`
          w-full appearance-none rounded-lg border border-[var(--border-medium)] 
          bg-[var(--bg-secondary)] text-[var(--text-primary)] 
          placeholder:text-[var(--text-faint)] 
          transition-colors focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20
          ${sizeClasses[size]} ${className}
        `}
        {...props}
      >
        {children}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-faint)] pointer-events-none" />
    </div>
  );
});

Select.displayName = 'Select';

export default Select;
