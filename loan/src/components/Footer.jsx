import { Landmark } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-[var(--border-subtle)] bg-[var(--bg-card)]/85 backdrop-blur">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Landmark className="h-5 w-5 text-[var(--accent)]" />
            <span className="text-sm font-semibold text-[var(--text-primary)]">LoanSmart</span>
          </div>

          <div className="flex items-center gap-6">
            {['About', 'Privacy', 'Contact'].map((item) => (
              <span key={item} className="cursor-pointer text-sm text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]">
                {item}
              </span>
            ))}
            <a href="#" className="text-sm text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]">
              GitHub
            </a>
          </div>

          <p className="text-xs text-[var(--text-faint)]">
            © {new Date().getFullYear()} LoanSmart
          </p>
        </div>
      </div>
    </footer>
  );
}
