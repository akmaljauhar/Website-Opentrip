import { useState } from 'react'
import { Outlet, Navigate, Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { LayoutDashboard, Calendar, LogOut, ChevronLeft, Settings, Menu, X } from 'lucide-react'
import Logo from './Logo'

export default function AdminLayout() {
  const { isAdmin, loading, logout } = useAuth()
  const location = useLocation()
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />
  }

  const navItems = [
    { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
    { to: '/admin/events', label: 'Events', icon: Calendar },
    { to: '/admin/events/previous', label: 'Past Events', icon: Calendar },
    { to: '/admin/settings', label: 'Settings', icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-surface">
      <nav className="bg-[#1c1c1c] border-b border-white/10 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-14 items-center">
            <div className="flex items-center gap-3">
              <Link to="/" className="text-white/60 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors">
                <ChevronLeft size={20} />
              </Link>
              <div className="h-6 w-px bg-white/10 hidden sm:block" />
              <Logo className="h-7 w-auto" />
              <span className="text-xs font-semibold text-accent bg-accent/10 px-2.5 py-1 rounded-full border border-accent/20 hidden sm:inline-block">
                Admin
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={logout}
                className="text-white/60 hover:text-white flex items-center gap-2 text-sm font-medium px-3 py-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <LogOut size={16} />
                <span className="hidden sm:inline">Logout</span>
              </button>
              <button
                onClick={() => setMobileNavOpen(!mobileNavOpen)}
                className="md:hidden text-white/60 hover:text-white p-2 rounded-lg hover:bg-white/10"
              >
                {mobileNavOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {mobileNavOpen && (
          <div className="md:hidden border-t border-white/10 bg-[#1c1c1c]">
            <div className="px-4 py-3 space-y-1">
              {navItems.map((item) => {
                const isActive = item.exact
                  ? location.pathname === item.to
                  : location.pathname.startsWith(item.to)
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setMobileNavOpen(false)}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                      isActive
                        ? 'bg-accent text-white'
                        : 'text-white/60 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <item.icon size={18} />
                    {item.label}
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row gap-6">
          <aside className="hidden md:block md:w-48 flex-shrink-0">
            <nav className="space-y-1">
              {navItems.map((item) => {
                const isActive = item.exact
                  ? location.pathname === item.to
                  : location.pathname.startsWith(item.to)
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                      isActive
                        ? 'bg-primary text-white shadow-sm'
                        : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <item.icon size={18} />
                    {item.label}
                  </Link>
                )
              })}
            </nav>
          </aside>

          <main className="flex-1 min-w-0">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}
