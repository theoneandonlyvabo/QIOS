import { motion } from 'framer-motion';
import { getStatusColor } from '@/lib/design-tokens';

interface MetricCardProps {
  title: string;
  value: string | number;
  target?: number;
  progress?: number;
  trend: {
    value: number;
    period: string;
    direction: 'up' | 'down';
  };
  insight?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  status: 'excellent' | 'good' | 'warning' | 'danger';
}

export default function MetricCard({
  title,
  value,
  target,
  progress,
  trend,
  insight,
  action,
  status
}: MetricCardProps) {
  const statusColors = getStatusColor(status);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`relative border-l-4 ${statusColors} rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-200`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-sm font-medium text-neutral-600 uppercase tracking-wide mb-1">
            {title}
          </h3>
          <p className="text-3xl font-bold text-neutral-900">
            {value}
          </p>
        </div>
        
        {/* Trend indicator */}
        <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
          trend.direction === 'up' ? 'bg-success-100 text-success-700' : 'bg-danger-100 text-danger-700'
        }`}>
          {trend.direction === 'up' ? '↑' : '↓'} {Math.abs(trend.value)}%
          <span className="text-neutral-500 ml-1">{trend.period}</span>
        </div>
      </div>

      {/* Progress bar (if target exists) */}
      {target && progress !== undefined && (
        <div className="mb-4">
          <div className="flex justify-between text-xs text-neutral-600 mb-2">
            <span>Progress to target</span>
            <span className="font-semibold">{progress}%</span>
          </div>
          <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(progress, 100)}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className={`h-full rounded-full transition-colors duration-500 ${
                progress >= 100 ? 'bg-success-500' :
                progress >= 75 ? 'bg-primary-500' :
                progress >= 50 ? 'bg-warning-500' : 'bg-danger-500'
              }`}
            />
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            Target: {target}
          </p>
        </div>
      )}

      {/* AI Insight (if available) */}
      {insight && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="bg-primary-50 border border-primary-200 rounded-lg p-3 mb-3"
        >
          <div className="flex gap-2">
            <span className="text-primary-600 text-sm">💡</span>
            <p className="text-sm text-neutral-700">{insight}</p>
          </div>
        </motion.div>
      )}

      {/* Action button (if available) */}
      {action && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={action.onClick}
          className="w-full mt-2 py-2 px-4 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
        >
          {action.label} →
        </motion.button>
      )}
    </motion.div>
  );
}