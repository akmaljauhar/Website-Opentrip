import { Link } from 'react-router-dom'
import { useEvents } from '../../hooks/useEvents'
import { Calendar, TrendingUp, Clock, CheckCircle, Plus } from 'lucide-react'

export default function Dashboard() {
  const { events: allEvents, loading } = useEvents()
  const upcoming = allEvents.filter((e) => e.status === 'open')
  const draft = allEvents.filter((e) => e.status === 'draft')
  const closed = allEvents.filter((e) => e.status === 'closed')
  const previous = allEvents.filter((e) => e.status === 'previous')

  const stats = [
    { label: 'Upcoming', value: upcoming.length, icon: Calendar, lightColor: 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400' },
    { label: 'Draft', value: draft.length, icon: Clock, lightColor: 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400' },
    { label: 'Closed', value: closed.length, icon: TrendingUp, lightColor: 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400' },
    { label: 'Previous', value: previous.length, icon: CheckCircle, lightColor: 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-extrabold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-500 dark:text-neutral-500 text-xs mt-0.5">Manage your events and track performance</p>
        </div>
        <Link
          to="/admin/events/new"
          className="bg-accent text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-accent-dark transition-all duration-200 flex items-center gap-2 shadow-sm shadow-accent/30"
        >
          <Plus size={18} />
          Create Event
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-card dark:bg-[#141414] rounded-xl p-4 border border-gray-100 dark:border-neutral-800 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${stat.lightColor}`}>
                <stat.icon size={18} />
              </div>
              <div>
                <p className="text-2xl font-extrabold text-gray-900 dark:text-white">
                  {loading ? '-' : stat.value}
                </p>
                <p className="text-xs text-gray-500 dark:text-neutral-500 font-medium">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-card dark:bg-[#141414] rounded-xl border border-gray-100 dark:border-neutral-800 overflow-hidden">
        <div className="px-5 py-3.5 border-b border-gray-100 dark:border-neutral-800 flex items-center justify-between">
          <h2 className="text-sm font-bold text-gray-900 dark:text-white">All Events</h2>
          <Link to="/admin/events" className="text-sm text-primary font-semibold flex items-center gap-1 hover:text-primary-light">
            View all
          </Link>
        </div>
        {loading ? (
          <div className="p-5 space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 bg-gray-100 dark:bg-neutral-800 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : allEvents.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-400 dark:text-neutral-600 text-sm">No events yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-neutral-800">
            {allEvents.slice(0, 5).map((event) => (
              <Link
                key={event.id}
                to={`/admin/events/edit/${event.id}`}
                className="flex items-center justify-between px-5 py-3 hover:bg-gray-50 dark:hover:bg-neutral-900/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary font-bold text-xs">
                    {event.title[0]}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{event.title}</p>
                    <p className="text-xs text-gray-400 dark:text-neutral-600">{event.event_dates?.length || 0} dates · {event.event_routes?.length || 0} routes</p>
                  </div>
                </div>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                  event.status === 'open' ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400' :
                  event.status === 'draft' ? 'bg-gray-100 dark:bg-neutral-800 text-gray-600 dark:text-neutral-400' :
                  event.status === 'closed' ? 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400' :
                  'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                }`}>
                  {event.status}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
