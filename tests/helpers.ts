import jwt from 'jsonwebtoken'
import type { H3Event } from 'h3'

export const TEST_JWT_SECRET = 'test-secret-key-for-unit-testing'

export interface TestUserPayload {
  userId: number
  email: string
  role: 'USER' | 'ADMIN'
}

export function generateTestToken(payload: TestUserPayload): string {
  return jwt.sign(payload, TEST_JWT_SECRET, { expiresIn: '1h' })
}

export function createMockEvent(options: {
  novelId?: number
  authToken?: string
  cookieToken?: string
  method?: string
  body?: any
} = {}): H3Event {
  const headers: Record<string, string> = {}

  if (options.authToken) {
    headers['authorization'] = `Bearer ${options.authToken}`
  }

  if (options.cookieToken) {
    headers['cookie'] = `auth_token=${options.cookieToken}`
  }

  const event = {
    context: {
      params: {
        id: options.novelId?.toString(),
      },
    },
    node: {
      req: {
        headers,
        method: options.method || 'POST',
      },
      res: {
        statusCode: 200,
        headers: {} as Record<string, string>,
      },
    },
  } as unknown as H3Event

  return event
}

export function createMockNovel(id: number, overrides: Record<string, any> = {}) {
  return {
    id,
    title: `Test Novel ${id}`,
    description: `Description for test novel ${id}`,
    cover: null,
    authorId: 1,
    status: 'ONGOING',
    tags: ['test'],
    viewCount: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  }
}

export function createMockUser(id: number, overrides: Record<string, any> = {}) {
  return {
    id,
    email: `user${id}@test.com`,
    username: `testuser${id}`,
    password: 'hashedpassword',
    avatar: null,
    role: 'USER',
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  }
}

export function createMockLike(userId: number, novelId: number) {
  return {
    id: userId * 1000 + novelId,
    userId,
    novelId,
    createdAt: new Date(),
  }
}
