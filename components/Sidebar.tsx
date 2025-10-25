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
    <div className="w-64 bg-white flex flex-col h-full">
      {/* Title Website */}
      <div className="px-8 pt-10 pb-8">
        <div className="flex items-end justify-center gap-2">
          <h1 className="text-3 xl font-bold italic text-gray-900">QIOS</h1>
          <p className="text-sm font-medium text-blue-600 mb-1">Retail</p>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-3 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = activeItem === item.id
          
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveItem(item.id)
                onNavigate?.(item.id.toLowerCase())
              }}
              className={`sidebar-item w-full text-left ${
                isActive 
                  ? 'bg-primary-600 text-white hover:bg-primary-700' 
                  : 'sidebar-item-inactive'
              }`}
            >
              <Icon className={`w-5 h-5 mr-3 ${isActive ? 'text-white' : ''}`} />
              {item.label}
            </button>
          )
        })}
        
        {/* Separator */}
        <div className="border-t border-gray-200 my-4"></div>
        
        {bottomItems.map((item) => {
          const Icon = item.icon
          const isActive = activeItem === item.id
          
          return (
            <button
              key={item.id}
              onClick={() => setActiveItem(item.id)}
              className={`sidebar-item w-full text-left ${
                isActive 
                  ? 'bg-primary-600 text-white hover:bg-primary-700' 
                  : 'sidebar-item-inactive'
              }`}
            >
              <Icon className={`w-5 h-5 mr-3 ${isActive ? 'text-white' : ''}`} />
              {item.label}
            </button>
          )
        })}
      </nav>

      {/* Ad Placeholder */}
      <div className="px-3 pt-2 pb-4">
        <div className="bg-gray-100 rounded-full p-4 text-center">
          <Image className="w-5 h-5 mx-auto mb-2 text-gray-400" />
          <p className="text-sm text-gray-500">Place Your Ads Here!</p>
        </div>
      </div>

      {/* Support Button */}
      <div className="px-3 pb-4">
        <button className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-2.5 px-4 rounded-full flex items-center justify-center transition-colors duration-200 text-sm">
          <Phone className="w-4 h-4 mr-2" />
          Get Support
        </button>
      </div>

      {/* Validity Info */}
      <div className="px-3 pb-4">
        <p className="text-xs text-gray-500 text-center">
          Valid Until DD/MM/YYYY
        </p>
      </div>
    </div>
  )
}

const SidebarComponent: React.FC<SidebarProps> = Sidebar;
export default SidebarComponent;
