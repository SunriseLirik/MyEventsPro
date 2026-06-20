'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { EventGrid } from '@/components/EventGrid'
import { EventFilters } from '@/components/EventFilters'
import { Calendar } from 'lucide-react'

export default function CatalogContent() {
  const searchParams = useSearchParams()
  const [events, setEvents] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const initialCategory = searchParams.get('category') || ''

  const fetchEvents = async (filters: any) => {
    setLoading(true)
    const params = new URLSearchParams()
    if (filters.search) params.set('search', filters.search)
    if (filters.category) params.set('category', filters.category)
    if (filters.city) params.set('city', filters.city)
    if (filters.format) params.set('format', filters.format)
    if (filters.price) params.set('price', filters.price)
    if (filters.sort) params.set('sort', filters.sort)

    const res = await fetch(`/api/events?${params.toString()}`)
    const data = await res.json()
    setEvents(data)
    setLoading(false)
  }

  useEffect(() => {
    fetch('/api/categories')
      .then((res) => res.json())
      .then(setCategories)
    fetchEvents({ search: '', category: initialCategory, city: '', format: '', price: '', sort: 'date' })
  }, [initialCategory])

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
          <Calendar className="text-indigo-600" />
          Каталог мероприятий
        </h1>
        <p className="text-gray-500">Найдите событие по своим интересам</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <EventFilters categories={categories} initial={{ search: '', category: initialCategory, city: '', format: '', price: '', sort: 'date' }} onChange={fetchEvents} />
        </div>
        <div className="lg:col-span-3">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="card h-96 animate-pulse bg-gray-100" />
              ))}
            </div>
          ) : (
            <EventGrid events={events} />
          )}
        </div>
      </div>
    </>
  )
}
