'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Calendar, User, LogOut, Menu, X, ShoppingCart } from 'lucide-react'
import { useBookingStore } from '@/store/useBookingStore'

interface UserData {
  name: string
  role: string
}

export function Header() {
  const [user, setUser] = useState<UserData | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const totalItems = useBookingStore((s) => s.totalItems())

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setUser(data))
      .catch(() => setUser(null))
  }, [])

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    setUser(null)
    window.location.href = '/'
  }

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <Calendar className="w-8 h-8 text-indigo-600" />
            <span className="text-xl font-bold text-gray-900">MyEventsPro</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">
              Главная
            </Link>
            <Link href="/catalog" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">
              Каталог
            </Link>
            {user && (
              <Link href="/create-event" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">
                Создать
              </Link>
            )}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <Link href="/cart" className="relative text-gray-600 hover:text-indigo-600">
              <ShoppingCart size={22} />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-indigo-600 text-white text-xs rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
            {user ? (
              <>
                <Link href="/profile" className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 font-medium">
                  <User size={18} />
                  {user.name}
                </Link>
                <button onClick={handleLogout} className="text-gray-500 hover:text-red-600">
                  <LogOut size={20} />
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-gray-600 hover:text-indigo-600 font-medium">
                  Войти
                </Link>
                <Link href="/register" className="btn-primary text-sm">
                  Регистрация
                </Link>
              </>
            )}
          </div>

          <button className="md:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-3">
          <Link href="/" className="block text-gray-600 font-medium" onClick={() => setMobileOpen(false)}>Главная</Link>
          <Link href="/catalog" className="block text-gray-600 font-medium" onClick={() => setMobileOpen(false)}>Каталог</Link>
          {user && <Link href="/create-event" className="block text-gray-600 font-medium" onClick={() => setMobileOpen(false)}>Создать</Link>}
          {user ? (
            <Link href="/profile" className="block text-gray-600 font-medium" onClick={() => setMobileOpen(false)}>Профиль</Link>
          ) : (
            <>
              <Link href="/login" className="block text-gray-600 font-medium" onClick={() => setMobileOpen(false)}>Войти</Link>
              <Link href="/register" className="block text-gray-600 font-medium" onClick={() => setMobileOpen(false)}>Регистрация</Link>
            </>
          )}
        </div>
      )}
    </header>
  )
}
