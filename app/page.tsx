import Link from 'next/link'
import { Calendar, Search, ArrowRight, Star, Users, Ticket } from 'lucide-react'
import { EventGrid } from '@/components/EventGrid'
import { prisma } from '@/lib/prisma'

export default async function HomePage() {
  const categories = await prisma.category.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' } })
  const featuredEvents = await prisma.event.findMany({
    where: { status: 'PUBLISHED', isFeatured: true },
    include: { category: true, images: { orderBy: { sortOrder: 'asc' } }, tickets: { where: { isActive: true }, orderBy: { price: 'asc' }, take: 1 } },
    orderBy: { startDate: 'asc' },
    take: 6,
  })

  return (
    <>
      <section className="relative bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('/images/placeholders/event.svg')] bg-cover bg-center" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
              Открывайте лучшие мероприятия
            </h1>
            <p className="text-lg md:text-xl text-indigo-100 mb-8">
              MyEventsPro — это платформа, где вы найдёте конференции, концерты, мастер-классы и создадите своё собственное событие.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/catalog" className="btn-primary bg-white text-indigo-700 hover:bg-gray-100">
                <Search size={18} />
                Найти мероприятие
              </Link>
              <Link href="/create-event" className="btn-primary border border-white/30">
                <Calendar size={18} />
                Создать мероприятие
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Категории</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/catalog?category=${cat.slug}`}
                className="group p-6 rounded-2xl bg-gray-50 border border-gray-100 hover:border-indigo-200 hover:bg-indigo-50 transition-all text-center"
              >
                <h3 className="font-bold text-gray-900 group-hover:text-indigo-700 mb-1">{cat.name}</h3>
                <p className="text-sm text-gray-500">{cat.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Главные события</h2>
            <Link href="/catalog" className="text-indigo-600 font-semibold flex items-center gap-1 hover:underline">
              Все мероприятия <ArrowRight size={18} />
            </Link>
          </div>
          <EventGrid events={featuredEvents} />
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6">
              <Calendar className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Тысячи событий</h3>
              <p className="text-gray-500">Находите мероприятия на любой вкус и интерес.</p>
            </div>
            <div className="p-6">
              <Ticket className="w-12 h-12 text-pink-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Быстрая покупка билетов</h3>
              <p className="text-gray-500">Бронируйте места за пару кликов, без очередей.</p>
            </div>
            <div className="p-6">
              <Users className="w-12 h-12 text-amber-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Создавайте события</h3>
              <p className="text-gray-500">Организовывайте мероприятия и собирайте аудиторию.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
