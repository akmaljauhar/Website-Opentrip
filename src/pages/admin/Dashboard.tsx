import { Link } from 'react-router-dom'
import { useEvents } from '../../hooks/useEvents'
import { Calendar, Clock, CheckCircle, Plus } from 'lucide-react'

export default function Dashboard() {
  const { events: allEvents, loading } = useEvents()
  const upcoming = allEvents.filter((e) => e.status === 'open')
  const draft = allEvents.filter((e) => e.status === 'draft')
  const previous = allEvents.filter((e) => e.status === 'previous')

  const stats = [
    { label: 'Upcoming', value: upcoming.length, icon: Calendar, lightColor: 'bg-green-50 text-green-700' },
    { label: 'Draft', value: draft.length, icon: Clock, lightColor: 'bg-amber-50 text-amber-700' },
    { label: 'Previous', value: previous.length, icon: CheckCircle, lightColor: 'bg-blue-50 text-blue-700' },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-extrabold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 text-xs mt-0.5">Manage your events and track performance</p>
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
          <div key={stat.label} className="bg-card rounded-xl p-4 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${stat.lightColor}`}>
                <stat.icon size={18} />
              </div>
              <div>
                <p className="text-2xl font-extrabold text-gray-900">
                  {loading ? '-' : stat.value}
                </p>
                <p className="text-xs text-gray-500 font-medium">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-card rounded-xl border border-gray-100 overflow-hidden">
        <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-sm font-bold text-gray-900">All Events</h2>
          <Link to="/admin/events" className="text-sm text-primary font-semibold flex items-center gap-1 hover:text-primary-light">
            View all
          </Link>
        </div>
        {loading ? (
          <div className="p-5 space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 bg-gray-100 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : allEvents.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-400 text-sm">No events yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {allEvents.slice(0, 5).map((event) => (
              <Link
                key={event.id}
                to={`/admin/events/edit/${event.id}`}
                className="flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary font-bold text-xs">
                    {event.title[0]}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{event.title}</p>
                    <p className="text-xs text-gray-400">{event.event_dates?.length || 0} dates · {event.event_routes?.length || 0} routes</p>
                  </div>
                </div>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                  event.status === 'open' ? 'bg-green-50 text-green-700' :
                  event.status === 'draft' ? 'bg-gray-100 text-gray-600' :
                  'bg-blue-50 text-blue-700'
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
