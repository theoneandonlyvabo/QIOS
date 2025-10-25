'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts'

interface UserActivityChartProps {
  year: string
}

const UserActivityChart = ({ year }: UserActivityChartProps) => {
  const data = [
    { month: 'Jan', activity: 0 },
    { month: 'Feb', activity: 0 },
    { month: 'Mar', activity: 0 },
    { month: 'Apr', activity: 0 },
    { month: 'May', activity: 0 },
    { month: 'Jun', activity: 0 },
    { month: 'Jul', activity: 0 },
    { month: 'Aug', activity: 0 },
    { month: 'Sep', activity: 0 },
    { month: 'Oct', activity: 0 },
    { month: 'Nov', activity: 0 },
    { month: 'Dec', activity: 0 },
  ]

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
          <Line 
            type="monotone" 
            dataKey="activity" 
            stroke="#ef4444" 
            strokeWidth={3}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default UserActivityChart
