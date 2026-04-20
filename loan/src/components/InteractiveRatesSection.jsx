import { motion } from 'framer-motion';
import { useRef } from 'react';
import InteractiveRateCard from './InteractiveRateCard';
import PageContainer from './ui/PageContainer';
import SectionHeader from './ui/SectionHeader';

export default function InteractiveRatesSection() {
  const containerRef = useRef(null);

  const rates = [
    { bank: 'ICICI Bank', rate: 8.90, emi: 21250, trending: true },
    { bank: 'HDFC Bank', rate: 8.75, emi: 20890, featured: true },
    { bank: 'Axis Bank', rate: 9.15, emi: 21845, trending: false },
    { bank: 'SBI', rate: 8.85, emi: 21145, trending: true },
  ];

  return (
    <section className="relative overflow-hidden py-20">
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

      <PageContainer>
        <SectionHeader
          eyebrow="Live Rates"
          title="Compare the best offers with a cleaner, more confident view"
          description="Real-time rates from top banks, presented with tighter hierarchy and a premium comparison feel."
          align="center"
          className="mx-auto mb-14 max-w-3xl"
        />

        {/* Cards Grid */}
        <div
          ref={containerRef}
          className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4"
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
          <p className="mb-6 text-sm text-[var(--text-muted)]">
            Rates updated every 10 minutes • Compare up to 20+ lenders
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="rounded-full bg-[var(--accent)] px-8 py-3 font-semibold text-white shadow-[0_16px_30px_rgba(15,118,110,0.24)] transition-all hover:bg-[var(--accent-strong)] hover:shadow-[0_20px_36px_rgba(15,118,110,0.32)]"
          >
            Compare All Rates →
          </motion.button>
        </motion.div>
      </PageContainer>
    </section>
  );
}
