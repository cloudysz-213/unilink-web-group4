'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'
import ChatbotWidget from '@/components/ChatbotWidget'
import { theme } from '@/lib/theme'

export default function AdminDashboard() {
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
      
      // Kiểm tra role - nếu không phải admin thì redirect
      if (profile?.role !== 'admin_officer' && profile?.role !== 'manager') {
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

  const role = userProfile?.role || 'admin_officer'

  // ========== UI ADMIN TỪ STITCH ==========
  return (
    <div className="min-h-screen bg-[#f9f9f9]">
      {/* Sidebar - DÙNG COMPONENT MỚI */}
      <Sidebar user={user} userProfile={userProfile} role={role} />
      
      {/* Top Header */}
      <header className="fixed top-0 right-0 w-[calc(100%-16rem)] h-16 glass-header border-b border-[#c8c5d0]/20 flex items-center justify-between px-8 z-40 bg-white/60 backdrop-blur-md">
        <div className="flex items-center space-x-4">
          <span className="text-primary font-headline font-extrabold text-lg tracking-tight">Enquiry Queue</span>
        </div>
        <div className="flex items-center space-x-6">
          <div className="relative group">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#47464f] text-lg">search</span>
            <input className="pl-10 pr-4 py-1.5 rounded-full bg-[#f3f3f4] border-none text-xs focus:ring-2 focus:ring-[#FEB21A] w-64 transition-all" placeholder="Quick search..." type="text"/>
          </div>
          <div className="flex items-center space-x-3">
            <button className="p-2 hover:bg-[#f3f3f4] rounded-full transition-colors relative">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-2 right-2 w-2 h-2 bg-[#ba1a1a] rounded-full border border-white"></span>
            </button>
            <button className="p-2 hover:bg-[#f3f3f4] rounded-full transition-colors">
              <span className="material-symbols-outlined">help</span>
            </button>
            <div className="h-8 w-8 rounded-full bg-[#151546] flex items-center justify-center overflow-hidden ml-2 border border-[#c8c5d0]/30">
              <span className="text-white text-sm font-bold">A</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="ml-64 pt-16 min-h-screen">
        <div className="max-w-7xl mx-auto px-10 py-12">
          {/* Page Header */}
          <div className="text-center mb-16">
            <h2 className="font-headline font-extrabold text-4xl text-[#020035] tracking-tight mb-3">Admin Dashboard – Enquiry Queue &amp; Triage</h2>
            <p className="text-[#47464f] max-w-2xl mx-auto font-medium">Manage incoming student enquiries, triage general/complex, and efficiently assign tasks to Student Support Officers (SSO).</p>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="bg-white p-6 rounded-xl shadow-sm border-b-4 border-[#ba1a1a]/20 flex justify-between items-start">
              <div>
                <p className="text-xs font-bold text-[#47464f] uppercase tracking-wider mb-2">Pending Enquiries</p>
                <h3 className="text-3xl font-headline font-extrabold text-[#020035]">28</h3>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-[#ffdad6] text-[#93000a] mt-3">+4 NEW TODAY</span>
              </div>
              <div className="p-3 bg-[#ffdad6]/30 rounded-lg text-[#ba1a1a]">
                <span className="material-symbols-outlined">notification_important</span>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border-b-4 border-emerald-500/20 flex justify-between items-start">
              <div>
                <p className="text-xs font-bold text-[#47464f] uppercase tracking-wider mb-2">General Enquiries</p>
                <h3 className="text-3xl font-headline font-extrabold text-[#020035]">15</h3>
                <div className="mt-3 flex items-center text-emerald-600 text-[10px] font-bold">
                  <span className="material-symbols-outlined text-sm mr-1">check_circle</span> STABLE VOLUME
                </div>
              </div>
              <div className="p-3 bg-emerald-50 rounded-lg text-emerald-600">
                <span className="material-symbols-outlined">chat</span>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border-b-4 border-[#FEB21A]/20 flex justify-between items-start">
              <div>
                <p className="text-xs font-bold text-[#47464f] uppercase tracking-wider mb-2">Complex Enquiries</p>
                <h3 className="text-3xl font-headline font-extrabold text-[#020035]">13</h3>
                <div className="mt-3 flex items-center text-[#7f5600] text-[10px] font-bold">
                  <span className="material-symbols-outlined text-sm mr-1">assignment_ind</span> NEEDS ASSIGNMENT
                </div>
              </div>
              <div className="p-3 bg-[#ffddae]/30 rounded-lg text-[#7f5600]">
                <span className="material-symbols-outlined">assignment_late</span>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border-b-4 border-[#ba1a1a]/40 flex justify-between items-start">
              <div>
                <p className="text-xs font-bold text-[#47464f] uppercase tracking-wider mb-2">Urgent High Priority</p>
                <h3 className="text-3xl font-headline font-extrabold text-[#ba1a1a]">5</h3>
                <div className="mt-3 flex items-center text-[#ba1a1a] text-[10px] font-bold">
                  <span className="material-symbols-outlined text-sm mr-1">warning</span> IMMEDIATE ACTION
                </div>
              </div>
              <div className="p-3 bg-[#ffdad6] text-[#ba1a1a] rounded-lg">
                <span className="material-symbols-outlined">report</span>
              </div>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="bg-[#f3f3f4] p-4 rounded-xl mb-8 flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-[300px] relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#777680]">search</span>
              <input className="w-full bg-white border-none rounded-lg pl-12 pr-4 py-3 focus:ring-2 focus:ring-[#FEB21A] text-sm" placeholder="Search by student ID, title..." type="text"/>
            </div>
            <div className="flex gap-3">
              <select className="bg-white border-none rounded-lg px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-[#FEB21A] cursor-pointer">
                <option>All Categories</option>
                <option>Visa & International</option>
                <option>Enrollment</option>
                <option>Financial Aid</option>
              </select>
              <select className="bg-white border-none rounded-lg px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-[#FEB21A] cursor-pointer">
                <option>All Priorities</option>
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
              <button className="bg-white p-3 rounded-lg hover:bg-[#f9f9f9] transition-colors">
                <span className="material-symbols-outlined text-[#47464f]">calendar_today</span>
              </button>
            </div>
          </div>

          {/* Enquiry Queue Section */}
          <div className="space-y-4 mb-12">
            <div className="flex items-center justify-between px-2 mb-4">
              <h4 className="font-headline font-bold text-xl text-[#020035]">Active Enquiry Queue</h4>
              <span className="text-xs font-bold text-[#47464f] uppercase tracking-widest">Showing 5 of 28 Items</span>
            </div>

            {/* Card 1 */}
            <div className="bg-white p-5 rounded-xl shadow-sm flex items-center gap-6 border border-transparent hover:border-[#c8c5d0]/30 transition-all">
              <div className="flex-shrink-0 w-12 h-12 rounded-full overflow-hidden border-2 border-[#eeeeee] bg-slate-200 flex items-center justify-center">
                <span className="text-xl">👤</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold text-[#7e7fb6] bg-[#151546]/10 px-2 py-0.5 rounded">#ENQ-8821</span>
                  <span className="text-[10px] font-bold text-[#ba1a1a] bg-[#ffdad6] px-2 py-0.5 rounded uppercase tracking-tighter">High Priority</span>
                </div>
                <h5 className="font-bold text-[#020035] truncate mb-0.5">Visa Extension Documents Review</h5>
                <p className="text-xs text-[#47464f]">Student: <span className="font-semibold">Nguyen Van A</span> • Submitted: <span className="text-[#020035] font-medium">Today 14:30</span></p>
              </div>
              <div className="hidden lg:flex flex-col items-center px-6 border-x border-[#c8c5d0]/10">
                <span className="text-[10px] font-bold text-[#47464f] uppercase mb-1">Category</span>
                <span className="px-3 py-1 bg-[#eeeeee] rounded-full text-[11px] font-bold text-[#020035]">Visa & International</span>
              </div>
              <div className="flex items-center gap-3">
                <button className="text-emerald-600 text-xs font-bold px-4 py-2 rounded-lg hover:bg-emerald-50 transition-colors">Resolve Now</button>
                <button className="bg-[#FEB21A] text-[#020035] text-xs font-bold px-4 py-2 rounded-lg hover:shadow-lg transition-all">Assign to SSO</button>
                <button className="p-2 text-[#020035] hover:bg-[#eeeeee] rounded-lg transition-colors">
                  <span className="material-symbols-outlined">visibility</span>
                </button>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white p-5 rounded-xl shadow-sm flex items-center gap-6 border border-transparent hover:border-[#c8c5d0]/30 transition-all">
              <div className="flex-shrink-0 w-12 h-12 rounded-full overflow-hidden border-2 border-[#eeeeee] bg-slate-200 flex items-center justify-center">
                <span className="text-xl">👤</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold text-[#7e7fb6] bg-[#151546]/10 px-2 py-0.5 rounded">#ENQ-8819</span>
                  <span className="text-[10px] font-bold text-[#7f5600] bg-[#ffddae]/40 px-2 py-0.5 rounded uppercase tracking-tighter">Medium Priority</span>
                </div>
                <h5 className="font-bold text-[#020035] truncate mb-0.5">Late Enrollment Fee Waiver Request</h5>
                <p className="text-xs text-[#47464f]">Student: <span className="font-semibold">Jane Doe</span> • Submitted: <span className="text-[#020035] font-medium">Today 12:15</span></p>
              </div>
              <div className="hidden lg:flex flex-col items-center px-6 border-x border-[#c8c5d0]/10">
                <span className="text-[10px] font-bold text-[#47464f] uppercase mb-1">Category</span>
                <span className="px-3 py-1 bg-[#eeeeee] rounded-full text-[11px] font-bold text-[#020035]">Financial Services</span>
              </div>
              <div className="flex items-center gap-3">
                <button className="text-emerald-600 text-xs font-bold px-4 py-2 rounded-lg hover:bg-emerald-50 transition-colors">Resolve Now</button>
                <button className="bg-[#FEB21A] text-[#020035] text-xs font-bold px-4 py-2 rounded-lg hover:shadow-lg transition-all">Assign to SSO</button>
                <button className="p-2 text-[#020035] hover:bg-[#eeeeee] rounded-lg transition-colors">
                  <span className="material-symbols-outlined">visibility</span>
                </button>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white p-5 rounded-xl shadow-sm flex items-center gap-6 border border-transparent hover:border-[#c8c5d0]/30 transition-all">
              <div className="flex-shrink-0 w-12 h-12 rounded-full overflow-hidden border-2 border-[#eeeeee] bg-slate-200 flex items-center justify-center">
                <span className="text-xl">👤</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold text-[#7e7fb6] bg-[#151546]/10 px-2 py-0.5 rounded">#ENQ-8815</span>
                  <span className="text-[10px] font-bold text-[#ba1a1a] bg-[#ffdad6] px-2 py-0.5 rounded uppercase tracking-tighter">High Priority</span>
                </div>
                <h5 className="font-bold text-[#020035] truncate mb-0.5">Medical Leave Absence Verification</h5>
                <p className="text-xs text-[#47464f]">Student: <span className="font-semibold">Mark Smith</span> • Submitted: <span className="text-[#020035] font-medium">Today 09:45</span></p>
              </div>
              <div className="hidden lg:flex flex-col items-center px-6 border-x border-[#c8c5d0]/10">
                <span className="text-[10px] font-bold text-[#47464f] uppercase mb-1">Category</span>
                <span className="px-3 py-1 bg-[#eeeeee] rounded-full text-[11px] font-bold text-[#020035]">Health & Wellbeing</span>
              </div>
              <div className="flex items-center gap-3">
                <button className="text-emerald-600 text-xs font-bold px-4 py-2 rounded-lg hover:bg-emerald-50 transition-colors">Resolve Now</button>
                <button className="bg-[#FEB21A] text-[#020035] text-xs font-bold px-4 py-2 rounded-lg hover:shadow-lg transition-all">Assign to SSO</button>
                <button className="p-2 text-[#020035] hover:bg-[#eeeeee] rounded-lg transition-colors">
                  <span className="material-symbols-outlined">visibility</span>
                </button>
              </div>
            </div>

            {/* Card 4 */}
            <div className="bg-white p-5 rounded-xl shadow-sm flex items-center gap-6 border border-transparent hover:border-[#c8c5d0]/30 transition-all">
              <div className="flex-shrink-0 w-12 h-12 rounded-full overflow-hidden border-2 border-[#eeeeee] bg-slate-200 flex items-center justify-center">
                <span className="text-xl">👤</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold text-[#7e7fb6] bg-[#151546]/10 px-2 py-0.5 rounded">#ENQ-8810</span>
                  <span className="text-[10px] font-bold text-[#47464f] bg-[#e2e2e2] px-2 py-0.5 rounded uppercase tracking-tighter">Low Priority</span>
                </div>
                <h5 className="font-bold text-[#020035] truncate mb-0.5">Library Access Card Replacement</h5>
                <p className="text-xs text-[#47464f]">Student: <span className="font-semibold">Amara Kaur</span> • Submitted: <span className="text-[#020035] font-medium">Yesterday 16:50</span></p>
              </div>
              <div className="hidden lg:flex flex-col items-center px-6 border-x border-[#c8c5d0]/10">
                <span className="text-[10px] font-bold text-[#47464f] uppercase mb-1">Category</span>
                <span className="px-3 py-1 bg-[#eeeeee] rounded-full text-[11px] font-bold text-[#020035]">General Services</span>
              </div>
              <div className="flex items-center gap-3">
                <button className="text-emerald-600 text-xs font-bold px-4 py-2 rounded-lg hover:bg-emerald-50 transition-colors">Resolve Now</button>
                <button className="bg-[#FEB21A] text-[#020035] text-xs font-bold px-4 py-2 rounded-lg hover:shadow-lg transition-all">Assign to SSO</button>
                <button className="p-2 text-[#020035] hover:bg-[#eeeeee] rounded-lg transition-colors">
                  <span className="material-symbols-outlined">visibility</span>
                </button>
              </div>
            </div>

            {/* Card 5 */}
            <div className="bg-white p-5 rounded-xl shadow-sm flex items-center gap-6 border border-transparent hover:border-[#c8c5d0]/30 transition-all">
              <div className="flex-shrink-0 w-12 h-12 rounded-full overflow-hidden border-2 border-[#eeeeee] bg-slate-200 flex items-center justify-center">
                <span className="text-xl">👤</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold text-[#7e7fb6] bg-[#151546]/10 px-2 py-0.5 rounded">#ENQ-8804</span>
                  <span className="text-[10px] font-bold text-[#7f5600] bg-[#ffddae]/40 px-2 py-0.5 rounded uppercase tracking-tighter">Medium Priority</span>
                </div>
                <h5 className="font-bold text-[#020035] truncate mb-0.5">Change of Course Application (B.Eng)</h5>
                <p className="text-xs text-[#47464f]">Student: <span className="font-semibold">Liam Wong</span> • Submitted: <span className="text-[#020035] font-medium">Yesterday 14:00</span></p>
              </div>
              <div className="hidden lg:flex flex-col items-center px-6 border-x border-[#c8c5d0]/10">
                <span className="text-[10px] font-bold text-[#47464f] uppercase mb-1">Category</span>
                <span className="px-3 py-1 bg-[#eeeeee] rounded-full text-[11px] font-bold text-[#020035]">Academic Records</span>
              </div>
              <div className="flex items-center gap-3">
                <button className="text-emerald-600 text-xs font-bold px-4 py-2 rounded-lg hover:bg-emerald-50 transition-colors">Resolve Now</button>
                <button className="bg-[#FEB21A] text-[#020035] text-xs font-bold px-4 py-2 rounded-lg hover:shadow-lg transition-all">Assign to SSO</button>
                <button className="p-2 text-[#020035] hover:bg-[#eeeeee] rounded-lg transition-colors">
                  <span className="material-symbols-outlined">visibility</span>
                </button>
              </div>
            </div>
          </div>

          {/* Quick Actions Bottom */}
          <div className="flex items-center justify-center gap-6">
            <button className="group flex items-center gap-2 bg-[#020035] text-white font-headline font-bold px-8 py-4 rounded-xl hover:bg-[#151546] transition-all active:scale-95">
              <span className="material-symbols-outlined text-[#FEB21A]" style={{ fontVariationSettings: "'FILL' 1" }}>add_circle</span>
              Log New Enquiry (Manual)
            </button>
            <button className="group flex items-center gap-2 bg-[#FEB21A] text-[#020035] font-headline font-bold px-8 py-4 rounded-xl hover:shadow-lg hover:shadow-[#FEB21A]/30 transition-all active:scale-95">
              <span className="material-symbols-outlined">list_alt</span>
              View All Enquiries
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 py-10 border-t border-[#c8c5d0]/20 bg-[#f3f3f4] px-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-[13px] text-[#47464f] font-medium">
          <div className="flex items-center gap-4">
            <span className="text-[#020035] font-bold">UniLink</span>
            <span>© 2024 UniLink Student Support Dashboard. All rights reserved.</span>
          </div>
          <div className="flex gap-8">
            <a className="hover:text-[#020035] transition-colors" href="#">Privacy Policy</a>
            <a className="hover:text-[#020035] transition-colors" href="#">Terms of Service</a>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
              <span className="text-[#020035]">System Status: Operational</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Chatbot Bubble */}
      <ChatbotWidget />
    </div>
  )
}