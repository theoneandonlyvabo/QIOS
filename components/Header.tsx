'use client'

import { useState } from 'react'
import { Calendar, Moon, Sun, User } from 'lucide-react'

const Header = () => {
  const [isDarkMode, setIsDarkMode] = useState(false)

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
    // Add theme toggle logic here
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Page Title */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        </div>

        {/* Right Side Controls */}
        <div className="flex items-center space-x-6">
          {/* Date Range */}
          <div className="flex items-center space-x-2 text-gray-600">
            <Calendar className="w-4 h-4" />
            <span className="text-sm font-medium">28.09.2025 - 05.10.2025</span>
          </div>

          {/* Theme Toggle */}
          <div className="flex items-center space-x-2">
            <Moon className="w-4 h-4 text-gray-400" />
            <button
              onClick={toggleTheme}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                isDarkMode ? 'bg-primary-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                  isDarkMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <Sun className="w-4 h-4 text-gray-400" />
          </div>

          {/* User Profile */}
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">Your Business Name</p>
              <p className="text-xs text-gray-500">Business Owner</p>
            </div>
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-gray-600" />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
