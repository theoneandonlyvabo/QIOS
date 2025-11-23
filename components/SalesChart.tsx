'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts'

interface SalesChartProps {
  data: Array<{
    date: string
    value: number
  }>
}

const SalesChart = ({ data }: SalesChartProps) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-400 bg-gray-50 dark:bg-gray-900 rounded-lg">
        <p>Belum ada data penjualan</p>
      </div>
    )
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="var(--chart-grid-color, #f0f0f0)"
            className="dark:!stroke-gray-700"
          />
          <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={false}
            tick={{
              fontSize: 12,
              fill: 'var(--chart-text-color, #6b7280)',
              className: 'dark:!fill-gray-400'
            }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{
              fontSize: 12,
              fill: 'var(--chart-text-color, #6b7280)',
              className: 'dark:!fill-gray-400'
            }}
            tickFormatter={(value) => `Rp${(value / 1000000).toFixed(1)}M`}
          />
          <Bar
            dataKey="value"
            fill="var(--chart-bar-color, #e5e7eb)"
            radius={[4, 4, 0, 0]}
            className="dark:!fill-gray-700"
          />
        </BarChart>
      </ResponsiveContainer>

      {/* Dots at the base of bars */}
      <div className="flex justify-between mt-2 px-2">
        {data.map((_, index) => (
          <div
            key={index}
            className="w-2 h-2 bg-primary-600 dark:bg-primary-500 rounded-full"
          ></div>
        ))}
      </div>

      <style jsx global>{`
        :root {
          --chart-grid-color: #f0f0f0;
          --chart-text-color: #6b7280;
          --chart-bar-color: #e5e7eb;
        }
        .dark {
          --chart-grid-color: #374151;
          --chart-text-color: #9ca3af;
          --chart-bar-color: #4b5563;
        }
      `}</style>
    </div>
  )
}

export default SalesChart
