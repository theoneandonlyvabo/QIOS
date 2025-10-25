'use client'

import Dashboard from '@/components/Dashboard'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import { useState } from 'react'

export default function Home() {
  const [activeView, setActiveView] = useState('overview')

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar onNavigate={setActiveView} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-x-hidden overflow-y-auto">
          <Header title={activeView.charAt(0).toUpperCase() + activeView.slice(1)} />
          <main className="p-6">
            <Dashboard activeView={activeView} />
          </main>
        </div>
      </div>
    </div>
  )
}
