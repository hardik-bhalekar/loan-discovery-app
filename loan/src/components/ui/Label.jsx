import { forwardRef } from 'react';

const Label = forwardRef(({ className = '', children, required = false, ...props }, ref) => (
  <label
    ref={ref}
    className={`block text-sm font-medium text-[var(--text-primary)] mb-2 ${className}`}
    {...props}
  >
    {children}
    {required && <span className="ml-1 text-red-500">*</span>}
  </label>
));

Label.displayName = 'Label';

export default Label;
