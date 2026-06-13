import jwt from 'jsonwebtoken'
import type { H3Event } from 'h3'

export interface JwtPayload {
  userId: number
  email: string
  role: 'USER' | 'ADMIN'
}

export function signToken(payload: JwtPayload): string {
  const config = useRuntimeConfig()
  return jwt.sign(payload, config.jwtSecret, { expiresIn: '7d' })
}

export function verifyToken(token: string): JwtPayload | null {
  try {
    const config = useRuntimeConfig()
    return jwt.verify(token, config.jwtSecret) as JwtPayload
  } catch {
    return null
  }
}

export function getAuthUser(event: H3Event): JwtPayload | null {
  const authHeader = getHeader(event, 'authorization')
  const cookieToken = getCookie(event, 'auth_token')
  
  const token = authHeader?.replace('Bearer ', '') || cookieToken
  
  if (!token) return null
  
  return verifyToken(token)
}

export function requireAuth(event: H3Event): JwtPayload {
  const user = getAuthUser(event)
  if (!user) {
    throw createError({
      statusCode: 401,
      message: '请先登录'
    })
  }
  return user
}

export function requireAdmin(event: H3Event): JwtPayload {
  const user = requireAuth(event)
  if (user.role !== 'ADMIN') {
    throw createError({
      statusCode: 403,
      message: '需要管理员权限'
    })
  }
  return user
}
