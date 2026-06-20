import { EventCard } from './EventCard'

interface EventGridProps {
  events: any[]
  emptyText?: string
}

export function EventGrid({ events, emptyText = 'Мероприятий не найдено' }: EventGridProps) {
  if (!events.length) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500 text-lg">{emptyText}</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  )
}
