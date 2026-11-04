import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import Logo from '../../components/layout/Logo'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate('/admin')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      <div className="lg:w-[45%] bg-primary relative flex flex-col items-center justify-start px-8 pt-[28vh] pb-10 lg:px-14 lg:pt-[30vh] lg:pb-12 overflow-hidden">
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 400 800"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden="true"
        >
          <path
            id="route1"
            d="M-20 180 C 80 120, 220 220, 420 140"
            fill="none"
            stroke="rgba(255,255,255,0.5)"
            strokeWidth="1.2"
            strokeDasharray="5 9"
          >
            <animate
              attributeName="stroke-dashoffset"
              from="0"
              to="-56"
              dur="6s"
              repeatCount="indefinite"
            />
          </path>
          <path
            id="route2"
            d="M-20 480 C 120 400, 260 560, 420 440"
            fill="none"
            stroke="rgba(255,255,255,0.42)"
            strokeWidth="1"
            strokeDasharray="5 9"
          >
            <animate
              attributeName="stroke-dashoffset"
              from="0"
              to="-56"
              dur="8s"
              repeatCount="indefinite"
            />
          </path>
          <path
            id="route3"
            d="M-20 680 C 100 620, 240 720, 420 640"
            fill="none"
            stroke="rgba(255,255,255,0.35)"
            strokeWidth="1.2"
            strokeDasharray="5 9"
          >
            <animate
              attributeName="stroke-dashoffset"
              from="0"
              to="-56"
              dur="10s"
              repeatCount="indefinite"
            />
          </path>

          <g fill="rgba(255,255,255,0.85)">
            <path d="M0 -5 L10 0 L0 5 L2 0 Z">
              <animateMotion dur="14s" repeatCount="indefinite" rotate="auto">
                <mpath href="#route1" />
              </animateMotion>
            </path>
          </g>
          <g fill="rgba(255,255,255,0.75)">
            <path d="M0 -5 L10 0 L0 5 L2 0 Z">
              <animateMotion dur="18s" repeatCount="indefinite" rotate="auto">
                <mpath href="#route2" />
              </animateMotion>
            </path>
          </g>
          <g fill="rgba(255,255,255,0.65)">
            <path d="M0 -5 L10 0 L0 5 L2 0 Z">
              <animateMotion dur="22s" repeatCount="indefinite" rotate="auto">
                <mpath href="#route3" />
              </animateMotion>
            </path>
          </g>

          <g fill="rgba(255,255,255,0.85)">
            <circle cx="90" cy="155" r="3" />
            <circle cx="310" cy="165" r="3" />
            <circle cx="150" cy="445" r="3" />
            <circle cx="330" cy="470" r="3" />
            <circle cx="110" cy="655" r="3" />
          </g>
          <g fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1.2">
            <circle cx="90" cy="155" r="6">
              <animate attributeName="r" values="6;12;6" dur="3s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.5;0;0.5" dur="3s" repeatCount="indefinite" />
            </circle>
            <circle cx="330" cy="470" r="6">
              <animate attributeName="r" values="6;12;6" dur="4s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.5;0;0.5" dur="4s" repeatCount="indefinite" />
            </circle>
            <circle cx="110" cy="655" r="6">
              <animate attributeName="r" values="6;12;6" dur="3.5s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.5;0;0.5" dur="3.5s" repeatCount="indefinite" />
            </circle>
          </g>
        </svg>

        <div className="hidden lg:block max-w-sm self-start w-full relative z-10">
          <div className="w-10 h-px bg-accent mb-6" />
          <p className="text-white/70 text-lg leading-relaxed font-light">
            Manage events, registrations, and trips from a single dashboard.
          </p>
        </div>
        <p className="hidden lg:block absolute bottom-12 z-10 text-white/30 text-xs tracking-wide">
          &copy; {new Date().getFullYear()} Citravel
        </p>
      </div>

      <div className="flex-1 relative flex items-center justify-center bg-surface px-6 py-8 lg:px-16 lg:py-10">
        <div className="absolute top-8 right-6 lg:top-10 lg:right-16">
          <Logo className="h-11 w-auto" />
        </div>
        <div className="w-full max-w-sm">
          <p className="text-accent text-[11px] font-semibold uppercase tracking-[0.2em] mb-3">
            Admin Access
          </p>
          <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
            Welcome back
          </h1>
          <p className="text-gray-400 text-sm mt-1.5 mb-9">
            Sign in to continue to your dashboard.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-50 border-l-2 border-red-500 text-red-700 text-sm px-4 py-3">
                {error}
              </div>
            )}
            <div>
              <label
                htmlFor="email"
                className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-2"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-0 py-2.5 bg-transparent border-0 border-b border-gray-200 text-gray-900 placeholder-gray-300 focus:outline-none focus:border-primary transition-colors text-sm"
                placeholder="admin@citravel.com"
                required
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-2"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-0 py-2.5 bg-transparent border-0 border-b border-gray-200 text-gray-900 placeholder-gray-300 focus:outline-none focus:border-primary transition-colors text-sm"
                placeholder="••••••••"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-3 font-medium text-sm tracking-wide hover:bg-primary-dark transition-colors disabled:opacity-50 mt-2"
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
