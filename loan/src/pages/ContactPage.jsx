import React, { useState } from 'react';
import { Mail, MapPin, Phone } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageContainer from '../components/ui/PageContainer';
import SectionHeader from '../components/ui/SectionHeader';
import FormField from '../components/ui/FormField';
import Button from '../components/ui/Button';
import Alert from '../components/ui/Alert';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState(null); // 'success' or 'error'

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate sending message
    if (name && email && message) {
      setStatus('success');
      setName('');
      setEmail('');
      setMessage('');
    } else {
      setStatus('error');
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-[var(--bg-primary)] to-[var(--bg-secondary)]">
      <Navbar />
      <main className="flex-1 py-16">
        <PageContainer className="max-w-5xl">
          <SectionHeader
            eyebrow="Contact Us"
            title="Get In Touch"
            description="Have questions about our loan discovery process or need technical assistance? We're here to help."
            align="center"
          />
          
          <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-2">
            {/* Contact Information */}
            <div className="space-y-8">
              <h3 className="text-2xl font-bold text-[var(--text-primary)]">Contact Information</h3>
              <p className="text-[var(--text-muted)]">
                Our support team is available during standard business hours to assist you with any inquiries regarding the platform.
              </p>
              
              <div className="space-y-6 mt-8">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--accent)]/10 text-[var(--accent)]">
                    <Mail className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[var(--text-muted)]">Email</p>
                    <a href="mailto:labop69@gmail.com" className="text-lg font-bold text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors">
                      labop69@gmail.com
                    </a>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--accent)]/10 text-[var(--accent)]">
                    <Phone className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[var(--text-muted)]">Phone</p>
                    <p className="text-lg font-bold text-[var(--text-primary)]">+91 (800) 123-4567</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--accent)]/10 text-[var(--accent)]">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[var(--text-muted)]">Office</p>
                    <p className="text-lg font-bold text-[var(--text-primary)]">Mumbai, Maharashtra, India</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-8 shadow-xl">
              <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-6">Send a Message</h3>
              
              {status === 'success' && (
                <Alert type="success" message="Thank you! Your message has been sent successfully." className="mb-6" />
              )}
              {status === 'error' && (
                <Alert type="error" message="Please fill out all fields before submitting." className="mb-6" />
              )}
              
              <form onSubmit={handleSubmit} className="space-y-5">
                <FormField
                  label="Your Name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                
                <FormField
                  label="Email Address"
                  type="email"
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                
                <div className="space-y-1.5">
                  <label className="block text-sm font-semibold text-[var(--text-secondary)]">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    className="w-full rounded-xl border border-[var(--border-medium)] bg-[var(--bg-primary)] px-4 py-3 text-sm text-[var(--text-primary)] outline-none transition-all placeholder:text-[var(--text-faint)] focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]"
                    placeholder="How can we help you?"
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                  ></textarea>
                </div>
                
                <Button type="submit" variant="primary" size="lg" fullWidth>
                  Send Message
                </Button>
              </form>
            </div>
          </div>
        </PageContainer>
      </main>
      <Footer />
    </div>
  );
}
