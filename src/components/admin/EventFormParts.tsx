import { useState } from 'react'
import { X } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { getSupabaseImageUrl } from '../../lib/supabase'
import { toWebImage } from '../../lib/imageUtils'
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
    const raw = e.target.files?.[0]
    if (!raw) return

    setError(null)
    setUploading(true)
    try {
      const file = await toWebImage(raw)
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
    } catch {
      setError('Failed to process image. Please try uploading a JPG or PNG.')
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

export interface StagedDocFile {
  id: string
  file: File
  previewUrl: string
}

export function DocumentationUploader({
  docs,
  deletedIds,
  stagedFiles,
  onAdd,
  onDelete,
  onDeleteStaged,
}: {
  docs: EventDocumentation[]
  deletedIds: string[]
  stagedFiles: StagedDocFile[]
  onAdd: (files: StagedDocFile[]) => void
  onDelete: (id: string) => void
  onDeleteStaged: (id: string) => void
}) {
  const [error, setError] = useState<string | null>(null)
  const [processing, setProcessing] = useState(false)

  const handleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setError(null)
    setProcessing(true)
    const failedFiles: string[] = []
    const staged: StagedDocFile[] = []

    for (const raw of Array.from(files)) {
      try {
        const file = await toWebImage(raw)
        staged.push({
          id: `staged-${Date.now()}-${Math.random().toString(36).slice(2)}`,
          file,
          previewUrl: URL.createObjectURL(file),
        })
      } catch {
        failedFiles.push(raw.name)
      }
    }

    if (failedFiles.length > 0) {
      setError(`Failed to process: ${failedFiles.join(', ')}`)
    }
    if (staged.length > 0) onAdd(staged)
    setProcessing(false)
    e.target.value = ''
  }

  const visibleDocs = docs.filter((doc) => !deletedIds.includes(doc.id))
  const hasChanges = stagedFiles.length > 0 || deletedIds.length > 0

  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">Documentation</label>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
        {visibleDocs.map((doc) => (
          <div key={doc.id} className="relative group aspect-square rounded-xl overflow-hidden border border-gray-200">
            <img
              src={getSupabaseImageUrl(doc.image_url)}
              alt={doc.caption || ''}
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={() => onDelete(doc.id)}
              className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
            >
              <X size={12} />
            </button>
          </div>
        ))}
        {stagedFiles.map((staged) => (
          <div
            key={staged.id}
            className="relative group aspect-square rounded-xl overflow-hidden border-2 border-dashed border-primary/40"
          >
            <img
              src={staged.previewUrl}
              alt={staged.file.name}
              className="w-full h-full object-cover"
            />
            <span className="absolute bottom-1.5 left-1.5 bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
              New
            </span>
            <button
              type="button"
              onClick={() => onDeleteStaged(staged.id)}
              className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
            >
              <X size={12} />
            </button>
          </div>
        ))}
      </div>
      <label className="cursor-pointer">
        <span className="block px-4 py-2.5 text-sm font-semibold text-primary bg-primary/5 border border-primary/20 rounded-xl hover:bg-primary/10 transition-colors text-center">
          {processing ? 'Processing...' : 'Upload Documentation'}
        </span>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFiles}
          className="hidden"
          disabled={processing}
        />
      </label>
      {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
      {hasChanges && (
        <p className="text-xs text-amber-600 mt-2">
          Unsaved changes — click &quot;Update Event&quot; to save, or &quot;Cancel&quot; to discard.
        </p>
      )}
    </div>
  )
}
