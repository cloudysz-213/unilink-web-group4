'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function AdminDashboard() {
  const [statusFilter, setStatusFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')

  const enquiries = [
    {
      id: 'ENQ-8821',
      student: 'Nguyễn Văn A',
      studentId: '23070983',
      title: 'Đăng ký môn học muộn',
      category: 'Academic',
      priority: 'Urgent',
      status: 'Open',
      assigned: 'Unassigned',
      received: '20/05/2024 14:00',
    },
    {
      id: 'ENQ-8822',
      student: 'Lê Thị B',
      studentId: '23071024',
      title: 'Refund học phí kỳ hè',
      category: 'Financial',
      priority: 'Medium',
      status: 'Assigned',
      assigned: 'Emily Chen',
      received: '20/05/2024 14:35',
    },
  ]

  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 w-64 bg-primary text-white flex flex-col z-40 lg:translate-x-0">
        <div className="px-6 py-8 flex items-center gap-3">
          <div className="h-10 w-10 bg-[#FEB21A] rounded flex items-center justify-center">
            🎓
          </div>
          <div>
            <h2 className="text-lg font-black leading-none">Admin Portal</h2>
            <p className="text-[10px] text-white/60 mt-1 uppercase tracking-wider font-bold">Staff Dashboard</p>
          </div>
        </div>
        <nav className="flex-1 px-2 space-y-1">
          <div className="bg-[#FEB21A] text-primary rounded-r-lg flex items-center gap-3 px-4 py-3 cursor-pointer transition-all font-semibold">
            📋 Queue
          </div>
          <div className="text-white/70 hover:text-white hover:bg-white/5 rounded-r-lg flex items-center gap-3 px-4 py-3 cursor-pointer transition-all">
            📊 Analytics
          </div>
          <div className="text-white/70 hover:text-white hover:bg-white/5 rounded-r-lg flex items-center gap-3 px-4 py-3 cursor-pointer transition-all">
            👥 Team
          </div>
          <div className="text-white/70 hover:text-white hover:bg-white/5 rounded-r-lg flex items-center gap-3 px-4 py-3 cursor-pointer transition-all">
            ⚙️ Settings
          </div>
        </nav>
        <div className="mt-auto p-4 border-t border-white/10 space-y-1">
          <div className="text-white/70 hover:text-white hover:bg-white/5 rounded-lg flex items-center gap-3 px-4 py-3 cursor-pointer transition-all">
            💬 Support
          </div>
          <Link href="/login" className="text-red-400 hover:text-red-300 hover:bg-white/5 rounded-lg flex items-center gap-3 px-4 py-3 transition-all">
            🚪 Logout
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 flex-1">
        {/* Header */}
        <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 p-6 lg:p-12 border-b border-gray-100">
          <div>
            <nav className="flex items-center gap-2 text-[10px] text-on-surface-variant font-bold mb-3 uppercase tracking-widest">
              <span>UniLink</span>
              <span>›</span>
              <span>Admin</span>
              <span>›</span>
              <span className="text-[#FEB21A]">Enquiry Queue</span>
            </nav>
            <div className="flex items-center gap-4 flex-wrap">
              <h1 className="font-headline text-4xl font-extrabold text-primary tracking-tight">
                Incoming Enquiries Queue
              </h1>
              <div className="flex items-center gap-1.5 px-3 py-1 bg-primary/5 rounded-full border border-primary/10">
                <span>🤖</span>
                <span className="text-[10px] font-bold text-primary uppercase">AI auto-prioritization enabled</span>
              </div>
            </div>
          </div>
          <button className="bg-[#FEB21A] text-primary px-6 py-3 rounded-lg font-bold flex items-center gap-2 hover:brightness-105 active:scale-95 shadow-md">
            ➕ Log Manual Enquiry
          </button>
        </header>

        <div className="p-6 lg:p-12">
          {/* Filter Bar */}
          <div className="bg-surface-container-lowest p-4 rounded-xl flex flex-wrap items-center gap-4 shadow-sm border border-gray-100 mb-8">
            <div className="flex-1 min-w-[280px] relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/60">🔍</span>
              <input className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-none rounded-lg text-sm focus:ring-2 focus:ring-[#FEB21A] outline-none" placeholder="Search by student name or ID..." type="text"/>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <select className="bg-gray-50 border-none text-sm rounded-lg py-2.5 px-4 focus:ring-2 focus:ring-[#FEB21A] outline-none" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="all">Status: All</option>
                <option value="open">Open</option>
                <option value="assigned">Assigned</option>
                <option value="pending">Pending</option>
                <option value="resolved">Resolved</option>
              </select>
              <select className="bg-gray-50 border-none text-sm rounded-lg py-2.5 px-4 focus:ring-2 focus:ring-[#FEB21A] outline-none" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
                <option value="all">Category: All</option>
                <option value="academic">Academic</option>
                <option value="visa">Visa</option>
                <option value="financial">Financial</option>
                <option value="welfare">Welfare</option>
                <option value="career">Career</option>
              </select>
              <button className="p-2.5 bg-gray-50 hover:bg-gray-100 text-on-surface rounded-lg transition-colors border border-gray-200">
                ⊙
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden border border-gray-100">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-on-surface-variant text-[11px] font-bold uppercase tracking-widest border-b border-gray-100">
                    <th className="px-6 py-4">ID</th>
                    <th className="px-6 py-4">Student</th>
                    <th className="px-6 py-4">Title & Category</th>
                    <th className="px-6 py-4">Priority</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Assigned To</th>
                    <th className="px-6 py-4">Received</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {enquiries.map((enquiry) => (
                    <tr key={enquiry.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-5 font-mono font-bold text-primary">{enquiry.id}</td>
                      <td className="px-6 py-5">
                        <div className="flex flex-col">
                          <span className="font-bold text-on-surface">{enquiry.student}</span>
                          <span className="text-[11px] text-on-surface-variant font-mono">{enquiry.studentId}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-col">
                          <span className="font-medium text-on-surface mb-1">{enquiry.title}</span>
                          <span className="text-[10px] text-primary/60 font-black uppercase">{enquiry.category}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase flex items-center w-fit gap-1 ${
                          enquiry.priority === 'Urgent'
                            ? 'bg-red-500 text-white'
                            : 'bg-[#F59E0B] text-white'
                        }`}>
                          ⚡ {enquiry.priority}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                          enquiry.status === 'Open'
                            ? 'bg-primary/5 text-primary border border-primary/20'
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                          {enquiry.status}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <span className="text-xs font-medium text-on-surface-variant">
                          {enquiry.assigned === 'Unassigned' ? (
                            <span className="italic">{enquiry.assigned}</span>
                          ) : (
                            enquiry.assigned
                          )}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-[11px] text-on-surface-variant leading-relaxed">
                        {enquiry.received}
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="flex justify-end gap-2">
                          <button className="px-3 py-1.5 bg-[#FEB21A] text-primary text-[10px] font-black uppercase rounded hover:brightness-110 active:scale-95 transition-all">
                            Triage
                          </button>
                          <button className="p-1.5 hover:bg-primary-container hover:text-white rounded transition-colors text-on-surface-variant">
                            ⋮
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <Card className="p-6">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Total Enquiries</h3>
            <p className="text-3xl font-bold text-gray-900">0</p>
          </Card>
          <Card className="p-6">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Open Queue</h3>
            <p className="text-3xl font-bold text-gray-900">0</p>
          </Card>
          <Card className="p-6">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Avg. Resolution Time</h3>
            <p className="text-3xl font-bold text-gray-900">--</p>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Admin Actions</h2>
            <div className="flex gap-4 flex-wrap">
              <Button className="bg-indigo-600 hover:bg-indigo-700">
                View All Enquiries
              </Button>
              <Button variant="outline">Log Manual Enquiry</Button>
              <Button variant="outline">Manage Staff</Button>
            </div>
          </Card>
        </div>
      </div>
    </main>
  )
}
