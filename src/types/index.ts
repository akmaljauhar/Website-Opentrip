export type EventStatus = 'draft' | 'open' | 'closed' | 'previous'

export interface Event {
  id: string
  title: string
  slug: string
  description: string
  event_location: string
  poster_url: string | null
  thumbnail_url: string | null
  banner_url: string | null
  google_form_url: string | null
  status: EventStatus
  created_at: string
  updated_at: string
}

export interface EventDate {
  id: string
  event_id: string
  event_date: string
  created_at: string
}

export interface EventRoute {
  id: string
  event_id: string
  city: string
  price: number
  meeting_point: string
  created_at: string
}

export interface EventDocumentation {
  id: string
  event_id: string
  image_url: string
  caption: string | null
  display_order: number
  created_at: string
}

export interface EventWithDetails extends Event {
  event_dates: EventDate[]
  event_routes: EventRoute[]
  event_documentation: EventDocumentation[]
}
