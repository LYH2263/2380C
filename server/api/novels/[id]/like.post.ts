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

  // 检查是否已点赞
  const existingLike = await prisma.like.findUnique({
    where: {
      userId_novelId: {
        userId: user.userId,
        novelId
      }
    }
  })

  if (existingLike) {
    // 取消点赞
    await prisma.like.delete({
      where: { id: existingLike.id }
    })
    return { success: true, liked: false }
  } else {
    // 添加点赞
    await prisma.like.create({
      data: {
        userId: user.userId,
        novelId
      }
    })
    return { success: true, liked: true }
  }
})
