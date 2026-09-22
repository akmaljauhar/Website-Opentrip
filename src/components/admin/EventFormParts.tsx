import { useState } from 'react'
import { X } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { getSupabaseImageUrl } from '../../lib/supabase'
import type { EventDocumentation } from '../../types'

interface DeleteDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
}

export function DeleteDialog({ isOpen, onClose, onConfirm, title }: DeleteDialogProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-2xl p-6 max-w-sm w-full shadow-2xl">
        <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center mx-auto mb-4">
          <X size={24} className="text-red-500" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2 text-center">Delete Event</h3>
        <p className="text-sm text-gray-500 mb-6 text-center">
          Are you sure you want to delete &quot;{title}&quot;? This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-red-500 rounded-xl hover:bg-red-600 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

export function ImageUploader({
  eventId,
  folder,
  currentUrl,
  onUpload,
  label,
}: {
  eventId: string
  folder: string
  currentUrl: string | null
  onUpload: (url: string) => void
  label: string
}) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setError(null)
    setUploading(true)
    const filePath = `${eventId}/${folder}/${Date.now()}-${file.name}`

    const { error } = await supabase.storage
      .from('events')
      .upload(filePath, file, { upsert: true })

    if (error) {
      setError(error.message)
    } else {
      const { data } = supabase.storage.from('events').getPublicUrl(filePath)
      onUpload(data.publicUrl)
    }
    setUploading(false)
  }

  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
      <div className="flex items-center gap-4">
        <div className="w-20 h-20 bg-gray-100 rounded-xl overflow-hidden border border-gray-200">
          {currentUrl ? (
            <img
              src={getSupabaseImageUrl(currentUrl)}
              alt={label}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://placehold.co/80x80/e2e8f0/94a3b8?text=No+Image'
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
              No image
            </div>
          )}
        </div>
        <div>
          <label className="cursor-pointer">
            <span className="block px-4 py-2.5 text-sm font-semibold text-primary bg-primary/5 border border-primary/20 rounded-xl hover:bg-primary/10 transition-colors">
              {uploading ? 'Uploading...' : currentUrl ? 'Change' : 'Upload'}
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={handleUpload}
              className="hidden"
              disabled={uploading}
            />
          </label>
          {error && <p className="text-xs text-red-500 mt-1.5">{error}</p>}
        </div>
      </div>
    </div>
  )
}

export function DocumentationUploader({
  eventId,
  docs,
  onUpdate,
}: {
  eventId: string
  docs: EventDocumentation[]
  onUpdate: () => void
}) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    setError(null)
    setUploading(true)
    const failedFiles: string[] = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const filePath = `${eventId}/documentation/${Date.now()}-${file.name}`

      const { error } = await supabase.storage
        .from('events')
        .upload(filePath, file, { upsert: true })

      if (error) {
        failedFiles.push(file.name)
      } else {
        const { data } = supabase.storage.from('events').getPublicUrl(filePath)
        await supabase.from('event_documentation').insert({
          event_id: eventId,
          image_url: data.publicUrl,
          caption: file.name,
          display_order: docs.length + i,
        })
      }
    }

    if (failedFiles.length > 0) {
      setError(`Failed to upload: ${failedFiles.join(', ')}`)
    }
    setUploading(false)
    onUpdate()
  }

  const handleDelete = async (doc: EventDocumentation) => {
    await supabase.from('event_documentation').delete().eq('id', doc.id)
    onUpdate()
  }

  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">Documentation</label>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
        {docs.map((doc) => (
          <div key={doc.id} className="relative group aspect-square rounded-xl overflow-hidden border border-gray-200">
            <img
              src={getSupabaseImageUrl(doc.image_url)}
              alt={doc.caption || ''}
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={() => handleDelete(doc)}
              className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
            >
              <X size={12} />
            </button>
          </div>
        ))}
      </div>
      <label className="cursor-pointer">
        <span className="block px-4 py-2.5 text-sm font-semibold text-primary bg-primary/5 border border-primary/20 rounded-xl hover:bg-primary/10 transition-colors text-center">
          {uploading ? 'Uploading...' : 'Upload Documentation'}
        </span>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleUpload}
          className="hidden"
          disabled={uploading}
        />
      </label>
      {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
    </div>
  )
}
