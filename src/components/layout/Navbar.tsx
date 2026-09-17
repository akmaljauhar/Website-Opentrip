import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, ChevronRight } from 'lucide-react'
import Logo from './Logo'

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const isAdmin = location.pathname.startsWith('/admin')

  if (isAdmin) return null

  return (
    <nav className="bg-primary/95 backdrop-blur-md sticky top-0 z-50 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Logo white className="h-9 w-auto" />
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
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  location.pathname === item.to
                    ? 'bg-white text-primary'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="text-white p-2"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-white/10 bg-primary">
          <div className="px-4 py-4 space-y-1">
            {[
              { to: '/', label: 'Home' },
              { to: '/events', label: 'Events' },
              { to: '/previous-events', label: 'Past Events' },
            ].map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="flex items-center justify-between py-3 px-4 text-white/90 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                <span className="font-medium">{item.label}</span>
                <ChevronRight size={16} className="text-white/40" />
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}
