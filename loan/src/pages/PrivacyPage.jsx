import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageContainer from '../components/ui/PageContainer';
import SectionHeader from '../components/ui/SectionHeader';

export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-[var(--bg-primary)] to-[var(--bg-secondary)]">
      <Navbar />
      <main className="flex-1 py-16">
        <PageContainer className="max-w-4xl">
          <SectionHeader
            eyebrow="Privacy Policy"
            title="How We Protect Your Data"
            description="Your privacy and security are our top priorities. Read our policy to understand how we handle your information."
            align="left"
          />
          <div className="mt-8 space-y-8 text-[var(--text-muted)] leading-relaxed">
            <section>
              <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3">1. Information Collection</h3>
              <p>We collect information you provide directly to us, such as when you create or modify your account, request loan options, contact customer support, or otherwise communicate with us. This may include your name, email address, phone number, and financial details necessary for accurate loan discovery.</p>
            </section>
            
            <section>
              <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3">2. Use of Information</h3>
              <p>We use the information we collect to provide, maintain, and improve our services, such as facilitating your loan requests, sending you technical notices and updates, and protecting against fraudulent transactions or unauthorized access.</p>
            </section>
            
            <section>
              <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3">3. Data Sharing and Disclosure</h3>
              <p>We do not share your personal information with third parties except as necessary to fulfill your loan discovery requests (e.g., matching you with a specific banking partner). Any such sharing strictly abides by RBI guidelines and GDPR principles where applicable.</p>
            </section>
            
            <section>
              <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3">4. Data Security</h3>
              <p>We utilize robust 256-bit SSL encryption and strict access controls to protect your data. However, please remember that no method of transmission over the internet or method of electronic storage is 100% secure.</p>
            </section>
            
            <section>
              <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3">5. Your Rights</h3>
              <p>You have the right to access, modify, or delete your personal data at any time through our Compliance Hub on your dashboard. If you need assistance with data erasure, please contact us.</p>
            </section>
          </div>
        </PageContainer>
      </main>
      <Footer />
    </div>
  );
}
