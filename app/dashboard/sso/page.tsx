'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'
import ChatbotWidget from '@/components/ChatbotWidget'
import { theme } from '@/lib/theme'

export default function SSODashboard() {
  const router = useRouter()
  const supabase = createClient()
  const [user, setUser] = useState<any>(null)
  const [userProfile, setUserProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)

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
      
      // Kiểm tra role - nếu không phải sso thì redirect
      if (profile?.role !== 'sso' && profile?.role !== 'admin_officer') {
        router.push('/dashboard/student')
        return
      }
      
      setUserProfile(profile)
      setLoading(false)
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

  const role = userProfile?.role || 'sso'

  // Dữ liệu mẫu
  const enquiries = [
    { id: 'ENQ-8821', student: 'Sarah Mitchell', studentId: '23070983', title: 'Scholarship Disbursement Delay', category: 'Financial', priority: 'Urgent', status: 'Assigned', assigned: 'Oct 24, 2024', sla: 'Due in 4h', lastUpdate: '15m ago' },
    { id: 'ENQ-8845', student: 'James Aris', studentId: '21094821', title: 'Visa Extension for PhD Program', category: 'International', priority: 'High', status: 'Assigned', assigned: 'Oct 23, 2024', sla: '12h left', lastUpdate: '1h ago' },
    { id: 'ENQ-8910', student: 'Li Wei', studentId: '24001298', title: 'Mental Health Support Referral', category: 'Welfare', priority: 'Urgent', status: 'Assigned', assigned: 'Oct 24, 2024', sla: 'Due in 2h', lastUpdate: '2h ago' },
    { id: 'ENQ-8952', student: 'Elena Rodriguez', studentId: '22088312', title: 'Incomplete Grade Appeal (BMAN300)', category: 'Academic', priority: 'Medium', status: 'Assigned', assigned: 'Oct 21, 2024', sla: 'SLA Met', lastUpdate: '4h ago' },
    { id: 'ENQ-9011', student: 'Marcus Thorne', studentId: '23114556', title: 'Graduation Gown sizing issue', category: 'Other', priority: 'Low', status: 'Assigned', assigned: 'Oct 25, 2024', sla: '2d left', lastUpdate: '1d ago' },
  ]

  return (
    <div className="min-h-screen bg-[#f9f9f9]">
      <Sidebar user={user} userProfile={userProfile} role={role} />
      
      <main className="ml-64 min-h-screen">
        <Header title="SSO Dashboard" subtitle="Assigned Enquiries" user={user} userProfile={userProfile} />
        
        <div className="pt-28 pb-12 px-8">
          {/* Stats Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {/* My Assigned Open */}
            <div className="bg-[#020035] text-white p-6 rounded-xl shadow-lg relative overflow-hidden group">
              <div className="absolute -right-4 -bottom-4 opacity-10 transition-transform group-hover:scale-110">
                <span className="material-symbols-outlined text-8xl">pending_actions</span>
              </div>
              <p className="text-[#FEB21A] text-xs font-bold uppercase tracking-widest mb-1">My Assigned Open</p>
              <h3 className="text-4xl font-extrabold font-headline">24</h3>
              <div className="mt-4 flex items-center gap-1 text-[10px] text-slate-300">
                <span className="material-symbols-outlined text-xs">trending_up</span>
                <span>12% increase from last week</span>
              </div>
            </div>
            {/* Escalated This Week */}
            <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-[#ba1a1a] relative overflow-hidden">
              <p className="text-[#47464f] text-xs font-bold uppercase tracking-widest mb-1">Escalated This Week</p>
              <h3 className="text-4xl font-extrabold font-headline text-[#ba1a1a]">7</h3>
              <div className="mt-4 flex items-center gap-1 text-[10px] text-[#ba1a1a]">
                <span className="material-symbols-outlined text-xs">warning</span>
                <span>Needs immediate attention</span>
                <span className="ml-2 font-bold">↑ 5% vs last week</span>
              </div>
            </div>
            {/* Avg. Resolution Time */}
            <div className="bg-white p-6 rounded-xl shadow-sm relative overflow-hidden">
              <p className="text-[#47464f] text-xs font-bold uppercase tracking-widest mb-1">Avg. Resolution Time</p>
              <h3 className="text-4xl font-extrabold font-headline text-[#020035]">18.5h</h3>
              <div className="mt-4 flex items-center gap-1 text-[10px] text-green-600">
                <span className="material-symbols-outlined text-xs">check_circle</span>
                <span>Within SLA target (24h)</span>
                <span className="ml-2 font-bold">↓ 10% improvement</span>
              </div>
            </div>
            {/* Urgent Pending */}
            <div className="bg-red-50 p-6 rounded-xl shadow-sm border-l-4 border-red-500 relative overflow-hidden">
              <p className="text-[#47464f] text-xs font-bold uppercase tracking-widest mb-1">Urgent Pending</p>
              <h3 className="text-4xl font-extrabold font-headline text-[#FEB21A]">5</h3>
              <div className="mt-4 flex items-center gap-1 text-[10px] text-[#FEB21A]">
                <span className="material-symbols-outlined text-xs">timer</span>
                <span>5 overdue priority items</span>
                <span className="ml-2 font-bold text-red-600">↑ 2% increase</span>
              </div>
            </div>
          </div>

          {/* Filters Section */}
          <div className="bg-[#f3f3f4] p-6 rounded-xl mb-8 flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#777680]">search</span>
              <input className="w-full bg-white border-none pl-12 pr-4 py-3 rounded-lg text-sm focus:ring-2 focus:ring-[#FEB21A] transition-all outline-none" placeholder="Search by student ID, title..." type="text"/>
            </div>
            <div className="flex gap-4 w-full md:w-auto">
              <select className="bg-white border-none rounded-lg text-sm py-3 px-4 focus:ring-2 focus:ring-[#FEB21A] min-w-[140px] outline-none">
                <option disabled>Status</option>
                <option>All</option>
                <option>In Progress</option>
                <option>Escalated</option>
                <option>Resolved</option>
              </select>
              <select className="bg-white border-none rounded-lg text-sm py-3 px-4 focus:ring-2 focus:ring-[#FEB21A] min-w-[180px] outline-none">
                <option disabled>Category</option>
                <option>Academic</option>
                <option>Visa & International</option>
                <option>Graduation & Career</option>
                <option>Welfare</option>
                <option>Financial</option>
                <option>Other</option>
              </select>
            </div>
          </div>

          {/* Table Section */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#f3f3f4]/50">
                    <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-[#47464f]">ID</th>
                    <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-[#47464f]">Student</th>
                    <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-[#47464f]">Title</th>
                    <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-[#47464f]">Category</th>
                    <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-[#47464f]">Priority</th>
                    <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-[#47464f]">Assigned</th>
                    <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-[#47464f]">SLA</th>
                    <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-[#47464f]">Last Updated</th>
                    <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-[#47464f] text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#eeeeee]">
                  {enquiries.map((enq, idx) => (
                    <tr key={idx} className="hover:bg-[#020035]/5 transition-colors group">
                      <td className="px-6 py-5 text-sm font-semibold text-[#020035]">#{enq.id}</td>
                      <td className="px-6 py-5">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-[#1a1c1c]">{enq.student}</span>
                          <span className="text-[10px] text-[#47464f]">ID: {enq.studentId}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-sm max-w-[200px] truncate">{enq.title}</td>
                      <td className="px-6 py-5">
                        <span className={`px-2.5 py-1 rounded text-[10px] font-bold border uppercase ${
                          enq.category === 'Financial' ? 'border-[#FEB21A] text-[#FEB21A] bg-[#FEB21A]/5' :
                          enq.category === 'International' ? 'border-[#020035] text-[#020035] bg-[#020035]/5' :
                          enq.category === 'Welfare' ? 'border-green-600 text-green-700 bg-green-50' :
                          'border-blue-600 text-blue-700 bg-blue-50'
                        }`}>
                          {enq.category}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <span className={`flex items-center gap-1.5 font-bold text-[10px] uppercase ${
                          enq.priority === 'Urgent' ? 'text-[#ba1a1a]' :
                          enq.priority === 'High' ? 'text-[#FEB21A]' : 'text-[#47464f]'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            enq.priority === 'Urgent' ? 'bg-[#ba1a1a]' :
                            enq.priority === 'High' ? 'bg-[#FEB21A]' : 'bg-[#47464f]'
                          }`}></span>
                          {enq.priority}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-[11px] text-[#47464f]">{enq.assigned}</td>
                      <td className="px-6 py-5">
                        <span className={`text-[11px] font-bold ${
                          enq.sla.includes('Due') ? 'text-[#ba1a1a]' :
                          enq.sla === 'SLA Met' ? 'text-green-600' : 'text-[#47464f]'
                        }`}>
                          {enq.sla}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-[11px] text-[#47464f]">{enq.lastUpdate}</td>
                      <td className="px-6 py-5 text-right">
                        <div className="flex justify-end gap-2">
                          <button className="px-3 py-1.5 bg-[#FEB21A] text-[#020035] text-[10px] font-bold rounded uppercase hover:brightness-95 transition-all">Respond</button>
                          <button className="px-3 py-1.5 bg-orange-500 text-white text-[10px] font-bold rounded uppercase hover:bg-orange-600 transition-all">Escalate</button>
                          <button className="p-1.5 bg-green-500 text-white rounded hover:bg-green-600 transition-all">
                            <span className="material-symbols-outlined text-sm">check</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-4 bg-[#f3f3f4]/20 flex justify-between items-center text-[10px] text-[#47464f]">
              <span>Showing 5 of 24 active enquiries</span>
              <div className="flex items-center gap-2">
                <button className="p-1 rounded bg-white hover:bg-[#e2e2e2] transition-colors">
                  <span className="material-symbols-outlined text-xs">chevron_left</span>
                </button>
                <span className="font-bold">Page 1 of 5</span>
                <button className="p-1 rounded bg-white hover:bg-[#e2e2e2] transition-colors">
                  <span className="material-symbols-outlined text-xs">chevron_right</span>
                </button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <footer className="mt-12 text-center">
            <p className="text-[10px] text-[#47464f] uppercase tracking-widest font-medium opacity-60">
              Data shown is anonymized and complies with ABC University privacy policy.
            </p>
          </footer>
        </div>
      </main>

      {/* Floating Action Button */}
      <ChatbotWidget />
    </div>
  )
}