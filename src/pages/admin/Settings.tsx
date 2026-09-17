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

  const [instagram, setInstagram] = useState('')
  const [tiktok, setTiktok] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [socialSaving, setSocialSaving] = useState(false)
  const [socialSaved, setSocialSaved] = useState(false)

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
          if (row.key === 'social_instagram') setInstagram(row.value)
          if (row.key === 'social_tiktok') setTiktok(row.value)
          if (row.key === 'social_whatsapp') setWhatsapp(row.value)
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

  const handleSocialSave = async () => {
    setSocialSaving(true)
    const now = new Date().toISOString()

    await supabase
      .from('site_settings')
      .upsert([
        { key: 'social_instagram', value: instagram, updated_at: now },
        { key: 'social_tiktok', value: tiktok, updated_at: now },
        { key: 'social_whatsapp', value: whatsapp, updated_at: now },
      ])

    setSocialSaving(false)
    setSocialSaved(true)
    setTimeout(() => setSocialSaved(false), 3000)
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-extrabold text-gray-900">Settings</h1>
        <p className="text-gray-500 text-xs mt-0.5">Manage your site configuration</p>
      </div>

      <div className="space-y-4">
        <div className="bg-card rounded-xl border border-gray-100 p-4 sm:p-5">
          <h2 className="text-base font-bold text-gray-900 mb-1">Site Logo</h2>
          <p className="text-xs text-gray-500 mb-4">
            Upload a logo that will appear in the top-left corner of the website.
          </p>

          <div className="flex flex-col sm:flex-row items-start gap-4">
            <div className="w-20 h-20 bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden border-2 border-dashed border-gray-200">
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
                <span className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-primary bg-primary/5 border border-primary/20 rounded-lg hover:bg-primary/10 transition-colors">
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
              <p className="text-[10px] text-gray-400 mt-2">Recommended: Square image, at least 200x200px</p>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-gray-100 p-4 sm:p-5">
          <h2 className="text-base font-bold text-gray-900 mb-1">Contact Information</h2>
          <p className="text-xs text-gray-500 mb-4">
            These details will be displayed in the footer of the website.
          </p>

          <div className="space-y-3 max-w-lg">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-sm"
                placeholder="info@citravel.com"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Phone</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-sm"
                placeholder="+62 812 3456 7890"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-sm"
                placeholder="Jakarta, Indonesia"
              />
            </div>
            <div className="pt-1">
              <button
                onClick={handleContactSave}
                disabled={contactSaving}
                className="inline-flex items-center gap-1.5 bg-accent text-white px-5 py-2 rounded-lg text-xs font-bold hover:bg-accent-dark transition-all duration-200 disabled:opacity-50 shadow-sm shadow-accent/30"
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

        <div className="bg-card rounded-xl border border-gray-100 p-4 sm:p-5">
          <h2 className="text-base font-bold text-gray-900 mb-1">Social Media</h2>
          <p className="text-xs text-gray-500 mb-4">
            Add your social media links to display in the footer.
          </p>

          <div className="space-y-3 max-w-lg">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Instagram URL</label>
              <input
                type="url"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-sm"
                placeholder="https://instagram.com/yourusername"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">TikTok URL</label>
              <input
                type="url"
                value={tiktok}
                onChange={(e) => setTiktok(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-sm"
                placeholder="https://tiktok.com/@yourusername"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">WhatsApp Number</label>
              <input
                type="tel"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-sm"
                placeholder="+6281234567890"
              />
              <p className="text-[10px] text-gray-400 mt-1">Enter number with country code (e.g. +6281234567890). No spaces or dashes.</p>
            </div>
            <div className="pt-1">
              <button
                onClick={handleSocialSave}
                disabled={socialSaving}
                className="inline-flex items-center gap-1.5 bg-accent text-white px-5 py-2 rounded-lg text-xs font-bold hover:bg-accent-dark transition-all duration-200 disabled:opacity-50 shadow-sm shadow-accent/30"
              >
                <Save size={16} />
                {socialSaving ? 'Saving...' : 'Save Social Links'}
              </button>
              {socialSaved && (
                <div className="flex items-center gap-1.5 text-sm text-green-600 mt-2 font-medium">
                  <Check size={14} /> Social links saved!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
