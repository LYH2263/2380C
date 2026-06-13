import prisma from '~/server/utils/prisma'
import { requireAuth } from '~/server/utils/auth'
import { novelSchema } from '~/server/utils/validators'

export default defineEventHandler(async (event) => {
  const user = requireAuth(event)
  const id = Number(event.context.params?.id)
  const body = await readBody(event)

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
      message: '无权编辑此小说'
    })
  }

  const result = novelSchema.safeParse(body)
  if (!result.success) {
    throw createError({
      statusCode: 400,
      message: result.error.errors[0].message
    })
  }

  const { title, description, cover, status, tags } = result.data

  const updatedNovel = await prisma.novel.update({
    where: { id },
    data: {
      title,
      description,
      cover: cover || null,
      status: status || 'ONGOING',
      tags: tags || []
    },
    include: {
      author: {
        select: { id: true, username: true, avatar: true }
      }
    }
  })

  return { success: true, novel: updatedNovel }
})
