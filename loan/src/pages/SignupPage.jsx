import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Lock, Mail, Phone, Shield, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '../components/ui/Button';
import FormField from '../components/ui/FormField';
import FormWrapper from '../components/FormWrapper';
import Navbar from '../components/Navbar';
import PageContainer from '../components/ui/PageContainer';
import Alert from '../components/ui/Alert';
import { registerUser } from '../utils/api';

export default function SignupPage() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await registerUser({ name, email, phone, password });
      setSuccess('Signup successful. Please login to continue.');
      setTimeout(() => navigate('/login'), 900);
    } catch (err) {
      setError(err.message || 'Signup failed');
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
            title="Create Account"
            subtitle="Join and save your loan preferences"
            icon={Shield}
            footer={
              <p className="text-center text-xs text-[var(--text-faint)]">
                Already have an account?{' '}
                <Link to="/login" className="text-[var(--accent)] font-semibold hover:underline">
                  Sign in
                </Link>
              </p>
            }
          >
            {error ? <Alert type="error" message={error} className="mb-4" /> : null}
            {success ? <Alert type="success" message={success} className="mb-4" /> : null}

            <form onSubmit={handleSubmit} className="space-y-5">
              <FormField
                label="Full Name"
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                icon={User}
                required
              />

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
                label="Phone"
                type="text"
                placeholder="10-digit mobile"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                icon={Phone}
              />

              <FormField
                label="Password"
                type="password"
                placeholder="Minimum 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={Lock}
                required
              />

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button type="submit" variant="primary" size="lg" fullWidth className="gap-2" disabled={loading}>
                  {loading ? 'Creating account...' : 'Sign Up'}
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
