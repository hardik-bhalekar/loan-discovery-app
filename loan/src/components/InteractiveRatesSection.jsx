import { motion } from 'framer-motion';
import { useRef } from 'react';
import InteractiveRateCard from './InteractiveRateCard';

export default function InteractiveRatesSection() {
  const containerRef = useRef(null);

  const rates = [
    { bank: 'ICICI Bank', rate: 8.90, emi: 21250, trending: true },
    { bank: 'HDFC Bank', rate: 8.75, emi: 20890, featured: true },
    { bank: 'Axis Bank', rate: 9.15, emi: 21845, trending: false },
    { bank: 'SBI', rate: 8.85, emi: 21145, trending: true },
  ];

  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[var(--bg-primary)] to-[var(--bg-secondary)]">
      {/* Decorative Background */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <motion.div
          animate={{ x: [0, 30, 0], y: [0, 20, 0] }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute -right-32 -top-32 w-64 h-64 bg-[var(--accent)]/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ x: [0, -30, 0], y: [0, -20, 0] }}
          transition={{ duration: 25, repeat: Infinity }}
          className="absolute -left-32 -bottom-32 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl"
        />
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-4">
            Compare Best Rates
          </h2>
          <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
            Real-time rates from top banks. Calculate your EMI and find the perfect loan.
          </p>
        </motion.div>

        {/* Cards Grid */}
        <div
          ref={containerRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {rates.map((rate, index) => (
            <motion.div
              key={rate.bank}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <InteractiveRateCard
                bank={rate.bank}
                rate={rate.rate}
                tenure={5}
                loanAmount={2000000}
                emi={rate.emi}
                trending={rate.trending}
                featured={rate.featured}
              />
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <p className="text-[var(--text-secondary)] mb-6">
            Rates updated every 10 minutes • Compare up to 20+ lenders
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 bg-[var(--accent)] text-white font-semibold rounded-full hover:shadow-lg transition-all"
          >
            Compare All Rates →
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
