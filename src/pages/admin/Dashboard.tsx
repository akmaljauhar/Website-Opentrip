import { Link } from 'react-router-dom'
import { useEvents } from '../../hooks/useEvents'
import { Calendar, TrendingUp, Clock, CheckCircle, Plus, ArrowRight } from 'lucide-react'

export default function Dashboard() {
  const { events: allEvents, loading } = useEvents()
  const upcoming = allEvents.filter((e) => e.status === 'open')
  const draft = allEvents.filter((e) => e.status === 'draft')
  const closed = allEvents.filter((e) => e.status === 'closed')
  const previous = allEvents.filter((e) => e.status === 'previous')

  const stats = [
    { label: 'Upcoming', value: upcoming.length, icon: Calendar, lightColor: 'bg-green-50 text-green-700' },
    { label: 'Draft', value: draft.length, icon: Clock, lightColor: 'bg-amber-50 text-amber-700' },
    { label: 'Closed', value: closed.length, icon: TrendingUp, lightColor: 'bg-red-50 text-red-700' },
    { label: 'Previous', value: previous.length, icon: CheckCircle, lightColor: 'bg-blue-50 text-blue-700' },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your events and track performance</p>
        </div>
        <Link
          to="/admin/events/new"
          className="bg-accent text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-accent-light transition-all duration-200 flex items-center gap-2 shadow-sm shadow-accent/20"
        >
          <Plus size={18} />
          Create Event
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-card rounded-2xl p-5 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl ${stat.lightColor}`}>
                <stat.icon size={22} />
              </div>
              <div>
                <p className="text-3xl font-extrabold text-gray-900">
                  {loading ? '-' : stat.value}
                </p>
                <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-card rounded-2xl border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">All Events</h2>
          <Link to="/admin/events" className="text-sm text-primary font-semibold flex items-center gap-1 hover:text-primary-light">
            View all <ArrowRight size={14} />
          </Link>
        </div>
        {loading ? (
          <div className="p-6 space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-14 bg-gray-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : allEvents.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Calendar size={28} className="text-primary" />
            </div>
            <p className="text-gray-500 font-medium mb-2">No events yet</p>
            <Link to="/admin/events/new" className="text-primary text-sm font-semibold hover:text-primary-light">
              Create your first event →
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {allEvents.slice(0, 5).map((event) => {
              const statusColors: Record<string, string> = {
                draft: 'bg-gray-100 text-gray-600',
                open: 'bg-green-50 text-green-700 ring-1 ring-green-200',
                closed: 'bg-red-50 text-red-700 ring-1 ring-red-200',
                previous: 'bg-blue-50 text-blue-700 ring-1 ring-blue-200',
              }
              return (
                <div key={event.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary font-bold text-sm">
                      {event.title[0]}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{event.title}</p>
                      <p className="text-xs text-gray-500">
                        {event.event_dates?.length || 0} dates · {event.event_routes?.length || 0} routes
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusColors[event.status]}`}>
                      {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                    </span>
                    <Link
                      to={`/admin/events/edit/${event.id}`}
                      className="text-sm text-primary font-semibold hover:text-primary-light px-3 py-1.5 rounded-lg hover:bg-primary/5 transition-colors"
                    >
                      Edit
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
