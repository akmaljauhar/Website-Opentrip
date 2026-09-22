import { useEvents } from '../../hooks/useEvents'
import HeroSection from '../../components/public/HeroSection'
import EventCard from '../../components/public/EventCard'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

export default function Home() {
  const { events: upcomingEvents, loading: loadingUpcoming } = useEvents('open')
  const { events: pastEvents, loading: loadingPast } = useEvents('past')

  return (
    <div>
      <HeroSection events={upcomingEvents} />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-end justify-between mb-6">
          <div>
            <span className="text-accent text-xs font-semibold uppercase tracking-wider">Don&apos;t Miss Out</span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mt-0.5">Upcoming Events</h2>
          </div>
          <Link
            to="/events"
            className="hidden sm:inline-flex items-center gap-1.5 text-primary font-semibold text-sm hover:text-primary-light transition-colors"
          >
            View all <ArrowRight size={14} />
          </Link>
        </div>
        {loadingUpcoming ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-100 rounded-xl h-72 animate-pulse" />
            ))}
          </div>
        ) : upcomingEvents.length === 0 ? (
          <div className="text-center py-12 bg-surface rounded-xl">
            <p className="text-gray-400 text-lg">No upcoming events at the moment.</p>
            <p className="text-gray-400 text-sm mt-1">Check back soon for new adventures!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcomingEvents.slice(0, 3).map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
        <div className="sm:hidden mt-4 text-center">
          <Link
            to="/events"
            className="inline-flex items-center gap-1.5 text-primary font-semibold text-sm"
          >
            View all events <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {pastEvents.length > 0 && (
        <section className="bg-surface py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-6">
              <div>
                <span className="text-accent text-xs font-semibold uppercase tracking-wider">Our Journey</span>
                <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mt-0.5">Past Events</h2>
              </div>
              <Link
                to="/past-events"
                className="hidden sm:inline-flex items-center gap-1.5 text-primary font-semibold text-sm hover:text-primary-light transition-colors"
              >
                View all <ArrowRight size={14} />
              </Link>
            </div>
            {loadingPast ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-gray-200 rounded-xl h-72 animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {pastEvents.slice(0, 3).map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      <section className="bg-primary py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-3">
            Ready for Your Next Adventure?
          </h2>
          <p className="text-white/60 mb-6 max-w-lg mx-auto">
            Browse our events and find the perfect trip for you.
          </p>
          <Link
            to="/events"
            className="inline-flex items-center gap-2 bg-accent text-white px-6 py-3 rounded-full font-bold hover:bg-accent-dark transition-all duration-200 shadow-lg shadow-accent/40"
          >
            Explore Events
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  )
}
