import { useMemo, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, BarChart3, ShieldCheck, Sparkles, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import AnimatedButton from '../ui/AnimatedButton';
import PageContainer from '../ui/PageContainer';

const previewRows = [
  { bank: 'SBI', rate: '8.50%', emi: 'Rs 20,478' },
  { bank: 'HDFC', rate: '9.00%', emi: 'Rs 21,048' },
  { bank: 'ICICI', rate: '9.25%', emi: 'Rs 21,337' },
];

export default function ScrollMorphHero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });

  const scale = useTransform(scrollYProgress, [0, 0.6], [1, 1.12]);
  const blur = useTransform(scrollYProgress, [0, 0.6], [0, 8]);
  const y = useTransform(scrollYProgress, [0, 0.6], [0, -80]);
  const radius = useTransform(scrollYProgress, [0, 0.6], [28, 16]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.35], [1, 0.2]);
  const dashboardOpacity = useTransform(scrollYProgress, [0.18, 0.55], [0.1, 1]);

  const stats = useMemo(
    () => [
      { icon: Sparkles, label: 'Smart ranking', value: '10 banks' },
      { icon: ShieldCheck, label: 'Data confidence', value: 'Real-time' },
      { icon: TrendingUp, label: 'Rate insights', value: 'City aware' },
    ],
    []
  );

  return (
    <section ref={ref} className="relative isolate overflow-hidden py-20 sm:py-24">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_8%_18%,rgba(36,132,123,0.25),transparent_35%),radial-gradient(circle_at_88%_20%,rgba(15,70,113,0.22),transparent_34%),radial-gradient(circle_at_52%_92%,rgba(227,188,83,0.16),transparent_34%)]" />
      <PageContainer className="relative">
        <motion.div style={{ y }} className="grid items-center gap-10 lg:grid-cols-[1.12fr_1fr]">
          <motion.div style={{ opacity: titleOpacity }}>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--text-faint)]">LoanSmart Platform</p>
            <h1 className="text-balance text-4xl font-semibold leading-tight text-[var(--text-primary)] sm:text-5xl lg:text-6xl">
              From one elegant card to a full lending dashboard as you scroll.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-[var(--text-muted)]">
              Discover rates, compare EMIs, and get ranked picks in a seamless motion-led experience crafted for modern fintech journeys.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/dashboard">
                <AnimatedButton className="group">
                  Start Exploring
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </AnimatedButton>
              </Link>
              <Link to="/login">
                <AnimatedButton variant="outline">Secure Login</AnimatedButton>
              </Link>
            </div>
          </motion.div>

          <motion.div
            style={{ scale, borderRadius: radius, filter: useTransform(blur, (v) => `blur(${v * 0.08}px)`) }}
            className="relative overflow-hidden border border-white/45 bg-[linear-gradient(145deg,rgba(255,255,255,0.76),rgba(255,255,255,0.34))] p-6 shadow-[0_24px_60px_rgba(6,44,72,0.22)] backdrop-blur-2xl dark:border-white/15 dark:bg-[linear-gradient(145deg,rgba(12,24,37,0.82),rgba(11,29,43,0.46))]"
          >
            <motion.div style={{ opacity: titleOpacity }} className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-faint)]">Card View</p>
              <h3 className="text-lg font-semibold text-[var(--text-primary)]">Your best loan profile snapshot</h3>
              <div className="grid gap-3 sm:grid-cols-3">
                {stats.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="rounded-xl border border-[var(--border-medium)] bg-[var(--bg-card)]/80 p-3">
                      <Icon className="h-4 w-4 text-[var(--accent)]" />
                      <p className="mt-2 text-xs text-[var(--text-faint)]">{item.label}</p>
                      <p className="mt-1 text-sm font-semibold text-[var(--text-primary)]">{item.value}</p>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            <motion.div style={{ opacity: dashboardOpacity }} className="absolute inset-0 rounded-[inherit] bg-[var(--bg-card)]/88 p-5 backdrop-blur-md">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--text-faint)]">Dashboard Preview</p>
                  <h3 className="text-base font-semibold text-[var(--text-primary)]">Live comparisons</h3>
                </div>
                <BarChart3 className="h-5 w-5 text-[var(--accent)]" />
              </div>
              <div className="space-y-2">
                {previewRows.map((row) => (
                  <div key={row.bank} className="grid grid-cols-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)]/80 px-3 py-2 text-xs">
                    <span className="font-semibold text-[var(--text-primary)]">{row.bank}</span>
                    <span className="text-[var(--text-muted)]">{row.rate}</span>
                    <span className="text-right font-semibold text-[var(--accent)]">{row.emi}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </PageContainer>
    </section>
  );
}
