import { useEvents } from '../../hooks/useEvents'
import EventCard from '../../components/public/EventCard'

export default function PreviousEvents() {
  const { events, loading } = useEvents('previous')

  return (
    <div className="bg-surface min-h-screen">
      <div className="bg-[#1c1c1c] py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-accent text-xs font-semibold uppercase tracking-wider">Our Journey</span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mt-0.5">Past Events</h1>
          <p className="text-white/50 mt-1.5 max-w-lg text-sm">Relive the memories from our previous adventures.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-card rounded-xl h-72 animate-pulse border border-gray-100" />
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-16 bg-card rounded-xl border border-gray-100">
            <p className="text-gray-400 text-lg">No past events yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
