import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    await requireAuth('ADMIN')
    const { status } = await request.json()
    const event = await prisma.event.update({
      where: { id: params.id },
      data: { status },
    })
    return NextResponse.json(event)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: error.message === 'Unauthorized' ? 401 : 403 })
  }
}
