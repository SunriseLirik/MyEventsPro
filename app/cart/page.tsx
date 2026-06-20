'use client'

import Link from 'next/link'
import { useBookingStore } from '@/store/useBookingStore'
import { formatPrice } from '@/lib/utils'
import { Trash2, ShoppingCart } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice, clearCart } = useBookingStore()
  const router = useRouter()

  const handleCheckout = async () => {
    const res = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items }),
    })

    if (res.ok) {
      clearCart()
      router.push('/profile')
    } else {
      alert('Ошибка оформления заказа')
    }
  }

  if (!items.length) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Корзина пуста</h1>
        <p className="text-gray-500 mb-6">Добавьте билеты на интересующие мероприятия</p>
        <Link href="/catalog" className="btn-primary">Перейти в каталог</Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Корзина</h1>
      <div className="space-y-4 mb-8">
        {items.map((item) => (
          <div key={item.ticketId} className="card p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-gray-900">{item.eventTitle}</h3>
              <p className="text-sm text-gray-500">{item.ticketName}</p>
              <p className="font-semibold text-indigo-600">{formatPrice(item.price)}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <button onClick={() => updateQuantity(item.ticketId, item.quantity - 1)} className="w-8 h-8 rounded-lg border border-gray-200 hover:bg-gray-50">-</button>
                <span className="w-8 text-center font-semibold">{item.quantity}</span>
                <button onClick={() => updateQuantity(item.ticketId, item.quantity + 1)} className="w-8 h-8 rounded-lg border border-gray-200 hover:bg-gray-50">+</button>
              </div>
              <button onClick={() => removeItem(item.ticketId)} className="text-red-500 hover:text-red-700">
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="card p-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <p className="text-gray-500">Итого</p>
          <p className="text-2xl font-bold text-gray-900">{formatPrice(totalPrice())}</p>
        </div>
        <button onClick={handleCheckout} className="btn-primary w-full md:w-auto">
          Оформить заказ
        </button>
      </div>
    </div>
  )
}
