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
  Ad,
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
    { id: 'Calendar', icon: Calendar, label: 'Calendar' },
    { id: 'AICompanion', icon: Brain, label: 'AI Companion' },
    { id: 'Team', icon: Users, label: 'Team Management' },
    { id: 'Notifications', icon: Bell, label: 'Notifications' },
    { id: 'Customers', icon: Users, label: 'Customer Analytics' },
    { id: 'Transactions', icon: CreditCard, label: 'Transactions' },
    { id: 'Stock', icon: Package, label: 'Inventory' },
    { id: 'Analytics', icon: BarChart3, label: 'Analytics' },
  ]

  const bottomItems = [
    { id: 'Settings', icon: Settings, label: 'Settings' },
    { id: 'Logout', icon: LogOut, label: 'Log Out' },
  ]

  return (
    <div className="w-64 bg-white shadow-lg flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">Q</span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">QIOS</h1>
            <p className="text-sm text-gray-500">Retail</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-4 py-6 space-y-2">
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
                isActive ? 'sidebar-item-active' : 'sidebar-item-inactive'
              }`}
            >
              <Icon className="w-5 h-5 mr-3" />
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
                isActive ? 'sidebar-item-active' : 'sidebar-item-inactive'
              }`}
            >
              <Icon className="w-5 h-5 mr-3" />
              {item.label}
            </button>
          )
        })}
      </nav>

      {/* Ad Placeholder */}
      <div className="px-4 py-4">
        <div className="bg-gray-100 rounded-lg p-4 text-center">
          <Ad className="w-6 h-6 mx-auto mb-2 text-gray-400" />
          <p className="text-sm text-gray-500">Place Your Ads Here!</p>
        </div>
      </div>

      {/* Support Button */}
      <div className="px-4 py-4">
        <button className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center transition-colors duration-200">
          <Phone className="w-4 h-4 mr-2" />
          Get Support
        </button>
      </div>

      {/* Validity Info */}
      <div className="px-4 py-2">
        <p className="text-xs text-gray-500 text-center">
          Valid Until DD/MM/YYYY
        </p>
      </div>
    </div>
  )
}

export default Sidebar
