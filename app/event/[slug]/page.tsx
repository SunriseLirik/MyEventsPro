'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import { Calendar, MapPin, Users, Clock, Star, Ticket } from 'lucide-react'
import { formatDate, formatPrice, formatDuration } from '@/lib/utils'
import { useBookingStore } from '@/store/useBookingStore'

export default function EventDetailPage() {
  const { slug } = useParams()
  const [event, setEvent] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedTicket, setSelectedTicket] = useState<any>(null)
  const [quantity, setQuantity] = useState(1)
  const addItem = useBookingStore((s) => s.addItem)

  useEffect(() => {
    fetch(`/api/events/${slug}`)
      .then((res) => res.json())
      .then((data) => {
        setEvent(data)
        if (data.tickets?.length) setSelectedTicket(data.tickets[0])
        setLoading(false)
      })
  }, [slug])

  const handleAddToCart = () => {
    if (!selectedTicket || !event) return
    addItem({
      ticketId: selectedTicket.id,
      eventId: event.id,
      eventTitle: event.title,
      ticketName: selectedTicket.name,
      price: selectedTicket.price,
      quantity,
      maxQuantity: selectedTicket.quantityTotal,
    })
    alert('Билет добавлен в корзину')
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="h-96 bg-gray-100 animate-pulse rounded-2xl" />
      </div>
    )
  }

  if (!event) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Мероприятие не найдено</h1>
      </div>
    )
  }

  const mainImage = event.images?.find((img: any) => img.isMain) || event.images?.[0]
  const isPlaceholder = !mainImage?.url || mainImage.url.includes('/placeholders/')
  const isFree = event.isFree || selectedTicket?.price === 0

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {!isPlaceholder && (
            <div className="relative aspect-video rounded-2xl overflow-hidden">
              <Image
                src={mainImage.url}
                alt={mainImage.altText || event.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          <div className="card p-6 md:p-8">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="badge bg-indigo-50 text-indigo-700">{event.category?.name}</span>
              {event.isFeatured && <span className="badge bg-amber-500 text-white">Топ</span>}
              {isFree && <span className="badge bg-green-500 text-white">Бесплатно</span>}
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{event.title}</h1>
            <p className="text-lg text-gray-600 mb-6">{event.shortDescription}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <div className="flex items-center gap-3 text-gray-700">
                <Calendar className="text-indigo-600" />
                <div>
                  <p className="text-sm text-gray-500">Когда</p>
                  <p className="font-medium">{formatDate(event.startDate)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <Clock className="text-indigo-600" />
                <div>
                  <p className="text-sm text-gray-500">Длительность</p>
                  <p className="font-medium">{formatDuration(event.startDate, event.endDate)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <MapPin className="text-indigo-600" />
                <div>
                  <p className="text-sm text-gray-500">Где</p>
                  <p className="font-medium">{event.city}, {event.venueName}</p>
                  <p className="text-sm text-gray-500">{event.address}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <Users className="text-indigo-600" />
                <div>
                  <p className="text-sm text-gray-500">Участников</p>
                  <p className="font-medium">{event.attendeesCount} / {event.maxAttendees}</p>
                </div>
              </div>
            </div>

            <div className="prose max-w-none text-gray-700">
              {event.description?.split('\n').map((p: string, i: number) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-24">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Ticket className="text-indigo-600" /> Билеты
            </h2>

            <div className="space-y-3 mb-6">
              {event.tickets?.map((ticket: any) => (
                <label
                  key={ticket.id}
                  className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                    selectedTicket?.id === ticket.id
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-200 hover:border-indigo-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="ticket"
                      checked={selectedTicket?.id === ticket.id}
                      onChange={() => setSelectedTicket(ticket)}
                      className="w-5 h-5 text-indigo-600"
                    />
                    <div>
                      <p className="font-semibold text-gray-900">{ticket.name}</p>
                      <p className="text-sm text-gray-500">{ticket.description}</p>
                    </div>
                  </div>
                  <span className="font-bold text-gray-900">
                    {ticket.price === 0 ? 'Бесплатно' : formatPrice(ticket.price)}
                  </span>
                </label>
              ))}
            </div>

            {selectedTicket && !isFree && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Количество</label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-lg border border-gray-200 hover:bg-gray-50"
                  >-</button>
                  <span className="text-lg font-semibold w-8 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(quantity + 1, selectedTicket.quantityTotal))}
                    className="w-10 h-10 rounded-lg border border-gray-200 hover:bg-gray-50"
                  >+</button>
                </div>
              </div>
            )}

            <button onClick={handleAddToCart} className="btn-primary w-full">
              {isFree ? 'Зарегистрироваться' : 'Купить билет'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
