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
  
  // Menu theo role - GIỐNG UI STITCH
  const navItems = {
    student: [
      { href: '/dashboard/student', icon: 'dashboard', label: 'Dashboard' },
      { href: '/enquiry/new', icon: 'forum', label: 'My Enquiries' },
      { href: '/appointments', icon: 'calendar_month', label: 'Appointments' },
      { href: '/profile', icon: 'person', label: 'Profile' },
      { href: '/search', icon: 'search', label: 'Knowledge Base' },
    ],
    admin_officer: [
      { href: '/dashboard/admin', icon: 'dashboard', label: 'Dashboard' },
      { href: '/appointments', icon: 'calendar_month', label: 'Appointments' },
      { href: '/profile', icon: 'person', label: 'Profile' },
      { href: '/settings', icon: 'settings', label: 'Settings' },
    ],
    sso: [
      { href: '/dashboard/sso', icon: 'assignment_late', label: 'Assigned Enquiries' },
      { href: '/appointments', icon: 'calendar_month', label: 'Appointments' },
      { href: '/profile', icon: 'person', label: 'Profile' },
      { href: '/settings', icon: 'settings', label: 'Settings' },
    ],
    manager: [
      { href: '/dashboard/manager', icon: 'analytics', label: 'Analytics' },
      { href: '/appointments', icon: 'calendar_month', label: 'Appointments' },
      { href: '/profile', icon: 'person', label: 'Profile' },
      { href: '/settings', icon: 'settings', label: 'Settings' },
    ],
  }

  const items = navItems[role as keyof typeof navItems] || navItems.student
  const displayName = userProfile?.full_name || user?.email?.split('@')[0] || 'User'
  const studentId = userProfile?.student_id || ''

  const isActive = (href: string) => {
    if (href === '/dashboard/student' && pathname === '/dashboard/student') return true
    if (href === '/dashboard/admin' && pathname === '/dashboard/admin') return true
    if (href === '/dashboard/sso' && pathname === '/dashboard/sso') return true
    if (href === '/dashboard/manager' && pathname === '/dashboard/manager') return true
    if (href === '/enquiry/new' && pathname === '/enquiry/new') return true
    if (href === '/appointments' && pathname === '/appointments') return true
    if (href === '/profile' && pathname === '/profile') return true
    if (href === '/search' && pathname === '/search') return true
    if (href === '/settings' && pathname === '/settings') return true
    return false
  }

  // Hàm render icon từ material-symbols-outlined
  const renderIcon = (iconName: string) => {
    return (
      <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 0", fontSize: '24px' }}>
        {iconName}
      </span>
    )
  }

  // Xác định title cho portal
  const getPortalTitle = () => {
    switch (role) {
      case 'admin_officer': return 'ADMIN PORTAL'
      case 'sso': return 'SSO PORTAL'
      case 'manager': return 'MANAGER PORTAL'
      default: return 'STUDENT PORTAL'
    }
  }

  return (
    <aside className="h-screen w-64 fixed left-0 top-0 overflow-y-auto z-50" style={{ backgroundColor: theme.colors.primary }}>
      <div className="flex flex-col h-full py-8">
        {/* Brand - Giống UI Stitch */}
        <div className="px-6 mb-10">
          <h1 className="text-xl font-bold text-white tracking-widest uppercase">UniLink</h1>
          <p className="text-[10px] text-[#FEB21A] font-bold tracking-[0.2em] mt-1">{getPortalTitle()}</p>
        </div>

        {/* Navigation - Giống UI Stitch */}
        <nav className="flex-1 space-y-1">
          {items.map((item) => {
            const active = isActive(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-6 py-4 transition-all duration-300 ${
                  active
                    ? 'bg-[#FEB21A] text-[#020035] font-bold rounded-r-full mr-4'
                    : 'text-slate-300 hover:text-white hover:bg-[#151546]'
                }`}
              >
                {renderIcon(item.icon)}
                <span className="font-medium text-sm">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Logout - Giống UI Stitch */}
        <div className="mt-auto px-6">
          <button
            onClick={async () => {
              const { createClient } = await import('@/lib/supabase/client')
              const supabase = createClient()
              await supabase.auth.signOut()
              window.location.href = '/login'
            }}
            className="flex items-center gap-3 py-4 text-slate-300 hover:text-white transition-colors w-full"
          >
            <span className="material-symbols-outlined text-xl">logout</span>
            <span className="font-medium text-sm">Logout</span>
          </button>
        </div>
      </div>
    </aside>
  )
}