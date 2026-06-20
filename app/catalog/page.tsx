import { Suspense } from 'react'
import CatalogContent from './CatalogContent'

export default function CatalogPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Suspense fallback={<div className="text-center py-12">Загрузка...</div>}>
        <CatalogContent />
      </Suspense>
    </div>
  )
}
