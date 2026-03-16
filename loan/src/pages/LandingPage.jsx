import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ClipboardList,
  Search,
  GitCompare,
  Award,
  Clock,
  Shield,
  Sparkles,
  Wallet,
  Home,
  GraduationCap,
  Car,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Button from '../components/Button';

const steps = [
  { icon: ClipboardList, title: 'Enter Details', desc: 'Share your income, credit score, and loan preferences.' },
  { icon: Search, title: 'Check Eligibility', desc: 'Instantly see which loan types you qualify for.' },
  { icon: GitCompare, title: 'Compare Options', desc: 'Compare rates, EMIs, and terms from top banks.' },
  { icon: Award, title: 'Get Best Match', desc: 'Receive personalized recommendations ranked by fit.' },
];

const benefits = [
  { icon: Clock, title: 'Save Time', desc: 'Compare 10+ banks in one place without branch visits.' },
  { icon: GitCompare, title: 'Compare Instantly', desc: 'Side-by-side comparison with real-time EMI calculation.' },
  { icon: Shield, title: 'Transparent', desc: 'Clear breakdown of principal, interest, and fees.' },
  { icon: Sparkles, title: 'Smart Suggestions', desc: 'Data-driven recommendations tailored to your profile.' },
];

const loanTypes = [
  { icon: Wallet, name: 'Personal Loan', rate: 'From 10.5%' },
  { icon: Home, name: 'Home Loan', rate: 'From 8.4%' },
  { icon: GraduationCap, name: 'Education Loan', rate: 'From 9.0%' },
  { icon: Car, name: 'Vehicle Loan', rate: 'From 9.25%' },
];

const banks = ['SBI', 'HDFC', 'ICICI', 'Axis', 'Kotak', 'Bank of Baroda', 'PNB', 'IndusInd'];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* ── Hero ─────────────────────────── */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            {/* Left */}
            <div>
              <h1 className="text-4xl md:text-5xl font-semibold text-gray-800 leading-tight mb-4">
                Find the Best Loan <span className="text-blue-600">for You</span> in Minutes
              </h1>
              <p className="text-gray-500 text-lg mb-8 leading-relaxed">
                Compare offers from India's top banks, check eligibility, and get
                personalized loan recommendations — all in one place.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link to="/dashboard">
                  <Button>Get Started <ArrowRight className="w-4 h-4" /></Button>
                </Link>
                <Link to="/dashboard">
                  <Button variant="outline">Check Eligibility</Button>
                </Link>
              </div>
            </div>

            {/* Right — simple card illustration */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-sm font-semibold text-gray-800 mb-1">Your Best Match</h3>
              <p className="text-xs text-gray-400 mb-4">Based on your profile</p>
              <div className="space-y-3">
                {[
                  { bank: 'SBI', rate: '8.5%', tag: 'Best Rate' },
                  { bank: 'HDFC', rate: '9.0%', tag: 'Fast Approval' },
                  { bank: 'ICICI', rate: '9.25%', tag: 'Flexible' },
                ].map((item) => (
                  <div key={item.bank} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                    <div>
                      <div className="text-sm font-medium text-gray-800">{item.bank}</div>
                      <div className="text-xs text-gray-400">{item.rate} p.a.</div>
                    </div>
                    <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded font-medium">
                      {item.tag}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── How It Works ─────────────────── */}
        <section className="bg-white border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-6 py-16">
            <h2 className="text-2xl font-semibold text-gray-800 text-center mb-2">How It Works</h2>
            <p className="text-gray-500 text-center mb-10">Four simple steps to your ideal loan</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {steps.map((step, i) => {
                const Icon = step.icon;
                return (
                  <div key={step.title} className="bg-gray-50 rounded-xl p-6">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                      <Icon className="w-5 h-5 text-blue-600" />
                    </div>
                    <h3 className="text-sm font-semibold text-gray-800 mb-1">{step.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Benefits ─────────────────────── */}
        <section className="max-w-7xl mx-auto px-6 py-16">
          <h2 className="text-2xl font-semibold text-gray-800 text-center mb-2">Benefits</h2>
          <p className="text-gray-500 text-center mb-10">Everything for a smarter borrowing decision</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {benefits.map((b) => {
              const Icon = b.icon;
              return (
                <div key={b.title} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex gap-4">
                  <div className="w-10 h-10 shrink-0 bg-blue-50 rounded-lg flex items-center justify-center">
                    <Icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-800 mb-1">{b.title}</h3>
                    <p className="text-sm text-gray-500">{b.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── Loan Types ───────────────────── */}
        <section className="bg-white border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-6 py-16">
            <h2 className="text-2xl font-semibold text-gray-800 text-center mb-2">Supported Loan Types</h2>
            <p className="text-gray-500 text-center mb-10">We cover all major loan categories</p>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {loanTypes.map((loan) => {
                const Icon = loan.icon;
                return (
                  <div key={loan.name} className="bg-gray-50 rounded-xl p-6 text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <Icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="text-sm font-semibold text-gray-800 mb-1">{loan.name}</h3>
                    <p className="text-xs text-gray-400">{loan.rate}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Trusted Banks ────────────────── */}
        <section className="max-w-7xl mx-auto px-6 py-16">
          <h2 className="text-2xl font-semibold text-gray-800 text-center mb-2">Trusted Banks</h2>
          <p className="text-gray-500 text-center mb-10">We compare offers from India's top institutions</p>

          <div className="flex flex-wrap justify-center gap-4">
            {banks.map((bank) => (
              <div key={bank} className="bg-white rounded-lg shadow-sm border border-gray-100 px-5 py-3">
                <span className="text-sm font-medium text-gray-700">{bank}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA ──────────────────────────── */}
        <section className="max-w-7xl mx-auto px-6 pb-16">
          <div className="bg-blue-600 rounded-xl p-10 md:p-14 text-center">
            <h2 className="text-2xl md:text-3xl font-semibold text-white mb-3">
              Ready to Find Your Perfect Loan?
            </h2>
            <p className="text-blue-100 mb-6 max-w-md mx-auto">
              Join thousands of borrowers making smarter decisions.
            </p>
            <Link to="/dashboard">
              <Button variant="secondary">Get Started Free <ArrowRight className="w-4 h-4" /></Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
