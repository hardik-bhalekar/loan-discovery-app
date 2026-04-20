import { lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ClipboardList, Search, GitCompare, Award, Clock, Shield, Sparkles, Home, GraduationCap, Car, Wallet } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ScrollMorphHero from '../components/ScrollMorphHero';
import InteractiveRatesSection from '../components/InteractiveRatesSection';
import AnimatedButton from '../components/ui/AnimatedButton';
import PremiumCard from '../components/ui/PremiumCard';
import PageContainer from '../components/ui/PageContainer';
import SectionHeader from '../components/ui/SectionHeader';
import LoadingState from '../components/ui/LoadingState';

const GlobeSection = lazy(() => import('../components/sections/GlobeSection'));

const steps = [
  { icon: ClipboardList, title: 'Enter Details', desc: 'Share your income, credit score, and preferred tenure in less than a minute.' },
  { icon: Search, title: 'Check Eligibility', desc: 'Get instant confidence labels for each loan category with transparent criteria.' },
  { icon: GitCompare, title: 'Compare Banks', desc: 'Sort offers by rate, EMI, and total cost in one clean comparison workflow.' },
  { icon: Award, title: 'Choose Top Pick', desc: 'Use ranked recommendations with reasons designed for decision clarity.' },
];

const benefits = [
  { icon: Clock, title: 'Speed', desc: 'Save hours with one dashboard for calculations, eligibility, and bank discovery.' },
  { icon: GitCompare, title: 'Precision', desc: 'EMI and total payment math update in real time as you tweak profile values.' },
  { icon: Shield, title: 'Transparency', desc: 'No hidden assumptions. Every recommendation includes confidence and rationale.' },
  { icon: Sparkles, title: 'Personalization', desc: 'Profile-aware ranking adapts offers to affordability and tenure fit.' },
];

const loanTypes = [
  { icon: Wallet, name: 'Personal Loan', rate: 'From 10.50%' },
  { icon: Home, name: 'Home Loan', rate: 'From 8.40%' },
  { icon: GraduationCap, name: 'Education Loan', rate: 'From 9.00%' },
  { icon: Car, name: 'Vehicle Loan', rate: 'From 9.25%' },
];

const banks = ['SBI', 'HDFC', 'ICICI', 'Axis', 'Kotak', 'Bank of Baroda', 'PNB', 'IndusInd'];

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 pb-10">
        <ScrollMorphHero />

        <section className="pt-10 pb-14 sm:pt-12 sm:pb-16 lg:pt-14 lg:pb-20">
          <PageContainer>
            <SectionHeader
              eyebrow="How It Works"
              title="A compact flow built for fast loan decisions"
              description="Every step is designed for clarity, speed, and confidence across desktop and mobile journeys."
              align="center"
              className="mb-10"
            />

            <div className="premium-grid grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {steps.map((step) => {
                const Icon = step.icon;
                return (
                  <PremiumCard key={step.title} className="h-full">
                    <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--bg-secondary)] text-[var(--accent)]">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-base font-semibold text-[var(--text-primary)]">{step.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-[var(--text-muted)]">{step.desc}</p>
                  </PremiumCard>
                );
              })}
            </div>
          </PageContainer>
        </section>

        <section className="py-16 sm:py-20">
          <PageContainer>
            <SectionHeader
              eyebrow="Benefits"
              title="Premium tooling for practical borrowing"
              description="From exploration to shortlisting, every interaction is tuned for trust and usability."
              align="center"
              className="mb-10"
            />
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {benefits.map((benefit) => {
                const Icon = benefit.icon;
                return (
                  <PremiumCard key={benefit.title} className="h-full">
                    <div className="flex gap-4">
                      <div className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--bg-secondary)] text-[var(--accent)]">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-base font-semibold text-[var(--text-primary)]">{benefit.title}</h3>
                        <p className="mt-2 text-sm text-[var(--text-muted)]">{benefit.desc}</p>
                      </div>
                    </div>
                  </PremiumCard>
                );
              })}
            </div>
          </PageContainer>
        </section>

        <InteractiveRatesSection />

        <Suspense fallback={<PageContainer><LoadingState label="Loading market globe" /></PageContainer>}>
          <GlobeSection />
        </Suspense>

        <section className="py-16 sm:py-20">
          <PageContainer>
            <SectionHeader
              eyebrow="Coverage"
              title="Loan categories and lenders you can compare instantly"
              align="center"
              className="mb-10"
            />

            <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
              {loanTypes.map((loan) => {
                const Icon = loan.icon;
                return (
                  <PremiumCard key={loan.name} className="h-full text-center">
                    <div className="mx-auto mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--bg-secondary)] text-[var(--accent)]">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-sm font-semibold text-[var(--text-primary)]">{loan.name}</h3>
                    <p className="mt-1 text-xs text-[var(--text-muted)]">{loan.rate}</p>
                  </PremiumCard>
                );
              })}
            </div>

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              {banks.map((bank) => (
                <span key={bank} className="rounded-full border border-[var(--border-medium)] bg-[var(--bg-card)] px-4 py-2 text-xs font-semibold text-[var(--text-muted)]">
                  {bank}
                </span>
              ))}
            </div>
          </PageContainer>
        </section>

        <section className="pb-16 sm:pb-20">
          <PageContainer>
            <div className="overflow-hidden rounded-[1.9rem] border border-[var(--border-medium)] bg-[linear-gradient(140deg,#0f766e,#145980)] p-8 text-center shadow-[0_22px_48px_rgba(10,52,76,0.38)] sm:p-12">
              <h2 className="text-2xl font-semibold text-white sm:text-3xl">Ready to shortlist your next loan with confidence?</h2>
              <p className="mx-auto mt-3 max-w-xl text-sm text-white/85 sm:text-base">
                Launch the dashboard to calculate EMIs, compare top banks, and act on personalized recommendations.
              </p>
              <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
                <Link to="/dashboard">
                  <AnimatedButton variant="secondary" className="min-w-40">
                    Open Dashboard
                    <ArrowRight className="h-4 w-4" />
                  </AnimatedButton>
                </Link>
                <Link to="/login">
                  <AnimatedButton variant="outline" className="min-w-40 border-white/55 bg-white/10 text-white hover:bg-white/20">
                    Secure Login
                  </AnimatedButton>
                </Link>
              </div>
            </div>
          </PageContainer>
        </section>
      </main>
      <Footer />
    </div>
  );
}
