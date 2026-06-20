import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { slugify } from '@/lib/slugify'

export async function POST(request: Request) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (user.role !== 'ORGANIZER' && user.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  try {
    const body = await request.json()

    // Validation
    const requiredFields = ['title', 'shortDescription', 'description', 'categoryId', 'startDate', 'endDate', 'city', 'venueName']
    const missing = requiredFields.filter((field) => !body[field])
    if (missing.length > 0) {
      return NextResponse.json({ error: `Заполните обязательные поля: ${missing.join(', ')}` }, { status: 400 })
    }

    const startDate = new Date(body.startDate)
    const endDate = new Date(body.endDate)
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return NextResponse.json({ error: 'Некорректная дата' }, { status: 400 })
    }
    if (endDate <= startDate) {
      return NextResponse.json({ error: 'Дата окончания должна быть позже даты начала' }, { status: 400 })
    }

    // Validate category exists
    const category = await prisma.category.findUnique({ where: { id: body.categoryId } })
    if (!category) {
      return NextResponse.json({ error: 'Выбранная категория не найдена' }, { status: 400 })
    }

    // Generate unique slug
    let baseSlug = body.slug && String(body.slug).trim() ? String(body.slug).trim() : slugify(body.title)
    if (!baseSlug) baseSlug = `event-${Date.now()}`

    let slug = baseSlug
    let suffix = 0
    while (await prisma.event.findUnique({ where: { slug } })) {
      suffix++
      slug = `${baseSlug}-${suffix}`
    }

    const event = await prisma.event.create({
      data: {
        organizerId: user.id,
        categoryId: body.categoryId,
        title: body.title,
        slug,
        shortDescription: body.shortDescription,
        description: body.description,
        startDate,
        endDate,
        locationType: body.isOnline ? 'online' : 'offline',
        venueName: body.venueName,
        address: body.address || '',
        city: body.city,
        isOnline: !!body.isOnline,
        onlineUrl: body.onlineUrl || '',
        isFree: !!body.isFree,
        status: 'PUBLISHED',
        maxAttendees: parseInt(body.maxAttendees) || 100,
        ageRestriction: body.ageRestriction || '0+',
        images: {
          create: {
            url: '/images/placeholders/event.svg',
            altText: body.title,
            isMain: true,
          },
        },
        tickets: {
          create: {
            name: body.ticketName || 'Билет',
            description: 'Основной билет',
            price: body.isFree ? 0 : parseInt(body.ticketPrice) || 0,
            quantityTotal: parseInt(body.ticketQuantity) || 100,
            isActive: true,
          },
        },
      },
    })

    return NextResponse.json(event)
  } catch (error: any) {
    console.error('Create event error:', error)
    const message = error?.message || 'Ошибка создания мероприятия'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
