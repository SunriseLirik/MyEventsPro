import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const city = searchParams.get('city')
    const format = searchParams.get('format')
    const price = searchParams.get('price')
    const search = searchParams.get('search')
    const sort = searchParams.get('sort') || 'date'

    const where: any = { status: 'PUBLISHED' }

    if (category) where.category = { slug: category }
    if (city && city !== 'all') where.city = city
    if (format && format !== 'all') {
      if (format === 'online') where.isOnline = true
      else if (format === 'offline') where.isOnline = false
    }
    if (price === 'free') where.isFree = true
    if (price === 'paid') where.isFree = false
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { city: { contains: search, mode: 'insensitive' } },
      ]
    }

    let orderBy: any = {}
    if (sort === 'date') orderBy = { startDate: 'asc' }
    else if (sort === 'price') orderBy = { tickets: { _min: { price: 'asc' } } }
    else if (sort === 'rating') orderBy = { rating: 'desc' }
    else if (sort === 'popular') orderBy = { attendeesCount: 'desc' }

    const events = await prisma.event.findMany({
      where,
      include: {
        category: true,
        images: { orderBy: { sortOrder: 'asc' } },
        tickets: { where: { isActive: true }, orderBy: { price: 'asc' }, take: 1 },
        organizer: { select: { id: true, name: true, avatar: true } },
      },
      orderBy,
    })

    return NextResponse.json(events)
  } catch (error) {
    console.error('Events fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 })
  }
}
