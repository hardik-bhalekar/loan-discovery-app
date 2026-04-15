import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Landmark, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from './ThemeToggle';
import PageContainer from './ui/PageContainer';

export default function Navbar() {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const links = [
    { to: '/', label: 'Home' },
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/login', label: 'Login' },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-[var(--border-subtle)] bg-[color-mix(in_oklab,var(--bg-card)_86%,transparent)] backdrop-blur-xl">
      <PageContainer>
        <div className="flex h-16 items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link to="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
              <motion.div
                whileHover={{ scale: 1.1, rotate: 10 }}
                whileTap={{ scale: 0.95 }}
              >
                <Landmark className="h-6 w-6 text-[var(--accent)]" />
              </motion.div>
              <span className="text-lg font-semibold tracking-tight text-[var(--text-primary)]">LoanSmart</span>
            </Link>
          </motion.div>

          <div className="hidden items-center gap-2 md:flex">
            {links.map((link, index) => {
              const active = location.pathname === link.to;
              return (
                <motion.div
                  key={link.to}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Link
                    to={link.to}
                    className={[
                      'rounded-lg px-3 py-2 text-sm font-semibold transition-all relative',
                      active
                        ? 'text-[var(--accent)]'
                        : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]',
                    ].join(' ')}
                  >
                    {link.label}
                    {active && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--accent)] rounded-full"
                        transition={{ duration: 0.3 }}
                      />
                    )}
                  </Link>
                </motion.div>
              );
            })}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <ThemeToggle />
            </motion.div>
          </div>

          <motion.button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            className="inline-flex rounded-lg p-2 text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] md:hidden"
            aria-label="Toggle menu"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <AnimatePresence mode="wait">
              {open ? (
                <motion.div key="close" initial={{ rotate: -90 }} animate={{ rotate: 0 }} exit={{ rotate: 90 }} transition={{ duration: 0.2 }}>
                  <X className="h-5 w-5" />
                </motion.div>
              ) : (
                <motion.div key="menu" initial={{ rotate: 90 }} animate={{ rotate: 0 }} exit={{ rotate: -90 }} transition={{ duration: 0.2 }}>
                  <Menu className="h-5 w-5" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-2 border-t border-[var(--border-subtle)] py-3 md:hidden overflow-hidden"
            >
              {links.map((link) => {
                const active = location.pathname === link.to;
                return (
                  <motion.div
                    key={link.to}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Link
                      to={link.to}
                      onClick={() => setOpen(false)}
                      className={[
                        'block rounded-lg px-3 py-2 text-sm font-semibold transition-all',
                        active ? 'bg-[var(--bg-secondary)] text-[var(--accent)]' : 'text-[var(--text-muted)]',
                      ].join(' ')}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                );
              })}
              <ThemeToggle />
            </motion.div>
          )}
        </AnimatePresence>
      </PageContainer>
    </nav>
  );
}
