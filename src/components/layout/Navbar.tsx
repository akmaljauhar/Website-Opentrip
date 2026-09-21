import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, ChevronRight, Moon, Sun } from 'lucide-react'
import { useTheme } from '../../hooks/useTheme'
import Logo from './Logo'

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const { dark, toggle } = useTheme()
  const isAdmin = location.pathname.startsWith('/admin')

  if (isAdmin) return null

  return (
    <nav className="bg-card dark:bg-[#141414] sticky top-0 z-50 border-b border-gray-200 dark:border-neutral-800 shadow-sm transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Logo className="h-9 w-auto" />
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-1">
            {[
              { to: '/', label: 'Home' },
              { to: '/events', label: 'Events' },
              { to: '/previous-events', label: 'Past Events' },
            ].map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                  location.pathname === item.to
                    ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                    : 'text-gray-600 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-neutral-800'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggle}
              className="p-2 rounded-full text-gray-600 dark:text-neutral-400 hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors"
              aria-label="Toggle dark mode"
            >
              {dark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden text-gray-700 dark:text-neutral-300 p-2"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-neutral-800 bg-card dark:bg-[#141414]">
          <div className="px-4 py-4 space-y-1">
            {[
              { to: '/', label: 'Home' },
              { to: '/events', label: 'Events' },
              { to: '/previous-events', label: 'Past Events' },
            ].map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="flex items-center justify-between py-3 px-4 text-gray-700 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-xl transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                <span className="font-semibold">{item.label}</span>
                <ChevronRight size={16} className="text-gray-400 dark:text-neutral-600" />
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}
