import Link from 'next/link'
import { Calendar, Mail, Phone } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Calendar className="w-6 h-6 text-indigo-400" />
              <span className="text-xl font-bold text-white">MyEventsPro</span>
            </Link>
            <p className="text-gray-400 max-w-sm">
              Платформа для поиска, создания и посещения мероприятий любого формата.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Разделы</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="hover:text-white transition-colors">Главная</Link></li>
              <li><Link href="/catalog" className="hover:text-white transition-colors">Каталог</Link></li>
              <li><Link href="/create-event" className="hover:text-white transition-colors">Создать мероприятие</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Контакты</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2"><Mail size={16} /> info@myeventspro.ru</li>
              <li className="flex items-center gap-2"><Phone size={16} /> +7 (999) 123-45-67</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-500">
          © 2026 MyEventsPro. Все права защищены.
        </div>
      </div>
    </footer>
  )
}
