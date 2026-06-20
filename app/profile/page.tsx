'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Calendar, Ticket, PlusCircle, LogOut } from 'lucide-react'

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [bookings, setBookings] = useState<any[]>([])
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const meRes = await fetch('/api/auth/me')
      if (!meRes.ok) {
        window.location.href = '/login'
        return
      }
      const userData = await meRes.json()
      setUser(userData)

      const bookingsRes = await fetch('/api/bookings')
      const bookingsData = await bookingsRes.json()
      setBookings(bookingsData)

      if (userData.role === 'ORGANIZER' || userData.role === 'ADMIN') {
        const eventsRes = await fetch('/api/organizer/events')
        if (eventsRes.ok) {
          setEvents(await eventsRes.json())
        }
      }

      setLoading(false)
    }
    fetchData()
  }, [])

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    window.location.href = '/'
  }

  if (loading) {
    return <div className="max-w-7xl mx-auto px-4 py-12 text-center">Загрузка...</div>
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
          <p className="text-gray-500">{user.email} • {user.role === 'ORGANIZER' ? 'Организатор' : user.role === 'ADMIN' ? 'Администратор' : 'Участник'}</p>
        </div>
        <div className="flex items-center gap-3">
          {(user.role === 'ORGANIZER' || user.role === 'ADMIN') && (
            <Link href="/create-event" className="btn-secondary">
              <PlusCircle size={18} /> Создать
            </Link>
          )}
          {user.role === 'ADMIN' && (
            <Link href="/admin" className="btn-secondary">Админ-панель</Link>
          )}
          <button onClick={handleLogout} className="btn-secondary text-red-600">
            <LogOut size={18} /> Выйти
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2"><Ticket size={22} /> Мои билеты</h2>
          {bookings.length === 0 ? (
            <div className="card p-8 text-center">
              <p className="text-gray-500 mb-4">У вас пока нет бронирований</p>
              <Link href="/catalog" className="btn-primary">Найти мероприятие</Link>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking: any) => (
                <div key={booking.id} className="card p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-gray-900">{booking.event?.title || booking.items.map((i: any) => i.ticket?.event?.title).join(', ')}</h3>
                    <p className="text-sm text-gray-500">{new Date(booking.createdAt).toLocaleDateString('ru-RU')}</p>
                    <p className="text-sm font-medium text-indigo-600">{booking.status === 'CONFIRMED' ? 'Подтверждено' : booking.status === 'PENDING' ? 'В обработке' : 'Отменено'}</p>
                  </div>
                  <span className="font-bold text-gray-900">{booking.totalAmount} ₽</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {(user.role === 'ORGANIZER' || user.role === 'ADMIN') && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2"><Calendar size={22} /> Мои события</h2>
            <div className="space-y-4">
              {events.map((event: any) => (
                <Link key={event.id} href={`/event/${event.slug}`} className="card p-4 block hover:border-indigo-300 transition-colors">
                  <h3 className="font-bold text-gray-900">{event.title}</h3>
                  <p className="text-sm text-gray-500">{new Date(event.startDate).toLocaleDateString('ru-RU')} • {event.status}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
