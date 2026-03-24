'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

export default function SignupPage() {
  const router = useRouter()
  const supabase = createClient()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [studentId, setStudentId] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            full_name: fullName,
            student_id: studentId,
          }
        }
      })

      if (error) {
        toast.error(error.message)
        setIsLoading(false)
        return
      }

      if (data.user) {
        await supabase
          .from('users')
          .upsert({
            id: data.user.id,
            email: email,
            full_name: fullName,
            student_id: studentId,
            role: 'student'
          })
      }

      toast.success('Đăng ký thành công! Vui lòng đăng nhập.')
      router.push('/login')
      
    } catch (err) {
      toast.error('Có lỗi xảy ra')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f9f9f9]">
      <header className="fixed top-0 w-full z-50 flex items-center justify-between px-6 h-16 bg-gradient-to-r from-[#020035] to-[#151546] shadow-lg">
        <div className="flex items-center gap-3">
          <span className="text-[#FEB21A] text-2xl">🎓</span>
          <span className="font-black text-white tracking-tight text-lg">UniLink</span>
        </div>
        <div className="absolute left-1/2 -translate-x-1/2 hidden md:block">
          <h1 className="font-black text-white tracking-tight text-sm uppercase opacity-90">UniLink - Student Enquiry & Appointment</h1>
        </div>
        <div className="flex items-center gap-4">
          <button className="text-slate-300 hover:text-[#FEB21A] transition-colors text-sm font-medium">Help</button>
          <div className="w-8 h-8 rounded-full bg-slate-300 flex items-center justify-center overflow-hidden text-slate-600">👤</div>
        </div>
      </header>

      <main className="min-h-screen pt-16 flex items-center justify-center px-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 -skew-x-12 transform origin-top translate-x-24 z-0"></div>
        <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-[#FEB21A]/5 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2 z-0"></div>

        <div className="w-full max-w-md z-10">
          <div className="bg-white p-8 md:p-10 rounded-2xl shadow-lg border border-slate-200">
            <div className="text-center mb-8">
              <h2 className="font-black text-3xl text-primary tracking-tight mb-2">Đăng ký</h2>
              <p className="text-slate-600 text-sm font-medium">Tạo tài khoản UniLink mới</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="text-xs font-black text-slate-500 uppercase tracking-wider ml-1">Họ và tên</label>
                <input className="w-full mt-1 px-4 py-3 border-b-2 border-slate-300 focus:border-[#FEB21A] outline-none" placeholder="Nguyễn Văn A" type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
              </div>

              <div>
                <label className="text-xs font-black text-slate-500 uppercase tracking-wider ml-1">Mã số sinh viên</label>
                <input className="w-full mt-1 px-4 py-3 border-b-2 border-slate-300 focus:border-[#FEB21A] outline-none" placeholder="SV20240001" type="text" value={studentId} onChange={(e) => setStudentId(e.target.value)} required />
              </div>

              <div>
                <label className="text-xs font-black text-slate-500 uppercase tracking-wider ml-1">Email</label>
                <input className="w-full mt-1 px-4 py-3 border-b-2 border-slate-300 focus:border-[#FEB21A] outline-none" placeholder="student@uni.edu.vn" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>

              <div>
                <label className="text-xs font-black text-slate-500 uppercase tracking-wider ml-1">Mật khẩu</label>
                <div className="relative mt-1">
                  <input className="w-full px-4 py-3 border-b-2 border-slate-300 focus:border-[#FEB21A] outline-none pr-10" placeholder="••••••••" type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} required />
                  <button type="button" className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400" onClick={() => setShowPassword(!showPassword)}>{showPassword ? '🙈' : '👁️'}</button>
                </div>
              </div>

              <button className="w-full bg-[#FEB21A] hover:brightness-110 text-primary font-black py-4 rounded-xl shadow-lg mt-6" type="submit" disabled={isLoading}>
                {isLoading ? 'Đang xử lý...' : 'ĐĂNG KÝ'}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-slate-600 text-sm">Đã có tài khoản? <Link href="/login" className="text-primary font-bold border-b-2 border-[#FEB21A]">Đăng nhập</Link></p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}