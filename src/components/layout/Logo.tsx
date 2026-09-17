import { useState, useEffect } from 'react'
import { supabase, getSupabaseImageUrl } from '../../lib/supabase'

interface LogoProps {
  className?: string
  white?: boolean
}

export default function Logo({ className = '', white = false }: LogoProps) {
  const [logoUrl, setLogoUrl] = useState<string | null>(null)

  useEffect(() => {
    const fetchLogo = async () => {
      const { data } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', 'logo_url')
        .single()
      if (data?.value) setLogoUrl(data.value)
    }
    fetchLogo()
  }, [])

  if (logoUrl) {
    return (
      <img
        src={getSupabaseImageUrl(logoUrl)}
        alt="Citravel Logo"
        className={`object-contain ${className}`}
        onError={() => setLogoUrl(null)}
      />
    )
  }

  return (
    <span className={`text-2xl font-extrabold tracking-tight ${white ? 'text-white' : 'text-primary'}`}>
      Citra<span className={white ? 'text-white/80' : 'text-gray-400'}>vel</span>
    </span>
  )
}
