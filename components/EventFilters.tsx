'use client'

import { Search, SlidersHorizontal } from 'lucide-react'
import { useState } from 'react'

interface Filters {
  search: string
  category: string
  city: string
  format: string
  price: string
  sort: string
}

interface EventFiltersProps {
  categories: any[]
  initial?: Filters
  onChange: (filters: Filters) => void
}

const cities = ['Москва', 'Санкт-Петербург', 'Подмосковье', 'Онлайн']

export function EventFilters({ categories, initial, onChange }: EventFiltersProps) {
  const [filters, setFilters] = useState<Filters>({
    search: initial?.search || '',
    category: initial?.category || '',
    city: initial?.city || '',
    format: initial?.format || '',
    price: initial?.price || '',
    sort: initial?.sort || 'date',
  })

  const update = (key: keyof Filters, value: string) => {
    const next = { ...filters, [key]: value }
    setFilters(next)
    onChange(next)
  }

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-4">
      <div className="flex items-center gap-2 text-gray-900 font-semibold mb-2">
        <SlidersHorizontal size={18} />
        <h3>Фильтры</h3>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Поиск мероприятий..."
          value={filters.search}
          onChange={(e) => update('search', e.target.value)}
          className="input pl-10"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Категория</label>
        <select value={filters.category} onChange={(e) => update('category', e.target.value)} className="input">
          <option value="">Все категории</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.slug}>{cat.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Город</label>
        <select value={filters.city} onChange={(e) => update('city', e.target.value)} className="input">
          <option value="">Все города</option>
          {cities.map((city) => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Формат</label>
        <select value={filters.format} onChange={(e) => update('format', e.target.value)} className="input">
          <option value="">Любой</option>
          <option value="offline">Офлайн</option>
          <option value="online">Онлайн</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Стоимость</label>
        <select value={filters.price} onChange={(e) => update('price', e.target.value)} className="input">
          <option value="">Любая</option>
          <option value="free">Бесплатно</option>
          <option value="paid">Платно</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Сортировка</label>
        <select value={filters.sort} onChange={(e) => update('sort', e.target.value)} className="input">
          <option value="date">По дате</option>
          <option value="price">По цене</option>
          <option value="rating">По рейтингу</option>
          <option value="popular">По популярности</option>
        </select>
      </div>
    </div>
  )
}
