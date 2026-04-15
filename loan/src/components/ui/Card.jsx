import { forwardRef } from 'react';

const Card = forwardRef(({ className = '', children, borderless = false, interactive = false, ...props }, ref) => (
  <div
    ref={ref}
    className={`rounded-2xl transition-all duration-200 ${
      !borderless ? 'border border-[var(--border-medium)] shadow-sm' : ''
    } ${interactive ? 'hover:shadow-lg hover:border-[var(--accent)]' : ''} bg-[var(--bg-card)] ${className}`}
    {...props}
  >
    {children}
  </div>
));

Card.displayName = 'Card';

const CardHeader = forwardRef(({ className = '', children, ...props }, ref) => (
  <div ref={ref} className={`px-6 py-4 border-b border-[var(--border-subtle)] ${className}`} {...props}>
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
  <div ref={ref} className={`px-6 py-4 border-t border-[var(--border-subtle)] flex gap-3 ${className}`} {...props}>
    {children}
  </div>
));

CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardBody, CardFooter };
