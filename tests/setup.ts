import { vi } from 'vitest'
import { TEST_JWT_SECRET } from './helpers'

globalThis.createError = (options: any) => {
  const error = new Error(options.message || 'Unknown error') as any
  error.statusCode = options.statusCode || 500
  error.statusMessage = options.statusMessage
  error.data = options.data
  return error
}

globalThis.defineEventHandler = (handler: any) => handler

globalThis.useRuntimeConfig = () => ({
  jwtSecret: TEST_JWT_SECRET,
  public: {
    appName: 'Test App',
  },
})

globalThis.getHeader = (event: any, name: string) => {
  const headers = event.node?.req?.headers || {}
  const value = headers[name.toLowerCase()] || headers[name]
  return value || undefined
}

globalThis.getCookie = (event: any, name: string) => {
  if (event.node?.req?.headers?.cookie) {
    const cookieHeader = event.node.req.headers.cookie
    const pairs = cookieHeader.split(';').map((s: string) => s.trim())
    for (const pair of pairs) {
      const [key, val] = pair.split('=')
      if (key === name) return val
    }
  }
  return undefined
}

vi.mock('~/server/utils/prisma', () => ({
  default: {
    novel: {
      findUnique: vi.fn(),
    },
    like: {
      findUnique: vi.fn(),
      create: vi.fn(),
      delete: vi.fn(),
    },
    user: {
      findUnique: vi.fn(),
    },
  },
}))
