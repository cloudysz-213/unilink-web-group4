'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

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
}

export default function Header({ title, subtitle, user, userProfile }: HeaderProps) {
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    toast.success('Logged out successfully')
    router.push('/login')
  }

  const displayName = userProfile?.full_name || user?.email?.split('@')[0] || 'Student'

  return (
    <header className="fixed top-0 right-0 left-64 h-20 z-40 bg-white/60 backdrop-blur-md flex justify-between items-center px-8 w-full border-b border-outline-variant/20">
      <div className="flex flex-col">
        <nav className="flex items-center text-[10px] uppercase tracking-wider text-on-surface-variant gap-2 mb-1">
          <span>Home</span>
          <span className="text-lg">›</span>
          <span style={{ color: theme.colors.secondary }} className="font-bold">
            {title}
          </span>
        </nav>
        <h2 className="text-2xl font-extrabold leading-tight" style={{ color: theme.colors.primary }}>
          Xin chào, {displayName}
          {subtitle && <span className="text-sm font-normal text-on-surface-variant ml-2">{subtitle}</span>}
        </h2>
      </div>
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <button className="p-2.5 hover:bg-surface-container-low rounded-full transition-colors text-on-surface-variant relative text-2xl">
            🔔
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full" style={{ backgroundColor: theme.colors.error }}></span>
          </button>
          <button className="p-2.5 hover:bg-surface-container-low rounded-full transition-colors text-on-surface-variant text-2xl">
            ❓
          </button>
        </div>
        <div className="h-8 w-px bg-outline-variant/30"></div>
        <Link
          href="/enquiry/new"
          className="px-6 py-2.5 rounded-lg font-bold flex items-center gap-2 hover:shadow-lg transition-all active:scale-95"
          style={{ backgroundColor: theme.colors.secondary, color: theme.colors.primary }}
        >
          <span className="text-lg">➕</span>
          New Enquiry
        </Link>
        <button
          className="text-sm font-bold px-3 py-2 rounded-lg transition-all hover:bg-error/5"
          style={{ color: theme.colors.error }}
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </header>
  )
}