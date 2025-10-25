'use client'

import { useEffect, useState } from 'react'
import { Sun, Moon } from 'lucide-react'

const AppearanceToggle = () => {
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false
    const stored = localStorage.getItem('appearance')
    if (stored) return stored === 'dark'
    return document.documentElement.classList.contains('dark')
  })

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('appearance', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('appearance', 'light')
    }
  }, [isDark])

  return (
    <button
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      onClick={() => setIsDark(!isDark)}
      className={`fixed right-6 top-6 z-50 flex items-center p-2 rounded-full shadow-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 ${
        isDark ? 'bg-primary-600 text-white' : 'bg-white text-gray-700 dark:bg-gray-800 dark:text-white'
      }`}
    >
      {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </button>
  )
}

export default AppearanceToggle
