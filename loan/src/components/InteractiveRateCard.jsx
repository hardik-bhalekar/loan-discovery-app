import { motion } from 'framer-motion';
import { TrendingDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardBody } from './ui/Card';

export default function InteractiveRateCard({ bank, rate, tenure, loanAmount, emi, trending, featured = false }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(0,0,0,0.15)' }}
      transition={{ duration: 0.3 }}
      className="h-full"
    >
      <Card interactive={!featured} className={featured ? 'border-[var(--accent)] border-2 shadow-2xl' : ''}>
        <CardBody className="relative">
          {featured && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute -top-3 right-4"
            >
              <span className="px-3 py-1 bg-[var(--accent)] text-white text-xs font-bold rounded-full">
                Featured
              </span>
            </motion.div>
          )}

          <div className="mb-6 mt-2">
            <h3 className="text-lg font-bold text-[var(--text-primary)] mb-1">{bank}</h3>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black text-[var(--accent)]">{rate}%</span>
              <span className="text-xs text-[var(--text-faint)]">p.a.</span>
            </div>
          </div>

          {trending && (
            <motion.div
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="mb-4 flex items-center gap-2 text-emerald-600 text-xs font-semibold"
            >
              <TrendingDown className="h-4 w-4" />
              <span>Rate down by 0.5%</span>
            </motion.div>
          )}

          <div className="space-y-3 py-4 border-y border-[var(--border-subtle)]">
            <div className="flex justify-between text-sm">
              <span className="text-[var(--text-faint)]">Loan Amount</span>
              <span className="font-semibold text-[var(--text-primary)]">₹{(loanAmount / 100000).toFixed(1)}L</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[var(--text-faint)]">Monthly EMI</span>
              <span className="font-bold text-[var(--accent)]">₹{(emi / 1000).toFixed(0)}k</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[var(--text-faint)]">Tenure</span>
              <span className="font-semibold text-[var(--text-primary)]">{tenure} years</span>
            </div>
          </div>

          <Link to="/dashboard" className="block w-full mt-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`w-full py-2.5 rounded-lg font-semibold text-sm transition-all ${
                featured
                  ? 'bg-[var(--accent)] text-white hover:shadow-lg'
                  : 'border border-[var(--border-medium)] text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]'
              }`}
            >
              {featured ? 'Apply Now' : 'View Details'}
            </motion.button>
          </Link>
        </CardBody>
      </Card>
    </motion.div>
  );
}
