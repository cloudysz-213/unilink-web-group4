'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'
import { theme } from '@/lib/theme'
import { toast } from 'sonner'
import { ChevronDown, ChevronLeft, ChevronRight, CheckCircle, X, Calendar as CalendarIcon, Clock, Plus, User } from 'lucide-react'
import ChatbotWidget from '@/components/ChatbotWidget'

export default function AppointmentsPage() {
  const router = useRouter()
  const supabase = createClient()
  const [user, setUser] = useState<any>(null)
  const [userProfile, setUserProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [role, setRole] = useState<string>('student')
  const [appointments, setAppointments] = useState<any[]>([])

  // Student form states
  const [selectedOfficer, setSelectedOfficer] = useState('Dr. Sarah Jenkins - Academic')
  const [selectedDate, setSelectedDate] = useState<number | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [note, setNote] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [bookingId, setBookingId] = useState<string | null>(null)
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
  const [submitting, setSubmitting] = useState(false)

  // SSO CALENDAR STATES
  const [ssoCurrentMonth, setSsoCurrentMonth] = useState(new Date().getMonth())
  const [ssoCurrentYear, setSsoCurrentYear] = useState(new Date().getFullYear())
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null)

  // Calendar helpers
  const years = [2023, 2024, 2025, 2026]
  const months = [
    { value: 0, name: 'Tháng 1' }, { value: 1, name: 'Tháng 2' }, { value: 2, name: 'Tháng 3' },
    { value: 3, name: 'Tháng 4' }, { value: 4, name: 'Tháng 5' }, { value: 5, name: 'Tháng 6' },
    { value: 6, name: 'Tháng 7' }, { value: 7, name: 'Tháng 8' }, { value: 8, name: 'Tháng 9' },
    { value: 9, name: 'Tháng 10' }, { value: 10, name: 'Tháng 11' }, { value: 11, name: 'Tháng 12' }
  ]

  const getDaysInMonth = (year: number, month: number) => {
    const firstDay = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const days = []
    const startOffset = firstDay === 0 ? 6 : firstDay - 1
    for (let i = 0; i < startOffset; i++) days.push(null)
    for (let i = 1; i <= daysInMonth; i++) days.push(i)
    return days
  }

  const days = getDaysInMonth(currentYear, currentMonth)
  const weekDays = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN']
  
  // SSO Calendar helpers
  const weekDaysEn = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  const ssoDays = getDaysInMonth(ssoCurrentYear, ssoCurrentMonth)

  const isAvailableDate = (day: number | null) => {
    if (!day) return false
    const availableDays = [2, 3, 4, 6, 7, 10, 11, 12, 13, 14, 17, 18, 19, 20, 21, 24, 25, 26, 27, 28, 31]
    return availableDays.includes(day)
  }
  
  const isBookedDate = (day: number | null) => {
    if (!day) return false
    const bookedDays = [5, 15, 22, 29]
    return bookedDays.includes(day)
  }

  const timeSlots = [
    { time: '09:00', available: true }, { time: '10:00', available: true },
    { time: '11:00', available: false }, { time: '14:00', available: true },
    { time: '15:00', available: true }, { time: '16:00', available: false },
  ]

  const officers = [
    'Dr. Sarah Jenkins - Academic',
    'Ms. Lan Nguyen - Visa Support',
    'Mr. John Doe - Financial',
  ]

  // SSO Calendar functions
  const prevSsoMonth = () => {
    if (ssoCurrentMonth === 0) {
      setSsoCurrentMonth(11)
      setSsoCurrentYear(ssoCurrentYear - 1)
    } else {
      setSsoCurrentMonth(ssoCurrentMonth - 1)
    }
    setSelectedAppointment(null)
  }

  const nextSsoMonth = () => {
    if (ssoCurrentMonth === 11) {
      setSsoCurrentMonth(0)
      setSsoCurrentYear(ssoCurrentYear + 1)
    } else {
      setSsoCurrentMonth(ssoCurrentMonth + 1)
    }
    setSelectedAppointment(null)
  }

  const hasAppointmentOnDate = (day: number) => {
    return appointments.some(apt => {
      const aptDate = new Date(apt.start_time)
      return aptDate.getDate() === day && 
             aptDate.getMonth() === ssoCurrentMonth && 
             aptDate.getFullYear() === ssoCurrentYear
    })
  }

  const getAppointmentsOnDate = (day: number) => {
    return appointments.filter(apt => {
      const aptDate = new Date(apt.start_time)
      return aptDate.getDate() === day && 
             aptDate.getMonth() === ssoCurrentMonth && 
             aptDate.getFullYear() === ssoCurrentYear
    })
  }

  const handleSsoDateClick = (day: number) => {
    const apts = getAppointmentsOnDate(day)
    setSelectedAppointment(apts.length > 0 ? apts[0] : null)
  }

  // Student Calendar functions
  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentMonth(parseInt(e.target.value))
    setSelectedDate(null)
    setSelectedTime(null)
  }

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentYear(parseInt(e.target.value))
    setSelectedDate(null)
    setSelectedTime(null)
  }

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear(currentYear - 1)
    } else {
      setCurrentMonth(currentMonth - 1)
    }
    setSelectedDate(null)
    setSelectedTime(null)
  }

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear(currentYear + 1)
    } else {
      setCurrentMonth(currentMonth + 1)
    }
    setSelectedDate(null)
    setSelectedTime(null)
  }

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
      
      const userRole = profile?.role || 'student'
      setRole(userRole)

      let query = supabase.from('appointments').select('*')
      
      if (userRole === 'student') {
        query = query.eq('student_id', currentUser.id)
      } else if (userRole === 'sso' || userRole === 'admin_officer') {
        query = query.eq('staff_id', currentUser.id)
      }
      
      const { data: appointmentsData } = await query
        .order('start_time', { ascending: true })
        .limit(20)
      
      if (appointmentsData) {
        setAppointments(appointmentsData)
      }
      
      setLoading(false)
    }
    fetchData()
  }, [supabase, router])

  const getOfficerName = (officer: string) => officer.split(' - ')[0]
  const getOfficerRole = (officer: string) => officer.split(' - ')[1] || 'Support Officer'

  const handleConfirm = async () => {
    if (!selectedDate || !selectedTime) {
      toast.error('Vui lòng chọn ngày và giờ')
      return
    }

    setSubmitting(true)

    try {
      const [hour, minute] = selectedTime.split(':')
      const startDateTime = new Date(currentYear, currentMonth, selectedDate, parseInt(hour), parseInt(minute))
      const endDateTime = new Date(startDateTime.getTime() + 30 * 60000)

      const { data, error } = await supabase
        .from('appointments')
        .insert({
          student_id: user.id,
          staff_name: getOfficerName(selectedOfficer),
          staff_role: getOfficerRole(selectedOfficer),
          title: `Appointment with ${getOfficerName(selectedOfficer)}`,
          start_time: startDateTime.toISOString(),
          end_time: endDateTime.toISOString(),
          status: 'pending',
          notes: note || null,
        })
        .select()
        .single()

      if (error) {
        toast.error(`Lỗi: ${error.message}`)
        setSubmitting(false)
        return
      }

      setBookingId(data.id)
      setShowModal(true)
      toast.success('Đặt lịch thành công!')
      setSelectedDate(null)
      setSelectedTime(null)
      setNote('')
      
    } catch (err) {
      toast.error('Có lỗi xảy ra')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: theme.colors.primary }}>
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  const userRole = userProfile?.role || 'student'

  // ========== STUDENT VIEW ==========
  if (userRole === 'student') {
    return (
      <div className="min-h-screen bg-[#f9f9f9]">
        <Sidebar user={user} userProfile={userProfile} role={userRole} />
        
        <main className="ml-64 min-h-screen flex flex-col">
          <Header title="Appointments" subtitle="Book a meeting" user={user} userProfile={userProfile} />
          
          <div className="max-w-6xl w-full mx-auto px-6 md:px-8 py-8 flex-1 mt-20">
            {/* Officer Selection */}
            <div className="mb-8">
              <label className="block text-sm font-bold text-[#020035] mb-2">Chọn cán bộ hỗ trợ</label>
              <div className="relative max-w-md">
                <select 
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 appearance-none focus:ring-2 focus:ring-[#FEB21A] focus:border-[#FEB21A] transition-all text-[#1a1c1c] font-medium pr-12"
                  value={selectedOfficer}
                  onChange={(e) => setSelectedOfficer(e.target.value)}
                >
                  {officers.map(officer => <option key={officer}>{officer}</option>)}
                </select>
                <ChevronDown size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <h1 className="text-3xl md:text-4xl font-headline font-extrabold text-[#020035] tracking-tight leading-tight mb-4">
              Book Appointment with <span className="text-[#FEB21A]">{getOfficerName(selectedOfficer)}</span>
            </h1>
            
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[#47464F] text-sm mb-6">
              <span className="flex items-center gap-1.5"><Clock size={16} /> Duration: 30 minutes</span>
              <span className="flex items-center gap-1.5"><CalendarIcon size={16} /> Time zone: GMT+7</span>
            </div>
            
            <p className="text-[#47464F] max-w-2xl leading-relaxed mb-10">Vui lòng chọn ngày và giờ phù hợp để thảo luận về kế hoạch học tập của bạn.</p>

            {/* Booking Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left: Calendar */}
              <div className="lg:col-span-7 bg-white rounded-2xl overflow-hidden shadow-md border border-gray-100">
                <div className="bg-[#020035] p-4 flex flex-wrap items-center justify-between gap-3 text-white">
                  <div className="flex items-center gap-3">
                    <button onClick={prevMonth} className="p-2 hover:bg-white/10 rounded-lg"><ChevronLeft size={20} /></button>
                    <div className="flex gap-2">
                      {/* FIXED: select tháng - nền trắng, chữ đen */}
                      <select 
                        value={currentMonth} 
                        onChange={handleMonthChange} 
                        className="bg-white border border-gray-300 rounded-lg px-3 py-1.5 text-sm font-medium text-[#020035] focus:ring-2 focus:ring-[#FEB21A] outline-none"
                      >
                        {months.map(m => <option key={m.value} value={m.value}>{m.name}</option>)}
                      </select>
                      {/* FIXED: select năm - nền trắng, chữ đen */}
                      <select 
                        value={currentYear} 
                        onChange={handleYearChange} 
                        className="bg-white border border-gray-300 rounded-lg px-3 py-1.5 text-sm font-medium text-[#020035] focus:ring-2 focus:ring-[#FEB21A] outline-none"
                      >
                        {years.map(y => <option key={y}>{y}</option>)}
                      </select>
                    </div>
                    <button onClick={nextMonth} className="p-2 hover:bg-white/10 rounded-lg"><ChevronRight size={20} /></button>
                  </div>
                </div>
                <div className="p-5">
                  <div className="grid grid-cols-7 text-center text-xs font-semibold text-gray-500 mb-3">{weekDays.map(d => <div key={d}>{d}</div>)}</div>
                  <div className="grid grid-cols-7 gap-1">
                    {days.map((day, idx) => {
                      if (day === null) return <div key={idx} className="h-12"></div>
                      const available = isAvailableDate(day)
                      const booked = isBookedDate(day)
                      const isSelected = selectedDate === day
                      if (booked) return <div key={idx} className="h-12 flex items-center justify-center bg-gray-100 text-gray-400 rounded-xl">{day}</div>
                      if (isSelected) return <button key={idx} className="h-12 bg-[#FEB21A] text-[#020035] font-bold rounded-xl" onClick={() => setSelectedDate(day)}>{day}</button>
                      if (available) return <button key={idx} className="h-12 bg-emerald-50 text-emerald-700 rounded-xl hover:bg-emerald-100" onClick={() => { setSelectedDate(day); setSelectedTime(null) }}>{day}</button>
                      return <div key={idx} className="h-12 flex items-center justify-center text-gray-400">{day}</div>
                    })}
                  </div>
                </div>
              </div>

              {/* Right: Time Slots */}
              <div className="lg:col-span-5">
                <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
                  <div className="flex items-center justify-between mb-6">
                    <div><h3 className="font-headline font-bold text-xl text-[#020035]">{selectedDate ? `${selectedDate}/${currentMonth+1}/${currentYear}` : 'Chọn ngày'}</h3>
                    <p className="text-xs font-medium text-gray-500 mt-1">Vui lòng chọn khung giờ trống</p></div>
                    <span className="text-[11px] font-bold text-[#020035] bg-[#FEB21A] px-3 py-1.5 rounded-full">{timeSlots.filter(s => s.available).length} SLOTS</span>
                  </div>
                  {!selectedDate ? (
                    <div className="text-center py-12 text-gray-400"><CalendarIcon size={48} className="mx-auto mb-3 opacity-50" /><p>Vui lòng chọn ngày trước</p></div>
                  ) : (
                    <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1 custom-scrollbar">
                      {timeSlots.map((slot, idx) => {
                        const isSelected = selectedTime === slot.time && slot.available
                        if (!slot.available) return <div key={idx} className="bg-gray-100 p-4 rounded-xl opacity-60"><div className="flex gap-4"><div className="w-14 h-14 bg-gray-200 rounded-xl flex justify-center items-center font-bold">{slot.time}</div><div><p className="font-semibold">Đã đặt</p></div></div></div>
                        if (isSelected) return <div key={idx} className="bg-[#FEB21A]/10 p-4 rounded-xl border-2 border-[#FEB21A]"><div className="flex gap-4"><div className="w-14 h-14 bg-[#FEB21A] rounded-xl flex justify-center items-center font-bold">{slot.time}</div><div><p className="font-bold">Đã chọn</p></div></div></div>
                        return <div key={idx} className="bg-white p-4 rounded-xl border hover:border-[#FEB21A] cursor-pointer" onClick={() => setSelectedTime(slot.time)}><div className="flex gap-4"><div className="w-14 h-14 bg-emerald-50 rounded-xl flex justify-center items-center font-bold">{slot.time}</div><div><p>Còn trống</p></div></div></div>
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-10">
              <label className="font-headline font-bold text-[#020035] mb-3 block">Ghi chú cho cuộc hẹn</label>
              <textarea className="w-full bg-white border border-gray-200 rounded-xl p-5 min-h-[120px]" placeholder="Ghi chú cho cuộc hẹn..." value={note} onChange={(e) => setNote(e.target.value)} />
            </div>

            <div className="mt-12 flex flex-col md:flex-row items-center justify-between gap-6 border-t border-gray-200 pt-8">
              <div className="flex flex-col items-center md:items-start gap-3">
                <button onClick={() => router.back()} className="text-gray-500 font-medium hover:text-red-500 text-sm underline">Hủy bỏ</button>
                <p className="text-[11px] text-gray-400 italic">Yêu cầu đặt lịch sẽ được xác nhận trong vòng 24 giờ làm việc qua email sinh viên.</p>
              </div>
              <button className={`px-12 py-4 rounded-xl font-bold text-lg shadow-lg ${selectedDate && selectedTime && !submitting ? 'bg-[#FEB21A] text-[#020035] cursor-pointer' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`} onClick={handleConfirm} disabled={!selectedDate || !selectedTime || submitting}>{submitting ? 'Đang xử lý...' : 'XÁC NHẬN ĐẶT LỊCH'}</button>
            </div>

            <p className="mt-12 text-center text-[11px] text-gray-400 border-t border-gray-200 pt-6">Lịch hẹn được bảo mật theo quy định của ABC University.</p>
          </div>
        </main>

        {showModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-3xl w-full max-w-md p-8 text-center shadow-2xl">
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-5">
                <CheckCircle size={44} />
              </div>
              <h2 className="text-2xl font-extrabold text-[#020035] mb-3">Đặt lịch thành công!</h2>
              <div className="bg-gray-50 py-2 px-5 rounded-xl inline-block mb-5">
                <span className="text-sm text-gray-500 mr-2">Mã lịch:</span>
                <span className="text-lg font-bold text-[#020035]">#{bookingId?.slice(-6) || 'BK-7729'}</span>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">
                Lịch hẹn đã đặt thành công với <span className="font-bold text-[#020035]">{getOfficerName(selectedOfficer)}</span> vào{' '}
                <span className="font-bold text-[#020035]">{selectedTime}, {selectedDate}/{currentMonth + 1}/{currentYear}</span>!{' '}
                Xác nhận sẽ gửi qua email.
              </p>
              <div className="flex gap-3">
                <button 
                  className="flex-1 bg-[#020035] text-white py-3 rounded-xl font-bold hover:bg-[#020035]/90 transition-all"
                  onClick={() => {
                    setShowModal(false)
                    window.location.href = '/dashboard/student?refresh=' + Date.now()
                  }}
                >
                  Về Dashboard
                </button>
                <button 
                  className="flex-1 border border-[#020035] text-[#020035] py-3 rounded-xl font-bold hover:bg-gray-50 transition-all"
                  onClick={() => setShowModal(false)}
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        )}

        <style jsx>{`
          .custom-scrollbar::-webkit-scrollbar { width: 4px; }
          .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
          .custom-scrollbar::-webkit-scrollbar-thumb { background: #FEB21A; border-radius: 10px; }
        `}</style>
      </div>
    )
  }

  // ========== SSO VIEW ==========
  if (userRole === 'sso') {
    return (
      <div className="min-h-screen bg-[#f9f9f9]">
        <Sidebar user={user} userProfile={userProfile} role={userRole} />
        <main className="ml-64 min-h-screen">
          <Header title="Appointment Manager" subtitle="My Schedule" user={user} userProfile={userProfile} />
          <div className="pt-28 pb-12 px-8 max-w-[1600px] mx-auto">
            <div className="text-center mb-12"><h1 className="text-5xl font-black text-[#020035]">Appointment Manager</h1><p className="text-gray-500 mt-2">Manage your academic guidance sessions and availability</p></div>
            <div className="grid grid-cols-12 gap-8">
              <div className="col-span-12 lg:col-span-7">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <div className="flex justify-between mb-6"><div className="flex gap-4"><h3 className="text-xl font-bold">{monthNames[ssoCurrentMonth]} {ssoCurrentYear}</h3><div className="flex gap-1"><button onClick={prevSsoMonth}><ChevronLeft size={20} /></button><button onClick={nextSsoMonth}><ChevronRight size={20} /></button></div></div><div className="flex gap-1 bg-gray-100 p-1 rounded"><button className="px-3 py-1.5 bg-white rounded-md text-xs font-bold">Month</button><button className="px-3 py-1.5 text-gray-500 text-xs font-bold">Week</button></div></div>
                  <div className="grid grid-cols-7 text-center mb-4">{weekDaysEn.map(d => <div key={d} className="text-[10px] font-bold text-gray-400 uppercase pb-4">{d}</div>)}</div>
                  <div className="grid grid-cols-7 gap-px bg-gray-100 rounded-lg overflow-hidden">
                    {ssoDays.map((day, idx) => {
                      if (day === null) return <div key={idx} className="bg-gray-50 h-28 p-2"></div>
                      const hasApt = hasAppointmentOnDate(day)
                      return <button key={idx} onClick={() => handleSsoDateClick(day)} className="bg-white h-28 p-2 text-left hover:bg-gray-50 relative"><span className={hasApt ? 'font-bold' : ''}>{day}</span>{hasApt && <div className="absolute bottom-2 left-2 w-1.5 h-1.5 rounded-full bg-[#FEB21A]"></div>}</button>
                    })}
                  </div>
                </div>
                <div className="mt-6 bg-gray-50 rounded-xl p-6 flex justify-between"><div className="flex gap-6"><div className="flex gap-3"><label className="relative inline-flex"><input type="checkbox" className="sr-only peer" defaultChecked /><div className="w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-[#FEB21A] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div></label><span className="text-sm font-bold">Online Today</span></div><div className="h-8 w-px bg-gray-300"></div><div className="flex gap-3"><p className="text-[10px] font-bold text-gray-500">Buffer Time</p><div className="bg-white rounded-lg border px-3 py-1.5"><input className="bg-transparent text-sm font-bold w-16" defaultValue="15 MINS" readOnly /></div></div></div><button className="px-6 py-2.5 bg-white border rounded-lg font-bold text-sm">Sync Outlook</button></div>
              </div>
              <div className="col-span-12 lg:col-span-5">
                <div className="flex justify-between mb-4"><h3 className="font-bold text-xs uppercase">Upcoming Appointments</h3><span className="bg-[#020035]/10 px-2 py-0.5 rounded text-[10px] font-bold">{appointments.length} TOTAL</span></div>
                <div className="space-y-4">
                  {appointments.length === 0 ? <div className="text-center py-12"><CalendarIcon size={48} className="mx-auto text-gray-300" /><p>No upcoming appointments</p></div> :
                    appointments.slice(0,5).map(apt => (
                      <div key={apt.id} className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-[#FEB21A]">
                        <div className="flex justify-between"><div className="flex gap-3"><div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center"><User size={18} /></div><div><p className="font-bold">Student {apt.student_id?.slice(-6)}</p><p className="text-[10px] text-gray-500">{apt.title}</p></div></div><span className="px-2 py-1 rounded text-[9px] font-bold bg-amber-100">{apt.status}</span></div>
                        <div className="flex gap-4 py-3 my-2 border-y"><div className="flex gap-1"><Clock size={14} className="text-[#FEB21A]" />{new Date(apt.start_time).toLocaleTimeString()}</div><div className="flex gap-1"><CalendarIcon size={14} />{new Date(apt.start_time).toLocaleDateString()}</div></div>
                        <div className="flex gap-2"><button className="flex-1 py-2 bg-[#FEB21A] text-xs font-bold rounded">Join</button><button className="flex-1 py-2 bg-gray-100 text-xs font-bold rounded">Reschedule</button></div>
                      </div>
                    ))
                  }
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  // ========== MANAGER VIEW ==========
  if (userRole === 'manager') {
    return (
      <div className="min-h-screen bg-[#f5f6f8]">
        <Sidebar user={user} userProfile={userProfile} role={userRole} />
        <main className="ml-64 min-h-screen">
          <Header title="Analytics Dashboard" subtitle="Appointment Oversight" user={user} userProfile={userProfile} />
          <div className="pt-28 pb-12 px-8 max-w-[1500px] mx-auto">
            <div className="mb-8"><h2 className="text-3xl font-bold">Analytics Dashboard</h2><p className="text-gray-500">System-wide performance and scheduling oversight</p></div>
            <div className="grid grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-2xl"><p className="text-gray-500 text-xs">Total Appointments</p><h4 className="text-3xl font-bold">{appointments.length}</h4></div>
              <div className="bg-white p-6 rounded-2xl"><p className="text-gray-500 text-xs">Staff Utilization</p><h4 className="text-3xl font-bold">87.4%</h4></div>
              <div className="bg-white p-6 rounded-2xl"><p className="text-gray-500 text-xs">Top Busy SSO</p><h4 className="text-xl font-bold">Dr. Arts Thorne</h4></div>
              <div className="bg-white p-6 rounded-2xl"><p className="text-gray-500 text-xs">No-Show Rate</p><h4 className="text-3xl font-bold">4.2%</h4></div>
            </div>
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="bg-white p-6 rounded-2xl"><h3 className="font-bold mb-4">Appointments per Department</h3><div className="flex items-end h-40 gap-2">{['STEM','ARTS','LAW','MED','ECON'].map((d,i) => <div key={d} className="flex-1 text-center"><div className="bg-[#020035] rounded-t h-24" style={{height:`${[85,65,45,55,40][i]}%`}}></div><span className="text-xs">{d}</span></div>)}</div></div>
              <div className="bg-white p-6 rounded-2xl"><h3 className="font-bold mb-4">Slot Distribution</h3><div className="flex justify-center"><div className="relative w-40 h-40"><div className="absolute inset-0 flex items-center justify-center flex-col"><span className="text-2xl font-bold">72%</span><span className="text-xs text-gray-500">Confirmed</span></div></div></div></div>
            </div>
            <div className="bg-[#020035] p-6 rounded-2xl text-white mb-8"><h3 className="font-bold mb-4">Policy Configuration</h3><div className="grid grid-cols-2 gap-6"><div><label>Max Slots per Day</label><input type="range" className="w-full" defaultValue={12} /><p className="text-right text-[#FEB21A]">12</p></div><div><label>Buffer Time</label><input type="range" className="w-full" defaultValue={15} /><p className="text-right text-[#FEB21A]">15 mins</p></div></div><button className="mt-4 w-full bg-[#FEB21A] py-2 rounded-xl font-bold">Export Report</button></div>
            <div className="bg-white rounded-2xl overflow-hidden"><div className="p-4 border-b"><h3 className="font-bold">Recent Appointment History</h3></div><table className="w-full"><thead className="bg-gray-50"><tr><th className="p-4 text-left text-xs">Date</th><th className="p-4 text-left">Student</th><th className="p-4 text-left">SSO</th><th className="p-4 text-left">Status</th></tr></thead><tbody><tr className="border-t"><td className="p-4">24 Oct 2023</td><td>Elena Vance</td><td>Dr. Thorne</td><td><span className="px-2 py-1 bg-green-100 rounded text-xs">Completed</span></td></tr><tr className="border-t"><td className="p-4">24 Oct 2023</td><td>Marcus Chen</td><td>Prof. Miller</td><td><span className="px-2 py-1 bg-rose-100 rounded text-xs">Cancelled</span></td></tr></tbody></table></div>
          </div>
        </main>
      </div>
    )
  }

  // ========== ADMIN VIEW ==========
  if (userRole === 'admin_officer') {
    return (
      <div className="min-h-screen bg-[#f9f9f9]">
        <Sidebar user={user} userProfile={userProfile} role={userRole} />
        <main className="ml-64 min-h-screen">
          <Header title="Appointments" subtitle="General Management" user={user} userProfile={userProfile} />
          <div className="pt-28 pb-12 px-8">
            <div className="flex justify-between mb-10"><h2 className="text-3xl font-bold">Appointments / General Management</h2><button className="bg-[#FEB21A] px-6 py-3 rounded-xl font-bold">Send Booking Link</button></div>
            <div className="grid grid-cols-3 gap-6 mb-10"><div className="bg-white p-6 rounded-2xl"><p className="text-gray-500 text-xs">Pending Requests</p><p className="text-4xl font-bold">28</p></div><div className="bg-white p-6 rounded-2xl"><p className="text-gray-500 text-xs">Active SSOs</p><p className="text-4xl font-bold">12</p></div><div className="bg-white p-6 rounded-2xl"><p className="text-gray-500 text-xs">Open Slots Today</p><p className="text-4xl font-bold">45</p></div></div>
            <div className="grid grid-cols-12 gap-10">
              <div className="col-span-8"><h3 className="text-xl font-bold mb-4">Appointment Queue</h3><div className="space-y-4">{appointments.slice(0,3).map((apt,i) => <div key={i} className="bg-white p-5 rounded-2xl flex gap-6"><div className="w-14 h-14 bg-gray-200 rounded-xl flex items-center justify-center">👤</div><div><h4 className="font-bold">Student {i+1}</h4><p className="text-sm text-gray-500">Visa Support</p></div><div className="flex gap-2"><button className="bg-gray-100 px-4 py-2 rounded-lg text-xs">Assign</button><button className="bg-[#FEB21A] px-4 py-2 rounded-lg text-xs font-bold">Approve</button></div></div>)}</div></div>
              <div className="col-span-4"><h3 className="text-xl font-bold mb-4">Staff Availability</h3><div className="space-y-3"><div className="bg-white p-4 rounded-2xl"><div className="flex justify-between"><span className="font-bold">James Smith</span><span className="text-green-600">Available</span></div><div className="h-1.5 bg-gray-100 rounded-full mt-2"><div className="h-full bg-green-500 w-1/2"></div></div></div><div className="bg-white p-4 rounded-2xl"><div className="flex justify-between"><span className="font-bold">Maria Tran</span><span className="text-orange-600">In Appointment</span></div><div className="h-1.5 bg-gray-100 rounded-full mt-2"><div className="h-full bg-orange-500 w-[85%]"></div></div></div></div></div>
            </div>
          </div>
        </main>
        <ChatbotWidget />
      </div>
    )
  }

  return <div>Loading...</div>
}