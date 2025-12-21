'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Home,
  Users,
  Calendar,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  Zap,
  ShoppingBag,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { UserRole } from '@/lib/types/database'

interface SidebarProps {
  organizationId: string
}

export function Sidebar({ organizationId }: SidebarProps) {
  const [role, setRole] = useState<UserRole | null>(null)
  const [open, setOpen] = useState(true)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    const loadUserRole = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: membership } = await supabase
        .from('memberships')
        .select('role')
        .eq('user_id', user.id)
        .eq('organization_id', organizationId)
        .eq('status', 'active')
        .single()

      if (membership) {
        setRole(membership.role as UserRole)
      }
    }

    loadUserRole()
  }, [organizationId, supabase])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/auth')
  }

  const baseItems = [
    { icon: Home, label: 'Dashboard', href: '/dashboard' },
    { icon: Zap, label: 'AI Studio', href: '/dashboard/image-gen' },
    { icon: ShoppingBag, label: 'Armour Studios', href: '/dashboard/studios' },
    { icon: Calendar, label: 'Calendar', href: '/dashboard/calendar' },
    { icon: FileText, label: 'Files', href: '/dashboard/files' },
  ]

  const roleItems = {
    owner: [
      { icon: Users, label: 'Team Management', href: '#' },
      { icon: Settings, label: 'Organization Settings', href: '#' },
      { icon: Users, label: 'Members & Roles', href: '#' },
    ],
    admin: [
      { icon: Users, label: 'Team Management', href: '#' },
      { icon: Settings, label: 'Organization Settings', href: '#' },
      { icon: Users, label: 'Members & Roles', href: '#' },
    ],
    manager: [
      { icon: Users, label: 'Team Management', href: '#' },
      { icon: Users, label: 'Team Members', href: '#' },
    ],
    coach: [
      { icon: Users, label: 'Team Members', href: '#' },
    ],
    player: [],
  }

  return [...baseItems, ...(roleItems[role!] || [])]
}

return (
  <>
    {/* Mobile toggle */}
    <button
      onClick={() => setOpen(!open)}
      className="fixed top-4 left-4 z-50 md:hidden p-2 hover:bg-slate-700 rounded-md"
    >
      {open ? <X size={24} /> : <Menu size={24} />}
    </button>

    {/* Sidebar */}
    <aside
      className={`fixed left-0 top-0 h-screen w-64 bg-slate-900 border-r border-slate-800 transition-transform duration-300 ${open ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 z-40`}
    >
      <div className="p-6 border-b border-slate-800">
        <h2 className="text-xl font-bold text-white">Armour Nexus</h2>
        {role && (
          <p className="text-xs text-slate-400 mt-1 capitalize">{role}</p>
        )}
      </div>

      <nav className="p-4 space-y-2">
        {role &&
          getMenuItems().map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex items-center gap-3 px-4 py-2 rounded-md text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
            >
              <item.icon size={18} />
              <span className="text-sm">{item.label}</span>
            </Link>
          ))}
      </nav>

      <div className="absolute bottom-4 left-4 right-4">
        <Button
          onClick={handleLogout}
          variant="outline"
          className="w-full flex items-center gap-2 border-slate-600 hover:bg-slate-800"
        >
          <LogOut size={16} />
          Sign Out
        </Button>
      </div>
    </aside>

    {/* Mobile overlay */}
    {open && (
      <div
        onClick={() => setOpen(false)}
        className="fixed inset-0 bg-black/50 z-30 md:hidden"
      />
    )}
  </>
)
}
