import React from 'react';

export default function RiskGauge({ score, band }) {
  const normalizedScore = Math.min(Math.max(score, 0), 100);
  
  const getColors = () => {
    if (normalizedScore <= 20) return 'text-emerald-500 bg-emerald-50 border-emerald-200';
    if (normalizedScore <= 40) return 'text-blue-500 bg-blue-50 border-blue-200';
    if (normalizedScore <= 60) return 'text-yellow-500 bg-yellow-50 border-yellow-200';
    if (normalizedScore <= 80) return 'text-orange-500 bg-orange-50 border-orange-200';
    return 'text-red-500 bg-red-50 border-red-200';
  };

  const getProgressColor = () => {
    if (normalizedScore <= 20) return 'bg-emerald-500';
    if (normalizedScore <= 40) return 'bg-blue-500';
    if (normalizedScore <= 60) return 'bg-yellow-500';
    if (normalizedScore <= 80) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <div className={`p-4 rounded-xl border ${getColors()} flex flex-col items-center justify-center`}>
      <p className="text-sm font-semibold uppercase tracking-wider mb-2">Risk Score</p>
      <div className="text-4xl font-bold mb-1">{normalizedScore}</div>
      <p className="text-xs font-medium uppercase tracking-wide">{band}</p>
      
      <div className="w-full mt-4 bg-white/50 rounded-full h-2 overflow-hidden border border-black/5 dark:bg-black/20">
        <div 
          className={`h-full ${getProgressColor()} transition-all duration-1000 ease-out`}
          style={{ width: `${normalizedScore}%` }}
        />
      </div>
      <div className="w-full flex justify-between mt-1 text-[10px] opacity-70 font-semibold">
        <span>0</span>
        <span>100</span>
      </div>
    </div>
  );
}
