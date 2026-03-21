'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function ManagerDashboard() {
  return (
    <div className="flex min-h-screen bg-surface">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 w-64 bg-primary text-white z-40 flex flex-col hidden md:flex">
        <div className="px-8 py-10">
          <div className="text-xl font-black tracking-tighter">UniLink</div>
        </div>
        <div className="px-6 mb-8">
          <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10">
            <div className="h-10 w-10 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
              👨‍💼
            </div>
            <div className="overflow-hidden">
              <div className="text-white font-bold text-sm truncate">Dr. Julian Vance</div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider truncate">Head of Analytics</div>
            </div>
          </div>
        </div>
        <nav className="flex-1 px-4 space-y-1">
          <Link href="#" className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:text-white hover:bg-white/5 transition-all rounded-lg text-sm font-medium">
            📊 Dashboard
          </Link>
          <Link href="#" className="flex items-center gap-3 px-4 py-3 bg-white/5 border border-l-4 border-l-[#FEB21A] text-[#FEB21A] rounded-lg text-sm font-medium">
            📈 Analytics
          </Link>
          <Link href="#" className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:text-white hover:bg-white/5 transition-all rounded-lg text-sm font-medium">
            📄 Reports
          </Link>
          <Link href="#" className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:text-white hover:bg-white/5 transition-all rounded-lg text-sm font-medium">
            💬 Enquiries
          </Link>
          <div className="pt-8 pb-2 px-4 text-[10px] font-bold uppercase tracking-widest text-white/40">Management</div>
          <Link href="#" className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:text-white hover:bg-white/5 transition-all rounded-lg text-sm font-medium">
            ⚙️ Settings
          </Link>
          <Link href="#" className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:text-white hover:bg-white/5 transition-all rounded-lg text-sm font-medium">
            ❓ Support
          </Link>
        </nav>
        <div className="p-6 border-t border-white/10">
          <Link href="/login" className="flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 transition-all text-sm font-medium rounded-lg">
            🚪 Logout
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="md:ml-64 flex-1">
        {/* Top Bar */}
        <header className="h-16 bg-white border-b border-gray-200 flex justify-between items-center px-6 md:px-8 sticky top-0 z-40">
          <div className="relative w-96 hidden md:block">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
            <input className="w-full bg-slate-50 border border-slate-200 text-sm rounded-lg pl-10 pr-4 py-2 focus:ring-1 focus:ring-[#FEB21A] focus:border-[#FEB21A] outline-none" placeholder="Search analytics..."/>
          </div>
          <div className="flex items-center gap-6">
            <button className="relative text-slate-400 hover:text-primary transition-colors">
              🔔
            </button>
            <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-primary">Dr. Julian Vance</p>
                <p className="text-[10px] text-slate-500 font-medium">Head of Analytics</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden border border-slate-300">
                👨‍💼
              </div>
            </div>
          </div>
        </header>

        <main className="p-6 md:p-10 max-w-7xl mx-auto w-full">
          {/* Dashboard Header */}
          <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <nav className="flex text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 gap-2">
                <a href="#" className="hover:text-primary">Admin</a>
                <span>/</span>
                <a href="#" className="text-primary">Insights</a>
              </nav>
              <h1 className="text-3xl font-extrabold tracking-tight text-primary">Service Performance Insights</h1>
              <p className="text-on-surface-variant text-sm mt-1">Real-time operational metrics for UniLink Curator</p>
            </div>
            <button className="bg-[#FEB21A] text-on-secondary px-6 py-3 rounded font-extrabold text-sm flex items-center gap-2 shadow-lg shadow-[#FEB21A]/20 hover:scale-[1.02] transition-transform">
              📥 Export Monthly Report
            </button>
          </header>

          {/* KPI Grid */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-100">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-slate-50 rounded-lg text-primary">💬</div>
                <span className="text-green-600 text-xs font-bold bg-green-50 px-2 py-1 rounded">+5.2%</span>
              </div>
              <h3 className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">Total Enquiries</h3>
              <p className="text-2xl font-extrabold text-primary">12,450</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-100">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-slate-50 rounded-lg text-primary">⏱️</div>
                <span className="text-primary text-[10px] font-bold bg-slate-100 px-2 py-1 rounded">Target 24h</span>
              </div>
              <h3 className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">Avg. Resolution</h3>
              <p className="text-2xl font-extrabold text-primary">18.5 hrs</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-100">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-slate-50 rounded-lg text-primary">⚠️</div>
                <span className="text-green-600 text-xs font-bold bg-green-50 px-2 py-1 rounded">Normal</span>
              </div>
              <h3 className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">Escalation Rate</h3>
              <p className="text-2xl font-extrabold text-primary">3.2%</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-100">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-slate-50 rounded-lg text-primary">⭐</div>
                <div className="flex text-[#FEB21A]">★★★★☆</div>
              </div>
              <h3 className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">CSAT Score</h3>
              <p className="text-2xl font-extrabold text-primary">4.8/5.0</p>
            </div>
          </section>

          {/* Charts Grid */}
          <section className="grid grid-cols-12 gap-6 mb-10">
            {/* Monthly Trends Chart */}
            <div className="col-span-12 lg:col-span-8 bg-white p-8 rounded-lg shadow-sm border border-slate-100">
              <div className="flex justify-between items-center mb-10">
                <h3 className="text-lg font-bold text-primary">Monthly Performance Trends</h3>
                <div className="flex gap-6 text-[10px] font-bold uppercase tracking-wider">
                  <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-sm bg-[#FEB21A]"></span> Submitted</div>
                  <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-sm bg-green-600"></span> Resolved</div>
                </div>
              </div>
              <div className="h-64 flex items-end justify-between gap-4 px-2 relative">
                {/* Grid Background */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-8 pt-4 opacity-10">
                  <div className="w-full h-px bg-primary"></div>
                  <div className="w-full h-px bg-primary"></div>
                  <div className="w-full h-px bg-primary"></div>
                </div>
                {/* Bars */}
                {[60, 75, 85, 92, 78, 88].map((height, i) => (
                  <div key={i} className="flex-1 flex items-end gap-1.5 h-full relative z-10">
                    <div className="flex-1 bg-[#FEB21A] rounded-t-sm" style={{ height: `${height}%` }}></div>
                    <div className="flex-1 bg-green-600 rounded-t-sm" style={{ height: `${height * 0.8}%` }}></div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-6 text-[10px] font-bold text-slate-400 px-2 uppercase tracking-widest">
                <span>JAN</span><span>FEB</span><span>MAR</span><span>APR</span><span>MAY</span><span>JUN</span>
              </div>
            </div>

            {/* Status Distribution Pie */}
            <div className="col-span-12 lg:col-span-4 bg-white p-8 rounded-lg shadow-sm border border-slate-100 flex flex-col">
              <h3 className="text-lg font-bold text-primary mb-8">Status Distribution</h3>
              <div className="flex-1 flex flex-col items-center justify-center">
                <div className="w-40 h-40 relative mb-8 flex items-center justify-center">
                  <div className="text-center">
                    <span className="text-3xl font-extrabold text-primary block">12.4k</span>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Total</span>
                  </div>
                </div>
                <div className="w-full space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="w-2.5 h-2.5 rounded-full bg-green-600"></span>
                      <span className="text-xs font-semibold text-slate-600">Resolved</span>
                    </div>
                    <span className="text-xs font-bold text-primary">65%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#FEB21A]"></span>
                      <span className="text-xs font-semibold text-slate-600">Assigned</span>
                    </div>
                    <span className="text-xs font-bold text-primary">20%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-600"></span>
                      <span className="text-xs font-semibold text-slate-600">Escalated</span>
                    </div>
                    <span className="text-xs font-bold text-primary">15%</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Categories */}
          <div className="bg-white p-8 rounded-lg shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-primary mb-8">Enquiries by Category</h3>
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-[11px] font-bold uppercase text-slate-500">
                  <span>Academic</span>
                  <span>45%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full">
                  <div className="h-full bg-primary rounded-full" style={{ width: '45%' }}></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-[11px] font-bold uppercase text-slate-500">
                  <span>Financial</span>
                  <span>25%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full">
                  <div className="h-full bg-[#FEB21A] rounded-full" style={{ width: '25%' }}></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-[11px] font-bold uppercase text-slate-500">
                  <span>Visa & Migration</span>
                  <span>18%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full">
                  <div className="h-full bg-blue-600 rounded-full" style={{ width: '18%' }}></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-[11px] font-bold uppercase text-slate-500">
                  <span>Welfare</span>
                  <span>12%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full">
                  <div className="h-full bg-purple-600 rounded-full" style={{ width: '12%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </main>
    </div>
  )
}
  }, [supabase, router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    toast.success('Logged out successfully')
    router.push('/')
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">U</span>
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
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Manager Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <Card className="p-6">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Escalated Enquiries</h3>
            <p className="text-3xl font-bold text-gray-900">0</p>
          </Card>
          <Card className="p-6">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Avg. Resolution Rate</h3>
            <p className="text-3xl font-bold text-gray-900">--</p>
          </Card>
          <Card className="p-6">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Pending Reviews</h3>
            <p className="text-3xl font-bold text-gray-900">0</p>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Manager Actions</h2>
            <div className="flex gap-4 flex-wrap">
              <Button className="bg-indigo-600 hover:bg-indigo-700">
                View Analytics
              </Button>
              <Button variant="outline">Escalated Queue</Button>
              <Button variant="outline">Generate Reports</Button>
            </div>
          </Card>
        </div>
      </div>
    </main>
  )
}
