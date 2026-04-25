  import { useEffect, useMemo, useState } from 'react';
  import {
    User,
    FileText,
    ShieldCheck,
    Calculator,
    GitCompare,
    Award,
    LogOut,
    Landmark,
    Menu,
    X,
    Building2,
    FileSpreadsheet,
  } from 'lucide-react';
  import { Link, useNavigate } from 'react-router-dom';
  import ProfileForm from '../components/ProfileForm';
  import LoanForm from '../components/LoanForm';
  import EligibilityResult from '../components/EligibilityResult';
  import EMICalculator from '../components/EMICalculator';
  import ComparisonTable from '../components/ComparisonTable';
  import RecommendationCard from '../components/RecommendationCard';
  import IfscLookup from '../components/IfscLookup';
  import ThemeToggle from '../components/ThemeToggle';
  import PremiumCard from '../components/ui/PremiumCard';
  import EmptyState from '../components/ui/EmptyState';
  import LoanIntelligenceCard from '../components/LoanIntelligenceCard';
  import StatementUpload from '../components/StatementUpload';
  import ComplianceHub from '../components/ComplianceHub';
  import {
    clearAuthToken,
    getAuthUser,
    getAdminStats,
    getMyProfile,
    deleteComparison,
    getSavedComparisons,
    saveLoanProfile,
    saveComparison,
    savePersonalProfile,
  } from '../utils/api';
  import { getRecommendations } from '../utils/recommendations';
  import { formatCompactINR } from '../utils/formatters';

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'loan-profile', label: 'Loan Profile', icon: FileText },
    { id: 'eligibility', label: 'Eligibility', icon: ShieldCheck },
    { id: 'emi', label: 'EMI Calculator', icon: Calculator },
    { id: 'compare', label: 'Comparison', icon: GitCompare },
    { id: 'recommend', label: 'Top Picks', icon: Award },
    { id: 'statements', label: 'Bank Statements', icon: FileSpreadsheet },
    { id: 'ifsc', label: 'IFSC Lookup', icon: Building2 },
    { id: 'compliance', label: 'Data & Rights', icon: ShieldCheck },
  ];

  const defaultProfile = {
    name: 'Rahul Sharma',
    age: 30,
    gender: 'Male',
    mobile: '',
    email: '',
    occupation: 'Salaried',
    city: 'Mumbai',

    loanAmount: 1000000,
    loanType: 'Personal Loan',
    purpose: 'Home Purchase',
    tenure: 5,
    preferredEmiBudget: 25000,

    employmentType: 'Salaried',
    employerName: '',
    workExperience: 3,
    monthlyIncome: 50000,
    additionalIncome: 0,

    existingEmis: 0,
    creditCardOutstanding: 0,
    otherActiveLoans: 0,

    creditScore: 750,
    pastDefaults: false,

    preferredBanks: [],
    ratePreference: 'Either',
    fastApprovalPriority: 3,
    lowestEmiPriority: 4,

    panReady: false,
    aadhaarReady: false,
    salarySlipsReady: false,
    itrReady: false,
    bankStatementsReady: false,
  };

  function applyProfileResponse(baseProfile, response) {
    if (!response) {
      return baseProfile;
    }

    return {
      ...baseProfile,
      name: response.name ?? baseProfile.name,
      email: response.email ?? baseProfile.email,
      mobile: response.phone ?? baseProfile.mobile,
      kycVerified: response.kycVerified ?? false,
      age: response.personal?.age ?? baseProfile.age,
      gender: response.personal?.gender ?? baseProfile.gender,
      city: response.personal?.city ?? baseProfile.city,
      occupation: response.personal?.occupation ?? baseProfile.occupation,
      loanAmount:
        response.loan?.loanAmount != null ? Number(response.loan.loanAmount) : baseProfile.loanAmount,
      loanType: response.loan?.loanType ?? baseProfile.loanType,
      purpose: response.loan?.purpose ?? baseProfile.purpose,
      tenure: response.loan?.tenure ?? baseProfile.tenure,
      monthlyIncome:
        response.loan?.monthlyIncome != null ? Number(response.loan.monthlyIncome) : baseProfile.monthlyIncome,
      creditScore: response.loan?.creditScore ?? baseProfile.creditScore,
      existingEmis:
        response.loan?.existingEmi != null ? Number(response.loan.existingEmi) : baseProfile.existingEmis,
    };
  }

  function buildComparisonSnapshot(profileState, selectedLoanTypes) {
    return {
      loanAmount: profileState.loanAmount,
      tenure: profileState.tenure,
      selectedTypes: selectedLoanTypes,
      generatedAt: new Date().toISOString(),
    };
  }

  function formatSavedComparison(selectedLoans) {
    if (!selectedLoans) {
      return 'Saved comparison';
    }

    const amount = selectedLoans.loanAmount ?? selectedLoans.amount;
    const tenure = selectedLoans.tenure ?? selectedLoans.years;
    const selectedTypes = Array.isArray(selectedLoans.selectedTypes) ? selectedLoans.selectedTypes.length : 0;
    return `${formatCompactINR(amount || 0)} over ${tenure || 0} years${selectedTypes ? ` • ${selectedTypes} filter(s)` : ''}`;
  }

  export default function Dashboard() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('profile');
    const [profile, setProfile] = useState(defaultProfile);
    const [selectedTypes, setSelectedTypes] = useState([]);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [profileError, setProfileError] = useState('');
    const [savedComparisons, setSavedComparisons] = useState([]);
    const [comparisonError, setComparisonError] = useState('');
    const [adminStats, setAdminStats] = useState(null);
    const [adminStatsError, setAdminStatsError] = useState('');
    const authUser = getAuthUser();
    const adminEmail = import.meta.env.VITE_ADMIN_EMAIL || 'admin@loandiscovery.local';
    const isAdmin = authUser?.email?.toLowerCase() === adminEmail.toLowerCase();
    const visibleTabs = isAdmin ? [...tabs, { id: 'admin', label: 'Admin', icon: ShieldCheck }] : tabs;

    const loanTypes = ['Home Loan', 'Car Loan', 'Personal Loan', 'Education Loan', 'Business Loan'];

    const recommendations = useMemo(() => getRecommendations(profile), [profile]);

    useEffect(() => {
      let active = true;

      const loadProfile = async () => {
        try {
          const response = await getMyProfile();
          if (active) {
            setProfile((current) => applyProfileResponse(current, response));
          }
        } catch (error) {
          if (active) {
            setProfileError(error.message || 'Failed to load saved profile');
          }
        }
      };

      loadProfile();

      return () => {
        active = false;
      };
    }, []);

    useEffect(() => {
      if (!isAdmin) {
        return undefined;
      }

      let active = true;

      const loadAdminStats = async () => {
        try {
          const response = await getAdminStats();
          if (active) {
            setAdminStats(response);
          }
        } catch (error) {
          if (active) {
            setAdminStatsError(error.message || 'Failed to load admin stats');
          }
        }
      };

      loadAdminStats();

      return () => {
        active = false;
      };
    }, [isAdmin]);

    useEffect(() => {
      let active = true;

      const loadComparisons = async () => {
        try {
          const response = await getSavedComparisons();
          if (active) {
            setSavedComparisons(Array.isArray(response) ? response : []);
          }
        } catch (error) {
          if (active) {
            setComparisonError(error.message || 'Failed to load saved comparisons');
          }
        }
      };

      loadComparisons();

      return () => {
        active = false;
      };
    }, []);

    const handleProfileSubmit = async (data) => {
      const nextProfile = { ...profile, ...data };
      setProfile(nextProfile);

      try {
        const response = await savePersonalProfile({
          name: nextProfile.name,
          email: nextProfile.email,
          phone: nextProfile.mobile,
          age: nextProfile.age,
          gender: nextProfile.gender,
          city: nextProfile.city,
          occupation: nextProfile.occupation,
        });
        setProfile((current) => applyProfileResponse(current, response));
        setProfileError('');
      } catch (error) {
        setProfileError(error.message || 'Failed to save personal profile');
      }
    };

    const handleLoanProfileSubmit = async (data) => {
      const nextProfile = { ...profile, ...data };
      setProfile(nextProfile);

      try {
        const response = await saveLoanProfile({
          monthlyIncome: nextProfile.monthlyIncome,
          creditScore: nextProfile.creditScore,
          existingEmi: nextProfile.existingEmis,
          loanAmount: nextProfile.loanAmount,
          loanType: nextProfile.loanType,
          tenure: nextProfile.tenure,
          purpose: nextProfile.purpose,
        });
        setProfile((current) => applyProfileResponse(current, response));
        setProfileError('');
      } catch (error) {
        setProfileError(error.message || 'Failed to save loan profile');
      }
    };

    const handleSaveComparison = async () => {
      try {
        const response = await saveComparison(buildComparisonSnapshot(profile, selectedTypes));
        setSavedComparisons((current) => [response, ...current]);
        setComparisonError('');
      } catch (error) {
        setComparisonError(error.message || 'Failed to save comparison');
      }
    };

    const handleDeleteComparison = async (comparisonId) => {
      try {
        await deleteComparison(comparisonId);
        setSavedComparisons((current) => current.filter((comparison) => comparison.id !== comparisonId));
        setComparisonError('');
      } catch (error) {
        setComparisonError(error.message || 'Failed to delete comparison');
      }
    };

    const handleLogout = () => {
      clearAuthToken();
      navigate('/login', { replace: true });
    };

    const renderContent = () => {
      switch (activeTab) {
        case 'profile':
          return <ProfileForm initialProfile={profile} onSubmit={handleProfileSubmit} />;
        case 'loan-profile':
          return <LoanForm initialProfile={profile} onSubmit={handleLoanProfileSubmit} />;
        case 'eligibility':
          return (
            <div className="space-y-6">
              <EligibilityResult profile={profile} />
              <LoanIntelligenceCard profile={profile} />
            </div>
          );
        case 'emi':
          return <EMICalculator initialAmount={profile.loanAmount} initialTenure={profile.tenure} />;
        case 'compare':
          return (
            <div className="space-y-4">
              <p className="text-sm text-[var(--text-muted)]">
                Comparing EMIs for {formatCompactINR(profile.loanAmount)} over {profile.tenure} years
              </p>

              <div className="luxury-panel rounded-[1.4rem] p-4 transition-all hover:shadow-[0_20px_44px_rgba(7,34,59,0.16)]">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-semibold tracking-wide text-[var(--text-primary)]">Saved comparisons</h3>
                    <p className="text-xs text-[var(--text-muted)]">Persist the current filter set and revisit it later.</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleSaveComparison}
                    className="rounded-full border border-[var(--accent)] bg-[var(--accent)] px-4 py-2 text-xs font-semibold text-white shadow-[0_12px_22px_rgba(15,118,110,0.24)] transition-all hover:-translate-y-0.5 hover:bg-[var(--accent-strong)]"
                  >
                    Save current view
                  </button>
                </div>

                {comparisonError ? (
                  <p className="mb-3 text-xs font-medium text-red-600">{comparisonError}</p>
                ) : null}

                {savedComparisons.length > 0 ? (
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                    {savedComparisons.map((comparison) => (
                      <div key={comparison.id} className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-4 shadow-[0_10px_22px_rgba(7,34,59,0.08)]">
                        <p className="text-sm font-semibold text-[var(--text-primary)]">{formatSavedComparison(comparison.selectedLoans)}</p>
                        <p className="mt-1 text-xs text-[var(--text-muted)]">
                          Saved {comparison.createdAt ? new Date(comparison.createdAt).toLocaleString() : 'recently'}
                        </p>
                        <button
                          type="button"
                          onClick={() => handleDeleteComparison(comparison.id)}
                          className="mt-3 text-xs font-semibold text-red-600 hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    title="No saved comparisons yet"
                    description="Save the current comparison view to keep a history of your shortlist."
                  />
                )}
              </div>

              <div className="luxury-panel rounded-[1.4rem] p-4 transition-all hover:shadow-[0_20px_44px_rgba(7,34,59,0.16)]">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-sm font-semibold tracking-wide text-[var(--text-primary)]">Loan type filters</h3>
                  {selectedTypes.length > 0 ? (
                    <button
                      type="button"
                      onClick={() => setSelectedTypes([])}
                      className="text-xs font-semibold text-[var(--accent)] hover:underline"
                    >
                      Clear all
                    </button>
                  ) : null}
                </div>

                <div className="flex flex-wrap gap-2">
                  {loanTypes.map((type) => {
                    const active = selectedTypes.includes(type);
                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() =>
                          setSelectedTypes((prev) =>
                            prev.includes(type) ? prev.filter((item) => item !== type) : [...prev, type]
                          )
                        }
                        className={[
                          'rounded-full border px-3 py-1.5 text-xs font-semibold transition-all duration-200 sm:text-sm',
                          active
                            ? 'border-[var(--accent)] bg-[var(--accent)] text-white shadow-[0_8px_16px_rgba(15,118,110,0.3)]'
                            : 'border-[var(--border-subtle)] bg-[var(--bg-secondary)] text-[var(--text-primary)] hover:-translate-y-0.5 hover:border-[var(--border-medium)] hover:bg-[color-mix(in_oklab,var(--bg-secondary)_72%,var(--bg-card)_28%)]',
                        ].join(' ')}
                      >
                        {type}
                      </button>
                    );
                  })}
                </div>
              </div>

              <ComparisonTable
                loanAmount={profile.loanAmount}
                tenure={profile.tenure}
                selectedTypes={selectedTypes}
              />
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
        case 'statements':
          return <StatementUpload />;
        case 'ifsc':
          return <IfscLookup />;
        case 'compliance':
          return <ComplianceHub />;
        case 'admin':
          return isAdmin ? (
            <div className="space-y-5">
              {adminStatsError ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {adminStatsError}
                </div>
              ) : null}

              {!adminStats && !adminStatsError ? (
                <PremiumCard>
                  <p className="text-sm text-[var(--text-muted)]">Loading admin analytics...</p>
                </PremiumCard>
              ) : null}

              {adminStats ? (
                <div className="space-y-5">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <PremiumCard>
                      <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-faint)]">Users</p>
                      <p className="mt-2 text-3xl font-bold text-[var(--text-primary)]">{adminStats.totalUsers}</p>
                    </PremiumCard>
                    <PremiumCard>
                      <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-faint)]">Saved Comparisons</p>
                      <p className="mt-2 text-3xl font-bold text-[var(--text-primary)]">{adminStats.totalComparisons}</p>
                    </PremiumCard>
                    <PremiumCard>
                      <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-faint)]">Average Loan Amount</p>
                      <p className="mt-2 text-3xl font-bold text-[var(--text-primary)]">
                        {formatCompactINR(adminStats.avgLoanAmount || 0)}
                      </p>
                    </PremiumCard>
                  </div>

                  <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
                    <PremiumCard>
                      <h3 className="text-sm font-semibold text-[var(--text-primary)]">Loan type popularity</h3>
                      <div className="mt-4 space-y-3">
                        {Object.entries(adminStats.loanTypePopularity || {}).length > 0 ? (
                          Object.entries(adminStats.loanTypePopularity)
                            .sort((left, right) => right[1] - left[1])
                            .map(([loanType, count]) => (
                              <div key={loanType} className="flex items-center justify-between rounded-2xl bg-[var(--bg-secondary)] px-4 py-3 shadow-[0_8px_18px_rgba(7,34,59,0.06)]">
                                <span className="text-sm font-medium text-[var(--text-primary)]">{loanType}</span>
                                <span className="text-sm font-semibold text-[var(--accent)]">{count}</span>
                              </div>
                            ))
                        ) : (
                          <EmptyState title="No loan profile data yet" description="Saved loan profiles will appear here." />
                        )}
                      </div>
                    </PremiumCard>

                    <PremiumCard>
                      <h3 className="text-sm font-semibold text-[var(--text-primary)]">Recent signups</h3>
                      <div className="mt-4 space-y-3">
                        {adminStats.recentSignups?.length ? (
                          adminStats.recentSignups.map((signup) => (
                            <div key={signup.userId} className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-3 shadow-[0_8px_18px_rgba(7,34,59,0.06)]">
                              <p className="text-sm font-semibold text-[var(--text-primary)]">{signup.name}</p>
                              <p className="text-xs text-[var(--text-muted)]">{signup.email}</p>
                              <p className="mt-1 text-[10px] text-[var(--text-faint)]">
                                {signup.createdAt ? new Date(signup.createdAt).toLocaleString() : 'Recent signup'}
                              </p>
                            </div>
                          ))
                        ) : (
                          <EmptyState title="No recent signups" description="New registrations will appear here." />
                        )}
                      </div>
                    </PremiumCard>
                  </div>
                </div>
              ) : null}
            </div>
          ) : (
            <EmptyState title="Admin only" description="This section is available to the configured admin account." />
          );
        default:
          return null;
      }
    };

    return (
      <div className="flex min-h-screen">
        <aside className="fixed left-0 top-0 z-40 hidden h-full w-72 flex-col border-r border-[var(--border-subtle)] bg-[color-mix(in_oklab,var(--bg-card)_92%,transparent)] backdrop-blur lg:flex">
          <div className="flex h-16 items-center justify-between border-b border-[var(--border-subtle)] px-6">
            <Link to="/" className="flex items-center gap-2">
              <Landmark className="h-5 w-5 text-[var(--accent)]" />
              <span className="text-sm font-semibold text-[var(--text-primary)]">LoanSmart</span>
            </Link>
            <ThemeToggle />
          </div>

          <nav className="flex-1 space-y-1 p-4">
            {visibleTabs.map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={[
                    'group flex w-full items-center gap-3 rounded-[1.1rem] px-3.5 py-3 text-sm font-semibold transition-all duration-200',
                    active
                      ? 'border border-[var(--border-medium)] bg-[color-mix(in_oklab,var(--bg-secondary)_70%,transparent)] text-[var(--accent)] shadow-[0_10px_20px_rgba(7,34,59,0.12)]'
                      : 'border border-transparent text-[var(--text-muted)] hover:-translate-y-0.5 hover:border-[var(--border-subtle)] hover:bg-[var(--bg-secondary)]/70 hover:text-[var(--text-primary)]',
                  ].join(' ')}
                >
                  <Icon className={[ 'h-4 w-4 transition-transform duration-200', active ? 'scale-110' : 'group-hover:scale-105' ].join(' ')} />
                  {tab.label}
                </button>
              );
            })}
          </nav>

          <div className="border-t border-[var(--border-subtle)] p-4">
            <div className="flex items-center justify-between rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-3 transition-colors hover:border-[var(--border-medium)]">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--accent)] to-[var(--accent-strong)] text-sm font-bold text-white shadow-sm">
                  {authUser?.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-bold text-[var(--text-primary)]">{authUser?.name || 'User'}</p>
                    {profile.kycVerified && (
                      <ShieldCheck className="h-4 w-4 text-emerald-500" title="KYC Verified" />
                    )}
                  </div>
                  <p className="max-w-[120px] truncate text-xs text-[var(--text-faint)]">{authUser?.email || 'Authenticated session'}</p>
                </div>
              </div>
              <button 
                type="button" 
                onClick={handleLogout} 
                className="rounded-lg p-2 text-[var(--text-faint)] transition-colors hover:bg-red-500/10 hover:text-red-500" 
                title="Logout"
                aria-label="Logout"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </aside>

        {sidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <button type="button" className="absolute inset-0 bg-black/35" onClick={() => setSidebarOpen(false)} aria-label="Close sidebar" />
            <aside className="absolute left-0 top-0 h-full w-72 border-r border-[var(--border-subtle)] bg-[var(--bg-card)] p-4 shadow-[0_20px_48px_rgba(7,34,59,0.18)]">
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
                {visibleTabs.map((tab) => {
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
                        'group flex w-full items-center gap-3 rounded-[1.1rem] border px-3.5 py-3 text-sm font-semibold transition-all duration-200',
                        active
                          ? 'border-[var(--border-medium)] bg-[color-mix(in_oklab,var(--bg-secondary)_70%,transparent)] text-[var(--accent)] shadow-[0_8px_18px_rgba(7,34,59,0.12)]'
                          : 'border-transparent text-[var(--text-muted)] hover:-translate-y-0.5 hover:border-[var(--border-subtle)] hover:bg-[var(--bg-secondary)]/70 hover:text-[var(--text-primary)]',
                      ].join(' ')}
                    >
                      <Icon className={[ 'h-4 w-4 transition-transform duration-200', active ? 'scale-110' : 'group-hover:scale-105' ].join(' ')} />
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
              <span className="text-sm font-semibold text-[var(--text-primary)]">{visibleTabs.find((item) => item.id === activeTab)?.label}</span>
            <ThemeToggle />
          </header>

          <main className="mx-auto w-full max-w-6xl p-4 sm:p-6 lg:p-8">
            {profileError ? (
              <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {profileError}
              </div>
            ) : null}

            <PremiumCard className="mb-8 flex flex-wrap items-center justify-between gap-4 px-6 py-5" hover={false}>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--accent)]">Dashboard</p>
                <h1 className="mt-1 text-2xl font-black tracking-tight text-[var(--text-primary)] sm:text-3xl">
                  {visibleTabs.find((item) => item.id === activeTab)?.label}
                </h1>
              </div>
              <div className="flex flex-col items-end gap-1 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] px-4 py-2">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-faint)]">Active Profile</p>
                <p className="text-sm font-semibold text-[var(--text-primary)]">
                  {formatCompactINR(profile.loanAmount)}{' '}
                  <span className="mx-1 font-normal text-[var(--text-faint)]">/</span>{' '}
                  {profile.tenure} yr{' '}
                  <span className="mx-1 font-normal text-[var(--text-faint)]">/</span>{' '}
                  <span className="text-[var(--accent)]">Score {profile.creditScore}</span>
                </p>
              </div>
            </PremiumCard>

            <div key={activeTab} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              {renderContent()}
            </div>
          </main>
        </div>
      </div>
    );
  }
