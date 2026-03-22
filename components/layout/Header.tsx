'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { Bell, HelpCircle, Plus, LogOut } from 'lucide-react'

const theme = {
  colors: {
    primary: "#020035",
    secondary: "#FEB21A",
    error: "#BA1A1A",
  }
}

interface HeaderProps {
  title: string
  subtitle?: string
  user: any
  userProfile: any
  hideGreeting?: boolean
}

export default function Header({ title, subtitle, user, userProfile, hideGreeting = false }: HeaderProps) {
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    toast.success('Logged out successfully')
    router.push('/login')
  }

  const displayName = userProfile?.full_name || user?.email?.split('@')[0] || 'Student'

  return (
    <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-10 fixed top-0 right-0 left-64 z-40">
      <div className="flex flex-col">
        <nav className="flex items-center text-[10px] uppercase tracking-wider text-slate-400 gap-2 mb-1">
          <span>Home</span>
          <span className="text-lg">›</span>
          <span className="text-[#FEB21A] font-bold">{title}</span>
        </nav>
        {!hideGreeting ? (
          <h2 className="text-2xl font-extrabold text-[#0A0521]">
            Xin chào, {displayName}
            {subtitle && <span className="text-sm font-normal text-slate-500 ml-2">{subtitle}</span>}
          </h2>
        ) : (
          <h2 className="text-2xl font-extrabold text-[#0A0521]">
            {title}
          </h2>
        )}
      </div>
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="relative cursor-pointer">
            <Bell size={22} className="text-slate-400" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </div>
          <HelpCircle size={22} className="text-slate-400 cursor-pointer" />
        </div>
        <div className="h-8 w-px bg-slate-200"></div>
        <Link
          href="/enquiry/new"
          className="bg-[#FEB21A] text-[#0A0521] px-6 py-2.5 rounded-lg font-bold flex items-center gap-2 hover:bg-orange-500 transition-all"
        >
          <Plus size={18} />
          New Enquiry
        </Link>
        <button
          className="flex items-center gap-2 text-slate-500 hover:text-red-500 transition-colors"
          onClick={handleLogout}
        >
          <LogOut size={18} />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </header>
  )
}