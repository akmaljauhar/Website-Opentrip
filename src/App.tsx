import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { supabase, getSupabaseImageUrl } from './lib/supabase'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import AdminLayout from './components/layout/AdminLayout'

import Home from './pages/public/Home'
import Events from './pages/public/Events'
import EventDetail from './pages/public/EventDetail'
import PastEvents from './pages/public/PastEvents'

import Login from './pages/admin/Login'
import Dashboard from './pages/admin/Dashboard'
import EventForm from './pages/admin/EventForm'
import EventList from './pages/admin/EventList'
import Settings from './pages/admin/Settings'

export default function App() {
  useEffect(() => {
    const loadFavicon = async () => {
      const { data } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', 'logo_url')
        .single()
      if (data?.value) {
        const url = getSupabaseImageUrl(data.value)
        const link = document.querySelector("link[rel~='icon']") as HTMLLinkElement || document.createElement('link')
        link.rel = 'icon'
        link.href = url
        document.head.appendChild(link)
      }
    }
    loadFavicon()
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      <Routes>
        {/* Public routes */}
        <Route
          path="*"
          element={
            <>
              <Navbar />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/events" element={<Events />} />
                  <Route path="/events/:slug" element={<EventDetail />} />
                  <Route path="/past-events" element={<PastEvents />} />
                  <Route path="/past-events/:slug" element={<EventDetail />} />
                </Routes>
              </main>
              <Footer />
            </>
          }
        />

        {/* Admin routes */}
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="events" element={<EventList status="open" />} />
          <Route path="events/draft" element={<EventList status="draft" />} />
          <Route path="events/past" element={<EventList status="past" />} />
          <Route path="events/new" element={<EventForm />} />
          <Route path="events/edit/:id" element={<EventForm />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </div>
  )
}
