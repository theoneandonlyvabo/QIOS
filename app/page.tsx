'use client'

import Dashboard from '@/components/Dashboard'
import Sidebar from '@/components/Sidebar'
import { useState } from 'react'

export default function Home() {
  const [activeView, setActiveView] = useState('overview')

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar onNavigate={setActiveView} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-x-hidden overflow-y-auto">
          <main className="p-6">
            <Dashboard activeView={activeView} storeId="your-store-id" />
          </main>
        </div>
      </div>
    </div>
  )
}