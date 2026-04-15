import { motion } from 'framer-motion';
import { Card, CardBody } from './ui/Card';

/**
 * Enhanced Grid Layout for dashboard-style components
 * Automatically handles responsive grid with animations
 */
export default function DashboardGrid({ children, columns = 3, gap = 6, animate = true }) {
  const gridColsClass = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  }[columns] || 'grid-cols-1';

  const gapClass = {
    4: 'gap-4',
    5: 'gap-5',
    6: 'gap-6',
    8: 'gap-8',
  }[gap] || 'gap-6';

  return (
    <div className={`grid ${gridColsClass} ${gapClass}`}>
      {animate ? (
        children.map?.((child, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            viewport={{ once: true }}
          >
            {child}
          </motion.div>
        )) || children
      ) : (
        children
      )}
    </div>
  );
}

/**
 * Empty state when no data is available
 */
export function DashboardEmpty({ icon: Icon, title, description, action, animate = true }) {
  const content = (
    <Card>
      <CardBody className="text-center py-12">
        {Icon && (
          <div className="mx-auto w-12 h-12 rounded-full bg-[var(--accent)]/10 flex items-center justify-center mb-4">
            <Icon className="w-6 h-6 text-[var(--accent)]" />
          </div>
        )}
        <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">{title}</h3>
        <p className="text-sm text-[var(--text-faint)] mb-6 max-w-sm">{description}</p>
        {action}
      </CardBody>
    </Card>
  );

  return animate ? (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      {content}
    </motion.div>
  ) : (
    content
  );
}
