import { useState, useEffect } from 'react'
import { supabase, getSupabaseImageUrl } from '../../lib/supabase'
import { Upload, Check, Save } from 'lucide-react'

export default function Settings() {
  const [logoUrl, setLogoUrl] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [saved, setSaved] = useState(false)

  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [contactSaving, setContactSaving] = useState(false)
  const [contactSaved, setContactSaved] = useState(false)

  useEffect(() => {
    const fetchSettings = async () => {
      const { data } = await supabase
        .from('site_settings')
        .select('key, value')

      if (data) {
        data.forEach((row) => {
          if (row.key === 'logo_url') setLogoUrl(row.value)
          if (row.key === 'contact_email') setEmail(row.value)
          if (row.key === 'contact_phone') setPhone(row.value)
          if (row.key === 'contact_address') setAddress(row.value)
        })
      }
    }
    fetchSettings()
  }, [])

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const filePath = `site/logo-${Date.now()}-${file.name}`

    const { error } = await supabase.storage
      .from('events')
      .upload(filePath, file, { upsert: true })

    if (!error) {
      const { data } = supabase.storage.from('events').getPublicUrl(filePath)

      const { error: upsertError } = await supabase
        .from('site_settings')
        .upsert({ key: 'logo_url', value: data.publicUrl, updated_at: new Date().toISOString() })

      if (!upsertError) {
        setLogoUrl(data.publicUrl)
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      }
    }
    setUploading(false)
  }

  const handleContactSave = async () => {
    setContactSaving(true)
    const now = new Date().toISOString()

    await supabase
      .from('site_settings')
      .upsert([
        { key: 'contact_email', value: email, updated_at: now },
        { key: 'contact_phone', value: phone, updated_at: now },
        { key: 'contact_address', value: address, updated_at: now },
      ])

    setContactSaving(false)
    setContactSaved(true)
    setTimeout(() => setContactSaved(false), 3000)
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-gray-900">Settings</h1>
        <p className="text-gray-500 text-sm mt-1">Manage your site configuration</p>
      </div>

      <div className="space-y-6">
        <div className="bg-card rounded-2xl border border-gray-100 p-5 sm:p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-2">Site Logo</h2>
          <p className="text-sm text-gray-500 mb-6">
            Upload a logo that will appear in the top-left corner of the website.
          </p>

          <div className="flex flex-col sm:flex-row items-start gap-6">
            <div className="w-24 h-24 bg-gray-100 rounded-2xl flex items-center justify-center overflow-hidden border-2 border-dashed border-gray-200">
              {logoUrl ? (
                <img
                  src={getSupabaseImageUrl(logoUrl)}
                  alt="Site Logo"
                  className="w-full h-full object-contain p-2"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none'
                  }}
                />
              ) : (
                <div className="text-center">
                  <Upload size={20} className="text-gray-300 mx-auto" />
                  <span className="text-[10px] text-gray-400 block mt-1">No logo</span>
                </div>
              )}
            </div>

            <div className="flex-1">
              <label className="cursor-pointer">
                <span className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-primary bg-primary/5 border border-primary/20 rounded-xl hover:bg-primary/10 transition-colors">
                  <Upload size={16} />
                  {uploading ? 'Uploading...' : logoUrl ? 'Change Logo' : 'Upload Logo'}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
              {saved && (
                <div className="flex items-center gap-1.5 text-sm text-green-600 mt-2 font-medium">
                  <Check size={14} /> Logo saved successfully!
                </div>
              )}
              <p className="text-xs text-gray-400 mt-3">Recommended: Square image, at least 200x200px</p>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-2xl border border-gray-100 p-5 sm:p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-2">Contact Information</h2>
          <p className="text-sm text-gray-500 mb-6">
            These details will be displayed in the footer of the website.
          </p>

          <div className="space-y-4 max-w-lg">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="info@citravel.com"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="+62 812 3456 7890"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="Jakarta, Indonesia"
              />
            </div>
            <div className="pt-2">
              <button
                onClick={handleContactSave}
                disabled={contactSaving}
                className="inline-flex items-center gap-2 bg-accent text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-accent-dark transition-all duration-200 disabled:opacity-50 shadow-sm shadow-accent/30"
              >
                <Save size={16} />
                {contactSaving ? 'Saving...' : 'Save Contact Info'}
              </button>
              {contactSaved && (
                <div className="flex items-center gap-1.5 text-sm text-green-600 mt-2 font-medium">
                  <Check size={14} /> Contact info saved!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
