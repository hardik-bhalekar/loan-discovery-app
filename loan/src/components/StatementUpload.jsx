import React, { useState, useEffect } from 'react';
import { getAuthToken } from '../utils/api';
import UploadZone from './UploadZone';
import CashflowChart from './CashflowChart';
import PremiumCard from './ui/PremiumCard';
import { ShieldCheck, AlertCircle, TrendingUp, CreditCard } from 'lucide-react';
import { formatCompactINR } from '../utils/formatters';

export default function StatementUpload() {
  const [report, setReport] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [cashflows, setCashflows] = useState([]);

  useEffect(() => {
    fetchLatestReport();
  }, []);

  const fetchLatestReport = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'}/statements/latest`, {
        headers: { Authorization: `Bearer ${getAuthToken()}` },
      });
      if (res.status === 200) {
        const data = await res.json();
        setReport(data);
        setCashflows(JSON.parse(data.cashflowJson || '[]'));
      }
    } catch (err) {
      console.error('Failed to fetch latest statement', err);
    }
  };

  const handleUpload = async (file) => {
    setIsUploading(true);
    setError('');
    
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'}/statements/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${getAuthToken()}` },
        body: formData,
      });

      if (!res.ok) throw new Error('Upload failed');
      
      const data = await res.json();
      setReport(data);
      setCashflows(JSON.parse(data.cashflowJson || '[]'));
    } catch (err) {
      setError(err.message || 'Failed to process statement. Please ensure it is a valid PDF/CSV.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <PremiumCard>
        <div className="mb-4">
          <h2 className="text-sm font-semibold tracking-wide text-[var(--text-primary)]">Bank Statement Intelligence</h2>
          <p className="text-xs text-[var(--text-muted)]">Upload your last 6 months' statement for instant verification and higher approval chances.</p>
        </div>
        <UploadZone onUpload={handleUpload} isUploading={isUploading} error={error} />
      </PremiumCard>

      {report && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <PremiumCard className="h-full">
              <h3 className="mb-4 text-sm font-semibold text-[var(--text-primary)]">Cashflow Analysis</h3>
              <CashflowChart data={cashflows} />
            </PremiumCard>
          </div>
          
          <div className="space-y-4">
            <PremiumCard className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10">
                <TrendingUp className="h-6 w-6 text-emerald-500" />
              </div>
              <div>
                <p className="text-xs font-medium text-[var(--text-faint)]">Avg. Monthly Income</p>
                <p className="text-lg font-bold text-[var(--text-primary)]">{formatCompactINR(report.averageMonthlyIncome)}</p>
              </div>
            </PremiumCard>

            <PremiumCard className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/10">
                <CreditCard className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-xs font-medium text-[var(--text-faint)]">Detected EMIs</p>
                <p className="text-lg font-bold text-[var(--text-primary)]">{formatCompactINR(report.totalDetectedEmis)}</p>
              </div>
            </PremiumCard>

            <PremiumCard className="flex items-center gap-4">
              <div className={`flex h-12 w-12 items-center justify-center rounded-full ${report.bounceCount > 0 ? 'bg-red-500/10' : 'bg-emerald-500/10'}`}>
                {report.bounceCount > 0 ? <AlertCircle className={`h-6 w-6 text-red-500`} /> : <ShieldCheck className="h-6 w-6 text-emerald-500" />}
              </div>
              <div>
                <p className="text-xs font-medium text-[var(--text-faint)]">Cheque/ECS Bounces</p>
                <p className="text-lg font-bold text-[var(--text-primary)]">
                  {report.bounceCount} <span className="text-xs font-normal text-[var(--text-muted)]">detected</span>
                </p>
              </div>
            </PremiumCard>
          </div>
        </div>
      )}
    </div>
  );
}
