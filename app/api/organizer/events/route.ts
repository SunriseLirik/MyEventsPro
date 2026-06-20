import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export async function GET() {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (user.role !== 'ORGANIZER' && user.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const events = await prisma.event.findMany({
    where: user.role === 'ADMIN' ? {} : { organizerId: user.id },
    orderBy: { createdAt: 'desc' },
    include: { category: true, tickets: true, organizer: { select: { name: true } } },
  })

  return NextResponse.json(events)
}
