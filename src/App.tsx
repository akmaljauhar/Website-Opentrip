import { Routes, Route } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import AdminLayout from './components/layout/AdminLayout'

import Home from './pages/public/Home'
import Events from './pages/public/Events'
import EventDetail from './pages/public/EventDetail'
import PreviousEvents from './pages/public/PreviousEvents'

import Login from './pages/admin/Login'
import Dashboard from './pages/admin/Dashboard'
import EventForm from './pages/admin/EventForm'
import EventList from './pages/admin/EventList'
import Settings from './pages/admin/Settings'

export default function App() {
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
                  <Route path="/previous-events" element={<PreviousEvents />} />
                  <Route path="/previous-events/:slug" element={<EventDetail />} />
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
          <Route path="events/previous" element={<EventList status="previous" />} />
          <Route path="events/new" element={<EventForm />} />
          <Route path="events/edit/:id" element={<EventForm />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </div>
  )
}
