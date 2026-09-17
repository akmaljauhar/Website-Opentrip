import { Link } from 'react-router-dom'
import { ArrowRight, Calendar, Sparkles } from 'lucide-react'
import { getSupabaseImageUrl } from '../../lib/supabase'
import type { EventWithDetails } from '../../types'

interface HeroSectionProps {
  event: EventWithDetails | null
}

export default function HeroSection({ event }: HeroSectionProps) {
  if (!event) {
    return (
      <section className="relative bg-primary overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 md:py-36 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 text-white/90 text-sm font-medium px-4 py-2 rounded-full mb-6 backdrop-blur-sm">
            <Sparkles size={16} className="text-accent" />
            Find Your Alonica
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 leading-tight">
            Explore <span className="text-accent">Unforgettable</span><br />Experiences
          </h1>
          <p className="text-lg text-white/60 max-w-xl mx-auto mb-8">
            Join exciting events and trips curated just for you.
            Create memories that last a lifetime.
          </p>
          <Link
            to="/events"
            className="inline-flex items-center gap-2 bg-accent text-white px-8 py-4 rounded-full font-bold hover:bg-accent-dark transition-all duration-200 shadow-lg shadow-accent/40"
          >
            Browse Events
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section className="relative bg-primary overflow-hidden min-h-[500px] flex items-center">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        {event.banner_url && (
          <img
            src={getSupabaseImageUrl(event.banner_url)}
            alt=""
            className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-40"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
          />
        )}
      </div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-accent/20 text-accent text-sm font-semibold px-4 py-2 rounded-full mb-6 border border-accent/30">
            <Sparkles size={16} />
            Featured Event
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4 leading-tight">
            {event.title}
          </h1>
          {event.event_dates?.length > 0 && (
            <div className="flex items-center gap-2 text-white/70 mb-6">
              <Calendar size={18} />
              <span>
                {new Date(event.event_dates[0].event_date).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
                {event.event_dates.length > 1 && ` +${event.event_dates.length - 1} more dates`}
              </span>
            </div>
          )}
          <p className="text-lg text-white/60 mb-8 line-clamp-3">{event.description}</p>
          <div className="flex flex-wrap gap-4">
            <Link
              to={`/events/${event.slug}`}
              className="inline-flex items-center gap-2 bg-white text-primary px-8 py-4 rounded-full font-bold hover:bg-gray-100 transition-all duration-200 shadow-lg"
            >
              View Details
              <ArrowRight size={18} />
            </Link>
            {event.google_form_url && (
              <a
                href={event.google_form_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-accent text-white px-8 py-4 rounded-full font-bold hover:bg-accent-dark transition-all duration-200 shadow-lg shadow-accent/40"
              >
                Register Now
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
