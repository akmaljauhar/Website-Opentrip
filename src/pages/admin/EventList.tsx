import { Link } from 'react-router-dom'
import { useEvents } from '../../hooks/useEvents'
import { DeleteDialog } from '../../components/admin/EventFormParts'
import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { Plus, Calendar, MapPin } from 'lucide-react'

interface Props {
  status?: 'open' | 'previous'
}

export default function EventList({ status }: Props) {
  const { events, loading, refetch } = useEvents(status)
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null)

  const handleDelete = async () => {
    if (!deleteTarget) return
    await supabase.from('events').delete().eq('id', deleteTarget.id)
    setDeleteTarget(null)
    refetch()
  }

  const title = status === 'previous' ? 'Past Events' : 'Upcoming Events'
  const description = status === 'previous'
    ? 'Events that have been completed'
    : 'Events currently open for registration'

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">{title}</h1>
          <p className="text-gray-500 text-sm mt-1">{description}</p>
        </div>
        <Link
          to="/admin/events/new"
          className="bg-accent text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-accent-dark transition-all duration-200 flex items-center gap-2 shadow-sm shadow-accent/30"
        >
          <Plus size={18} />
          Create Event
        </Link>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-card rounded-2xl animate-pulse border border-gray-100" />
          ))}
        </div>
      ) : events.length === 0 ? (
        <div className="bg-card rounded-2xl border border-gray-100 p-12 text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Calendar size={28} className="text-primary" />
          </div>
          <p className="text-gray-500 font-medium mb-2">No events found</p>
          <Link to="/admin/events/new" className="text-primary text-sm font-semibold hover:text-primary-light">
            Create an event →
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {events.map((event) => (
            <div
              key={event.id}
              className="bg-card rounded-2xl border border-gray-100 p-5 flex items-center justify-between hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary font-bold text-lg">
                  {event.title[0]}
                </div>
                <div>
                  <p className="font-bold text-gray-900">{event.title}</p>
                  <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                    <span className="flex items-center gap-1">
                      <Calendar size={12} /> {event.event_dates?.length || 0} dates
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin size={12} /> {event.event_routes?.length || 0} routes
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Link
                  to={`/admin/events/edit/${event.id}`}
                  className="text-sm text-primary font-semibold hover:text-primary-light px-4 py-2 rounded-xl hover:bg-primary/5 transition-colors"
                >
                  Edit
                </Link>
                <button
                  onClick={() => setDeleteTarget({ id: event.id, title: event.title })}
                  className="text-sm text-red-500 font-semibold hover:text-red-600 px-4 py-2 rounded-xl hover:bg-red-50 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <DeleteDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title={deleteTarget?.title || ''}
      />
    </div>
  )
}
