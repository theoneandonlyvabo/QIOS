import BusinessHealthHero from './BusinessHealthHero';
import MetricCard from './MetricCard';
import InteractiveChart from './InteractiveChart';
import { motion } from 'framer-motion';

export default function Dashboard() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto p-6 space-y-6"
    >
      {/* Hero Section */}
      <BusinessHealthHero
        data={{
          score: 85,
          trend: 'up',
          message: 'Your business is performing well with room for optimization',
          urgentActions: [
            {
              id: '1',
              title: 'Low Stock Alert',
              description: '5 products are below minimum stock level',
              priority: 'high',
              action: () => {}
            },
            {
              id: '2',
              title: 'Review Pending Orders',
              description: '3 orders need confirmation',
              priority: 'medium',
              action: () => {}
            }
          ]
        }}
      />

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <MetricCard
          title="Monthly Revenue"
          value="Rp 45.2M"
          target={60000000}
          progress={75.3}
          trend={{
            value: 12.5,
            period: "vs last month",
            direction: "up"
          }}
          insight="You're on track to exceed target by 8% if this trend continues."
          action={{
            label: "View detailed breakdown",
            onClick: () => {}
          }}
          status="good"
        />

        <MetricCard
          title="Customer Satisfaction"
          value="4.8/5.0"
          trend={{
            value: 0.3,
            period: "vs last month",
            direction: "up"
          }}
          insight="Positive reviews mention quick service and product quality"
          action={{
            label: "View customer feedback",
            onClick: () => {}
          }}
          status="excellent"
        />

        <MetricCard
          title="Inventory Health"
          value="85%"
          target={100}
          progress={85}
          trend={{
            value: 5,
            period: "vs last week",
            direction: "down"
          }}
          insight="5 products need reordering soon"
          action={{
            label: "Manage inventory",
            onClick: () => {}
          }}
          status="warning"
        />
      </div>

      {/* Revenue Chart */}
      <InteractiveChart
        data={[
          // Sample data - replace with actual data
          { date: '2025-01-01', value: 1000000, previousValue: 800000 },
          { date: '2025-01-02', value: 1200000, previousValue: 900000 },
          { date: '2025-01-03', value: 1100000, previousValue: 850000 },
          { date: '2025-01-04', value: 1300000, previousValue: 950000 },
          { date: '2025-01-05', value: 1500000, previousValue: 1100000 },
          { date: '2025-01-06', value: 1400000, previousValue: 1200000 },
          { date: '2025-01-07', value: 1600000, previousValue: 1300000 },
        ]}
      />

      {/* Activity Feed */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">Recent Activity</h3>
        {/* Add activity feed component here */}
      </div>
    </motion.div>
  );
}