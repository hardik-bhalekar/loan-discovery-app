import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Landmark, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from './ThemeToggle';
import PageContainer from './ui/PageContainer';
import { clearAuthToken, getAuthUser, isAuthenticated } from '../utils/api';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const authenticated = isAuthenticated();
  const authUser = getAuthUser();

  const links = authenticated
    ? [
        { to: '/', label: 'Home' },
        { to: '/dashboard', label: 'Dashboard' },
      ]
    : [
        { to: '/', label: 'Home' },
        { to: '/dashboard', label: 'Dashboard' },
        { to: '/login', label: 'Login' },
      ];

  const handleLogout = () => {
    clearAuthToken();
    setOpen(false);
    navigate('/login', { replace: true });
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-[var(--border-subtle)] bg-[color-mix(in_oklab,var(--bg-card)_88%,transparent)] backdrop-blur-xl">
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
                      'relative rounded-full px-3.5 py-2 text-sm font-semibold transition-all',
                      active
                        ? 'bg-[var(--bg-secondary)] text-[var(--accent)]'
                        : 'text-[var(--text-muted)] hover:bg-[var(--bg-secondary)]/70 hover:text-[var(--text-primary)]',
                    ].join(' ')}
                  >
                    {link.label}
                    {active && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="absolute inset-x-3 bottom-1 h-0.5 rounded-full bg-[var(--accent)]"
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
            {authenticated ? (
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-full border border-[var(--border-medium)] px-4 py-2 text-sm font-semibold text-[var(--text-primary)] transition-all hover:-translate-y-0.5 hover:bg-[var(--bg-secondary)]"
              >
                Logout{authUser?.name ? ` • ${authUser.name.split(' ')[0]}` : ''}
              </button>
            ) : null}
          </div>

          <motion.button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            className="inline-flex rounded-xl p-2 text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] md:hidden"
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
              className="space-y-2 overflow-hidden border-t border-[var(--border-subtle)] py-3 md:hidden"
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
              {authenticated ? (
                <button
                  type="button"
                  onClick={handleLogout}
                  className="block w-full rounded-lg px-3 py-2 text-left text-sm font-semibold text-red-600 transition-all hover:bg-[var(--bg-secondary)]"
                >
                  Logout
                </button>
              ) : null}
              <ThemeToggle />
            </motion.div>
          )}
        </AnimatePresence>
      </PageContainer>
    </nav>
  );
}
