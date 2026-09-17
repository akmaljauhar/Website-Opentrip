import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import type { EventWithDetails } from '../types'

export function useEvent() {
  const { slug } = useParams<{ slug: string }>()
  const [event, setEvent] = useState<EventWithDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!slug) return

    const fetchEvent = async () => {
      setLoading(true)
      const { data, error: fetchError } = await supabase
        .from('events')
        .select('*, event_dates(*), event_routes(*), event_documentation(*)')
        .eq('slug', slug)
        .single()

      if (fetchError) {
        setError(fetchError.message)
      } else {
        setEvent(data as EventWithDetails)
      }
      setLoading(false)
    }

    fetchEvent()
  }, [slug])

  return { event, loading, error }
}
