'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'
import { theme } from '@/lib/theme'

export default function ManagerAppointments() {
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
      
      if (profile?.role !== 'manager') {
        router.push('/dashboard/student')
        return
      }
      setUserProfile(profile)
      setLoading(false)
    }
    fetchData()
  }, [supabase, router])

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen bg-[#020035]"><div className="text-white">Loading...</div></div>
  }

  return (
    <div className="min-h-screen bg-[#f5f6f8]">
      <Sidebar user={user} userProfile={userProfile} role="manager" />
      <main className="ml-64 min-h-screen">
        <Header title="Appointments" subtitle="Analytics & Oversight" user={user} userProfile={userProfile} />
        
        <div className="p-8 max-w-7xl mx-auto">
          {/* KPI Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm"><p className="text-gray-500 text-xs">Total Appointments</p><h4 className="text-3xl font-bold">1,284</h4><span className="text-green-600 text-xs">+12%</span></div>
            <div className="bg-white p-6 rounded-2xl shadow-sm"><p className="text-gray-500 text-xs">Staff Utilization</p><h4 className="text-3xl font-bold">87.4%</h4></div>
            <div className="bg-white p-6 rounded-2xl shadow-sm"><p className="text-gray-500 text-xs">Avg. Duration</p><h4 className="text-3xl font-bold">32 min</h4></div>
            <div className="bg-white p-6 rounded-2xl shadow-sm"><p className="text-gray-500 text-xs">No-Show Rate</p><h4 className="text-3xl font-bold text-red-500">4.2%</h4></div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <h3 className="text-lg font-bold mb-4">Appointments per Department</h3>
              <div className="flex items-end justify-between h-48 gap-4">
                {['STEM', 'ARTS', 'LAW', 'MED', 'ECON'].map((d, i) => (
                  <div key={d} className="flex-1 text-center">
                    <div className="bg-[#020035] rounded-t-lg h-24" style={{height: `${[85,65,45,55,40][i]}%`}}></div>
                    <span className="text-xs mt-2 block">{d}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <h3 className="text-lg font-bold mb-4">Slot Distribution</h3>
              <div className="flex justify-center">
                <div className="relative w-40 h-40">
                  <svg className="w-full h-full -rotate-90">
                    <circle cx="80" cy="80" r="70" fill="none" stroke="#e2e8f0" strokeWidth="15" />
                    <circle cx="80" cy="80" r="70" fill="none" stroke="#FEB21A" strokeWidth="15" strokeDasharray="440" strokeDashoffset="123" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <span className="text-2xl font-bold">72%</span>
                    <span className="text-xs text-gray-500">Confirmed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Policy Config */}
          <div className="bg-[#020035] p-6 rounded-2xl text-white mb-8">
            <h3 className="text-lg font-bold mb-4">Policy Configuration</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div><label className="text-sm text-gray-300">Max Slots Per Day</label><input type="range" className="w-full" defaultValue={12} /><p className="text-right text-[#FEB21A]">12</p></div>
              <div><label className="text-sm text-gray-300">Buffer Time</label><input type="range" className="w-full" defaultValue={15} /><p className="text-right text-[#FEB21A]">15 mins</p></div>
            </div>
            <button className="mt-4 w-full bg-[#FEB21A] text-[#020035] py-3 rounded-xl font-bold">Export Report</button>
          </div>

          {/* Recent Appointments Table */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="p-5 border-b"><h3 className="font-bold">Recent Appointment History</h3></div>
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-xs font-bold text-gray-500"><tr><th className="p-4">Date</th><th className="p-4">Student</th><th className="p-4">SSO</th><th className="p-4">Status</th></tr></thead>
              <tbody>
                <tr className="border-t"><td className="p-4">24 Oct 2023</td><td className="p-4">Elena Vance</td><td className="p-4">Dr. Thorne</td><td className="p-4"><span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">Completed</span></td></tr>
                <tr className="border-t"><td className="p-4">24 Oct 2023</td><td className="p-4">Marcus Chen</td><td className="p-4">Prof. Miller</td><td className="p-4"><span className="px-2 py-1 bg-rose-100 text-rose-700 rounded text-xs">Cancelled</span></td></tr>
                <tr className="border-t"><td className="p-4">23 Oct 2023</td><td className="p-4">Sarah Jenkins</td><td className="p-4">Dr. Thorne</td><td className="p-4"><span className="px-2 py-1 bg-amber-100 text-amber-700 rounded text-xs">Pending</span></td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}