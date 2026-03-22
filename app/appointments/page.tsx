'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'
import { theme } from '@/lib/theme'
import { toast } from 'sonner'
import { ChevronDown, ChevronLeft, ChevronRight, CheckCircle, X, Calendar as CalendarIcon, Clock } from 'lucide-react'

export default function AppointmentsPage() {
  const router = useRouter()
  const supabase = createClient()
  const [user, setUser] = useState<any>(null)
  const [userProfile, setUserProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedOfficer, setSelectedOfficer] = useState('Dr. Sarah Jenkins - Academic')
  const [selectedDate, setSelectedDate] = useState<number | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [note, setNote] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [bookingId, setBookingId] = useState<string | null>(null)
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
  const [submitting, setSubmitting] = useState(false)

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

  const getOfficerName = (officer: string) => {
    return officer.split(' - ')[0]
  }

  const getOfficerRole = (officer: string) => {
    return officer.split(' - ')[1] || 'Support Officer'
  }

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

    // Log để kiểm tra
    console.log('Creating appointment:', {
      student_id: user.id,
      start_time: startDateTime.toISOString(),
      end_time: endDateTime.toISOString(),
      now: new Date().toISOString()
    })

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
      console.error('Supabase error:', error)
      toast.error(`Lỗi: ${error.message}`)
      return
    }

    console.log('Appointment saved:', data)
    setBookingId(data.id)
    setShowModal(true)
    toast.success('Đặt lịch thành công!')
    
    // Reset form
    setSelectedDate(null)
    setSelectedTime(null)
    setNote('')
    
    // Force reload dashboard với cache buster
    setTimeout(() => {
      window.location.href = '/dashboard/student?t=' + Date.now()
    }, 500)
    
  } catch (err) {
    console.error('Error:', err)
    toast.error('Có lỗi xảy ra')
  } finally {
    setSubmitting(false)
  }
}

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
    { time: '09:00', available: true },
    { time: '10:00', available: true },
    { time: '11:00', available: false },
    { time: '14:00', available: true },
    { time: '15:00', available: true },
    { time: '16:00', available: false },
  ]

  const officers = [
    'Dr. Sarah Jenkins - Academic',
    'Ms. Lan Nguyen - Visa Support',
    'Mr. John Doe - Financial',
  ]

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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: theme.colors.primary }}>
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  const role = userProfile?.role || 'student'

  return (
    <div className="min-h-screen bg-[#f9f9f9]">
      <Sidebar user={user} userProfile={userProfile} role={role} />
      
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
                {officers.map(officer => (
                  <option key={officer}>{officer}</option>
                ))}
              </select>
              <ChevronDown size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl font-headline font-extrabold text-[#020035] tracking-tight leading-tight mb-4">
            Book Appointment with <span className="text-[#FEB21A]">{getOfficerName(selectedOfficer)}</span>
          </h1>
          
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[#47464F] text-sm mb-6">
            <span className="flex items-center gap-1.5">
              <Clock size={16} /> Duration: 30 minutes
            </span>
            <span className="flex items-center gap-1.5">
              <CalendarIcon size={16} /> Time zone: GMT+7
            </span>
          </div>
          
          <p className="text-[#47464F] max-w-2xl leading-relaxed mb-10">
            Vui lòng chọn ngày và giờ phù hợp để thảo luận về kế hoạch học tập của bạn.
          </p>

          {/* Booking Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Calendar */}
            <div className="lg:col-span-7 bg-white rounded-2xl overflow-hidden shadow-md border border-gray-100">
              <div className="bg-[#020035] p-4 flex flex-wrap items-center justify-between gap-3 text-white">
                <div className="flex items-center gap-3">
                  <button onClick={prevMonth} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                    <ChevronLeft size={20} />
                  </button>
                  <div className="flex gap-2">
                    <select value={currentMonth} onChange={handleMonthChange} className="bg-white/10 border border-white/20 rounded-lg px-3 py-1.5 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-[#FEB21A]">
                      {months.map(month => (
                        <option key={month.value} value={month.value} className="text-[#020035]">{month.name}</option>
                      ))}
                    </select>
                    <select value={currentYear} onChange={handleYearChange} className="bg-white/10 border border-white/20 rounded-lg px-3 py-1.5 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-[#FEB21A]">
                      {years.map(year => (
                        <option key={year} value={year} className="text-[#020035]">{year}</option>
                      ))}
                    </select>
                  </div>
                  <button onClick={nextMonth} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
              <div className="p-5">
                <div className="grid grid-cols-7 text-center text-xs font-semibold text-gray-500 mb-3">
                  {weekDays.map(day => <div key={day}>{day}</div>)}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {days.map((day, idx) => {
                    if (day === null) return <div key={idx} className="h-12 flex items-center justify-center"></div>
                    
                    const available = isAvailableDate(day)
                    const booked = isBookedDate(day)
                    const isSelected = selectedDate === day
                    
                    if (booked) {
                      return (
                        <div key={idx} className="h-12 flex items-center justify-center">
                          <div className="w-full h-10 flex items-center justify-center bg-gray-100 text-gray-400 rounded-xl text-sm cursor-not-allowed">{day}</div>
                        </div>
                      )
                    }
                    if (isSelected) {
                      return (
                        <div key={idx} className="h-12 flex items-center justify-center">
                          <button className="w-full h-10 flex items-center justify-center bg-[#FEB21A] text-[#020035] font-bold rounded-xl shadow-md" onClick={() => setSelectedDate(day)}>{day}</button>
                        </div>
                      )
                    }
                    if (available) {
                      return (
                        <div key={idx} className="h-12 flex items-center justify-center">
                          <button className="w-full h-10 flex items-center justify-center bg-emerald-50 text-emerald-700 font-medium rounded-xl hover:bg-emerald-100 transition-all" onClick={() => { setSelectedDate(day); setSelectedTime(null) }}>{day}</button>
                        </div>
                      )
                    }
                    return (
                      <div key={idx} className="h-12 flex items-center justify-center">
                        <div className="w-full h-10 flex items-center justify-center text-gray-400 rounded-xl">{day}</div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Right: Time Slots */}
            <div className="lg:col-span-5">
              <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="font-headline font-bold text-xl text-[#020035]">
                      {selectedDate ? `${selectedDate}/${currentMonth + 1}/${currentYear}` : 'Chọn ngày'}
                    </h3>
                    <p className="text-xs font-medium text-gray-500 mt-1">Vui lòng chọn khung giờ trống</p>
                  </div>
                  <span className="text-[11px] font-bold text-[#020035] bg-[#FEB21A] px-3 py-1.5 rounded-full">
                    {timeSlots.filter(s => s.available).length} SLOTS
                  </span>
                </div>
                
                {!selectedDate ? (
                  <div className="text-center py-12 text-gray-400">
                    <CalendarIcon size={48} className="mx-auto mb-3 opacity-50" />
                    <p className="text-sm">Vui lòng chọn ngày trước</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
                    {timeSlots.map((slot, idx) => {
                      const isSelected = selectedTime === slot.time && slot.available
                      if (!slot.available) {
                        return (
                          <div key={idx} className="bg-gray-100 p-4 rounded-xl flex items-center justify-between opacity-60">
                            <div className="flex items-center gap-4">
                              <div className="w-14 h-14 bg-gray-200 rounded-xl flex items-center justify-center text-gray-500 font-bold text-lg">{slot.time}</div>
                              <div>
                                <p className="font-semibold text-gray-500">{slot.time} - {parseInt(slot.time) + 0.5}:{slot.time.slice(-2)}</p>
                                <p className="text-[11px] text-gray-400 font-medium mt-1">Đã đặt</p>
                              </div>
                            </div>
                            <X size={20} className="text-gray-400" />
                          </div>
                        )
                      }
                      if (isSelected) {
                        return (
                          <div key={idx} className="bg-[#FEB21A]/10 p-4 rounded-xl flex items-center justify-between border-2 border-[#FEB21A]">
                            <div className="flex items-center gap-4">
                              <div className="w-14 h-14 bg-[#FEB21A] text-[#020035] rounded-xl flex items-center justify-center font-bold text-lg shadow-inner">{slot.time}</div>
                              <div>
                                <p className="font-bold text-[#020035]">{slot.time} - {parseInt(slot.time) + 0.5}:{slot.time.slice(-2)}</p>
                                <p className="text-[11px] font-medium text-emerald-600 mt-1">Đã chọn</p>
                              </div>
                            </div>
                            <CheckCircle size={22} className="text-[#FEB21A]" />
                          </div>
                        )
                      }
                      return (
                        <div key={idx} className="bg-white p-4 rounded-xl flex items-center justify-between border border-gray-100 hover:border-[#FEB21A] hover:shadow-md transition-all cursor-pointer group" onClick={() => setSelectedTime(slot.time)}>
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-emerald-50 text-emerald-700 rounded-xl flex items-center justify-center font-bold text-lg group-hover:bg-[#FEB21A]/20 transition-all">{slot.time}</div>
                            <div>
                              <p className="font-semibold text-[#020035]">{slot.time} - {parseInt(slot.time) + 0.5}:{slot.time.slice(-2)}</p>
                              <p className="text-[11px] font-medium text-emerald-600 mt-1">Còn trống</p>
                            </div>
                          </div>
                          <div className="w-5 h-5 rounded-full border-2 border-gray-300 group-hover:border-[#FEB21A] group-hover:bg-[#FEB21A]/20 transition-all"></div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Note Section */}
          <div className="mt-10">
            <label className="font-headline font-bold text-[#020035] mb-3 block">Ghi chú cho cuộc hẹn</label>
            <textarea 
              className="w-full bg-white border border-gray-200 rounded-xl p-5 min-h-[120px] shadow-sm focus:ring-2 focus:ring-[#FEB21A]/30 focus:border-[#FEB21A] outline-none transition-all text-[#1a1c1c]"
              placeholder="Ghi chú cho cuộc hẹn (ví dụ: Cần mang theo giấy tờ...)"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>

          {/* Actions */}
          <div className="mt-12 flex flex-col md:flex-row items-center justify-between gap-6 border-t border-gray-200 pt-8">
            <div className="flex flex-col items-center md:items-start gap-3">
              <button onClick={() => router.back()} className="text-gray-500 font-medium hover:text-red-500 transition-colors text-sm underline underline-offset-4">Hủy bỏ</button>
              <p className="text-[11px] text-gray-400 italic leading-relaxed text-center md:text-left max-w-[280px]">Yêu cầu đặt lịch sẽ được xác nhận trong vòng 24 giờ làm việc qua email sinh viên.</p>
            </div>
            <button 
              className={`w-full md:w-auto px-12 py-4 rounded-xl font-headline font-bold text-lg tracking-wide shadow-lg transition-all ${selectedDate && selectedTime && !submitting ? 'bg-[#FEB21A] text-[#020035] hover:shadow-[#FEB21A]/30 hover:scale-[1.02] cursor-pointer' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
              onClick={handleConfirm}
              disabled={!selectedDate || !selectedTime || submitting}
            >
              {submitting ? 'Đang xử lý...' : 'XÁC NHẬN ĐẶT LỊCH'}
            </button>
          </div>

          <p className="mt-12 text-center text-[11px] text-gray-400 border-t border-gray-200 pt-6">Lịch hẹn được bảo mật theo quy định của ABC University.</p>
        </div>
      </main>

      {/* Success Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="relative bg-white rounded-3xl w-full max-w-md p-8 text-center shadow-2xl">
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
                  window.location.href = '/dashboard/student'
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
    </div>
  )
}