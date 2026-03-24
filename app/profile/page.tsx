'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'
import { theme } from '@/lib/theme'
import ChatbotWidget from '@/components/ChatbotWidget'

export default function ProfilePage() {
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

  const role = userProfile?.role || 'student'
  const displayName = userProfile?.full_name || user?.email?.split('@')[0] || 'Student'
  const studentId = userProfile?.student_id || 'AC-8821'

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <Sidebar user={user} userProfile={userProfile} role={role} />
      
      <main className="ml-64 min-h-screen">
        <Header title="Profile" subtitle="Manage your account" user={user} userProfile={userProfile} />
        
        <div className="pt-28 pb-12 px-12 max-w-7xl mx-auto">
          {/* Profile Header Section - Giữ nguyên từ Stitch */}
          <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mb-10 flex flex-col md:flex-row items-center gap-8">
            <div className="relative">
              <div className="h-36 w-36 rounded-2xl overflow-hidden border-4 border-slate-50 shadow-xl bg-slate-100">
                <img 
                  alt="Profile avatar" 
                  className="h-full w-full object-cover" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBLNICPpokzF66lML4d8MeD0uaBZDM5xUSHFB6SVYZKEu4yhAZ9KRY-NJQoFkmu_pqSZNXmq5DC4YC2PXhMUe8VRi2ktw3OW0cHnhsFnc7p2Nc7VgjdDFE4H3yn-Av3APHyHaLypi9twRRtRLMJ5EB6Yjyxia-tNqT-GMrfnAG2u8z5e73VSzVElXTdcoAnSmZKZScYH3UkStvhMjCdH9X6mzx8_EmJE8LywloPj2S01YPfKpSvw0krM7VDS7x0CfxABBovUJA3dQ0"
                />
              </div>
              <button className="absolute -bottom-2 -right-2 bg-[#FEB21A] p-2.5 rounded-xl shadow-lg hover:scale-105 transition-transform border-2 border-white">
                <span className="material-symbols-outlined text-base text-[#020035]">photo_camera</span>
              </button>
            </div>
            <div className="flex-1">
              <div className="flex flex-col md:flex-row items-baseline gap-4 mb-3">
                <h1 className="text-4xl font-extrabold tracking-tight" style={{ color: theme.colors.primary }}>{displayName}</h1>
                <span className="px-3 py-1 bg-[#FEB21A]/10 text-[#020035] text-[10px] font-black uppercase tracking-widest rounded-full border border-[#FEB21A]/20">Student</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-8 max-w-2xl">
                <div className="flex items-center gap-2 text-slate-500 font-medium text-sm">
                  <span className="material-symbols-outlined text-lg text-slate-400">badge</span>
                  <span>Mã sinh viên: <span className="text-[#020035] font-bold">{studentId}</span></span>
                </div>
                <div className="flex items-center gap-2 text-slate-500 font-medium text-sm">
                  <span className="material-symbols-outlined text-lg text-slate-400">mail</span>
                  <span>{user?.email}</span>
                </div>
              </div>
            </div>
          </section>

          {/* Grid Layout - Giữ nguyên từ Stitch */}
          <div className="grid grid-cols-12 gap-10">
            {/* Main Form Column */}
            <div className="col-span-12 lg:col-span-8 space-y-10">
              {/* Personal Information */}
              <div className="bg-white p-10 rounded-2xl shadow-sm border border-slate-200">
                <div className="flex items-center gap-3 mb-8">
                  <div className="h-10 w-1 bg-[#FEB21A] rounded-full"></div>
                  <h3 className="text-xl font-bold" style={{ color: theme.colors.primary }}>Personal Information</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[0.7rem] font-black text-slate-400 uppercase tracking-[0.1em]">Full Name</label>
                    <input 
                      className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-3.5 font-medium transition-all focus:bg-white focus:border-[#FEB21A] focus:ring-4 focus:ring-[#FEB21A]/10 outline-none" 
                      type="text" 
                      defaultValue={displayName}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[0.7rem] font-black text-slate-400 uppercase tracking-[0.1em]">Phone Number</label>
                    <input 
                      className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-3.5 font-medium transition-all focus:bg-white focus:border-[#FEB21A] focus:ring-4 focus:ring-[#FEB21A]/10 outline-none" 
                      type="text" 
                      defaultValue="+84 123 456 789"
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[0.7rem] font-black text-slate-400 uppercase tracking-[0.1em]">University Email</label>
                    <div className="flex items-center gap-3 w-full bg-slate-100 border border-slate-200 px-4 py-3.5 rounded-xl text-slate-500">
                      <span className="material-symbols-outlined text-base">lock</span>
                      <span className="font-semibold">{user?.email}</span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-medium flex items-center gap-1 pt-1">
                      <span className="material-symbols-outlined text-[12px]">info</span>
                      Institutional email cannot be changed manually. Please contact Support.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Security Card */}
            <div className="col-span-12 lg:col-span-4 space-y-10">
              <div className="bg-white p-10 rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#FEB21A]/5 rounded-full -mr-12 -mt-12"></div>
                <div className="flex items-center gap-3 mb-8 relative z-10">
                  <div className="h-10 w-1 bg-[#020035] rounded-full"></div>
                  <h3 className="text-xl font-bold" style={{ color: theme.colors.primary }}>Security</h3>
                </div>
                <div className="space-y-6 relative z-10">
                  <div className="space-y-2">
                    <label className="text-[0.7rem] font-black text-slate-400 uppercase tracking-[0.1em]">Current Password</label>
                    <input className="w-full bg-slate-50/50 border border-slate-200 px-4 py-3 rounded-xl text-sm font-medium focus:bg-white focus:border-[#FEB21A] focus:ring-4 focus:ring-[#FEB21A]/10 outline-none" placeholder="••••••••" type="password"/>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[0.7rem] font-black text-slate-400 uppercase tracking-[0.1em]">New Password</label>
                    <input className="w-full bg-slate-50/50 border border-slate-200 px-4 py-3 rounded-xl text-sm font-medium focus:bg-white focus:border-[#FEB21A] focus:ring-4 focus:ring-[#FEB21A]/10 outline-none" placeholder="Min. 8 characters" type="password"/>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[0.7rem] font-black text-slate-400 uppercase tracking-[0.1em]">Confirm New Password</label>
                    <input className="w-full bg-slate-50/50 border border-slate-200 px-4 py-3 rounded-xl text-sm font-medium focus:bg-white focus:border-[#FEB21A] focus:ring-4 focus:ring-[#FEB21A]/10 outline-none" placeholder="Repeat password" type="password"/>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Global Actions */}
          <div className="mt-16 pt-10 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                <span className="material-symbols-outlined">verified_user</span>
              </div>
              <div>
                <div className="text-sm font-bold" style={{ color: theme.colors.primary }}>Secure Infrastructure</div>
                <div className="text-xs text-slate-400 font-medium">Your data is encrypted using enterprise-grade protocols.</div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="px-8 py-4 text-slate-500 font-bold text-sm hover:text-[#020035] transition-colors">
                Discard Changes
              </button>
              <button className="bg-[#FEB21A] text-[#020035] px-16 py-4 rounded-xl font-black shadow-xl shadow-[#FEB21A]/20 hover:shadow-[#FEB21A]/40 active:scale-[0.98] transition-all text-lg tracking-widest uppercase">
                LƯU THAY ĐỔI
              </button>
            </div>
          </div>
        </div>
      </main>
      <ChatbotWidget />
    </div>
  )
}