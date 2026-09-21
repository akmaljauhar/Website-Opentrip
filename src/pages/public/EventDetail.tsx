import { useEvent } from '../../hooks/useEvent'
import { getSupabaseImageUrl } from '../../lib/supabase'
import { Calendar, MapPin, IndianRupee, ExternalLink, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { EventRoute } from '../../types'

export default function EventDetail() {
  const { event, loading, error } = useEvent()

  if (loading) {
    return (
      <div className="bg-surface dark:bg-[#0a0a0a] min-h-screen">
        <div className="bg-[#1c1c1c] py-10">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="animate-pulse space-y-3">
              <div className="h-5 bg-white/10 rounded w-32" />
              <div className="h-8 bg-white/10 rounded w-1/2" />
            </div>
          </div>
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-4">
            <div className="bg-gray-200 dark:bg-neutral-800 rounded-xl h-64" />
            <div className="h-5 bg-gray-200 dark:bg-neutral-800 rounded w-1/3" />
            <div className="h-4 bg-gray-200 dark:bg-neutral-800 rounded w-3/4" />
          </div>
        </div>
      </div>
    )
  }

  if (error || !event) {
    return (
      <div className="bg-surface dark:bg-[#0a0a0a] min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-5xl font-extrabold text-primary/20 mb-3">404</h1>
          <p className="text-gray-500 dark:text-neutral-500 mb-4">Event not found.</p>
          <Link to="/events" className="inline-flex items-center gap-2 text-primary font-semibold hover:text-primary-light text-sm">
            <ArrowLeft size={16} /> Back to Events
          </Link>
        </div>
      </div>
    )
  }

  const routesByCity: Record<string, typeof event.event_routes> = (event.event_routes || []).reduce(
    (acc: Record<string, typeof event.event_routes>, route: typeof event.event_routes[number]) => {
      const city = route.city || 'Other'
      if (!acc[city]) acc[city] = []
      acc[city].push(route)
      return acc
    },
    {} as Record<string, typeof event.event_routes>
  )

  return (
    <div className="bg-surface dark:bg-[#0a0a0a] min-h-screen">
      <div className="bg-[#1c1c1c] relative overflow-hidden">
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
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <Link to="/events" className="inline-flex items-center gap-1.5 text-white/60 hover:text-white text-xs mb-4 transition-colors">
            <ArrowLeft size={14} /> All Events
          </Link>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3">{event.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-white/70 text-sm">
            {event.event_dates?.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5">
                <Calendar size={14} />
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
            {event.event_location && (
              <div className="flex items-center gap-1.5">
                <MapPin size={14} />
                <span>{event.event_location}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {event.poster_url && (
          <div className="mb-8 -mt-12 relative z-10">
            <img
              src={getSupabaseImageUrl(event.poster_url)}
              alt={event.title}
              className="w-full rounded-xl shadow-2xl border border-gray-100 dark:border-neutral-800"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://placehold.co/800x400/0d3b4f/ffffff?text=Citravel'
              }}
            />
          </div>
        )}

        <div className="bg-card dark:bg-[#141414] rounded-xl p-5 shadow-sm border border-gray-100 dark:border-neutral-800 mb-5">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">About This Event</h2>
          <p className="text-gray-600 dark:text-neutral-400 leading-relaxed text-sm whitespace-pre-wrap">{event.description}</p>
        </div>

        {Object.keys(routesByCity).length > 0 && (
          <div className="bg-card dark:bg-[#141414] rounded-xl p-5 shadow-sm border border-gray-100 dark:border-neutral-800 mb-5">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Routes & Pricing</h2>
            <div className="space-y-4">
              {Object.entries(routesByCity).map(([city, routes]) => (
                <div key={city}>
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin size={14} className="text-primary" />
                    <h3 className="text-sm font-bold text-primary">{city}</h3>
                  </div>
                  <div className="space-y-2 ml-5">
                    {routes.map((route: EventRoute) => (
                      <div
                        key={route.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-surface dark:bg-neutral-900 rounded-lg border border-gray-100 dark:border-neutral-800"
                      >
                        <div className="flex items-center gap-3 mb-2 sm:mb-0">
                          <div>
                            <p className="text-xs text-gray-500 dark:text-neutral-500">{route.meeting_point}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 text-primary font-bold text-sm">
                          <IndianRupee size={14} />
                          IDR {route.price.toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {event.event_documentation?.length > 0 && (
          <div className="bg-card dark:bg-[#141414] rounded-xl p-5 shadow-sm border border-gray-100 dark:border-neutral-800 mb-5">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Documentation</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {event.event_documentation
                .sort((a, b) => a.display_order - b.display_order)
                .map((doc) => (
                  <div key={doc.id} className="aspect-square rounded-lg overflow-hidden border border-gray-100 dark:border-neutral-800">
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

        {event.google_form_url && event.status !== 'previous' && (
          <div className="bg-[#1c1c1c] rounded-xl p-5 text-center">
            <h3 className="text-lg font-bold text-white mb-1">Ready to Join?</h3>
            <p className="text-white/60 text-sm mb-4">Secure your spot now!</p>
            <a
              href={event.google_form_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-accent text-white px-6 py-2.5 rounded-full font-bold hover:bg-accent-dark transition-all duration-200 shadow-lg shadow-accent/40 text-sm"
            >
              Register Now
              <ExternalLink size={16} />
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
