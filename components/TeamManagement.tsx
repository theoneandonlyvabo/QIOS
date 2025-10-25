'use client'

import { useState } from 'react'
import { Users, UserPlus, Shield, Clock, DollarSign, Calendar, Settings, Trash2, Edit } from 'lucide-react'

interface TeamMember {
  id: string
  name: string
  email: string
  role: 'owner' | 'manager' | 'cashier' | 'warehouse' | 'analyst'
  status: 'active' | 'inactive'
  lastActive: string
  salary: number
  schedule: {
    monday: string
    tuesday: string
    wednesday: string
    thursday: string
    friday: string
    saturday: string
    sunday: string
  }
  performance: {
    transactions: number
    sales: number
    rating: number
  }
}

const TeamManagement = () => {
  const [members, setMembers] = useState<TeamMember[]>([
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'manager',
      status: 'active',
      lastActive: '2024-01-15',
      salary: 5000000,
      schedule: {
        monday: '09:00-17:00',
        tuesday: '09:00-17:00',
        wednesday: '09:00-17:00',
        thursday: '09:00-17:00',
        friday: '09:00-17:00',
        saturday: '10:00-16:00',
        sunday: 'off'
      },
      performance: {
        transactions: 150,
        sales: 25000000,
        rating: 4.5
      }
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'cashier',
      status: 'active',
      lastActive: '2024-01-15',
      salary: 3500000,
      schedule: {
        monday: '08:00-16:00',
        tuesday: '08:00-16:00',
        wednesday: '08:00-16:00',
        thursday: '08:00-16:00',
        friday: '08:00-16:00',
        saturday: '09:00-15:00',
        sunday: 'off'
      },
      performance: {
        transactions: 200,
        sales: 18000000,
        rating: 4.2
      }
    }
  ])

  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null)

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner':
        return <Shield className="w-4 h-4 text-red-600" />
      case 'manager':
        return <Users className="w-4 h-4 text-blue-600" />
      case 'cashier':
        return <DollarSign className="w-4 h-4 text-green-600" />
      case 'warehouse':
        return <Settings className="w-4 h-4 text-orange-600" />
      case 'analyst':
        return <Shield className="w-4 h-4 text-purple-600" />
      default:
        return <Users className="w-4 h-4 text-gray-600" />
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'owner':
        return 'bg-red-100 text-red-800'
      case 'manager':
        return 'bg-blue-100 text-blue-800'
      case 'cashier':
        return 'bg-green-100 text-green-800'
      case 'warehouse':
        return 'bg-orange-100 text-orange-800'
      case 'analyst':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    return status === 'active' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-gray-100 text-gray-800'
  }

  const getPerformanceColor = (rating: number) => {
    if (rating >= 4.5) return 'text-green-600'
    if (rating >= 3.5) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Users className="w-8 h-8 text-primary-600" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Team Management</h2>
            <p className="text-gray-600">Kelola tim dan akses pengguna</p>
          </div>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add Member</span>
        </button>
      </div>

      {/* Team Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Users className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">Total Members</span>
          </div>
          <p className="text-2xl font-bold text-blue-900">{members.length}</p>
        </div>
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Clock className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium text-green-800">Active Members</span>
          </div>
          <p className="text-2xl font-bold text-green-900">
            {members.filter(m => m.status === 'active').length}
          </p>
        </div>
        <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <DollarSign className="w-5 h-5 text-purple-600" />
            <span className="text-sm font-medium text-purple-800">Total Salary</span>
          </div>
          <p className="text-2xl font-bold text-purple-900">
            Rp. {members.reduce((sum, m) => sum + m.salary, 0).toLocaleString()}
          </p>
        </div>
        <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Shield className="w-5 h-5 text-orange-600" />
            <span className="text-sm font-medium text-orange-800">Avg Performance</span>
          </div>
          <p className="text-2xl font-bold text-orange-900">
            {(members.reduce((sum, m) => sum + m.performance.rating, 0) / members.length).toFixed(1)}
          </p>
        </div>
      </div>

      {/* Team Members List */}
      <div className="chart-container">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Team Members</h3>
        <div className="space-y-4">
          {members.map((member) => (
            <div key={member.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-gray-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{member.name}</h4>
                    <p className="text-sm text-gray-600">{member.email}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(member.role)}`}>
                        {member.role.toUpperCase()}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(member.status)}`}>
                        {member.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-6">
                  {/* Performance Metrics */}
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Transactions</p>
                    <p className="font-semibold text-gray-900">{member.performance.transactions}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Sales</p>
                    <p className="font-semibold text-gray-900">Rp. {member.performance.sales.toLocaleString()}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Rating</p>
                    <p className={`font-semibold ${getPerformanceColor(member.performance.rating)}`}>
                      {member.performance.rating}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Salary</p>
                    <p className="font-semibold text-gray-900">Rp. {member.salary.toLocaleString()}</p>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setSelectedMember(member)}
                      className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Schedule Management */}
      <div className="chart-container">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Schedule Management</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-900">Member</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Monday</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Tuesday</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Wednesday</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Thursday</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Friday</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Saturday</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Sunday</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member) => (
                <tr key={member.id} className="border-b border-gray-100">
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      {getRoleIcon(member.role)}
                      <span className="font-medium text-gray-900">{member.name}</span>
                    </div>
                  </td>
                  {Object.entries(member.schedule).map(([day, time]) => (
                    <td key={day} className="py-3 px-4">
                      <span className={`text-sm ${time === 'off' ? 'text-gray-400' : 'text-gray-900'}`}>
                        {time}
                      </span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payroll Integration */}
      <div className="chart-container">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Payroll Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Next Payroll</h4>
            <p className="text-sm text-blue-800">Due: 25 January 2024</p>
            <p className="text-lg font-bold text-blue-900">
              Rp. {members.reduce((sum, m) => sum + m.salary, 0).toLocaleString()}
            </p>
          </div>
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <h4 className="font-medium text-green-900 mb-2">Attendance Tracking</h4>
            <p className="text-sm text-green-800">Average attendance: 95%</p>
            <p className="text-sm text-green-800">Late arrivals: 2 this month</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TeamManagement
