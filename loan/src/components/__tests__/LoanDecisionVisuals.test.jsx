import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import RiskGauge from '../RiskGauge';
import ReasonList from '../ReasonList';

describe('RiskGauge Component', () => {
  it('renders low risk correctly (Green)', () => {
    render(<RiskGauge score={15} band="LOW" />);
    expect(screen.getByText('15')).toBeInTheDocument();
    expect(screen.getByText('LOW')).toBeInTheDocument();
    expect(screen.getByText('Risk Score')).toBeInTheDocument();
    
    // Check dynamic classes
    const container = screen.getByText('LOW').closest('div');
    expect(container).toHaveClass('text-emerald-500');
  });

  it('renders high risk correctly (Red)', () => {
    render(<RiskGauge score={85} band="VERY_HIGH" />);
    expect(screen.getByText('85')).toBeInTheDocument();
    expect(screen.getByText('VERY_HIGH')).toBeInTheDocument();
    
    const container = screen.getByText('VERY_HIGH').closest('div');
    expect(container).toHaveClass('text-red-500');
  });

  it('clamps invalid scores', () => {
    render(<RiskGauge score={150} band="INVALID" />);
    expect(screen.getByText('100')).toBeInTheDocument(); // max clamp is 100
  });
});

describe('ReasonList Component', () => {
  it('renders eligible state', () => {
    render(<ReasonList eligible={true} reason="Income meets requirements." />);
    expect(screen.getByText('Eligible')).toBeInTheDocument();
    expect(screen.getByText('Income meets requirements.')).toBeInTheDocument();
  });

  it('renders not eligible state', () => {
    render(<ReasonList eligible={false} reason="DTI ratio too high." />);
    expect(screen.getByText('Not Eligible')).toBeInTheDocument();
    expect(screen.getByText('DTI ratio too high.')).toBeInTheDocument();
  });
});
