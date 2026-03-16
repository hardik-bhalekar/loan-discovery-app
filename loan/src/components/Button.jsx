import { forwardRef } from 'react';

const Button = forwardRef(function Button(
  { variant = 'primary', className = '', children, ...props },
  ref
) {
  const base = 'inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium transition-colors cursor-pointer disabled:opacity-50';

  const styles = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50',
    secondary: 'bg-amber-500 text-white hover:bg-amber-600',
  };

  return (
    <button ref={ref} className={`${base} ${styles[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
});

export default Button;
