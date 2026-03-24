'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'
import ChatbotWidget from '@/components/ChatbotWidget'
import { theme } from '@/lib/theme'

export default function ManagerDashboard() {
  const router = useRouter()
  const supabase = createClient()
  const [user, setUser] = useState<any>(null)
  const [userProfile, setUserProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [aiInsights, setAiInsights] = useState<any>(null)

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user: currentUser } } = await supabase.auth.getUser()
      
      if (!currentUser) {
        router.push('/login')
        return
      }
      
      setUser(currentUser)
      
      const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('id', currentUser.id)
        .single()
      
      if (profile?.role !== 'manager' && profile?.role !== 'admin_officer') {
        router.push('/dashboard/student')
        return
      }
      
      setUserProfile(profile)
      setLoading(false)

      // Fetch AI insights
      try {
        const response = await fetch('/api/ai/analytics', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ period: '30' })
        })
        
        if (response.ok) {
          const data = await response.json()
          setAiInsights(data)
        }
      } catch (error) {
        console.error('AI insights error:', error)
      }
    }
    
    fetchData()
  }, [supabase, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: theme.colors.primary }}>
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  const role = userProfile?.role || 'manager'

  return (
    <div className="flex min-h-screen bg-[#f5f6f8]">
      {/* Sidebar - Đảm bảo component Sidebar của bạn có width cố định là 64 (16rem) */}
      <Sidebar user={user} userProfile={userProfile} role={role} />
      
      {/* FIX 1: Thêm ml-64 để đẩy toàn bộ content sang phải, tránh bị Sidebar đè.
          FIX 2: Thêm flex-1 để chiếm trọn chiều rộng còn lại.
      */}
      <main className="flex-1 ml-64 min-h-screen flex flex-col overflow-x-hidden">
        <Header title="Manager Dashboard" subtitle="Analytics & Oversight" user={user} userProfile={userProfile} />
        
        {/* FIX 3: p-10 (padding) để nội dung không sát mép.
            FIX 4: Thêm pt-12 (padding top) để tạo khoảng cách an toàn với Header.
        */}
        <div className="flex-1 p-10 pt-12 max-w-7xl mx-auto w-full">
          
          {/* Dashboard Header - Tăng mb-12 để thoáng hơn */}
          <div className="text-center mb-16">
            <nav className="flex items-center justify-center gap-2 text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-4">
              <span>Admin</span>
              <span className="text-lg">›</span>
              <span className="text-[#FEB21A]">Insights</span>
            </nav>
            <h1 className="text-4xl font-headline font-black text-[#020035] tracking-tight">Service Performance Insights</h1>
            <p className="text-gray-500 text-sm mt-2 font-medium">Real-time operational metrics for UniLink Curator</p>
            <div className="mt-8 flex justify-center gap-4">
              <button className="flex items-center gap-2 bg-white text-[#020035] px-6 py-2.5 rounded-xl font-bold text-sm shadow-sm border border-gray-200 hover:shadow-md transition-all">
                <span className="material-symbols-outlined text-xl">filter_list</span>
                Filter View
              </button>
              <button className="flex items-center gap-2 bg-[#FEB21A] text-[#020035] px-6 py-2.5 rounded-xl font-black text-sm shadow-xl shadow-[#FEB21A]/25 hover:-translate-y-0.5 transition-all">
                <span className="material-symbols-outlined text-xl">analytics</span>
                Generate Audit
              </button>
            </div>
          </div>

          {/* KPI Grid - Giữ nguyên logic UI của bạn, tăng gap-8 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-[#020035]/5 rounded-xl flex items-center justify-center text-[#020035]">
                  <span className="material-symbols-outlined text-2xl">calendar_today</span>
                </div>
                <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">+12%</span>
              </div>
              <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1">Total Appointments</p>
              <h4 className="text-3xl font-extrabold text-[#020035]">1,284</h4>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-[#020035]/5 rounded-xl flex items-center justify-center text-[#020035]">
                  <span className="material-symbols-outlined text-2xl">percent</span>
                </div>
                <span className="text-[11px] font-bold text-[#020035] bg-[#FEB21A]/10 px-2 py-1 rounded-full border border-[#FEB21A]/20">Target Met</span>
              </div>
              <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1">Staff Utilization</p>
              <h4 className="text-3xl font-extrabold text-[#020035]">87.4%</h4>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-[#020035]/5 rounded-xl flex items-center justify-center text-[#020035]">
                  <span className="material-symbols-outlined text-2xl">stars</span>
                </div>
                <span className="text-[11px] font-bold text-white bg-[#020035] px-2 py-1 rounded-full">Top Performer</span>
              </div>
              <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1">Top Busy SSO</p>
              <h4 className="text-xl font-bold text-[#020035] truncate">Dr. Arts Thorne</h4>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-[#020035]/5 rounded-xl flex items-center justify-center text-[#020035]">
                  <span className="material-symbols-outlined text-2xl">warning</span>
                </div>
                <span className="text-[11px] font-bold text-rose-600 bg-rose-50 px-2 py-1 rounded-full">-2.1%</span>
              </div>
              <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1">No-Show Rate</p>
              <h4 className="text-3xl font-extrabold text-[#020035]">4.2%</h4>
            </div>
          </div>

          {/* AI Insights Card */}
          {aiInsights && (
            <div className="bg-gradient-to-br from-[#FEB21A]/20 to-[#FEB21A]/5 border-2 border-[#FEB21A] p-8 rounded-2xl shadow-sm mb-16">
              <div className="flex gap-6 items-start">
                <div className="text-5xl">🤖</div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-[#020035] mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#FEB21A] rounded-full"></span>
                    AI-Generated Insights
                  </h3>
                  <p className="text-[#47464F] leading-relaxed mb-6 text-base">{aiInsights.summary}</p>
                  
                  {/* Trends */}
                  {aiInsights.trends && aiInsights.trends.length > 0 && (
                    <div className="mb-6 p-4 bg-white/50 rounded-xl">
                      <p className="text-xs font-bold text-[#47464F] uppercase tracking-wider mb-3">Key Trends</p>
                      <div className="space-y-2">
                        {aiInsights.trends.map((trend: string, idx: number) => (
                          <div key={idx} className="flex items-center gap-2 text-sm text-[#020035]">
                            <span className="text-lg">📈</span>
                            {trend}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Key Metrics */}
                  {aiInsights.metrics && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {aiInsights.metrics.total_enquiries !== undefined && (
                        <div className="bg-white px-3 py-2 rounded-lg">
                          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Total Enquiries</p>
                          <p className="text-xl font-bold text-[#020035]">{aiInsights.metrics.total_enquiries}</p>
                        </div>
                      )}
                      {aiInsights.metrics.resolved_rate_percent !== undefined && (
                        <div className="bg-white px-3 py-2 rounded-lg">
                          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Resolved Rate</p>
                          <p className="text-xl font-bold text-green-600">{aiInsights.metrics.resolved_rate_percent.toFixed(1)}%</p>
                        </div>
                      )}
                      {aiInsights.metrics.average_rating !== 'N/A' && (
                        <div className="bg-white px-3 py-2 rounded-lg">
                          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Avg Rating</p>
                          <p className="text-xl font-bold text-[#FEB21A]">{aiInsights.metrics.average_rating}/5</p>
                        </div>
                      )}
                      {aiInsights.metrics.rated_enquiries !== undefined && (
                        <div className="bg-white px-3 py-2 rounded-lg">
                          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Rated Responses</p>
                          <p className="text-xl font-bold text-[#020035]">{aiInsights.metrics.rated_enquiries}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Charts Grid - Tăng gap-8 và mb-16 */}
          <div className="grid grid-cols-12 gap-8 mb-16">
            <div className="col-span-12 lg:col-span-7 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-10">
                <div>
                  <h5 className="text-lg font-bold text-[#020035]">Appointments per Department</h5>
                  <p className="text-xs text-gray-500 mt-1">Monthly distribution across faculties</p>
                </div>
                <button className="text-gray-400 hover:text-[#020035] transition-all">
                  <span className="material-symbols-outlined">more_vert</span>
                </button>
              </div>
              <div className="flex items-end justify-between h-64 gap-6 px-2">
                {[
                  { name: 'STEM', height: 85, color: '#020035' },
                  { name: 'ARTS', height: 65, color: '#020035' },
                  { name: 'LAW', height: 45, color: '#FEB21A' },
                  { name: 'MED', height: 55, color: '#020035' },
                  { name: 'ECON', height: 40, color: '#020035' }
                ].map((item, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center">
                    <div className="w-full bg-gray-50 rounded-t-xl h-48 flex flex-col justify-end overflow-hidden">
                      <div className="rounded-t-xl transition-all duration-500" style={{ height: `${item.height}%`, backgroundColor: item.color }}></div>
                    </div>
                    <span className="mt-4 text-[10px] font-bold text-gray-500 uppercase tracking-wide">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="col-span-12 lg:col-span-5 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <h5 className="text-lg font-bold text-[#020035] mb-2">Slot Distribution</h5>
              <p className="text-xs text-gray-500 mb-8">Confirmed vs. Cancelled capacity</p>
              <div className="flex flex-col items-center">
                <div className="relative w-48 h-48">
                  <svg className="w-full h-full -rotate-90">
                    <circle cx="96" cy="96" r="80" fill="transparent" stroke="#f1f5f9" strokeWidth="20" />
                    <circle cx="96" cy="96" r="80" fill="transparent" stroke="#FEB21A" strokeWidth="20" strokeDasharray="502" strokeDashoffset="140" strokeLinecap="round" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-bold text-[#020035]">72%</span>
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">Confirmed</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-8 w-full">
                  <div className="bg-gray-50 p-4 rounded-xl text-center border border-gray-100">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#FEB21A]"></div>
                      <span className="text-[9px] font-bold text-gray-500 uppercase">Confirmed</span>
                    </div>
                    <span className="text-xl font-bold text-[#020035]">924</span>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl text-center border border-gray-100">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <div className="w-2.5 h-2.5 rounded-full bg-gray-300"></div>
                      <span className="text-[9px] font-bold text-gray-500 uppercase">Cancelled</span>
                    </div>
                    <span className="text-xl font-bold text-[#020035]">360</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tables Section - Tăng khoảng cách mb-16 */}
          <div className="space-y-8 mb-16">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h3 className="text-lg font-bold text-[#020035]">Top Performing Staff</h3>
                <button className="text-[10px] font-bold text-[#020035] hover:underline uppercase tracking-wider">Full Rankings</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50/80 text-[10px] font-bold text-gray-500 uppercase">
                    <tr><th className="px-8 py-4">Staff</th><th className="px-8 py-4">Resolution</th><th className="px-8 py-4">Tickets</th><th className="px-8 py-4 text-right">CSAT</th></tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-sm">
                    {/* Hàng dữ liệu giữ nguyên style của bạn */}
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-8 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-[#020035] text-white flex items-center justify-center text-xs font-bold">EW</div>
                          <div><p className="font-bold text-[#020035]">Elena Wells</p><p className="text-[10px] text-gray-400">Academic Affairs</p></div>
                        </div>
                      </td>
                      <td className="px-8 py-4 font-medium">4.2 hrs</td>
                      <td className="px-8 py-4 font-medium">1,142</td>
                      <td className="px-8 py-4 text-right"><span className="px-2.5 py-1 bg-green-100 text-green-700 text-[10px] font-bold rounded-lg">4.9/5</span></td>
                    </tr>
                    {/* Thêm các hàng khác tương tự... */}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex flex-wrap justify-between items-center gap-4 bg-gray-50/50">
                <h3 className="text-lg font-bold text-[#020035]">Recent Escalated Enquiries</h3>
                <div className="flex gap-3">
                  <button className="bg-white border border-gray-200 text-[#020035] px-4 py-2 rounded-xl text-xs font-bold hover:bg-gray-50 transition-all">Generate Report</button>
                  <button className="bg-[#020035] text-white px-4 py-2 rounded-xl text-xs font-bold hover:opacity-90 transition-all">Process All</button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50/80 text-[10px] font-bold text-gray-500 uppercase">
                    <tr><th className="px-8 py-4">ID</th><th className="px-8 py-4">Student</th><th className="px-8 py-4">Category</th><th className="px-8 py-4">Description</th><th className="px-8 py-4">Elapsed</th><th className="px-8 py-4 text-right">Action</th></tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-8 py-5 font-mono text-xs font-bold text-[#020035]">#ENQ-8821</td>
                      <td className="px-8 py-5"><div><p className="font-bold text-[#020035]">Sarah Mitchell</p><p className="text-[10px] text-gray-400">s.mitchell@uni.edu</p></div></td>
                      <td className="px-8 py-5"><span className="px-2 py-1 bg-blue-50 text-blue-600 text-[9px] font-bold rounded-lg">Financial</span></td>
                      <td className="px-8 py-5 text-sm text-gray-600">Scholarship Disbursement Delay</td>
                      <td className="px-8 py-5"><span className="text-red-500 text-xs font-bold">5 Days</span></td>
                      <td className="px-8 py-5 text-right"><button className="px-4 py-2 border border-[#020035] text-[#020035] text-[10px] font-bold rounded-xl hover:bg-[#020035] hover:text-white transition-all">Review</button></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <footer className="mt-16 py-8 border-t border-gray-200 text-center text-[11px] text-gray-400">
            <p>© 2026 ABC University Curator. All rights reserved. Data shown is anonymized and complies with privacy policy.</p>
          </footer>
        </div>
      </main>

      {/* Floating Action */}
      <ChatbotWidget />
    </div>
  )
}