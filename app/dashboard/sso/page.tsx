'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function SSODashboard() {
  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 w-64 bg-[#020035] text-white flex flex-col z-40 hidden md:flex">
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
          <Link href="#" className="text-white/70 hover:text-white hover:bg-white/5 rounded-r-lg flex items-center gap-3 px-4 py-3 cursor-pointer transition-all">
            📊 Dashboard
          </Link>
          <Link href="#" className="bg-[#FEB21A] text-primary rounded-r-lg flex items-center gap-3 px-4 py-3 cursor-pointer transition-all font-semibold">
            📋 Assigned Enquiries
          </Link>
          <Link href="#" className="text-white/70 hover:text-white hover:bg-white/5 rounded-r-lg flex items-center gap-3 px-4 py-3 cursor-pointer transition-all">
            📅 Appointments
          </Link>
          <Link href="#" className="text-white/70 hover:text-white hover:bg-white/5 rounded-r-lg flex items-center gap-3 px-4 py-3 cursor-pointer transition-all">
            👤 Profile
          </Link>
        </nav>
        <div className="mt-auto p-4 border-t border-white/10 space-y-1">
          <Link href="#" className="text-white/70 hover:text-white hover:bg-white/5 rounded-lg flex items-center gap-3 px-4 py-3 transition-all">
            ⚙️ Settings
          </Link>
          <Link href="/login" className="text-red-400 hover:text-red-300 hover:bg-white/5 rounded-lg flex items-center gap-3 px-4 py-3 transition-all">
            🚪 Logout
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="md:ml-64 flex-1">
        {/* Top Header */}
        <header className="sticky top-0 z-30 w-full bg-white/60 backdrop-blur-md border-b border-gray-100">
          <div className="flex justify-between items-center px-6 md:px-12 py-4">
            <div className="flex items-center gap-4">
              <span className="md:hidden cursor-pointer">☰</span>
              <h2 className="font-headline text-xl font-extrabold text-[#020035]">Assigned Complex Enquiries</h2>
            </div>
            <div className="flex items-center gap-6">
              <input className="hidden sm:block pl-10 pr-4 py-1.5 bg-gray-50 border border-gray-200 text-sm rounded-lg focus:ring-2 focus:ring-[#FEB21A] outline-none w-64" placeholder="Global search..."/>
              <button className="relative">🔔</button>
            </div>
          </div>
        </header>

        <div className="p-6 md:p-8">
          {/* Stats Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <div className="bg-[#020035] text-white p-6 rounded-xl shadow-lg relative overflow-hidden">
              <p className="text-[#FEB21A] text-xs font-bold uppercase tracking-widest mb-1">My Assigned Open</p>
              <h3 className="text-4xl font-extrabold font-headline mb-3">24</h3>
              <div className="flex items-center gap-1 text-[10px] text-slate-300">
                📈 12% increase from last week
              </div>
            </div>

            <div className="bg-white border border-red-200 border-l-4 p-6 rounded-xl shadow-sm">
              <p className="text-on-surface-variant text-xs font-bold uppercase tracking-widest mb-1">Escalated This Week</p>
              <h3 className="text-4xl font-extrabold font-headline text-red-500 mb-3">7</h3>
              <div className="flex items-center gap-1 text-[10px] text-red-600">
                ⚠️ Needs immediate attention
              </div>
            </div>

            <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm">
              <p className="text-on-surface-variant text-xs font-bold uppercase tracking-widest mb-1">Avg. Resolution Time</p>
              <h3 className="text-4xl font-extrabold font-headline text-[#020035] mb-3">18.5h</h3>
              <div className="flex items-center gap-1 text-[10px] text-green-600">
                ✓ Within SLA target (24h)
              </div>
            </div>

            <div className="bg-red-50 border border-red-200 border-l-4 p-6 rounded-xl shadow-sm">
              <p className="text-on-surface-variant text-xs font-bold uppercase tracking-widest mb-1">Urgent Pending</p>
              <h3 className="text-4xl font-extrabold font-headline text-red-600 mb-3">5</h3>
              <div className="flex items-center gap-1 text-[10px] text-red-600">
                ⏱️ 5 overdue priority items
              </div>
            </div>
          </div>

          {/* Filters Section */}
          <div className="bg-gray-50 p-6 rounded-xl mb-8 flex flex-col md:flex-row gap-4 items-center border border-gray-200">
            <div className="relative flex-1 w-full">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
              <input className="w-full bg-white border border-gray-200 pl-12 pr-4 py-3 rounded-lg text-sm focus:ring-2 focus:ring-[#FEB21A] outline-none transition-all" placeholder="Search by student ID, title..."/>
            </div>
            <div className="flex gap-4 w-full md:w-auto">
              <select className="bg-white border border-gray-200 rounded-lg text-sm py-3 px-4 focus:ring-2 focus:ring-[#FEB21A] outline-none">
                <option>Status</option>
                <option>All</option>
                <option>In Progress</option>
                <option>Escalated</option>
                <option>Resolved</option>
              </select>
              <select className="bg-white border border-gray-200 rounded-lg text-sm py-3 px-4 focus:ring-2 focus:ring-[#FEB21A] outline-none">
                <option>Category</option>
                <option>Academic</option>
                <option>International</option>
                <option>Graduation</option>
                <option>Welfare</option>
                <option>Financial</option>
              </select>
            </div>
          </div>

          {/* Table Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-6 py-4 text-left text-[11px] font-bold uppercase text-on-surface-variant">ID</th>
                    <th className="px-6 py-4 text-left text-[11px] font-bold uppercase text-on-surface-variant">Student</th>
                    <th className="px-6 py-4 text-left text-[11px] font-bold uppercase text-on-surface-variant">Title</th>
                    <th className="px-6 py-4 text-left text-[11px] font-bold uppercase text-on-surface-variant">Category</th>
                    <th className="px-6 py-4 text-left text-[11px] font-bold uppercase text-on-surface-variant">Priority</th>
                    <th className="px-6 py-4 text-left text-[11px] font-bold uppercase text-on-surface-variant">SLA</th>
                    <th className="px-6 py-4 text-left text-[11px] font-bold uppercase text-on-surface-variant">Last Updated</th>
                    <th className="px-6 py-4 text-right text-[11px] font-bold uppercase text-on-surface-variant">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-5 font-semibold text-primary">#ENQ-8821</td>
                    <td className="px-6 py-5">
                      <div>
                        <div className="font-bold text-on-surface">Sarah Mitchell</div>
                        <div className="text-[10px] text-on-surface-variant">ID: 23070983</div>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-sm max-w-[200px] truncate">Scholarship Disbursement Delay</td>
                    <td className="px-6 py-5">
                      <span className="px-2.5 py-1 rounded text-[10px] font-bold border border-[#FEB21A] text-[#6b4800] bg-[#FEB21A]/5 uppercase">Financial</span>
                    </td>
                    <td className="px-6 py-5">
                      <span className="flex items-center gap-1.5 text-red-600 font-bold text-[10px] uppercase">
                        <span className="w-1.5 h-1.5 bg-red-600 rounded-full"></span>
                        Urgent
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-[11px] font-bold text-red-600">Due in 4h</span>
                    </td>
                    <td className="px-6 py-5 text-[11px] text-on-surface-variant">15m ago</td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex justify-end gap-2">
                        <button className="px-3 py-1.5 bg-[#FEB21A] text-[#020035] text-[10px] font-bold rounded uppercase hover:brightness-95 transition-all">Respond</button>
                        <button className="px-3 py-1.5 bg-orange-500 text-white text-[10px] font-bold rounded uppercase hover:bg-orange-600 transition-all">Escalate</button>
                        <button className="p-1.5 bg-green-500 text-white rounded hover:bg-green-600 transition-all">✓</button>
                      </div>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-5 font-semibold text-primary">#ENQ-8845</td>
                    <td className="px-6 py-5">
                      <div>
                        <div className="font-bold text-on-surface">James Aris</div>
                        <div className="text-[10px] text-on-surface-variant">ID: 21094821</div>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-sm max-w-[200px] truncate">Visa Extension for PhD Program</td>
                    <td className="px-6 py-5">
                      <span className="px-2.5 py-1 rounded text-[10px] font-bold border border-primary text-primary bg-primary/5 uppercase">International</span>
                    </td>
                    <td className="px-6 py-5">
                      <span className="flex items-center gap-1.5 text-orange-600 font-bold text-[10px] uppercase">
                        <span className="w-1.5 h-1.5 bg-orange-600 rounded-full"></span>
                        High
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-[11px] font-bold text-on-surface-variant">12h left</span>
                    </td>
                    <td className="px-6 py-5 text-[11px] text-on-surface-variant">1h ago</td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex justify-end gap-2">
                        <button className="px-3 py-1.5 bg-[#FEB21A] text-[#020035] text-[10px] font-bold rounded uppercase hover:brightness-95 transition-all">Respond</button>
                        <button className="px-3 py-1.5 bg-orange-500 text-white text-[10px] font-bold rounded uppercase hover:bg-orange-600 transition-all">Escalate</button>
                        <button className="p-1.5 bg-green-500 text-white rounded hover:bg-green-600 transition-all">✓</button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
            </div>
            <span className="text-xl font-bold text-gray-900">UniLink</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">{user?.email}</span>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">SSO Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <Card className="p-6">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Assigned Enquiries</h3>
            <p className="text-3xl font-bold text-gray-900">0</p>
          </Card>
          <Card className="p-6">
            <h3 className="text-sm font-medium text-gray-600 mb-2">In Progress</h3>
            <p className="text-3xl font-bold text-gray-900">0</p>
          </Card>
          <Card className="p-6">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Resolved Today</h3>
            <p className="text-3xl font-bold text-gray-900">0</p>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">SSO Actions</h2>
            <div className="flex gap-4 flex-wrap">
              <Button className="bg-indigo-600 hover:bg-indigo-700">
                View Assigned Enquiries
              </Button>
              <Button variant="outline">My Responses</Button>
              <Button variant="outline">Escalate Enquiry</Button>
            </div>
          </Card>
        </div>
      </div>
    </main>
  )
}
