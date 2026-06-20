import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export async function GET() {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const bookings = await prisma.booking.findMany({
    where: { userId: user.id },
    include: {
      event: { include: { images: { take: 1 } } },
      items: {
        include: {
          ticket: { include: { event: { include: { images: { take: 1 } } } } },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(bookings)
}

export async function POST(request: Request) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { items } = await request.json()
    if (!items?.length) return NextResponse.json({ error: 'Корзина пуста' }, { status: 400 })

    const bookings = []
    const itemsByEvent: Record<string, typeof items> = {}

    for (const item of items) {
      const ticket = await prisma.ticket.findUnique({
        where: { id: item.ticketId },
        include: { event: true },
      })
      if (!ticket) return NextResponse.json({ error: 'Билет не найден' }, { status: 400 })
      if (!itemsByEvent[ticket.eventId]) itemsByEvent[ticket.eventId] = []
      itemsByEvent[ticket.eventId].push({ ...item, ticket, eventId: ticket.eventId })
    }

    for (const eventId of Object.keys(itemsByEvent)) {
      const eventItems = itemsByEvent[eventId]
      let totalAmount = 0
      const bookingItems = []

      for (const item of eventItems) {
        totalAmount += item.ticket.price * item.quantity
        bookingItems.push({
          ticketId: item.ticket.id,
          quantity: item.quantity,
          price: item.ticket.price,
        })
      }

      const booking = await prisma.booking.create({
        data: {
          userId: user.id,
          eventId,
          totalAmount,
          finalAmount: totalAmount,
          status: totalAmount === 0 ? 'CONFIRMED' : 'PENDING',
          paymentStatus: totalAmount === 0 ? 'PAID' : 'PENDING',
          bookingCode: `EVT-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`,
          items: { create: bookingItems },
        },
        include: { items: true },
      })

      for (const item of eventItems) {
        await prisma.event.update({
          where: { id: eventId },
          data: { attendeesCount: { increment: item.quantity } },
        })
        await prisma.ticket.update({
          where: { id: item.ticket.id },
          data: { quantitySold: { increment: item.quantity } },
        })
      }

      bookings.push(booking)
    }

    return NextResponse.json(bookings)
  } catch (error) {
    console.error('Booking create error:', error)
    return NextResponse.json({ error: 'Ошибка бронирования' }, { status: 500 })
  }
}
