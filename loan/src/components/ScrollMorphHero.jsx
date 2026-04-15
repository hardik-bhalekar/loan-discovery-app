import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';

export default function ScrollMorphHero() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const [textLines, setTextLines] = useState(['Discover Your', 'Perfect Loan']);

  // Scroll-driven morphing transformations
  const scale = useTransform(scrollYProgress, [0, 0.4], [1, 0.8]);
  const opacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.4], [0, -80]);
  const blur = useTransform(scrollYProgress, [0, 0.5], [0, 10]);
  const rotation = useTransform(scrollYProgress, [0, 0.4], [0, 3]);

  return (
    <div
      ref={containerRef}
      className="relative min-h-[150vh] bg-gradient-to-b from-[var(--bg-primary)] via-[var(--bg-secondary)] to-[var(--bg-primary)]"
    >
      {/* Fixed Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-radial from-[var(--accent)]/20 via-transparent to-transparent" />
        <div className="absolute top-20 right-10 w-96 h-96 bg-[var(--accent)]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
      </div>

      {/* Content Container */}
      <motion.div
        style={{ scale, y, opacity }}
        className="sticky top-0 h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-5xl mx-auto text-center">
          {/* Main Heading with Letter Spacing Morph */}
          <motion.div
            style={{ rotate: rotation }}
            className="mb-8"
          >
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-[var(--text-primary)] leading-tight">
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
            className="text-lg sm:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            Compare rates, calculate EMIs, and find the best loan options tailored to your needs with our intelligent loan discovery platform.
          </motion.p>

          {/* CTA Buttons with Stagger */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-4 bg-[var(--accent)] text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
            >
              Get Started
              <motion.span animate={{ x: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                →
              </motion.span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-4 border-2 border-[var(--border-medium)] text-[var(--text-primary)] font-semibold rounded-full hover:bg-[var(--bg-secondary)] transition-all duration-300"
            >
              Learn More
            </motion.button>
          </motion.div>

          {/* Stats Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-3 gap-6 mt-16 pt-16 border-t border-[var(--border-subtle)]"
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
        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-20"
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
