import { motion } from 'framer-motion';
import { Card, CardBody, CardHeader } from './ui/Card';

export default function FormWrapper({ title, subtitle, icon: Icon, children, footer }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md mx-auto"
    >
      <Card className="shadow-xl">
        <CardHeader className="bg-gradient-to-r from-[var(--accent)]/5 to-blue-600/5 border-b border-[var(--border-medium)]">
          <div className="flex items-start gap-3">
            {Icon && (
              <div className="p-2.5 rounded-lg bg-[var(--accent)]/10">
                <Icon className="h-6 w-6 text-[var(--accent)]" />
              </div>
            )}
            <div className="flex-1">
              <h2 className="text-xl font-bold text-[var(--text-primary)]">{title}</h2>
              {subtitle && <p className="text-sm text-[var(--text-secondary)] mt-1">{subtitle}</p>}
            </div>
          </div>
        </CardHeader>

        <CardBody className="pt-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {children}
          </motion.div>
        </CardBody>

        {footer && (
          <>
            <div className="h-px bg-gradient-to-r from-transparent via-[var(--border-subtle)] to-transparent" />
            <div className="px-6 py-4 bg-[var(--bg-secondary)]/50 rounded-b-2xl">
              {footer}
            </div>
          </>
        )}
      </Card>
    </motion.div>
  );
}
