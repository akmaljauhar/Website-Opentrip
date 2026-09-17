import { Link } from 'react-router-dom'
import { Calendar, MapPin, IndianRupee, ArrowUpRight } from 'lucide-react'
import { getSupabaseImageUrl } from '../../lib/supabase'
import type { EventWithDetails } from '../../types'

interface EventCardProps {
  event: EventWithDetails
  showStatus?: boolean
}

export default function EventCard({ event, showStatus }: EventCardProps) {
  const firstDate = event.event_dates?.[0]?.event_date
  const firstRoute = event.event_routes?.[0]

  const statusColors: Record<string, string> = {
    draft: 'bg-gray-100 text-gray-600',
    open: 'bg-green-50 text-green-700 ring-1 ring-green-200',
    closed: 'bg-red-50 text-red-700 ring-1 ring-red-200',
    previous: 'bg-blue-50 text-blue-700 ring-1 ring-blue-200',
  }

  return (
    <Link
      to={`/events/${event.slug}`}
      className="group block bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-primary/20"
    >
      <div className="relative aspect-[16/9] bg-gray-100 overflow-hidden">
        <img
          src={getSupabaseImageUrl(event.thumbnail_url || event.poster_url || '')}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://placehold.co/600x400/0d3b4f/ffffff?text=Citravel'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-lg">
            <ArrowUpRight size={14} className="text-white" />
          </div>
        </div>
        {showStatus && (
          <div className="absolute top-2 left-2">
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${statusColors[event.status]}`}>
              {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
            </span>
          </div>
        )}
      </div>
      <div className="p-4">
        {firstDate && !showStatus && (
          <div className="flex items-center gap-1.5 text-accent text-xs font-semibold mb-1.5">
            <Calendar size={12} />
            {new Date(firstDate).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </div>
        )}
        <h3 className="text-base font-bold text-gray-900 group-hover:text-primary transition-colors line-clamp-1 mb-0.5">
          {event.title}
        </h3>
        <p className="text-xs text-gray-500 line-clamp-2 mb-3">{event.description}</p>
        {firstRoute && (
          <div className="flex items-center gap-3 text-xs text-gray-500 pt-2 border-t border-gray-100">
            <span className="flex items-center gap-1 font-semibold text-primary">
              <IndianRupee size={12} />
              IDR {firstRoute.price.toLocaleString()}
            </span>
            <span className="flex items-center gap-1">
              <MapPin size={12} className="text-gray-400" />
              {firstRoute.meeting_point}
            </span>
          </div>
        )}
      </div>
    </Link>
  )
}
