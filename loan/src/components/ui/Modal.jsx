import { useEffect, forwardRef } from 'react';
import { X } from 'lucide-react';

const Modal = forwardRef(
  ({ isOpen, onClose, title, children, size = 'md', closeButton = true }, ref) => {
    useEffect(() => {
      if (isOpen) {
        document.body.style.overflow = 'hidden';
      }
      return () => {
        document.body.style.overflow = 'unset';
      };
    }, [isOpen]);

    if (!isOpen) return null;

    const sizeClasses = {
      sm: 'max-w-sm',
      md: 'max-w-md',
      lg: 'max-w-lg',
      xl: 'max-w-xl',
      '2xl': 'max-w-2xl',
    };

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <div
          ref={ref}
          className={`relative rounded-2xl border border-[var(--border-medium)] bg-[var(--bg-card)] shadow-2xl ${sizeClasses[size]} mx-4`}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[var(--border-subtle)] px-6 py-4">
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">{title}</h2>
            {closeButton && (
              <button
                onClick={onClose}
                className="text-[var(--text-faint)] hover:text-[var(--text-primary)] transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>

          {/* Content */}
          <div className="p-6">{children}</div>
        </div>
      </div>
    );
  }
);

Modal.displayName = 'Modal';

export default Modal;
