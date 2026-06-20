import { cookies } from 'next/headers'
import { jwtVerify } from 'jose'

export async function getCurrentUser() {
  const token = (await cookies()).get('token')?.value
  if (!token) return null

  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET))
    return {
      id: payload.userId as string,
      email: payload.email as string,
      role: payload.role as string,
    }
  } catch {
    return null
  }
}

export async function requireAuth(role?: string) {
  const user = await getCurrentUser()
  if (!user) throw new Error('Unauthorized')
  if (role && user.role !== role && user.role !== 'ADMIN') throw new Error('Forbidden')
  return user
}
