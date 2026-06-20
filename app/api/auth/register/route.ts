import { NextResponse } from 'next/server'
import { hash } from 'bcryptjs'
import { SignJWT } from 'jose'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const { email, password, name, role = 'USER' } = await request.json()

    if (!email || !password || !name) {
      return NextResponse.json({ error: 'Заполните все обязательные поля' }, { status: 400 })
    }

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ error: 'Пользователь уже существует' }, { status: 409 })
    }

    const passwordHash = await hash(password, 10)
    const user = await prisma.user.create({
      data: {
        email,
        password: passwordHash,
        name,
        role: role === 'ORGANIZER' ? 'ORGANIZER' : 'USER',
      },
    })

    const token = await new SignJWT({ userId: user.id, email: user.email, role: user.role })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('7d')
      .sign(new TextEncoder().encode(process.env.JWT_SECRET))

    const response = NextResponse.json({ success: true, user: { id: user.id, email: user.email, name: user.name, role: user.role } })
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })

    return response
  } catch (error) {
    console.error('Register error:', error)
    return NextResponse.json({ error: 'Ошибка регистрации' }, { status: 500 })
  }
}
