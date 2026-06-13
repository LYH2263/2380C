import prisma from '~/server/utils/prisma'
import { requireAuth } from '~/server/utils/auth'
import { chapterSchema } from '~/server/utils/validators'

export default defineEventHandler(async (event) => {
  const user = requireAuth(event)
  const novelId = Number(event.context.params?.id)
  const chapterId = Number(event.context.params?.chapterId)
  const body = await readBody(event)

  if (!novelId || isNaN(novelId) || !chapterId || isNaN(chapterId)) {
    throw createError({
      statusCode: 400,
      message: '无效的参数'
    })
  }

  // 检查章节和权限
  const chapter = await prisma.chapter.findFirst({
    where: { id: chapterId, novelId },
    include: {
      novel: { select: { authorId: true } }
    }
  })

  if (!chapter) {
    throw createError({
      statusCode: 404,
      message: '章节不存在'
    })
  }

  if (chapter.novel.authorId !== user.userId && user.role !== 'ADMIN') {
    throw createError({
      statusCode: 403,
      message: '无权编辑此章节'
    })
  }

  const result = chapterSchema.safeParse(body)
  if (!result.success) {
    throw createError({
      statusCode: 400,
      message: result.error.errors[0].message
    })
  }

  const { title, content, order } = result.data
  const wordCount = content.replace(/\s/g, '').length

  const updatedChapter = await prisma.chapter.update({
    where: { id: chapterId },
    data: {
      title,
      content,
      order: order || chapter.order,
      wordCount
    }
  })

  return { success: true, chapter: updatedChapter }
})
