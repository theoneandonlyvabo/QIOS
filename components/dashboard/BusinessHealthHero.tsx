import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { getStatusColor, getTrendColor } from '@/lib/design-tokens';

interface HealthStatus {
  score: number;
  trend: 'up' | 'down' | 'stable';
  message: string;
  urgentActions: Action[];
}

interface Action {
  id: string;
  title: string;
  description: string;
  priority: 'critical' | 'high' | 'medium';
  action: () => void;
}

export default function BusinessHealthHero({ data }: { data: HealthStatus }) {
  const healthColor = getStatusColor(
    data.score >= 80 ? 'excellent' : 
    data.score >= 60 ? 'good' : 
    data.score >= 40 ? 'warning' : 'danger'
  );
  
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl p-8 text-white shadow-xl">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      
      <div className="relative z-10 grid md:grid-cols-3 gap-8">
        {/* Main Health Score */}
        <div className="md:col-span-1 flex flex-col items-center justify-center">
          <div className="mb-4">
            <div className={`w-32 h-32 rounded-full border-8 ${healthColor} flex items-center justify-center bg-white/10 backdrop-blur`}>
              <span className="text-5xl font-bold">{data.score}</span>
            </div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              {data.trend === 'up' && <TrendingUp className="w-5 h-5 text-success-300" />}
              {data.trend === 'down' && <TrendingDown className="w-5 h-5 text-danger-300" />}
              {data.trend === 'stable' && <Minus className="w-5 h-5 text-warning-300" />}
              <span className="text-lg font-semibold">Health Score</span>
            </div>
            <p className="text-white/80 text-sm">{data.message}</p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="md:col-span-1 space-y-4">
          <h3 className="text-sm font-medium text-white/60 uppercase tracking-wide">Today's Performance</h3>
          
          <div className="space-y-3">
            <QuickStat
              label="Revenue"
              value="Rp 2.4M"
              change="+12%"
              positive
            />
            <QuickStat
              label="Transactions"
              value="47"
              change="+8"
              positive
            />
            <QuickStat
              label="Avg. Order Value"
              value="Rp 51K"
              change="-3%"
              positive={false}
            />
          </div>
        </div>

        {/* Urgent Actions */}
        <div className="md:col-span-1">
          <h3 className="text-sm font-medium text-white/60 uppercase tracking-wide mb-4">Action Required</h3>
          
          <div className="space-y-3">
            {data.urgentActions.length === 0 ? (
              <div className="bg-white/10 backdrop-blur rounded-lg p-4 text-center">
                <p className="text-sm text-white/80">All good! No urgent actions needed.</p>
              </div>
            ) : (
              data.urgentActions.map((action) => (
                <UrgentActionCard key={action.id} action={action} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function QuickStat({ label, value, change, positive }: any) {
  return (
    <div className="flex items-center justify-between bg-white/10 backdrop-blur rounded-lg p-3">
      <span className="text-sm text-white/70">{label}</span>
      <div className="text-right">
        <p className="text-lg font-semibold">{value}</p>
        <p className={`text-xs ${positive ? 'text-success-300' : 'text-danger-300'}`}>
          {change} vs yesterday
        </p>
      </div>
    </div>
  );
}

function UrgentActionCard({ action }: { action: Action }) {
  const priorityColor = {
    critical: 'bg-danger-500/20',
    high: 'bg-warning-500/20',
    medium: 'bg-primary-400/20'
  }[action.priority];

  return (
    <button
      onClick={action.action}
      className={`w-full text-left p-3 ${priorityColor} rounded-lg backdrop-blur hover:bg-white/10 transition-colors duration-200`}
    >
      <h4 className="font-medium mb-1">{action.title}</h4>
      <p className="text-sm text-white/70">{action.description}</p>
    </button>
  );
}