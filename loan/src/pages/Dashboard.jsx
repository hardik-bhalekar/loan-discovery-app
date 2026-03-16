import { useState, useCallback } from 'react';
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
} from 'lucide-react';
import { Link } from 'react-router-dom';
import LoanForm from '../components/LoanForm';
import EligibilityResult from '../components/EligibilityResult';
import EMICalculator from '../components/EMICalculator';
import ComparisonTable from '../components/ComparisonTable';
import RecommendationCard from '../components/RecommendationCard';
import { getRecommendations } from '../utils/recommendations';

const tabs = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'eligibility', label: 'Eligibility', icon: ShieldCheck },
  { id: 'emi', label: 'EMI Calculator', icon: Calculator },
  { id: 'compare', label: 'Comparison', icon: GitCompare },
  { id: 'recommend', label: 'Recommendations', icon: Award },
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

  const handleProfileSubmit = useCallback((data) => {
    setProfile(data);
  }, []);

  const recommendations = getRecommendations(profile);

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return <LoanForm onSubmit={handleProfileSubmit} />;
      case 'eligibility':
        return <EligibilityResult profile={profile} />;
      case 'emi':
        return <EMICalculator />;
      case 'compare':
        return (
          <div>
            <p className="text-sm text-gray-500 mb-4">
              Comparing EMIs for ₹{(profile.loanAmount / 100000).toFixed(1)}L over {profile.tenure} years
            </p>
            <ComparisonTable loanAmount={profile.loanAmount} tenure={profile.tenure} />
          </div>
        );
      case 'recommend':
        return (
          <div>
            <p className="text-sm text-gray-500 mb-6">
              Top recommendations for ₹{(profile.loanAmount / 100000).toFixed(1)}L over {profile.tenure} years
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recommendations.slice(0, 3).map((loan) => (
                <RecommendationCard key={loan.id} loan={loan} />
              ))}
            </div>
            {recommendations.length > 3 && (
              <div className="mt-8">
                <h3 className="text-sm font-medium text-gray-500 mb-4">Other Options</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recommendations.slice(3, 6).map((loan) => (
                    <RecommendationCard key={loan.id} loan={loan} />
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* ── Sidebar ──────────────────────── */}
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-gray-100 fixed top-0 left-0 h-full z-40">
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-gray-100">
          <Link to="/" className="flex items-center gap-2">
            <Landmark className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-semibold text-gray-800">LoanSmart</span>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-3">
          <div className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                    active
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </nav>

        {/* User */}
        <div className="px-4 py-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-xs font-semibold text-blue-600">
                U
              </div>
              <div>
                <div className="text-xs font-medium text-gray-700">User</div>
                <div className="text-[10px] text-gray-400">Free Plan</div>
              </div>
            </div>
            <Link to="/" className="text-gray-400 hover:text-red-500 transition-colors" title="Logout">
              <LogOut className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/20" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-64 bg-white border-r border-gray-100 shadow-lg">
            <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100">
              <Link to="/" className="flex items-center gap-2">
                <Landmark className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-semibold text-gray-800">LoanSmart</span>
              </Link>
              <button onClick={() => setSidebarOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="py-4 px-3">
              <div className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const active = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => { setActiveTab(tab.id); setSidebarOpen(false); }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                        active
                          ? 'bg-blue-50 text-blue-600'
                          : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </nav>
          </aside>
        </div>
      )}

      {/* ── Main Content ─────────────────── */}
      <div className="flex-1 lg:ml-64">
        {/* Top bar (mobile) */}
        <header className="lg:hidden h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-30">
          <button onClick={() => setSidebarOpen(true)} className="text-gray-500 hover:text-gray-700">
            <Menu className="w-5 h-5" />
          </button>
          <Link to="/" className="flex items-center gap-2">
            <Landmark className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-semibold text-gray-800">LoanSmart</span>
          </Link>
          <div className="w-5" /> {/* spacer */}
        </header>

        {/* Content */}
        <main className="p-8 max-w-5xl">
          {/* Page heading */}
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-gray-800">
              {tabs.find((t) => t.id === activeTab)?.label}
            </h1>
          </div>

          {/* Tab content */}
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
