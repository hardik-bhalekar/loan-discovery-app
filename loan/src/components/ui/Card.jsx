import { forwardRef } from 'react';

const Card = forwardRef(({ className = '', children, borderless = false, interactive = false, ...props }, ref) => (
  <div
    ref={ref}
    className={`rounded-[1.4rem] bg-[var(--bg-card)] transition-all duration-300 ${
      !borderless ? 'border border-[var(--border-subtle)] shadow-[0_14px_34px_rgba(7,34,59,0.11)]' : ''
    } ${interactive ? 'hover:-translate-y-1 hover:border-[var(--border-medium)] hover:shadow-[0_22px_46px_rgba(7,34,59,0.18)]' : ''} ${className}`}
    {...props}
  >
    {children}
  </div>
));

Card.displayName = 'Card';

const CardHeader = forwardRef(({ className = '', children, ...props }, ref) => (
  <div ref={ref} className={`border-b border-[var(--border-subtle)] px-6 py-5 ${className}`} {...props}>
    {children}
  </div>
));

CardHeader.displayName = 'CardHeader';

const CardBody = forwardRef(({ className = '', children, ...props }, ref) => (
  <div ref={ref} className={`p-6 ${className}`} {...props}>
    {children}
  </div>
));

CardBody.displayName = 'CardBody';

const CardFooter = forwardRef(({ className = '', children, ...props }, ref) => (
  <div ref={ref} className={`flex gap-3 border-t border-[var(--border-subtle)] px-6 py-4 ${className}`} {...props}>
    {children}
  </div>
));

CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardBody, CardFooter };
