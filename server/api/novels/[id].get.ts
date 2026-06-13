import prisma from '~/server/utils/prisma'
import { getAuthUser } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const id = Number(event.context.params?.id)
  const user = getAuthUser(event)

  if (!id || isNaN(id)) {
    throw createError({
      statusCode: 400,
      message: '无效的小说ID'
    })
  }

  const novel = await prisma.novel.findUnique({
    where: { id },
    include: {
      author: {
        select: { id: true, username: true, avatar: true }
      },
      chapters: {
        orderBy: { order: 'asc' },
        select: {
          id: true,
          title: true,
          order: true,
          wordCount: true,
          createdAt: true
        }
      },
      _count: {
        select: {
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
    }
  })

  if (!novel) {
    throw createError({
      statusCode: 404,
      message: '小说不存在'
    })
  }

  // 增加浏览量
  await prisma.novel.update({
    where: { id },
    data: { viewCount: { increment: 1 } }
  })

  // 计算平均评分
  const avgRating = novel.ratings.length > 0
    ? novel.ratings.reduce((sum, r) => sum + r.score, 0) / novel.ratings.length
    : 0

  // 获取用户评分
  let userRating = null
  if (user) {
    const rating = await prisma.rating.findUnique({
      where: {
        userId_novelId: {
          userId: user.userId,
          novelId: id
        }
      }
    })
    userRating = rating?.score || null
  }

  return {
    ...novel,
    avgRating: Math.round(avgRating * 10) / 10,
    isLiked: user ? novel.likes?.length > 0 : false,
    isFavorited: user ? novel.favorites?.length > 0 : false,
    userRating,
    ratings: undefined,
    likes: undefined,
    favorites: undefined
  }
})
