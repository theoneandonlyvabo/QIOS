import { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line } from 'recharts';
import { motion } from 'framer-motion';

interface ChartData {
  date: string;
  value: number;
  previousValue?: number;
}

interface InteractiveChartProps {
  data: ChartData[];
  title?: string;
}

export default function InteractiveChart({ data, title = 'Revenue Trends' }: InteractiveChartProps) {
  const [timeframe, setTimeframe] = useState<'7d' | '30d' | '90d'>('30d');
  const [metric, setMetric] = useState<'revenue' | 'orders' | 'aov'>('revenue');
  const [comparisonEnabled, setComparisonEnabled] = useState(false);

  // Custom tooltip with insights
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) return null;

    const current = payload[0].value;
    const previous = comparisonEnabled && payload[1] ? payload[1].value : null;
    const change = previous ? ((current - previous) / previous * 100).toFixed(1) : null;

    return (
      <div className="bg-white border border-neutral-200 rounded-lg shadow-lg p-4 max-w-xs">
        <p className="text-sm font-semibold text-neutral-900 mb-2">{label}</p>
        
        <div className="space-y-2">
          <div>
            <p className="text-xs text-neutral-600">Current Period</p>
            <p className="text-lg font-bold text-primary-600">
              Rp {current.toLocaleString('id-ID')}
            </p>
          </div>
          
          {comparisonEnabled && previous && (
            <div>
              <p className="text-xs text-neutral-600">Previous Period</p>
              <p className="text-sm text-neutral-700">
                Rp {previous.toLocaleString('id-ID')}
              </p>
              <p className={`text-sm font-semibold ${
                Number(change) > 0 ? 'text-success-600' : 'text-danger-600'
              }`}>
                {Number(change) > 0 ? '+' : ''}{change}% change
              </p>
            </div>
          )}
        </div>
        
        <div className="mt-3 pt-3 border-t border-neutral-100">
          <p className="text-xs text-neutral-600">
            {getInsightForDataPoint(current, previous)}
          </p>
        </div>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl shadow-md p-6"
    >
      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
        <h3 className="text-lg font-semibold text-neutral-900">{title}</h3>
        
        <div className="flex gap-2">
          {/* Timeframe selector */}
          <div className="inline-flex rounded-lg border border-neutral-200 p-1">
            {[
              { value: '7d', label: '7 Days' },
              { value: '30d', label: '30 Days' },
              { value: '90d', label: '90 Days' }
            ].map((tf) => (
              <button
                key={tf.value}
                onClick={() => setTimeframe(tf.value as any)}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  timeframe === tf.value
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                {tf.label}
              </button>
            ))}
          </div>

          {/* Metric selector */}
          <select
            value={metric}
            onChange={(e) => setMetric(e.target.value as any)}
            className="px-3 py-1 border border-neutral-200 rounded-lg text-sm font-medium text-neutral-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="revenue">Revenue</option>
            <option value="orders">Orders</option>
            <option value="aov">Avg Order Value</option>
          </select>

          {/* Comparison toggle */}
          <button
            onClick={() => setComparisonEnabled(!comparisonEnabled)}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              comparisonEnabled
                ? 'bg-primary-100 text-primary-700'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
            }`}
          >
            {comparisonEnabled ? '✓ Compare' : 'Compare'}
          </button>
        </div>
      </div>

      {/* Chart */}
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
            <XAxis 
              dataKey="date" 
              stroke="#737373"
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              stroke="#737373"
              style={{ fontSize: '12px' }}
              tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
            />
            <Tooltip content={<CustomTooltip />} />
            
            <Area
              type="monotone"
              dataKey="value"
              stroke="#3B82F6"
              strokeWidth={2}
              fill="url(#colorRevenue)"
            />
            
            {comparisonEnabled && (
              <Line
                type="monotone"
                dataKey="previousValue"
                stroke="#A3A3A3"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Summary stats */}
      <div className="mt-6 grid grid-cols-3 gap-4 pt-4 border-t border-neutral-100">
        <ChartStat
          label="Period Total"
          value={calculateTotal(data)}
        />
        <ChartStat
          label="Daily Average"
          value={calculateAverage(data)}
        />
        <ChartStat
          label="Peak Day"
          value={findPeak(data)}
          highlight
        />
      </div>
    </motion.div>
  );
}

function ChartStat({ label, value, highlight = false }: any) {
  return (
    <div>
      <p className="text-xs text-neutral-600 mb-1">{label}</p>
      <p className={`text-lg font-bold ${
        highlight ? 'text-success-600' : 'text-neutral-900'
      }`}>
        Rp {value.toLocaleString('id-ID')}
      </p>
    </div>
  );
}

// Helper functions
function calculateTotal(data: ChartData[]) {
  return data.reduce((acc, curr) => acc + curr.value, 0);
}

function calculateAverage(data: ChartData[]) {
  return calculateTotal(data) / data.length;
}

function findPeak(data: ChartData[]) {
  return Math.max(...data.map(d => d.value));
}

function getInsightForDataPoint(current: number, previous: number | null) {
  if (!previous) return 'Hover over different points to see the trend';
  
  const change = ((current - previous) / previous) * 100;
  if (change > 20) return 'Significant increase - investigate success factors';
  if (change > 10) return 'Healthy growth trend';
  if (change > 0) return 'Slight improvement from previous period';
  if (change > -10) return 'Minor decrease - monitor the trend';
  return 'Notable decrease - may require attention';
}