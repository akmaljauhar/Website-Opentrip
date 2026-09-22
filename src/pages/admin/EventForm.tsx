import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import slugify from 'slugify'
import { ImageUploader, DocumentationUploader } from '../../components/admin/EventFormParts'
import { Plus, X, Save, ArrowLeft } from 'lucide-react'
import type { EventStatus, EventDocumentation } from '../../types'

interface EventDateForm {
  id?: string
  event_date: string
}

interface EventRouteForm {
  id?: string
  city: string
  price: number
  meeting_point: string
}

export default function EventForm() {
  const { id } = useParams<{ id: string }>()
  const isEdit = !!id
  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [eventLocation, setEventLocation] = useState('')
  const [status, setStatus] = useState<EventStatus>('draft')
  const [posterUrl, setPosterUrl] = useState<string | null>(null)
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null)
  const [bannerUrl, setBannerUrl] = useState<string | null>(null)
  const [googleFormUrl, setGoogleFormUrl] = useState('')
  const [dates, setDates] = useState<EventDateForm[]>([{ event_date: '' }])
  const [routes, setRoutes] = useState<EventRouteForm[]>([{ city: '', price: 0, meeting_point: '' }])
  const [documentation, setDocumentation] = useState<EventDocumentation[]>([])
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(isEdit)

  useEffect(() => {
    if (isEdit && id) {
      const fetchEvent = async () => {
        const { data } = await supabase
          .from('events')
          .select('*, event_dates(*), event_routes(*), event_documentation(*)')
          .eq('id', id)
          .single()

        if (data) {
          setTitle(data.title)
          setDescription(data.description)
          setEventLocation(data.event_location || '')
          setStatus(data.status)
          setPosterUrl(data.poster_url)
          setThumbnailUrl(data.thumbnail_url)
          setBannerUrl(data.banner_url)
          setGoogleFormUrl(data.google_form_url || '')
          setDates(data.event_dates?.map((d: { id: string; event_date: string }) => ({ id: d.id, event_date: d.event_date })) || [])
          setRoutes(
            data.event_routes?.map((r: { id: string; city: string; price: number; meeting_point: string }) => ({
              id: r.id,
              city: r.city,
              price: r.price,
              meeting_point: r.meeting_point,
            })) || []
          )
          setDocumentation(data.event_documentation || [])
        }
        setLoading(false)
      }
      fetchEvent()
    }
  }, [id, isEdit])

  const addDate = () => setDates([...dates, { event_date: '' }])
  const removeDate = (index: number) => setDates(dates.filter((_, i) => i !== index))
  const updateDate = (index: number, value: string) => {
    const updated = [...dates]
    updated[index].event_date = value
    setDates(updated)
  }

  const addRoute = () => setRoutes([...routes, { city: '', price: 0, meeting_point: '' }])
  const removeRoute = (index: number) => setRoutes(routes.filter((_, i) => i !== index))
  const updateRoute = (index: number, field: keyof EventRouteForm, value: string | number) => {
    const updated = [...routes]
    updated[index] = { ...updated[index], [field]: value } as EventRouteForm
    setRoutes(updated)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    const slug = slugify(title, { lower: true, strict: true })

    const eventData = {
      title,
      slug,
      description,
      event_location: eventLocation,
      status,
      poster_url: posterUrl,
      thumbnail_url: thumbnailUrl,
      banner_url: bannerUrl,
      google_form_url: googleFormUrl || null,
      updated_at: new Date().toISOString(),
    }

    let eventId = id

    if (isEdit && id) {
      await supabase.from('events').update(eventData).eq('id', id)
    } else {
      const { data } = await supabase.from('events').insert({ ...eventData, created_at: new Date().toISOString() }).select().single()
      eventId = data?.id
    }

    if (eventId) {
      await supabase.from('event_dates').delete().eq('event_id', eventId)
      const validDates = dates.filter((d) => d.event_date)
      if (validDates.length > 0) {
        await supabase.from('event_dates').insert(
          validDates.map((d) => ({ event_id: eventId, event_date: d.event_date }))
        )
      }

      await supabase.from('event_routes').delete().eq('event_id', eventId)
      const validRoutes = routes.filter((r) => r.city)
      if (validRoutes.length > 0) {
        await supabase.from('event_routes').insert(
          validRoutes.map((r) => ({
            event_id: eventId,
            city: r.city,
            price: r.price,
            meeting_point: r.meeting_point,
          }))
        )
      }
    }

    setSaving(false)
    const redirectMap: Record<string, string> = {
      open: '/admin/events',
      draft: '/admin/events/draft',
      previous: '/admin/events/previous',
    }
    navigate(redirectMap[status] || '/admin/events')
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-gray-100 rounded-xl w-1/3 animate-pulse" />
        <div className="h-64 bg-gray-100 rounded-2xl animate-pulse" />
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => {
          const redirectMap: Record<string, string> = {
            open: '/admin/events',
            draft: '/admin/events/draft',
            previous: '/admin/events/previous',
          }
          navigate(redirectMap[status] || '/admin/events')
        }} className="text-gray-400 hover:text-gray-600">
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-xl font-extrabold text-gray-900">
            {isEdit ? 'Edit Event' : 'Create Event'}
          </h1>
          <p className="text-gray-500 text-xs mt-0.5">
            {isEdit ? 'Update event details' : 'Fill in the details for your new event'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-card rounded-xl border border-gray-100 p-4 sm:p-5">
          <h2 className="text-base font-bold text-gray-900 mb-4">Basic Information</h2>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Event Name</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-sm"
                placeholder="e.g. Citravel Mountain Adventure"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none transition-all text-sm"
                placeholder="Describe your event..."
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Event Location</label>
              <input
                type="text"
                value={eventLocation}
                onChange={(e) => setEventLocation(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-sm"
                placeholder="e.g. Mount Bromo, East Java"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as EventStatus)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-sm"
              >
                <option value="draft">Draft</option>
                <option value="open">Open</option>
                <option value="previous">Previous</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-gray-100 p-4 sm:p-5">
          <h2 className="text-base font-bold text-gray-900 mb-4">Media</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {isEdit && id ? (
              <>
                <ImageUploader eventId={id} folder="poster" currentUrl={posterUrl} onUpload={setPosterUrl} label="Poster" />
                <ImageUploader eventId={id} folder="thumbnail" currentUrl={thumbnailUrl} onUpload={setThumbnailUrl} label="Thumbnail" />
                <ImageUploader eventId={id} folder="banner" currentUrl={bannerUrl} onUpload={setBannerUrl} label="Banner" />
              </>
            ) : (
              <p className="text-xs text-gray-400 col-span-3 bg-gray-50 p-3 rounded-lg text-center">
                Save the event first, then upload media.
              </p>
            )}
          </div>
        </div>

        <div className="bg-card rounded-xl border border-gray-100 p-4 sm:p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-gray-900">Event Dates</h2>
            <button
              type="button"
              onClick={addDate}
              className="text-sm font-semibold text-primary flex items-center gap-1 hover:text-primary-light transition-colors"
            >
              <Plus size={16} /> Add Date
            </button>
          </div>
          <div className="space-y-2">
            {dates.map((date, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="date"
                  value={date.event_date}
                  onChange={(e) => updateDate(index, e.target.value)}
                  className="flex-1 px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-sm"
                  required
                />
                {dates.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeDate(index)}
                    className="text-gray-400 hover:text-red-500 p-2 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card rounded-xl border border-gray-100 p-4 sm:p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-gray-900">Routes</h2>
            <button
              type="button"
              onClick={addRoute}
              className="text-sm font-semibold text-primary flex items-center gap-1 hover:text-primary-light transition-colors"
            >
              <Plus size={16} /> Add Route
            </button>
          </div>
          <div className="space-y-3">
            {routes.map((route, index) => (
              <div key={index} className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-end p-3 bg-gray-50 rounded-lg">
                <div>
                  <label className="block text-[10px] font-semibold text-gray-500 mb-1 uppercase tracking-wider">City</label>
                  <input
                    type="text"
                    value={route.city}
                    onChange={(e) => updateRoute(index, 'city', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-card transition-all text-sm"
                    placeholder="e.g. Jakarta"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-gray-500 mb-1 uppercase tracking-wider">Meeting Point</label>
                  <input
                    type="text"
                    value={route.meeting_point}
                    onChange={(e) => updateRoute(index, 'meeting_point', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-card transition-all text-sm"
                    placeholder="e.g. Jakarta Station"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-gray-500 mb-1 uppercase tracking-wider">Price (IDR)</label>
                  <input
                    type="number"
                    value={route.price || ''}
                    onChange={(e) => updateRoute(index, 'price', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-card transition-all text-sm"
                    placeholder="500000"
                  />
                </div>
                <div className="flex justify-end">
                  {routes.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeRoute(index)}
                      className="text-gray-400 hover:text-red-500 p-2.5 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      <X size={18} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card rounded-xl border border-gray-100 p-4 sm:p-5">
          <h2 className="text-base font-bold text-gray-900 mb-4">Registration</h2>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Google Form URL</label>
            <input
              type="url"
              value={googleFormUrl}
              onChange={(e) => setGoogleFormUrl(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-sm"
              placeholder="https://docs.google.com/forms/d/..."
            />
          </div>
        </div>

        {isEdit && id && (
          <div className="bg-card rounded-xl border border-gray-100 p-4 sm:p-5">
            <DocumentationUploader
              eventId={id}
              docs={documentation}
              onUpdate={async () => {
                const { data } = await supabase
                  .from('events')
                  .select('event_documentation(*)')
                  .eq('id', id)
                  .single()
                if (data) setDocumentation(data.event_documentation || [])
              }}
            />
          </div>
        )}

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={saving}
            className="bg-accent text-white px-6 py-2.5 rounded-lg font-bold hover:bg-accent-dark transition-all duration-200 disabled:opacity-50 flex items-center gap-2 shadow-sm shadow-accent/30 text-sm"
          >
            <Save size={18} />
            {saving ? 'Saving...' : isEdit ? 'Update Event' : 'Create Event'}
          </button>
          <button
            type="button"
            onClick={() => {
              const redirectMap: Record<string, string> = {
                open: '/admin/events',
                draft: '/admin/events/draft',
                previous: '/admin/events/previous',
              }
              navigate(redirectMap[status] || '/admin/events')
            }}
            className="bg-gray-100 text-gray-700 px-5 py-2.5 rounded-lg font-semibold hover:bg-gray-200 transition-colors text-sm"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
