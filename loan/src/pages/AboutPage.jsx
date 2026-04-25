import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageContainer from '../components/ui/PageContainer';
import SectionHeader from '../components/ui/SectionHeader';

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-[var(--bg-primary)] to-[var(--bg-secondary)]">
      <Navbar />
      <main className="flex-1 py-16">
        <PageContainer className="max-w-4xl">
          <SectionHeader
            eyebrow="About Us"
            title="Empowering Financial Discovery"
            description="Our mission is to simplify the loan discovery process by bringing transparency, ease, and smart matching technology to everyone."
            align="left"
          />
          <div className="mt-8 space-y-6 text-[var(--text-muted)] leading-relaxed">
            <p>
              At LoanSmart, we believe that finding the right financial product shouldn't be a tedious process. With countless banks, varied interest rates, and complex terms, it can be overwhelming for the average consumer to make an informed choice.
            </p>
            <p>
              We bridge the gap between borrowers and lenders by providing an intuitive platform where users can compare live rates, review Key Fact Statements (KFS), and simulate EMIs before ever committing to a loan.
            </p>
            <p>
              Founded in 2026, LoanSmart brings together a team of finance experts and technology enthusiasts dedicated to making loan discovery transparent, secure, and user-centric. Whether you are looking for a personal loan, home loan, or business financing, LoanSmart equips you with the tools you need to secure the best rates available.
            </p>
          </div>
        </PageContainer>
      </main>
      <Footer />
    </div>
  );
}
