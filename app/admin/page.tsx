'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function AdminPage() {
  const [events, setEvents] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])

  useEffect(() => {
    fetch('/api/organizer/events').then((r) => r.json()).then(setEvents)
    fetch('/api/admin/users').then((r) => r.json()).then(setUsers)
  }, [])

  const updateStatus = async (id: string, status: string) => {
    await fetch(`/api/admin/events/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    setEvents(events.map((e) => e.id === id ? { ...e, status } : e))
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Админ-панель</h1>

      <section className="mb-12">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Мероприятия</h2>
        <div className="card overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-sm font-semibold text-gray-700">Название</th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-700">Организатор</th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-700">Статус</th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-700">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {events.map((event) => (
                <tr key={event.id}>
                  <td className="px-4 py-3 font-medium text-gray-900"><Link href={`/event/${event.slug}`} className="hover:text-indigo-600">{event.title}</Link></td>
                  <td className="px-4 py-3 text-gray-500">{event.organizer?.name}</td>
                  <td className="px-4 py-3"><span className="badge bg-gray-100 text-gray-700">{event.status}</span></td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      {event.status !== 'PUBLISHED' && (
                        <button onClick={() => updateStatus(event.id, 'PUBLISHED')} className="text-sm text-green-600 hover:underline">Опубликовать</button>
                      )}
                      {event.status !== 'CANCELLED' && (
                        <button onClick={() => updateStatus(event.id, 'CANCELLED')} className="text-sm text-red-600 hover:underline">Отменить</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Пользователи</h2>
        <div className="card overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-sm font-semibold text-gray-700">Имя</th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-700">Email</th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-700">Роль</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-4 py-3 font-medium text-gray-900">{user.name}</td>
                  <td className="px-4 py-3 text-gray-500">{user.email}</td>
                  <td className="px-4 py-3"><span className="badge bg-indigo-50 text-indigo-700">{user.role}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
