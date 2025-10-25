'use client'

import { useState, useEffect } from 'react'

interface CalendarEvent {
  id: string
  title: string
  date: string
  type: 'bill' | 'salary' | 'supplier' | 'project' | 'deadline'
  priority: 'high' | 'medium' | 'low'
  amount?: number
  description?: string
}

const CalendarDashboard = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([])

  useEffect(() => {
    const mockEvents: CalendarEvent[] = [
      {
        id: '1',
        title: 'Tagihan PLN',
        date: '2024-01-17',
        type: 'bill',
        priority: 'high',
        amount: 500000,
        description: 'Tagihan listrik bulanan'
      },
      {
        id: '2',
        title: 'Gaji Karyawan',
        date: '2024-01-20',
        type: 'salary',
        priority: 'high',
        amount: 2000000,
        description: 'Gaji bulanan seluruh karyawan'
      }
    ]
    setEvents(mockEvents)
  }, [])

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'bill': return '⚠️'
      case 'salary': return '👥'
      case 'supplier': return '💰'
      case 'project': return '📈'
      default: return '⏰'
    }
  }

  const getEventColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-200 bg-red-50'
      case 'medium': return 'border-yellow-200 bg-yellow-50'
      case 'low': return 'border-green-200 bg-green-50'
      default: return 'border-gray-200 bg-gray-50'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold">📅</span>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Calendar Dashboard</h2>
          <p className="text-gray-600">Tanggal penting dan deadline bisnis</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Mendatang</h3>
        <div className="space-y-3">
          {events.map((event: CalendarEvent) => (
            <div key={event.id} className={`p-4 border rounded-lg ${getEventColor(event.priority)}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{getEventIcon(event.type)}</span>
                  <div>
                    <h4 className="font-medium text-gray-900">{event.title}</h4>
                    <p className="text-sm text-gray-600">{event.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{formatDate(event.date)}</p>
                  {event.amount && (
                    <p className="text-sm text-gray-600">Rp. {event.amount.toLocaleString()}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default CalendarDashboard