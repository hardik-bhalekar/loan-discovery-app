import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Link } from 'react-router-dom';

export default function ScrollMorphHero() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end start'] });
  const textLines = ['Discover Your', 'Perfect Loan'];

  // Scroll-driven morphing transformations
  const scale = useTransform(scrollYProgress, [0, 0.6], [1, 0.97]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0.9]);
  const y = useTransform(scrollYProgress, [0, 0.6], [0, -26]);
  const rotation = useTransform(scrollYProgress, [0, 0.6], [0, 1.5]);

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[var(--bg-primary)] via-[var(--bg-secondary)] to-[var(--bg-primary)] pt-16"
    >
      {/* Hero-local background */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="hero-glow absolute inset-0 opacity-80" />
        <div className="absolute right-10 top-20 h-96 w-96 rounded-full bg-[var(--accent)]/10 blur-3xl" />
        <div className="absolute bottom-20 left-10 h-96 w-96 rounded-full bg-amber-500/10 blur-3xl" />
      </div>

      {/* Content Container */}
      <motion.div
        style={{ scale, y, opacity }}
        className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 pb-14 pt-6 sm:px-6 sm:pb-16 sm:pt-8 lg:px-8"
      >
        <div className="mx-auto max-w-5xl text-center">
          {/* Main Heading with Letter Spacing Morph */}
          <motion.div
            style={{ rotate: rotation }}
            className="mb-8"
          >
            <h1 className="text-5xl font-black leading-[1.04] tracking-tight text-[var(--text-primary)] sm:text-6xl md:text-7xl lg:text-[5rem]">
              {textLines.map((line, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                >
                  <span className="bg-gradient-to-r from-[var(--accent)] via-blue-500 to-purple-600 bg-clip-text text-transparent">
                    {line}
                  </span>
                </motion.div>
              ))}
            </h1>
          </motion.div>

          {/* Subtitle with Fade */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mx-auto mb-12 max-w-2xl text-lg leading-relaxed text-[var(--text-muted)] sm:text-xl"
          >
            Compare rates, calculate EMIs, and find the best loan options tailored to your needs with our intelligent loan discovery platform.
          </motion.p>

          {/* CTA Buttons with Stagger */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex items-center justify-center gap-4 sm:flex-row"
          >
            <Link to="/dashboard">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 rounded-full bg-[var(--accent)] px-8 py-4 font-semibold text-white shadow-[0_18px_34px_rgba(15,118,110,0.28)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[var(--accent-strong)] hover:shadow-[0_22px_40px_rgba(15,118,110,0.34)]"
              >
                Get Started
                <motion.span animate={{ x: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                  →
                </motion.span>
              </motion.button>
            </Link>

            <Link to="/login">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="rounded-full border border-[var(--border-medium)] px-8 py-4 font-semibold text-[var(--text-primary)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[var(--bg-secondary)]"
              >
                Secure Login
              </motion.button>
            </Link>
          </motion.div>

          {/* Stats Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-10 grid grid-cols-3 gap-4 border-t border-[var(--border-subtle)] pt-8 sm:gap-6"
          >
            {[
              { number: '100K+', label: 'Users' },
              { number: '₹50Cr', label: 'Loan Volume' },
              { number: '4.8★', label: 'Rating' }
            ].map((stat, i) => (
              <motion.div key={i} whileHover={{ scale: 1.1 }} className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-[var(--accent)] mb-1">{stat.number}</div>
                <div className="text-xs sm:text-sm text-[var(--text-faint)]">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        className="pointer-events-none absolute bottom-4 left-1/2 z-20 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="flex flex-col items-center gap-2 text-[var(--text-faint)]">
          <span className="text-xs font-medium">Scroll to explore</span>
          <div className="w-6 h-10 border-2 border-[var(--text-faint)] rounded-full flex justify-center p-2">
            <motion.div
              className="w-1 h-1.5 bg-[var(--text-faint)] rounded-full"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
