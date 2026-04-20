import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail, Eye, EyeOff, Shield, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '../components/ui/Button';
import FormField from '../components/ui/FormField';
import FormWrapper from '../components/FormWrapper';
import Navbar from '../components/Navbar';
import PageContainer from '../components/ui/PageContainer';
import Alert from '../components/ui/Alert';
import { loginUser, setAuthSession } from '../utils/api';

export default function LoginPage() {
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await loginUser({ email, password });
      setAuthSession(res, rememberMe);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-[var(--bg-primary)] to-[var(--bg-secondary)]">
      <Navbar />

      <main className="flex flex-1 items-center justify-center px-6 py-10">
        <PageContainer className="w-full max-w-md">
          <FormWrapper
            title="Welcome Back"
            subtitle="Sign in to access your loan dashboard"
            icon={Shield}
            footer={
              <div className="space-y-3 text-center">
                <p className="text-xs text-[var(--text-faint)]">
                  Don't have an account?{' '}
                  <Link to="/signup" className="text-[var(--accent)] font-semibold hover:underline">
                    Create one →
                  </Link>
                </p>
                <div className="flex items-center justify-center gap-1 text-xs text-[var(--text-faint)]">
                  <Lock className="h-3 w-3" />
                  <span>256-bit SSL encrypted</span>
                </div>
              </div>
            }
          >
            <Alert type="info" message="Use your registered email and password" dismissible={true} className="mb-6" />
            {error ? <Alert type="error" message={error} className="mb-4" /> : null}

            <form onSubmit={handleLogin} className="space-y-5">
              <FormField
                label="Email Address"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={Mail}
                required
              />

              <FormField
                label="Password"
                type={showPass ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={Lock}
                required
              />

              <button
                type="button"
                onClick={() => setShowPass((prev) => !prev)}
                className="-mt-2 inline-flex items-center gap-1 text-xs text-[var(--text-faint)] transition-colors hover:text-[var(--text-primary)]"
              >
                {showPass ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                {showPass ? 'Hide password' : 'Show password'}
              </button>

              {/* Options */}
              <div className="flex items-center justify-between">
                <label className="flex cursor-pointer items-center gap-2">
                  <input 
                    type="checkbox" 
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 rounded border-[var(--border-medium)] bg-[var(--bg-secondary)] text-[var(--accent)]"
                  />
                  <span className="text-xs text-[var(--text-faint)]">Remember me</span>
                </label>
                <button type="button" className="text-xs text-[var(--accent)] hover:text-[var(--accent)]/80 font-semibold">
                  Forgot password?
                </button>
              </div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button type="submit" variant="primary" size="lg" fullWidth className="gap-2" disabled={loading}>
                  {loading ? 'Signing in...' : 'Sign In'}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </motion.div>
            </form>
          </FormWrapper>
        </PageContainer>
      </main>
    </div>
  );
}
