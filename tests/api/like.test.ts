import { describe, it, expect, vi, beforeEach } from 'vitest'
import prisma from '~/server/utils/prisma'
import likeHandler from '~/server/api/novels/[id]/like.post'
import {
  generateTestToken,
  createMockEvent,
  createMockNovel,
  createMockLike,
} from '../helpers'

const mockPrisma = prisma as any

describe('POST /api/novels/[id]/like', () => {
  const testUserId = 1
  const testNovelId = 42
  const testToken = generateTestToken({
    userId: testUserId,
    email: 'test@example.com',
    role: 'USER',
  })

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('未登录用户点赞', () => {
    it('应返回 401 未授权错误', async () => {
      const event = createMockEvent({ novelId: testNovelId })

      try {
        await likeHandler(event)
        expect.fail('Should have thrown an error')
      } catch (error: any) {
        expect(error.statusCode).toBe(401)
        expect(error.message).toBe('请先登录')
      }

      expect(mockPrisma.like.create).not.toHaveBeenCalled()
      expect(mockPrisma.like.delete).not.toHaveBeenCalled()
    })
  })

  describe('登录用户首次点赞', () => {
    it('应成功点赞并返回 { liked: true }', async () => {
      const mockNovel = createMockNovel(testNovelId)
      mockPrisma.novel.findUnique.mockResolvedValue(mockNovel)
      mockPrisma.like.findUnique.mockResolvedValue(null)
      mockPrisma.like.create.mockResolvedValue(
        createMockLike(testUserId, testNovelId)
      )

      const event = createMockEvent({
        novelId: testNovelId,
        authToken: testToken,
      })

      const result = await likeHandler(event)

      expect(result).toEqual({ success: true, liked: true })
      expect(mockPrisma.like.create).toHaveBeenCalledTimes(1)
      expect(mockPrisma.like.create).toHaveBeenCalledWith({
        data: {
          userId: testUserId,
          novelId: testNovelId,
        },
      })
      expect(mockPrisma.like.delete).not.toHaveBeenCalled()
    })

    it('点赞后 Like 表中应新增一条记录', async () => {
      const mockNovel = createMockNovel(testNovelId)
      const mockLike = createMockLike(testUserId, testNovelId)

      mockPrisma.novel.findUnique.mockResolvedValue(mockNovel)
      mockPrisma.like.findUnique.mockResolvedValue(null)
      mockPrisma.like.create.mockResolvedValue(mockLike)

      const event = createMockEvent({
        novelId: testNovelId,
        authToken: testToken,
      })

      await likeHandler(event)

      expect(mockPrisma.like.create).toHaveBeenCalledWith({
        data: {
          userId: testUserId,
          novelId: testNovelId,
        },
      })

      const createdLike = await mockPrisma.like.create.mock.results[0].value
      expect(createdLike).toBeDefined()
      expect(createdLike.userId).toBe(testUserId)
      expect(createdLike.novelId).toBe(testNovelId)
    })
  })

  describe('登录用户取消点赞', () => {
    it('应成功取消点赞并返回 { liked: false }', async () => {
      const mockNovel = createMockNovel(testNovelId)
      const existingLike = createMockLike(testUserId, testNovelId)

      mockPrisma.novel.findUnique.mockResolvedValue(mockNovel)
      mockPrisma.like.findUnique.mockResolvedValue(existingLike)
      mockPrisma.like.delete.mockResolvedValue(existingLike)

      const event = createMockEvent({
        novelId: testNovelId,
        authToken: testToken,
      })

      const result = await likeHandler(event)

      expect(result).toEqual({ success: true, liked: false })
      expect(mockPrisma.like.delete).toHaveBeenCalledTimes(1)
      expect(mockPrisma.like.delete).toHaveBeenCalledWith({
        where: { id: existingLike.id },
      })
      expect(mockPrisma.like.create).not.toHaveBeenCalled()
    })

    it('取消点赞后 Like 表中对应记录应被删除', async () => {
      const mockNovel = createMockNovel(testNovelId)
      const existingLike = createMockLike(testUserId, testNovelId)

      mockPrisma.novel.findUnique.mockResolvedValue(mockNovel)
      mockPrisma.like.findUnique.mockResolvedValue(existingLike)
      mockPrisma.like.delete.mockResolvedValue(existingLike)

      const event = createMockEvent({
        novelId: testNovelId,
        authToken: testToken,
      })

      await likeHandler(event)

      expect(mockPrisma.like.delete).toHaveBeenCalledWith({
        where: { id: existingLike.id },
      })

      const deletedLike = await mockPrisma.like.delete.mock.results[0].value
      expect(deletedLike).toBeDefined()
      expect(deletedLike.id).toBe(existingLike.id)
    })
  })

  describe('对不存在的小说点赞', () => {
    it('应返回 404 错误', async () => {
      mockPrisma.novel.findUnique.mockResolvedValue(null)

      const event = createMockEvent({
        novelId: 9999,
        authToken: testToken,
      })

      try {
        await likeHandler(event)
        expect.fail('Should have thrown a 404 error')
      } catch (error: any) {
        expect(error.statusCode).toBe(404)
        expect(error.message).toBe('小说不存在')
      }

      expect(mockPrisma.like.create).not.toHaveBeenCalled()
      expect(mockPrisma.like.delete).not.toHaveBeenCalled()
      expect(mockPrisma.like.findUnique).not.toHaveBeenCalled()
    })
  })

  describe('点赞切换逻辑验证', () => {
    it('连续调用两次应先点赞后取消点赞', async () => {
      const mockNovel = createMockNovel(testNovelId)
      const mockLike = createMockLike(testUserId, testNovelId)

      mockPrisma.novel.findUnique.mockResolvedValue(mockNovel)

      mockPrisma.like.findUnique
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(mockLike)

      mockPrisma.like.create.mockResolvedValue(mockLike)
      mockPrisma.like.delete.mockResolvedValue(mockLike)

      const event1 = createMockEvent({
        novelId: testNovelId,
        authToken: testToken,
      })
      const result1 = await likeHandler(event1)
      expect(result1.liked).toBe(true)
      expect(mockPrisma.like.create).toHaveBeenCalledTimes(1)

      const event2 = createMockEvent({
        novelId: testNovelId,
        authToken: testToken,
      })
      const result2 = await likeHandler(event2)
      expect(result2.liked).toBe(false)
      expect(mockPrisma.like.delete).toHaveBeenCalledTimes(1)
    })
  })

  describe('无效的小说ID', () => {
    it('传入非数字ID应返回 400 错误', async () => {
      const event = createMockEvent({
        authToken: testToken,
      })
      event.context.params = { id: 'abc' }

      try {
        await likeHandler(event)
        expect.fail('Should have thrown a 400 error')
      } catch (error: any) {
        expect(error.statusCode).toBe(400)
        expect(error.message).toBe('无效的小说ID')
      }
    })
  })

  describe('使用 Cookie Token 认证', () => {
    it('通过 Cookie 传递 Token 也可以正常点赞', async () => {
      const mockNovel = createMockNovel(testNovelId)
      mockPrisma.novel.findUnique.mockResolvedValue(mockNovel)
      mockPrisma.like.findUnique.mockResolvedValue(null)
      mockPrisma.like.create.mockResolvedValue(
        createMockLike(testUserId, testNovelId)
      )

      const event = createMockEvent({
        novelId: testNovelId,
        cookieToken: testToken,
      })

      const result = await likeHandler(event)

      expect(result).toEqual({ success: true, liked: true })
      expect(mockPrisma.like.create).toHaveBeenCalledTimes(1)
    })
  })
})
