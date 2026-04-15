import { forwardRef } from 'react';
import AnimatedButton from './ui/AnimatedButton';

const Button = forwardRef(function Button({ variant = 'primary', className = '', children, ...props }, ref) {
  return (
    <AnimatedButton ref={ref} variant={variant} className={className} {...props}>
      {children}
    </AnimatedButton>
  );
});

export default Button;
