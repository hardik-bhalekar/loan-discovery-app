import { useMemo, useState } from 'react';
import {
  User,
  ShieldCheck,
  Calculator,
  GitCompare,
  Award,
  LogOut,
  Landmark,
  Menu,
  X,
  Building2,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import LoanForm from '../components/LoanForm';
import EligibilityResult from '../components/EligibilityResult';
import EMICalculator from '../components/EMICalculator';
import ComparisonTable from '../components/ComparisonTable';
import RecommendationCard from '../components/RecommendationCard';
import IfscLookup from '../components/IfscLookup';
import ThemeToggle from '../components/ThemeToggle';
import PremiumCard from '../components/ui/PremiumCard';
import EmptyState from '../components/ui/EmptyState';
import { getRecommendations } from '../utils/recommendations';
import { formatCompactINR } from '../utils/formatters';

const tabs = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'eligibility', label: 'Eligibility', icon: ShieldCheck },
  { id: 'emi', label: 'EMI Calculator', icon: Calculator },
  { id: 'compare', label: 'Comparison', icon: GitCompare },
  { id: 'recommend', label: 'Top Picks', icon: Award },
  { id: 'ifsc', label: 'IFSC Lookup', icon: Building2 },
];

const defaultProfile = {
  age: 30,
  occupation: 'Salaried',
  monthlyIncome: 50000,
  creditScore: 750,
  city: 'Mumbai',
  loanAmount: 1000000,
  purpose: 'Home Purchase',
  loanType: 'Personal Loan',
  tenure: 5,
};

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('profile');
  const [profile, setProfile] = useState(defaultProfile);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const recommendations = useMemo(() => getRecommendations(profile), [profile]);

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return <LoanForm initialProfile={profile} onSubmit={setProfile} />;
      case 'eligibility':
        return <EligibilityResult profile={profile} />;
      case 'emi':
        return <EMICalculator initialAmount={profile.loanAmount} initialTenure={profile.tenure} />;
      case 'compare':
        return (
          <div className="space-y-4">
            <p className="text-sm text-[var(--text-muted)]">
              Comparing EMIs for {formatCompactINR(profile.loanAmount)} over {profile.tenure} years
            </p>
            <ComparisonTable loanAmount={profile.loanAmount} tenure={profile.tenure} />
          </div>
        );
      case 'recommend':
        return recommendations.length ? (
          <div>
            <p className="mb-6 text-sm text-[var(--text-muted)]">
              Top recommendations for {formatCompactINR(profile.loanAmount)} over {profile.tenure} years
            </p>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {recommendations.slice(0, 6).map((loan) => (
                <RecommendationCard key={loan.id} loan={loan} />
              ))}
            </div>
          </div>
        ) : (
          <EmptyState title="No recommendations yet" description="Update profile details and try again." />
        );
      case 'ifsc':
        return <IfscLookup />;
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen">
      <aside className="fixed left-0 top-0 z-40 hidden h-full w-72 flex-col border-r border-[var(--border-subtle)] bg-[var(--bg-card)]/95 backdrop-blur lg:flex">
        <div className="flex h-16 items-center justify-between border-b border-[var(--border-subtle)] px-6">
          <Link to="/" className="flex items-center gap-2">
            <Landmark className="h-5 w-5 text-[var(--accent)]" />
            <span className="text-sm font-semibold text-[var(--text-primary)]">LoanSmart</span>
          </Link>
          <ThemeToggle />
        </div>

        <nav className="flex-1 space-y-1 p-4">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={[
                  'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all',
                  active
                    ? 'bg-[var(--bg-secondary)] text-[var(--accent)]'
                    : 'text-[var(--text-muted)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]',
                ].join(' ')}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>

        <div className="border-t border-[var(--border-subtle)] p-4">
          <div className="flex items-center justify-between rounded-xl bg-[var(--bg-secondary)] p-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--accent)]/15 text-xs font-semibold text-[var(--accent)]">U</div>
              <div>
                <p className="text-xs font-semibold text-[var(--text-primary)]">User</p>
                <p className="text-[10px] text-[var(--text-faint)]">Analyst plan</p>
              </div>
            </div>
            <Link to="/" className="text-[var(--text-faint)] transition-colors hover:text-red-500" title="Logout">
              <LogOut className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button type="button" className="absolute inset-0 bg-black/35" onClick={() => setSidebarOpen(false)} aria-label="Close sidebar" />
          <aside className="absolute left-0 top-0 h-full w-72 border-r border-[var(--border-subtle)] bg-[var(--bg-card)] p-4">
            <div className="mb-4 flex items-center justify-between">
              <Link to="/" className="flex items-center gap-2">
                <Landmark className="h-5 w-5 text-[var(--accent)]" />
                <span className="text-sm font-semibold text-[var(--text-primary)]">LoanSmart</span>
              </Link>
              <button onClick={() => setSidebarOpen(false)} className="rounded-lg p-2 hover:bg-[var(--bg-secondary)]" aria-label="Close menu">
                <X className="h-5 w-5 text-[var(--text-muted)]" />
              </button>
            </div>
            <div className="mb-4"><ThemeToggle /></div>
            <div className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setSidebarOpen(false);
                    }}
                    className={[
                      'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold',
                      active ? 'bg-[var(--bg-secondary)] text-[var(--accent)]' : 'text-[var(--text-muted)]',
                    ].join(' ')}
                  >
                    <Icon className="h-4 w-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </aside>
        </div>
      )}

      <div className="flex-1 lg:ml-72">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[var(--border-subtle)] bg-[color-mix(in_oklab,var(--bg-card)_92%,transparent)] px-4 backdrop-blur sm:px-6 lg:hidden">
          <button onClick={() => setSidebarOpen(true)} className="rounded-lg p-2 hover:bg-[var(--bg-secondary)]" aria-label="Open menu">
            <Menu className="h-5 w-5 text-[var(--text-primary)]" />
          </button>
          <span className="text-sm font-semibold text-[var(--text-primary)]">{tabs.find((item) => item.id === activeTab)?.label}</span>
          <ThemeToggle />
        </header>

        <main className="mx-auto w-full max-w-6xl p-4 sm:p-6 lg:p-8">
          <PremiumCard className="mb-6 flex flex-wrap items-center justify-between gap-4" hover={false}>
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-[var(--text-faint)]">Dashboard</p>
              <h1 className="text-2xl font-semibold text-[var(--text-primary)]">{tabs.find((item) => item.id === activeTab)?.label}</h1>
            </div>
            <p className="text-sm text-[var(--text-muted)]">
              Profile: {formatCompactINR(profile.loanAmount)} • {profile.tenure} years • Credit {profile.creditScore}
            </p>
          </PremiumCard>

          {renderContent()}
        </main>
      </div>
    </div>
  );
}
