'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { slugify } from '@/lib/slugify'

export default function CreateEventPage() {
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const [form, setForm] = useState({
    title: '',
    shortDescription: '',
    description: '',
    categoryId: '',
    startDate: '',
    endDate: '',
    city: '',
    venueName: '',
    address: '',
    isOnline: false,
    onlineUrl: '',
    isFree: false,
    maxAttendees: 100,
    ageRestriction: '0+',
    ticketName: 'Стандарт',
    ticketPrice: 0,
    ticketQuantity: 100,
  })

  useEffect(() => {
    fetch('/api/categories')
      .then((res) => res.json())
      .then(setCategories)
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (!form.categoryId) {
      setError('Выберите категорию')
      setLoading(false)
      return
    }

    const start = new Date(form.startDate)
    const end = new Date(form.endDate)
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      setError('Укажите корректные даты')
      setLoading(false)
      return
    }
    if (end <= start) {
      setError('Дата окончания должна быть позже даты начала')
      setLoading(false)
      return
    }

    const payload = {
      ...form,
      slug: slugify(form.title),
      maxAttendees: Number(form.maxAttendees),
      ticketPrice: Number(form.ticketPrice),
      ticketQuantity: Number(form.ticketQuantity),
    }

    const res = await fetch('/api/events/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    const data = await res.json()
    setLoading(false)

    if (!res.ok) {
      setError(data.error || 'Ошибка создания')
      return
    }

    router.push(`/event/${data.slug}`)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Создать мероприятие</h1>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="card p-6 md:p-8 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Название</label>
          <input type="text" name="title" required value={form.title} onChange={handleChange} className="input" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Краткое описание</label>
          <input type="text" name="shortDescription" required value={form.shortDescription} onChange={handleChange} className="input" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Полное описание</label>
          <textarea name="description" required rows={5} value={form.description} onChange={handleChange} className="input" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Категория</label>
            <select name="categoryId" required value={form.categoryId} onChange={handleChange} className="input">
              <option value="">Выберите</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Возрастное ограничение</label>
            <select name="ageRestriction" value={form.ageRestriction} onChange={handleChange} className="input">
              <option value="0+">0+</option>
              <option value="6+">6+</option>
              <option value="12+">12+</option>
              <option value="16+">16+</option>
              <option value="18+">18+</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Начало</label>
            <input type="datetime-local" name="startDate" required value={form.startDate} onChange={handleChange} className="input" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Окончание</label>
            <input type="datetime-local" name="endDate" required value={form.endDate} onChange={handleChange} className="input" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Город</label>
            <input type="text" name="city" required value={form.city} onChange={handleChange} className="input" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Место проведения</label>
            <input type="text" name="venueName" required value={form.venueName} onChange={handleChange} className="input" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Адрес</label>
          <input type="text" name="address" value={form.address} onChange={handleChange} className="input" />
        </div>

        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2">
            <input type="checkbox" name="isOnline" checked={form.isOnline} onChange={handleChange} className="w-5 h-5" />
            <span className="text-gray-700">Онлайн</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" name="isFree" checked={form.isFree} onChange={handleChange} className="w-5 h-5" />
            <span className="text-gray-700">Бесплатно</span>
          </label>
        </div>

        {form.isOnline && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ссылка на трансляцию</label>
            <input type="url" name="onlineUrl" value={form.onlineUrl} onChange={handleChange} className="input" />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Максимальное число участников</label>
          <input type="number" name="maxAttendees" min={1} value={form.maxAttendees} onChange={handleChange} className="input" />
        </div>

        <div className="border-t border-gray-100 pt-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Билет</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Название</label>
              <input type="text" name="ticketName" value={form.ticketName} onChange={handleChange} className="input" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Цена</label>
              <input type="number" name="ticketPrice" min={0} value={form.ticketPrice} onChange={handleChange} className="input" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Количество</label>
              <input type="number" name="ticketQuantity" min={1} value={form.ticketQuantity} onChange={handleChange} className="input" />
            </div>
          </div>
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? 'Создание...' : 'Создать мероприятие'}
        </button>
      </form>
    </div>
  )
}
