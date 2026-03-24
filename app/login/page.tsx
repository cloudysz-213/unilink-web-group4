'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      })

      if (error) {
        toast.error('Sai email hoặc mật khẩu')
        setIsLoading(false)
        return
      }

      // Lấy role từ bảng users
      const { data: profile } = await supabase
        .from('users')
        .select('role')
        .eq('id', data.user.id)
        .single()

      const role = profile?.role || 'student'
      
      const redirectMap: Record<string, string> = {
        student: '/dashboard/student',
        admin_officer: '/dashboard/admin',
        sso: '/dashboard/sso',
        manager: '/dashboard/manager',
        director: '/dashboard/manager',
      }

      const redirectPath = redirectMap[role] || '/dashboard/student'
      
      toast.success('Đăng nhập thành công!')
      router.push(redirectPath)
      
    } catch (err) {
      toast.error('Có lỗi xảy ra, vui lòng thử lại')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f9f9f9]">
      {/* Top Navigation */}
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
          <div className="w-8 h-8 rounded-full bg-slate-300 flex items-center justify-center overflow-hidden text-slate-600">
            👤
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="min-h-screen pt-16 flex items-center justify-center px-4 relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 -skew-x-12 transform origin-top translate-x-24 z-0"></div>
        <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-[#FEB21A]/5 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2 z-0"></div>

        {/* Login Card */}
        <div className="w-full max-w-md z-10">
          <div className="bg-white p-8 md:p-10 rounded-2xl shadow-lg border border-slate-200">
            <div className="text-center mb-10">
              <h2 className="font-black text-3xl text-primary tracking-tight mb-2">Đăng nhập</h2>
              <p className="text-slate-600 text-sm font-medium">Chào mừng bạn quay lại hệ thống UniLink</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-500 uppercase tracking-wider ml-1">Mã sinh viên / Email</label>
                <div className="relative group">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#FEB21A] transition-colors">👤</span>
                  <input 
                    className="w-full pl-11 pr-4 py-3.5 bg-white border-b-2 border-slate-300 focus:border-[#FEB21A] focus:ring-0 transition-all outline-none text-slate-900 placeholder:text-slate-400 font-medium"
                    placeholder="SV123456 hoặc student@uni.edu.vn" 
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-500 uppercase tracking-wider ml-1">Mật khẩu</label>
                <div className="relative group">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#FEB21A] transition-colors">🔒</span>
                  <input 
                    className="w-full pl-11 pr-12 py-3.5 bg-white border-b-2 border-slate-300 focus:border-[#FEB21A] focus:ring-0 transition-all outline-none text-slate-900 placeholder:text-slate-400 font-medium"
                    placeholder="••••••••" 
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button 
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors"
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              {/* Options */}
              <div className="flex items-center justify-between py-2">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-[#FEB21A] focus:ring-[#FEB21A]"
                  />
                  <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900 transition-colors">Nhớ mật khẩu</span>
                </label>
                <a className="text-sm font-bold text-[#FEB21A] hover:opacity-80 transition-opacity" href="#">
                  Quên mật khẩu?
                </a>
              </div>

              {/* Login Button */}
              <button 
                className="w-full bg-[#FEB21A] hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed text-primary font-black py-4 rounded-xl shadow-lg hover:shadow-[#FEB21A]/40 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? 'Đang đăng nhập...' : 'ĐĂNG NHẬP'}
                {!isLoading && <span>→</span>}
              </button>
            </form>

            {/* Sign Up Link - ĐÃ SỬA */}
            <div className="mt-10 text-center">
              <p className="text-slate-600 text-sm font-medium">
                Chưa có tài khoản? 
                <Link href="/signup" className="text-primary font-black border-b-2 border-[#FEB21A] ml-1 transition-all hover:bg-[#FEB21A]/10 px-1">
                  Đăng ký
                </Link>
              </p>
            </div>
          </div>

          {/* Support Info */}
          <div className="mt-8 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-4 px-2">
            <div className="flex items-center gap-2 text-slate-600 text-xs font-medium">
              <span>ℹ️</span>
              Hỗ trợ kỹ thuật: support@unilink.edu.vn
            </div>
            <div className="flex gap-4">
              <a className="text-xs font-medium text-slate-500 hover:text-primary transition-colors" href="#">Bảo mật</a>
              <a className="text-xs font-medium text-slate-500 hover:text-primary transition-colors" href="#">Điều khoản</a>
            </div>
          </div>
        </div>
      </main>

      {/* Floating Chat Button */}
      <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end gap-3 group">
        <div className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium shadow-xl opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-300">
          Hỏi nhanh
        </div>
        <button className="w-14 h-14 bg-[#020035] rounded-full flex items-center justify-center text-white shadow-2xl hover:scale-110 active:scale-95 transition-all relative font-bold text-2xl">
          💬
          <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-[#FEB21A] border-2 border-white rounded-full"></span>
        </button>
      </div>
    </div>
  )
}