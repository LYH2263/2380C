import prisma from '~/server/utils/prisma'
import { requireAuth } from '~/server/utils/auth'
import { commentSchema } from '~/server/utils/validators'

export default defineEventHandler(async (event) => {
  const user = requireAuth(event)
  const chapterId = Number(event.context.params?.chapterId)
  const body = await readBody(event)

  if (!chapterId || isNaN(chapterId)) {
    throw createError({
      statusCode: 400,
      message: '无效的章节ID'
    })
  }

  const result = commentSchema.safeParse(body)
  if (!result.success) {
    throw createError({
      statusCode: 400,
      message: result.error.errors[0].message
    })
  }

  const { content, paragraph, parentId } = result.data

  // 检查章节是否存在
  const chapter = await prisma.chapter.findUnique({
    where: { id: chapterId }
  })

  if (!chapter) {
    throw createError({
      statusCode: 404,
      message: '章节不存在'
    })
  }

  // 如果是回复，检查父评论是否存在
  if (parentId) {
    const parentComment = await prisma.comment.findUnique({
      where: { id: parentId }
    })
    if (!parentComment) {
      throw createError({
        statusCode: 404,
        message: '被回复的评论不存在'
      })
    }
  }

  const comment = await prisma.comment.create({
    data: {
      userId: user.userId,
      chapterId,
      content,
      paragraph: paragraph ?? null,
      parentId: parentId ?? null
    },
    include: {
      user: {
        select: { id: true, username: true, avatar: true }
      }
    }
  })

  return { success: true, comment }
})
