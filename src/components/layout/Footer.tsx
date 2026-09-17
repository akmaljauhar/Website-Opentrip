import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import Logo from './Logo'

interface ContactInfo {
  email: string
  phone: string
  address: string
}

export default function Footer() {
  const [contact, setContact] = useState<ContactInfo>({
    email: 'info@citravel.com',
    phone: '+62 812 3456 7890',
    address: 'Jakarta, Indonesia',
  })

  useEffect(() => {
    const fetchContact = async () => {
      const { data } = await supabase
        .from('site_settings')
        .select('key, value')
        .in('key', ['contact_email', 'contact_phone', 'contact_address'])

      if (data) {
        const updated = { ...contact }
        data.forEach((row) => {
          if (row.key === 'contact_email' && row.value) updated.email = row.value
          if (row.key === 'contact_phone' && row.value) updated.phone = row.value
          if (row.key === 'contact_address' && row.value) updated.address = row.value
        })
        setContact(updated)
      }
    }
    fetchContact()
  }, [])

  return (
    <footer className="bg-primary text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Logo white className="h-8 w-auto mb-4" />
            <p className="text-white/60 text-sm leading-relaxed max-w-sm">
              Find Your Alonica. Your trusted partner for amazing events and trips.
              Discover unforgettable experiences with Citravel.
            </p>
            <div className="flex gap-2.5 mt-4">
              {['Facebook', 'Instagram', 'Twitter'].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:bg-accent hover:text-white transition-all duration-200"
                >
                  <span className="text-xs font-bold">{social[0]}</span>
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
                { to: '/previous-events', label: 'Past Events' },
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
