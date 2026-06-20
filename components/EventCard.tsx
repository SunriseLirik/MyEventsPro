'use client'

import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Calendar, Ticket } from 'lucide-react'
import { formatDate, formatPrice } from '@/lib/utils'

interface EventCardProps {
  event: any
}

export function EventCard({ event }: EventCardProps) {
  const mainImage = event.images?.find((img: any) => img.isMain) || event.images?.[0]
  const minPrice = event.tickets?.[0]?.price ?? 0
  const isFree = event.isFree || minPrice === 0

  return (
    <Link href={`/event/${event.slug}`} className="card group hover:shadow-lg transition-shadow">
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={mainImage?.url || '/images/placeholder.jpg'}
          alt={mainImage?.altText || event.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {event.isFeatured && (
          <span className="absolute top-3 left-3 badge bg-amber-500 text-white">Топ</span>
        )}
        {isFree && (
          <span className="absolute top-3 right-3 badge bg-green-500 text-white">Бесплатно</span>
        )}
      </div>

      <div className="p-5">
        <div className="flex items-center gap-2 text-sm text-indigo-600 font-medium mb-2">
          <span className="badge bg-indigo-50 text-indigo-700">{event.category?.name}</span>
          <span className="text-gray-400">•</span>
          <span className="flex items-center gap-1">
            <Calendar size={14} />
            {formatDate(event.startDate)}
          </span>
        </div>

        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors">
          {event.title}
        </h3>
        <p className="text-gray-500 text-sm line-clamp-2 mb-4">{event.shortDescription}</p>

        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1 text-sm text-gray-500">
            <MapPin size={14} />
            {event.city}
          </span>
          <span className="flex items-center gap-1 font-bold text-gray-900">
            <Ticket size={16} />
            {isFree ? 'Бесплатно' : formatPrice(minPrice)}
          </span>
        </div>
      </div>
    </Link>
  )
}
