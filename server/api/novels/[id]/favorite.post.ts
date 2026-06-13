import prisma from '~/server/utils/prisma'
import { requireAuth } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const user = requireAuth(event)
  const novelId = Number(event.context.params?.id)

  if (!novelId || isNaN(novelId)) {
    throw createError({
      statusCode: 400,
      message: '无效的小说ID'
    })
  }

  // 检查小说是否存在
  const novel = await prisma.novel.findUnique({
    where: { id: novelId }
  })

  if (!novel) {
    throw createError({
      statusCode: 404,
      message: '小说不存在'
    })
  }

  // 检查是否已收藏
  const existingFavorite = await prisma.favorite.findUnique({
    where: {
      userId_novelId: {
        userId: user.userId,
        novelId
      }
    }
  })

  if (existingFavorite) {
    // 取消收藏
    await prisma.favorite.delete({
      where: { id: existingFavorite.id }
    })
    return { success: true, favorited: false }
  } else {
    // 添加收藏
    await prisma.favorite.create({
      data: {
        userId: user.userId,
        novelId
      }
    })
    return { success: true, favorited: true }
  }
})
