import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import type { EventWithDetails, EventStatus } from '../types'

export function useEvents(status?: EventStatus) {
  const [events, setEvents] = useState<EventWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchEvents = async () => {
    setLoading(true)
    setError(null)

    let query = supabase
      .from('events')
      .select('*, event_dates(*), event_routes(*), event_documentation(*)')
      .order('created_at', { ascending: false })

    if (status) {
      query = query.eq('status', status)
    }

    const { data, error: fetchError } = await query

    if (fetchError) {
      setError(fetchError.message)
    } else {
      setEvents(data as EventWithDetails[])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchEvents()
  }, [status])

  return { events, loading, error, refetch: fetchEvents }
}
