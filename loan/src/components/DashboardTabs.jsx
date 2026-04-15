import { motion, AnimatePresence } from 'framer-motion';

export default function DashboardTabs({ tabs, activeTab, onTabChange, children }) {
  return (
    <div className="flex-1 flex flex-col">
      {/* Tab Navigation */}
      <div className="border-b border-[var(--border-subtle)] bg-[var(--bg-card)]/50 backdrop-blur sticky top-0 z-10">
        <div className="flex gap-2 px-4 sm:px-6 overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <motion.button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold whitespace-nowrap transition-colors relative border-b-2 ${
                  isActive
                    ? 'text-[var(--accent)] border-[var(--accent)]'
                    : 'text-[var(--text-faint)] border-transparent hover:text-[var(--text-primary)]'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="flex-1 p-4 sm:p-6 overflow-y-auto"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
