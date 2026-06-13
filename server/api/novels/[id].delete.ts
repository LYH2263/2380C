import prisma from '~/server/utils/prisma'
import { requireAuth } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const user = requireAuth(event)
  const id = Number(event.context.params?.id)

  if (!id || isNaN(id)) {
    throw createError({
      statusCode: 400,
      message: '无效的小说ID'
    })
  }

  // 检查权限
  const novel = await prisma.novel.findUnique({
    where: { id },
    select: { authorId: true }
  })

  if (!novel) {
    throw createError({
      statusCode: 404,
      message: '小说不存在'
    })
  }

  if (novel.authorId !== user.userId && user.role !== 'ADMIN') {
    throw createError({
      statusCode: 403,
      message: '无权删除此小说'
    })
  }

  await prisma.novel.delete({
    where: { id }
  })

  return { success: true }
})
