import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  try {
    const event = await prisma.event.findUnique({
      where: { slug: params.slug },
      include: {
        category: true,
        images: { orderBy: { sortOrder: 'asc' } },
        tickets: { where: { isActive: true }, orderBy: { price: 'asc' } },
        organizer: { select: { id: true, name: true, avatar: true } },
        reviews: {
          where: { isApproved: true },
          include: { user: { select: { name: true, avatar: true } } },
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
      },
    })

    if (!event) {
      return NextResponse.json({ error: 'Мероприятие не найдено' }, { status: 404 })
    }

    await prisma.event.update({
      where: { id: event.id },
      data: { viewsCount: { increment: 1 } },
    })

    return NextResponse.json(event)
  } catch (error) {
    console.error('Event fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch event' }, { status: 500 })
  }
}
