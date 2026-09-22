import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import Logo from './Logo'

interface ContactInfo {
  email: string
  phone: string
  address: string
}

interface SocialLinks {
  instagram: string
  tiktok: string
  whatsapp: string
}

export default function Footer() {
  const [contact, setContact] = useState<ContactInfo>({
    email: 'info@citravel.com',
    phone: '+62 812 3456 7890',
    address: 'Jakarta, Indonesia',
  })

  const [socials, setSocials] = useState<SocialLinks>({
    instagram: '',
    tiktok: '',
    whatsapp: '',
  })

  useEffect(() => {
    const fetchSettings = async () => {
      const { data } = await supabase
        .from('site_settings')
        .select('key, value')
        .in('key', ['contact_email', 'contact_phone', 'contact_address', 'social_instagram', 'social_tiktok', 'social_whatsapp'])

      if (data) {
        const updatedContact = { ...contact }
        const updatedSocials = { ...socials }
        data.forEach((row) => {
          if (row.key === 'contact_email' && row.value) updatedContact.email = row.value
          if (row.key === 'contact_phone' && row.value) updatedContact.phone = row.value
          if (row.key === 'contact_address' && row.value) updatedContact.address = row.value
          if (row.key === 'social_instagram' && row.value) updatedSocials.instagram = row.value
          if (row.key === 'social_tiktok' && row.value) updatedSocials.tiktok = row.value
          if (row.key === 'social_whatsapp' && row.value) updatedSocials.whatsapp = row.value
        })
        setContact(updatedContact)
        setSocials(updatedSocials)
      }
    }
    fetchSettings()
  }, [])

  const formatWhatsAppUrl = (input: string) => {
    if (!input) return ''
    if (input.startsWith('http')) return input
    const cleaned = input.replace(/[^0-9+]/g, '')
    const number = cleaned.startsWith('+') ? cleaned.slice(1) : cleaned
    return `https://wa.me/${number}`
  }

  const socialItems = [
    {
      name: 'Instagram',
      url: socials.instagram,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
        </svg>
      ),
    },
    {
      name: 'TikTok',
      url: socials.tiktok,
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.51a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15.2a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.73a8.19 8.19 0 0 0 4.76 1.52v-3.4a4.85 4.85 0 0 1-1-.16z" />
        </svg>
      ),
    },
    {
      name: 'WhatsApp',
      url: formatWhatsAppUrl(socials.whatsapp),
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      ),
    },
  ]

  return (
    <footer className="bg-primary text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="inline-flex bg-white rounded-lg px-3 py-1.5 mb-4">
              <Logo className="h-8 w-auto" />
            </div>
            <p className="text-white/60 text-sm leading-relaxed max-w-sm">
              Find Your Alonica. Your trusted partner for amazing events and trips.
              Discover unforgettable experiences with Citravel.
            </p>
            <div className="flex gap-2.5 mt-4">
              {socialItems.filter((s) => s.url).map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:bg-accent hover:text-white transition-all duration-200"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3 text-xs uppercase tracking-wider">Navigate</h4>
            <ul className="space-y-2">
              {[
                { to: '/', label: 'Home' },
                { to: '/events', label: 'Events' },
                { to: '/previous-events', label: 'Previous Events' },
              ].map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className="text-white/60 hover:text-white transition-colors text-sm">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3 text-xs uppercase tracking-wider">Contact</h4>
            <ul className="space-y-2 text-sm text-white/60">
              <li>{contact.email}</li>
              <li>{contact.phone}</li>
              <li>{contact.address}</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-white/40 text-sm">
            &copy; {new Date().getFullYear()} Citravel. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-white/40">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
