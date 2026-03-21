'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'
import { toast } from 'sonner'
import { theme } from '@/lib/theme'

export default function AppointmentsPage() {
  const router = useRouter()
  const supabase = createClient()
  const [user, setUser] = useState<any>(null)
  const [userProfile, setUserProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedOfficer, setSelectedOfficer] = useState('')
  const [selectedDate, setSelectedDate] = useState<number | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [note, setNote] = useState('')

  const officers = [
    { id: 1, name: 'Dr. Sarah Jenkins', role: 'Academic Advisor' },
    { id: 2, name: 'Ms. Lan Nguyen', role: 'Visa Support' },
    { id: 3, name: 'Mr. John Doe', role: 'Financial Aid' },
  ]

  const timeSlots = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00']

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

  const handleConfirm = async () => {
    if (!selectedOfficer || !selectedDate || !selectedTime) {
      toast.error('Please select officer, date and time')
      return
    }
    
    toast.success('Appointment booked successfully!')
    // TODO: Save to database
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
    <div className="min-h-screen bg-gray-50">
      <Sidebar user={user} userProfile={userProfile} role={role} />
      
      <main className="ml-64 min-h-screen relative">
        <Header title="Appointments" subtitle="Book a meeting" user={user} userProfile={userProfile} />
        
        <div className="pt-28 pb-12 px-8 max-w-6xl mx-auto">
          {/* Officer Selection */}
          <div className="mb-8">
            <label className="block text-sm font-bold mb-2" style={{ color: theme.colors.primary }}>
              Select Support Officer
            </label>
            <select
              className="w-full max-w-md border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:outline-none"
              style={{ focusRingColor: theme.colors.secondary }}
              value={selectedOfficer}
              onChange={(e) => setSelectedOfficer(e.target.value)}
            >
              <option value="">Choose an officer...</option>
              {officers.map(officer => (
                <option key={officer.id} value={officer.name}>
                  {officer.name} - {officer.role}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Calendar */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-bold mb-4" style={{ color: theme.colors.primary }}>Select Date</h3>
              <div className="grid grid-cols-7 gap-2 text-center mb-4">
                {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map(day => (
                  <div key={day} className="text-xs font-bold text-gray-400">{day}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-2 text-center">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30].map(day => (
                  <button
                    key={day}
                    onClick={() => setSelectedDate(day)}
                    className={`p-2 rounded-lg transition-all ${
                      selectedDate === day
                        ? 'text-white font-bold'
                        : 'hover:bg-gray-100'
                    }`}
                    style={selectedDate === day ? { backgroundColor: theme.colors.secondary, color: theme.colors.primary } : {}}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>

            {/* Time Slots */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-bold mb-4" style={{ color: theme.colors.primary }}>Select Time</h3>
              <div className="grid grid-cols-2 gap-3">
                {timeSlots.map(time => (
                  <button
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    className={`p-3 rounded-xl border transition-all ${
                      selectedTime === time
                        ? 'border-2 font-bold'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    style={selectedTime === time ? { borderColor: theme.colors.secondary, backgroundColor: `${theme.colors.secondary}10` } : {}}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Note */}
          <div className="mt-8">
            <label className="block text-sm font-bold mb-2" style={{ color: theme.colors.primary }}>
              Note (optional)
            </label>
            <textarea
              className="w-full border border-gray-200 rounded-xl p-4 focus:ring-2 focus:outline-none"
              rows={3}
              placeholder="Add any additional information..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              style={{ focusRingColor: theme.colors.secondary }}
            />
          </div>

          {/* Actions */}
          <div className="mt-8 flex gap-4">
            <button
              onClick={handleConfirm}
              className="px-8 py-3 rounded-xl font-bold transition-all hover:brightness-95"
              style={{ backgroundColor: theme.colors.secondary, color: theme.colors.primary }}
            >
              Confirm Booking
            </button>
            <button
              onClick={() => router.back()}
              className="px-8 py-3 rounded-xl border border-gray-300 font-bold hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}