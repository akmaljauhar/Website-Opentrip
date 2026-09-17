import { useEvent } from '../../hooks/useEvent'
import { getSupabaseImageUrl } from '../../lib/supabase'
import { Calendar, MapPin, IndianRupee, ExternalLink, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function EventDetail() {
  const { event, loading, error } = useEvent()

  if (loading) {
    return (
      <div className="bg-surface min-h-screen">
        <div className="bg-primary py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="animate-pulse space-y-4">
              <div className="h-6 bg-white/10 rounded w-32" />
              <div className="h-10 bg-white/10 rounded w-1/2" />
            </div>
          </div>
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse space-y-6">
            <div className="bg-gray-200 rounded-2xl h-80" />
            <div className="h-6 bg-gray-200 rounded w-1/3" />
            <div className="h-4 bg-gray-200 rounded w-3/4" />
          </div>
        </div>
      </div>
    )
  }

  if (error || !event) {
    return (
      <div className="bg-surface min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-6xl font-extrabold text-primary/20 mb-4">404</h1>
          <p className="text-gray-500 text-lg mb-6">Event not found.</p>
          <Link to="/events" className="inline-flex items-center gap-2 text-primary font-semibold hover:text-primary-light">
            <ArrowLeft size={18} /> Back to Events
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-surface min-h-screen">
      <div className="bg-primary relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
          {event.banner_url && (
            <img
              src={getSupabaseImageUrl(event.banner_url)}
              alt=""
              className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-30"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
            />
          )}
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Link to="/events" className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm mb-6 transition-colors">
            <ArrowLeft size={16} /> All Events
          </Link>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">{event.title}</h1>
          {event.event_dates?.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 text-white/70">
              <Calendar size={18} />
              {event.event_dates
                .sort((a, b) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime())
                .map((date, i) => (
                  <span key={date.id}>
                    {new Date(date.event_date).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                    {i < event.event_dates.length - 1 && <span className="mx-1">·</span>}
                  </span>
                ))
              }
            </div>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {event.poster_url && (
          <div className="mb-10 -mt-16 relative z-10">
            <img
              src={getSupabaseImageUrl(event.poster_url)}
              alt={event.title}
              className="w-full rounded-2xl shadow-2xl border border-gray-100"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://placehold.co/800x400/0d3b4f/ffffff?text=Citravel'
              }}
            />
          </div>
        )}

        <div className="bg-card rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">About This Event</h2>
          <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{event.description}</p>
        </div>

        {event.event_routes?.length > 0 && (
          <div className="bg-card rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Routes & Pricing</h2>
            <div className="space-y-4">
              {event.event_routes.map((route) => (
                <div
                  key={route.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-surface rounded-xl border border-gray-100"
                >
                  <div className="flex items-center gap-3 mb-3 sm:mb-0">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <MapPin size={18} className="text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{route.route_name}</p>
                      <p className="text-sm text-gray-500">{route.meeting_point}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-primary font-bold text-lg">
                    <IndianRupee size={18} />
                    IDR {route.price.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {event.event_documentation?.length > 0 && (
          <div className="bg-card rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Documentation</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {event.event_documentation
                .sort((a, b) => a.display_order - b.display_order)
                .map((doc) => (
                  <div key={doc.id} className="aspect-square rounded-xl overflow-hidden border border-gray-100">
                    <img
                      src={getSupabaseImageUrl(doc.image_url)}
                      alt={doc.caption || ''}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ))
              }
            </div>
          </div>
        )}

        {event.google_form_url && (
          <div className="bg-primary rounded-2xl p-6 md:p-8 text-center">
            <h3 className="text-xl font-bold text-white mb-2">Ready to Join?</h3>
            <p className="text-white/60 mb-6">Secure your spot now!</p>
            <a
              href={event.google_form_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-accent text-white px-8 py-4 rounded-full font-bold hover:bg-accent-light transition-all duration-200 shadow-lg shadow-accent/30 text-lg"
            >
              Register Now
              <ExternalLink size={20} />
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
