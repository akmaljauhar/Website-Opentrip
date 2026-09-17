import { useEvents } from '../../hooks/useEvents'
import HeroSection from '../../components/public/HeroSection'
import EventCard from '../../components/public/EventCard'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

export default function Home() {
  const { events: upcomingEvents, loading: loadingUpcoming } = useEvents('open')
  const { events: previousEvents, loading: loadingPrevious } = useEvents('previous')

  return (
    <div>
      <HeroSection events={upcomingEvents} />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="text-accent text-sm font-semibold uppercase tracking-wider">Don&apos;t Miss Out</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-1">Upcoming Events</h2>
          </div>
          <Link
            to="/events"
            className="hidden sm:inline-flex items-center gap-2 text-primary font-semibold text-sm hover:text-primary-light transition-colors"
          >
            View all <ArrowRight size={16} />
          </Link>
        </div>
        {loadingUpcoming ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-100 rounded-2xl h-96 animate-pulse" />
            ))}
          </div>
        ) : upcomingEvents.length === 0 ? (
          <div className="text-center py-16 bg-surface rounded-2xl">
            <p className="text-gray-400 text-lg">No upcoming events at the moment.</p>
            <p className="text-gray-400 text-sm mt-1">Check back soon for new adventures!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingEvents.slice(0, 3).map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
        <div className="sm:hidden mt-6 text-center">
          <Link
            to="/events"
            className="inline-flex items-center gap-2 text-primary font-semibold text-sm"
          >
            View all events <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {previousEvents.length > 0 && (
        <section className="bg-surface py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-10">
              <div>
                <span className="text-accent text-sm font-semibold uppercase tracking-wider">Our Journey</span>
                <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-1">Past Events</h2>
              </div>
              <Link
                to="/previous-events"
                className="hidden sm:inline-flex items-center gap-2 text-primary font-semibold text-sm hover:text-primary-light transition-colors"
              >
                View all <ArrowRight size={16} />
              </Link>
            </div>
            {loadingPrevious ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-gray-200 rounded-2xl h-96 animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {previousEvents.slice(0, 3).map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      <section className="bg-primary py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
            Ready for Your Next Adventure?
          </h2>
          <p className="text-white/60 text-lg mb-8 max-w-lg mx-auto">
            Browse our events and find the perfect trip for you.
          </p>
          <Link
            to="/events"
            className="inline-flex items-center gap-2 bg-accent text-white px-8 py-4 rounded-full font-bold hover:bg-accent-dark transition-all duration-200 shadow-lg shadow-accent/40"
          >
            Explore Events
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  )
}
