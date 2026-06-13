import prisma from '~/server/utils/prisma'
import { getAuthUser } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const user = getAuthUser(event)

  const page = Number(query.page) || 1
  const limit = Number(query.limit) || 12
  const search = query.search as string || ''
  const tag = query.tag as string || ''
  const status = query.status as string || ''
  const sort = query.sort as string || 'latest'

  const where: any = {}

  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } }
    ]
  }

  if (tag) {
    where.tags = { has: tag }
  }

  if (status && ['ONGOING', 'COMPLETED', 'HIATUS'].includes(status)) {
    where.status = status
  }

  const orderBy: any = {}
  switch (sort) {
    case 'popular':
      orderBy.viewCount = 'desc'
      break
    case 'rating':
      orderBy.ratings = { _count: 'desc' }
      break
    default:
      orderBy.createdAt = 'desc'
  }

  const [novels, total] = await Promise.all([
    prisma.novel.findMany({
      where,
      include: {
        author: {
          select: { id: true, username: true, avatar: true }
        },
        _count: {
          select: {
            chapters: true,
            likes: true,
            favorites: true,
            ratings: true
          }
        },
        ratings: {
          select: { score: true }
        },
        ...(user ? {
          likes: {
            where: { userId: user.userId },
            select: { id: true }
          },
          favorites: {
            where: { userId: user.userId },
            select: { id: true }
          }
        } : {})
      },
      orderBy,
      skip: (page - 1) * limit,
      take: limit
    }),
    prisma.novel.count({ where })
  ])

  // 计算平均评分
  const novelsWithRating = novels.map(novel => {
    const avgRating = novel.ratings.length > 0
      ? novel.ratings.reduce((sum, r) => sum + r.score, 0) / novel.ratings.length
      : 0
    
    return {
      ...novel,
      avgRating: Math.round(avgRating * 10) / 10,
      isLiked: user ? novel.likes?.length > 0 : false,
      isFavorited: user ? novel.favorites?.length > 0 : false,
      ratings: undefined,
      likes: undefined,
      favorites: undefined
    }
  })

  return {
    novels: novelsWithRating,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  }
})
