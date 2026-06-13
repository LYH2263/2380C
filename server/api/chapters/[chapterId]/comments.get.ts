import prisma from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const chapterId = Number(event.context.params?.chapterId)
  const query = getQuery(event)
  const paragraph = query.paragraph ? Number(query.paragraph) : undefined

  if (!chapterId || isNaN(chapterId)) {
    throw createError({
      statusCode: 400,
      message: '无效的章节ID'
    })
  }

  const where: any = {
    chapterId,
    parentId: null
  }

  if (paragraph !== undefined) {
    where.paragraph = paragraph
  }

  const comments = await prisma.comment.findMany({
    where,
    include: {
      user: {
        select: { id: true, username: true, avatar: true }
      },
      replies: {
        include: {
          user: {
            select: { id: true, username: true, avatar: true }
          }
        },
        orderBy: { createdAt: 'asc' }
      }
    },
    orderBy: { createdAt: 'desc' }
  })

  return { comments }
})
