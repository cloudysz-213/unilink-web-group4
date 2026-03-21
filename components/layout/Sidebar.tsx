'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

// Theme colors
const theme = {
  colors: {
    primary: "#020035",
    secondary: "#FEB21A",
    error: "#BA1A1A",
  }
}

interface SidebarProps {
  user: any
  userProfile: any
  role: string
}

export default function Sidebar({ user, userProfile, role }: SidebarProps) {
  const pathname = usePathname()
  
  const navItems = {
    student: [
      { href: '/dashboard/student', icon: '📊', label: 'Dashboard' },
      { href: '/enquiry/new', icon: '💬', label: 'New Enquiry' },
      { href: '/appointments', icon: '📅', label: 'Appointments' },
      { href: '/profile', icon: '👤', label: 'Profile' },
      { href: '/search', icon: '🔍', label: 'Search' },
    ],
    admin_officer: [
      { href: '/dashboard/admin', icon: '📋', label: 'Queue' },
      { href: '/profile', icon: '👤', label: 'Profile' },
    ],
    sso: [
      { href: '/dashboard/sso', icon: '📋', label: 'Assigned Enquiries' },
      { href: '/profile', icon: '👤', label: 'Profile' },
    ],
    manager: [
      { href: '/dashboard/manager', icon: '📊', label: 'Analytics' },
      { href: '/profile', icon: '👤', label: 'Profile' },
    ],
  }

  const items = navItems[role as keyof typeof navItems] || navItems.student
  const displayName = userProfile?.full_name || user?.email?.split('@')[0] || 'User'
  const studentId = userProfile?.student_id || ''

  return (
    <aside className="h-screen w-64 fixed left-0 top-0 overflow-y-auto z-50" style={{ backgroundColor: theme.colors.primary }}>
      <div className="flex flex-col h-full py-8">
        {/* Brand */}
        <div className="px-8 mb-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center font-bold" style={{ backgroundColor: theme.colors.secondary, color: theme.colors.primary }}>
              🎓
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tighter leading-none text-white">UniLink</h1>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">ABC University</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1">
          {items.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-6 py-4 transition-all duration-300 ${
                  isActive
                    ? 'rounded-r-full mr-4 font-bold'
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`}
                style={isActive ? { backgroundColor: theme.colors.secondary, color: theme.colors.primary } : {}}
              >
                <span className="text-xl">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Profile Card */}
        <div className="px-6 mb-6">
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full border border-white/20 bg-white/5 flex items-center justify-center text-white text-xl">
                👤
              </div>
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 rounded-full" style={{ borderColor: theme.colors.primary }}></div>
            </div>
            <div className="overflow-hidden">
              <p className="text-white text-sm font-bold truncate">{displayName}</p>
              {studentId && (
                <p className="text-slate-400 text-[10px] font-medium">MSSV: {studentId}</p>
              )}
            </div>
          </div>
        </div>

        {/* Support CTA */}
        <div className="px-6 mt-auto">
          <div className="p-4 rounded-xl" style={{ backgroundColor: '#151546' }}>
            <p className="text-xs text-slate-400 mb-3">Need assistance?</p>
            <button className="w-full py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-medium transition-all">
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </aside>
  )
}