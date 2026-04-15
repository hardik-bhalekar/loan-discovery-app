import { useState } from 'react';

export default function Tabs({ defaultValue, tabs = [], children, className = '' }) {
  const [activeTab, setActiveTab] = useState(defaultValue || (Array.isArray(tabs) ? tabs[0]?.value : null));

  return (
    <div className={className}>
      <div className="border-b border-[var(--border-subtle)] flex gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`
              px-4 py-3 text-sm font-medium transition-colors relative
              ${activeTab === tab.value
                ? 'text-[var(--accent)]'
                : 'text-[var(--text-faint)] hover:text-[var(--text-primary)]'}
            `}
          >
            {tab.label}
            {activeTab === tab.value && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--accent)]" />
            )}
          </button>
        ))}
      </div>
      <div className="pt-6">
        {typeof children === 'function' ? children(activeTab) : children}
      </div>
    </div>
  );
}
