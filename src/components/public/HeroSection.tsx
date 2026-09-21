import { useState, useRef, useCallback, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Calendar, MapPin, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react'
import { getSupabaseImageUrl } from '../../lib/supabase'
import type { EventWithDetails } from '../../types'

interface HeroSectionProps {
  events: EventWithDetails[]
}

function HeroSlide({ event }: { event: EventWithDetails }) {
  return (
    <>
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        {event.banner_url && (
          <img
            src={getSupabaseImageUrl(event.banner_url)}
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-25"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
          />
        )}
      </div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-accent/20 text-accent text-xs font-semibold px-3 py-1.5 rounded-full mb-4 border border-accent/30">
            <Sparkles size={14} />
            Featured Event
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-3 leading-tight">
            {event.title}
          </h1>
          {event.event_dates?.length > 0 && (
            <div className="flex items-center gap-2 text-white/70 mb-4">
              <Calendar size={16} />
              <span className="text-sm">
                {new Date(event.event_dates[0].event_date).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
                {event.event_dates.length > 1 && ` +${event.event_dates.length - 1} more dates`}
              </span>
            </div>
          )}
          {event.event_location && (
            <div className="flex items-center gap-2 text-white/60 mb-4">
              <MapPin size={16} />
              <span className="text-sm">{event.event_location}</span>
            </div>
          )}
          <div className="flex flex-wrap gap-3">
            <Link
              to={`/events/${event.slug}`}
              className="inline-flex items-center gap-2 bg-white text-primary px-6 py-2.5 rounded-full font-bold hover:bg-gray-100 transition-all duration-200 shadow-lg text-sm"
            >
              View Details
              <ArrowRight size={16} />
            </Link>
            {event.google_form_url && event.status !== 'previous' && (
              <a
                href={event.google_form_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-accent text-white px-6 py-2.5 rounded-full font-bold hover:bg-accent-dark transition-all duration-200 shadow-lg shadow-accent/40 text-sm"
              >
                Register Now
              </a>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default function HeroSection({ events }: HeroSectionProps) {
  const [current, setCurrent] = useState(0)
  const touchStart = useRef<number | null>(null)
  const touchEnd = useRef<number | null>(null)
  const minSwipeDistance = 50

  const hasMultiple = events.length > 1

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % events.length)
  }, [events.length])

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + events.length) % events.length)
  }, [events.length])

  const onTouchStart = (e: React.TouchEvent) => {
    touchEnd.current = null
    touchStart.current = e.targetTouches[0].clientX
  }

  const onTouchMove = (e: React.TouchEvent) => {
    touchEnd.current = e.targetTouches[0].clientX
  }

  const onTouchEnd = () => {
    if (!touchStart.current || !touchEnd.current) return
    const distance = touchStart.current - touchEnd.current
    if (Math.abs(distance) >= minSwipeDistance) {
      if (distance > 0) {
        next()
      } else {
        prev()
      }
    }
  }

  useEffect(() => {
    if (!hasMultiple) return
    const timer = setInterval(next, 5000)
    return () => clearInterval(timer)
  }, [hasMultiple, next])

  if (events.length === 0) {
    return (
      <section className="relative bg-[#1c1c1c] overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 text-white/90 text-sm font-medium px-4 py-2 rounded-full mb-4 backdrop-blur-sm">
            <Sparkles size={16} className="text-accent" />
            Find Your Alonica
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-4 leading-tight">
            Explore <span className="text-accent">Unforgettable</span><br />Experiences
          </h1>
          <p className="text-white/60 max-w-xl mx-auto mb-6">
            Join exciting events and trips curated just for you.
            Create memories that last a lifetime.
          </p>
          <Link
            to="/events"
            className="inline-flex items-center gap-2 bg-accent text-white px-6 py-3 rounded-full font-bold hover:bg-accent-dark transition-all duration-200 shadow-lg shadow-accent/40"
          >
            Browse Events
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section
      className="relative bg-[#1c1c1c] overflow-hidden min-h-[380px] flex items-center"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <HeroSlide event={events[current]} />

      {hasMultiple && (
        <>
          <button
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/10 backdrop-blur-sm text-white p-2.5 rounded-full hover:bg-white/20 transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/10 backdrop-blur-sm text-white p-2.5 rounded-full hover:bg-white/20 transition-colors"
          >
            <ChevronRight size={20} />
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {events.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === current ? 'bg-accent w-6' : 'bg-white/40 hover:bg-white/60 w-2'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  )
}
