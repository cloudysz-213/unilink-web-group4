'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock } from 'lucide-react'

// Theme colors
const theme = {
  colors: {
    primary: "#020035",
    secondary: "#FEB21A",
    error: "#BA1A1A",
    success: "#2E7D32",
  }
}

export default function StudentDashboard() {
  const router = useRouter()
  const supabase = createClient()
  const [user, setUser] = useState<any>(null)
  const [userProfile, setUserProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [enquiries, setEnquiries] = useState<any[]>([])
  const [appointments, setAppointments] = useState<any[]>([])
  const [stats, setStats] = useState({
    open: 0,
    appointments: 0
  })
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())

  useEffect(() => {
    const fetchData = async () => {
      // Get current user
      const { data: { user: currentUser } } = await supabase.auth.getUser()
      
      if (!currentUser) {
        router.push('/login')
        return
      }
      
      setUser(currentUser)
      
      // Get user profile
      const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('id', currentUser.id)
        .single()
      
      setUserProfile(profile)
      
      // Get user's enquiries
      const { data: enquiriesData } = await supabase
        .from('enquiries')
        .select('*')
        .eq('student_id', currentUser.id)
        .order('created_at', { ascending: false })
        .limit(5)
      
      if (enquiriesData) {
        setEnquiries(enquiriesData)
        const openCount = enquiriesData.filter(e => e.status !== 'resolved' && e.status !== 'closed').length
        setStats(prev => ({ ...prev, open: openCount }))
      }
      
      // Get upcoming appointments
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      
      const { data: appointmentsData, error: aptError } = await supabase
        .from('appointments')
        .select('*')
        .eq('student_id', currentUser.id)
        .in('status', ['pending', 'confirmed'])
        .gte('start_time', today.toISOString())
        .order('start_time', { ascending: true })
        .limit(10)
      
      if (aptError) {
        console.error('Error fetching appointments:', aptError)
      } else {
        console.log('Appointments fetched:', appointmentsData)
        setAppointments(appointmentsData || [])
        setStats(prev => ({ ...prev, appointments: appointmentsData?.length || 0 }))
      }
      
      setLoading(false)
    }
    
    fetchData()
  }, [supabase, router])

  // Format date
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('vi-VN', { day: 'numeric', month: 'numeric', year: 'numeric' })
  }

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
  }

  // Generate calendar days
  const getDaysInMonth = (year: number, month: number) => {
    const firstDay = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const days = []
    const startOffset = firstDay === 0 ? 6 : firstDay - 1
    
    for (let i = 0; i < startOffset; i++) {
      days.push(null)
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i)
    }
    return days
  }

  const days = getDaysInMonth(currentYear, currentMonth)
  const weekDays = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN']
  const monthNames = ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12']

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear(currentYear - 1)
    } else {
      setCurrentMonth(currentMonth - 1)
    }
  }

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear(currentYear + 1)
    } else {
      setCurrentMonth(currentMonth + 1)
    }
  }

  const hasAppointment = (day: number | null) => {
    if (!day) return false
    return appointments.some(apt => {
      const aptDate = new Date(apt.start_time)
      return aptDate.getDate() === day && aptDate.getMonth() === currentMonth && aptDate.getFullYear() === currentYear
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: theme.colors.primary }}>
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  const displayName = userProfile?.full_name || user?.email?.split('@')[0] || 'Student'
  const studentId = userProfile?.student_id || 'N/A'
  const role = userProfile?.role || 'student'

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar user={user} userProfile={userProfile} role={role} />
      
      <main className="ml-64 min-h-screen relative">
        <Header title="Dashboard" subtitle="Student Portal" user={user} userProfile={userProfile} />
        
        <div className="pt-28 pb-12 px-8 max-w-[1600px] mx-auto">
          <div className="grid grid-cols-12 gap-8">
            {/* Left Column */}
            <div className="col-span-12 lg:col-span-8 space-y-8">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all group">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center group-hover:bg-[#FEB21A]/20 transition-colors text-2xl">💬</div>
                    {stats.open > 0 && <span className="px-2.5 py-1 rounded-full bg-red-100 text-red-700 text-[10px] font-bold uppercase tracking-wider">{stats.open} Active</span>}
                  </div>
                  <h3 className="text-gray-500 text-sm font-medium">Open Enquiries</h3>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-4xl font-extrabold" style={{ color: theme.colors.primary }}>{stats.open}</span>
                    <span className="text-xs text-gray-400 font-medium">Active enquiries</span>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all group">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center group-hover:bg-[#FEB21A]/20 transition-colors text-2xl">📅</div>
                    {stats.appointments > 0 && <span className="px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold uppercase tracking-wider">{stats.appointments} Upcoming</span>}
                  </div>
                  <h3 className="text-gray-500 text-sm font-medium">Upcoming Appointments</h3>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-4xl font-extrabold" style={{ color: theme.colors.primary }}>{stats.appointments}</span>
                    <span className="text-xs text-gray-400 font-medium">Next appointments</span>
                  </div>
                </div>
              </div>

              {/* Enquiry Table */}
              <section className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
                <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
                  <h3 className="font-bold text-lg" style={{ color: theme.colors.primary }}>Recent Enquiries</h3>
                  <button className="text-sm font-semibold hover:underline" style={{ color: theme.colors.secondary }}>View All</button>
                </div>
                <div className="overflow-x-auto">
                  {enquiries.length === 0 ? (
                    <div className="p-12 text-center text-gray-400">
                      <p className="text-lg mb-2">📭</p>
                      <p>You haven't submitted any enquiries yet</p>
                      <button onClick={() => router.push('/enquiry/new')} className="mt-4 px-4 py-2 rounded-lg text-sm font-bold" style={{ backgroundColor: theme.colors.secondary, color: theme.colors.primary }}>Submit Your First Enquiry</button>
                    </div>
                  ) : (
                    <table className="w-full text-left">
                      <thead className="bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-wider">
                        <tr><th className="px-6 py-4">ID</th><th className="px-6 py-4">Title</th><th className="px-6 py-4">Category</th><th className="px-6 py-4">Status</th><th className="px-6 py-4 text-right">Action</th></tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {enquiries.map((enquiry, idx) => (
                          <tr key={enquiry.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 text-sm font-mono text-gray-500">#{enquiry.id?.slice(-6) || `ENQ-${idx + 1}`}</td>
                            <td className="px-6 py-4 text-sm font-semibold" style={{ color: theme.colors.primary }}>{enquiry.title}</td>
                            <td className="px-6 py-4 text-sm text-gray-500 capitalize">{enquiry.category || 'General'}</td>
                            <td className="px-6 py-4"><span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${enquiry.status === 'resolved' ? 'bg-green-100 text-green-800' : enquiry.status === 'assigned' ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'}`}>{enquiry.status === 'open' ? 'Open' : enquiry.status || 'Open'}</span></td>
                            <td className="px-6 py-4 text-right"><button onClick={() => router.push(`/enquiry/${enquiry.id}`)} className="text-xs font-bold px-4 py-2 rounded-lg hover:brightness-95 transition-all" style={{ backgroundColor: theme.colors.secondary, color: theme.colors.primary }}>View</button></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </section>
            </div>

            {/* Right Column */}
            <div className="col-span-12 lg:col-span-4 space-y-8">
              {/* Calendar Section */}
              <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-lg" style={{ color: theme.colors.primary }}>Lịch Hẹn</h3>
                  <div className="flex gap-2">
                    <button onClick={prevMonth} className="p-1 hover:bg-gray-100 rounded-md"><ChevronLeft size={20} className="text-gray-500" /></button>
                    <span className="text-sm font-medium text-gray-600 px-2">{monthNames[currentMonth]} {currentYear}</span>
                    <button onClick={nextMonth} className="p-1 hover:bg-gray-100 rounded-md"><ChevronRight size={20} className="text-gray-500" /></button>
                  </div>
                </div>
                
                <div className="grid grid-cols-7 gap-2 text-center text-[10px] font-bold text-gray-400 uppercase tracking-tighter mb-4">
                  {weekDays.map(day => <div key={day}>{day}</div>)}
                </div>
                
                <div className="grid grid-cols-7 gap-2 text-center text-sm">
                  {days.map((day, idx) => {
                    if (day === null) return <div key={idx} className="p-2"></div>
                    const hasApt = hasAppointment(day)
                    return (
                      <div key={idx} className={`p-2 rounded-lg cursor-pointer transition-all ${hasApt ? 'bg-blue-500 text-white font-semibold shadow-md' : 'hover:bg-gray-100 text-gray-700'}`}>
                        {day}
                      </div>
                    )
                  })}
                </div>
                
                {appointments.length > 0 && (
                  <div className="mt-6">
                    {appointments.slice(0, 1).map((apt) => {
                      const aptDate = new Date(apt.start_time)
                      const isTomorrow = aptDate.getDate() === new Date().getDate() + 1
                      const dayName = aptDate.toLocaleDateString('vi-VN', { weekday: 'long' })
                      const formattedDate = aptDate.toLocaleDateString('vi-VN', { day: 'numeric', month: 'numeric' })
                      const formattedTime = aptDate.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
                      return (
                        <div key={apt.id} className="p-4 rounded-xl bg-[#020035]/5 border-l-4 border-[#FEB21A] flex items-center justify-between hover:bg-[#020035]/10 transition-all">
                          <div>
                            <p className="text-[9px] font-bold text-[#FEB21A] mb-0.5 uppercase tracking-wider">{isTomorrow ? 'TOMORROW' : dayName.toUpperCase()}</p>
                            <p className="text-sm font-bold text-[#020035]">{apt.title || `Meeting with ${apt.staff_name}`}</p>
                            <p className="text-xs text-gray-500 mt-1">{formattedTime} - {formattedDate}</p>
                          </div>
                          <CalendarIcon size={20} className="text-[#020035]/40" />
                        </div>
                      )
                    })}
                    {appointments.length > 1 && <Link href="/appointments" className="block text-center text-xs font-semibold mt-3 hover:underline" style={{ color: theme.colors.secondary }}>+ {appointments.length - 1} more appointment{appointments.length - 1 > 1 ? 's' : ''} →</Link>}
                  </div>
                )}
                
                {appointments.length === 0 && (
                  <div className="mt-6 text-center py-4">
                    <CalendarIcon size={32} className="mx-auto text-gray-300 mb-2" />
                    <p className="text-sm text-gray-400">No upcoming appointments</p>
                    <Link href="/appointments" className="inline-block mt-2 text-xs font-semibold hover:underline" style={{ color: theme.colors.secondary }}>Book an appointment →</Link>
                  </div>
                )}
              </section>

              {/* Student Info Card */}
              <div className="p-6 rounded-2xl relative overflow-hidden shadow-xl" style={{ backgroundColor: theme.colors.primary, color: 'white' }}>
                <div className="relative z-10">
                  <h3 className="text-lg font-bold mb-1">{displayName}</h3>
                  <p className="text-slate-400 text-xs mb-4">ID: {studentId}</p>
                  <div className="flex gap-4 items-center">
                    <div className="text-center"><p className="text-[10px] text-slate-400 uppercase tracking-widest">Credits</p><p className="text-lg font-bold">112/140</p></div>
                    <div className="h-8 w-px bg-white/10"></div>
                    <div className="text-center"><p className="text-[10px] text-slate-400 uppercase tracking-widest">GPA</p><p className="text-lg font-bold text-[#FEB21A]">3.82</p></div>
                    <div className="h-8 w-px bg-white/10"></div>
                    <div className="text-center"><p className="text-[10px] text-slate-400 uppercase tracking-widest">Appointments</p><p className="text-lg font-bold text-[#FEB21A]">{stats.appointments}</p></div>
                  </div>
                </div>
                <div className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full opacity-10 blur-2xl transition-transform duration-700" style={{ backgroundColor: theme.colors.secondary }}></div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="font-bold mb-4" style={{ color: theme.colors.primary }}>Quick Actions</h3>
                <div className="space-y-3">
                  <button onClick={() => router.push('/enquiry/new')} className="w-full flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:border-[#FEB21A] transition-all group"><span>Submit New Enquiry</span><span className="text-xl group-hover:translate-x-1 transition-transform">→</span></button>
                  <button onClick={() => router.push('/appointments')} className="w-full flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:border-[#FEB21A] transition-all group"><span>Book Appointment</span><span className="text-xl group-hover:translate-x-1 transition-transform">→</span></button>
                  <button onClick={() => router.push('/search')} className="w-full flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:border-[#FEB21A] transition-all group"><span>Search Knowledge Base</span><span className="text-xl group-hover:translate-x-1 transition-transform">→</span></button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Chatbot Bubble */}
        <div className="fixed bottom-8 right-8 z-[60] flex flex-col items-end gap-3">
          <div className="hidden md:flex bg-black/60 backdrop-blur-md text-white px-4 py-3 rounded-2xl shadow-2xl border border-white/40 max-w-[240px] mb-1 text-sm"><p>Need help with admission procedures or course registration?</p></div>
          <div className="flex items-center gap-3">
            <button className="text-white text-sm font-bold whitespace-nowrap px-6 py-3 rounded-full shadow-xl hover:scale-105 transition-all flex items-center gap-2" style={{ backgroundColor: theme.colors.primary }}><span className="text-2xl">🤖</span>Ask AI</button>
            <div className="relative group"><button className="w-14 h-14 rounded-full flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-all text-3xl" style={{ backgroundColor: theme.colors.secondary, color: theme.colors.primary }}>💬</button><span className="absolute top-0 right-0 w-4 h-4 border-2 border-white rounded-full" style={{ backgroundColor: theme.colors.error }}></span></div>
          </div>
        </div>
      </main>
    </div>
  )
}