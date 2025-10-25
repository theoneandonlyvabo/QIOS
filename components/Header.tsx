'use client'

import React, { useState, useEffect } from 'react'
import { Calendar, Moon, Sun, User, Settings, Database } from 'lucide-react'

interface HeaderProps {
  title?: string;
}

const Header: React.FC<HeaderProps> = ({ title = 'Dashboard' }) => {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [showCalendar, setShowCalendar] = useState(false)
  const [dateRange, setDateRange] = useState({ start: 'n/a', end: 'n/a' })

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDarkMode])

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
  }

  const toggleProfileMenu = () => {
    setShowProfileMenu(!showProfileMenu)
  }

  const toggleCalendar = () => {
    setShowCalendar(!showCalendar)
  }

  return (
    <div className="sticky top-6 z-50">
      <div className="px-12 py-4 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{title}</h1>
        <div className="flex items-center space-x-6">
          {/* Date Range */}
          <button
            onClick={toggleCalendar}
            className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          >
            <Calendar className="w-6 h-6" />
            <span className="text-sm font-medium">{dateRange.start} - {dateRange.end}</span>
          </button>

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
          <div className="relative">
            <button
              onClick={toggleProfileMenu}
              className="flex items-center space-x-3 hover:opacity-80"
            >
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900 dark:text-white">Your Business Name</p>
              </div>
              <div className="w-8 h-8 bg-gray-300 dark:bg-gray-700 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-gray-600 dark:text-gray-300" />
              </div>
            </button>

            {/* Profile Menu Popup */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2">
                <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Your Business Name</p>
                </div>
                <button className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                  <Settings className="w-4 h-4 inline-block mr-2" />
                  Settings
                </button>
                <button className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                  <Database className="w-4 h-4 inline-block mr-2" />
                  Developer Mode
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Calendar Popup */}
      {showCalendar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Select Date Range</h3>
              <button
                onClick={toggleCalendar}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                ✕
              </button>
            </div>
            {/* Calendar Component would go here */}
            <div className="mt-4 flex justify-end">
              <button
                onClick={toggleCalendar}
                className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Header
