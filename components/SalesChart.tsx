'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts'

interface SalesChartProps {
  year: string
}

const SalesChart = ({ year }: SalesChartProps) => {
  const data = [
    { month: 'JAN', value: 0 },
    { month: 'FEB', value: 0 },
    { month: 'MAR', value: 0 },
    { month: 'APR', value: 0 },
    { month: 'MEI', value: 0 },
    { month: 'JUN', value: 0 },
    { month: 'JUL', value: 0 },
    { month: 'AGU', value: 0 },
    { month: 'SEP', value: 0 },
    { month: 'OKT', value: 0 },
    { month: 'NOV', value: 0 },
    { month: 'DES', value: 0 },
  ]

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="month" 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#6b7280' }}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#6b7280' }}
            tickFormatter={(value) => 'N/A'}
          />
          <Bar 
            dataKey="value" 
            fill="#e5e7eb"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
      
      {/* Red dots at the base of bars */}
      <div className="flex justify-between mt-2 px-2">
        {data.map((_, index) => (
          <div key={index} className="w-2 h-2 bg-primary-600 rounded-full"></div>
        ))}
      </div>
    </div>
  )
}

export default SalesChart
