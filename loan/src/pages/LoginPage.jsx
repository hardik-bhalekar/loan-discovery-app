import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Lock, Mail, Eye, EyeOff, Shield, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '../components/ui/Button';
import FormField from '../components/ui/FormField';
import FormWrapper from '../components/FormWrapper';
import Navbar from '../components/Navbar';
import PageContainer from '../components/ui/PageContainer';
import Alert from '../components/ui/Alert';

export default function LoginPage() {
  const [showPass, setShowPass] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    window.location.href = '/dashboard';
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[var(--bg-primary)] to-[var(--bg-secondary)]">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-6 py-10">
        <PageContainer className="w-full max-w-md">
          <FormWrapper
            title="Welcome Back"
            subtitle="Sign in to access your loan dashboard"
            icon={Shield}
            footer={
              <div className="text-center space-y-3">
                <p className="text-xs text-[var(--text-faint)]">
                  Don't have an account?{' '}
                  <Link to="/dashboard" className="text-[var(--accent)] font-semibold hover:underline">
                    Start exploring →
                  </Link>
                </p>
                <div className="flex items-center justify-center gap-1 text-xs text-[var(--text-faint)]">
                  <Lock className="h-3 w-3" />
                  <span>256-bit SSL encrypted</span>
                </div>
              </div>
            }
          >
            <Alert 
              type="info" 
              message="Demo: Any email and password will work" 
              dismissible={true}
              className="mb-6"
            />

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

              {/* Options */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-[var(--border-medium)] text-[var(--accent)] bg-[var(--bg-secondary)]"
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
                <Button type="submit" variant="primary" size="lg" fullWidth className="gap-2">
                  Sign In
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
