'use client'

import { useState } from 'react'
import { 
  LayoutDashboard, 
  BarChart3, 
  Package, 
  Bell, 
  Users, 
  Settings, 
  LogOut,
  Phone,
  Image,
  Calendar,
  Brain,
  CreditCard
} from 'lucide-react'

interface SidebarProps {
  onNavigate?: (view: string) => void
}

const Sidebar = ({ onNavigate }: SidebarProps) => {
  const [activeItem, setActiveItem] = useState('Dashboard')

  const menuItems = [
    { id: 'Dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'Analytics', icon: BarChart3, label: 'Analytics' },
    { id: 'Stock', icon: Package, label: 'Stock' },
    { id: 'Notifications', icon: Bell, label: 'Notifications' },
    { id: 'Customers', icon: Users, label: 'Customers' },
  ]

  const bottomItems = [
    { id: 'Settings', icon: Settings, label: 'Settings' },
    { id: 'Logout', icon: LogOut, label: 'Keluar' },
  ]

  return (
    <div className="w-64 bg-white dark:bg-gray-900 flex flex-col h-full">
      {/* Title Website */}
      <div className="px-8 pt-10 pb-8">
        <div className="flex items-end justify-center gap-2">
          <h1 className="text-3xl font-bold italic text-gray-900 dark:text-white">QIOS</h1>
          <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-1">Retail</p>
        </div>
      </div>

      <nav className="flex-1 px-3 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`w-full flex items-center px-4 py-2 rounded-full text-sm
              ${activeItem === item.id 
                ? 'bg-primary-600 text-white' 
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
          >
            <item.icon className="w-4 h-4 mr-3" />
            {item.label}
          </button>
        ))}
      </nav>

      {/* Ad Placeholder */}
      <div className="px-3 pt-2 pb-4">
        <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-4 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">Place Your Ads Here!</p>
        </div>
      </div>

      {/* Support Button */}
      <div className="px-3 pb-4">
        <button className="w-full bg-primary-600 text-white rounded-full py-2.5 hover:bg-primary-700">
          Get Support
        </button>
      </div>
    </div>
  )
}

const SidebarComponent: React.FC<SidebarProps> = Sidebar;
export default SidebarComponent;
