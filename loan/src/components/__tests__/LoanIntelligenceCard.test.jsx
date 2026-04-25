import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import LoanIntelligenceCard from '../LoanIntelligenceCard';
import { computeRiskScore } from '../../services/predictionApi';
import { BrowserRouter } from 'react-router-dom';

// Mock the API layer
vi.mock('../../services/predictionApi', () => ({
  computeRiskScore: vi.fn(),
}));

describe('LoanIntelligenceCard', () => {
  const mockProfile = {
    monthlyIncome: 60000,
    creditScore: 750,
    loanAmount: 500000,
    tenure: 5,
    loanType: 'Home Loan',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // Mock crypto.randomUUID for testing
    Object.defineProperty(window, 'crypto', {
      value: { randomUUID: () => '12345678-1234-1234-1234-123456789abc' },
      writable: true,
    });
  });

  const renderWithRouter = (ui) => render(<BrowserRouter>{ui}</BrowserRouter>);

  it('renders initial state correctly', () => {
    renderWithRouter(<LoanIntelligenceCard profile={mockProfile} />);
    expect(screen.getByText('Loan Intelligence')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Analyze Profile/i })).toBeInTheDocument();
  });

  it('displays loading state during API call', async () => {
    // Hang the promise to test loading state
    computeRiskScore.mockImplementation(() => new Promise((resolve) => setTimeout(resolve, 100)));
    
    renderWithRouter(<LoanIntelligenceCard profile={mockProfile} />);
    const button = screen.getByRole('button', { name: /Analyze Profile/i });
    fireEvent.click(button);

    expect(screen.getByText('Running risk models...')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Analyze Profile/i })).not.toBeInTheDocument();
  });

  it('displays API error state correctly', async () => {
    computeRiskScore.mockRejectedValue(new Error('Network failure'));
    
    renderWithRouter(<LoanIntelligenceCard profile={mockProfile} />);
    fireEvent.click(screen.getByRole('button', { name: /Analyze Profile/i }));

    await waitFor(() => {
      expect(screen.getByText('Network failure')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Try Again/i })).toBeInTheDocument();
    });
  });

  it('displays results properly on successful calculation', async () => {
    computeRiskScore.mockResolvedValue({
      riskScore: 25,
      riskBand: 'LOW',
      eligible: true,
      eligibilityReason: 'Approved',
      maxEligibleAmount: 1000000,
      recommendedEmi: 15000,
    });
    
    renderWithRouter(<LoanIntelligenceCard profile={mockProfile} />);
    fireEvent.click(screen.getByRole('button', { name: /Analyze Profile/i }));

    await waitFor(() => {
      expect(screen.getByText('LOW')).toBeInTheDocument(); // from RiskGauge
      expect(screen.getByText('Eligible')).toBeInTheDocument(); // from ReasonList
      expect(screen.getByText('Approved')).toBeInTheDocument();
      // Ensure the exact idempotency key was passed
      expect(computeRiskScore).toHaveBeenCalledWith(expect.objectContaining({
        idempotencyKey: '12345678-1234-1234-1234-123456789abc'
      }));
    });
  });
});
