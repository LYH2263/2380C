import prisma from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const novelId = Number(event.context.params?.id)
  const chapterId = Number(event.context.params?.chapterId)

  if (!novelId || isNaN(novelId) || !chapterId || isNaN(chapterId)) {
    throw createError({
      statusCode: 400,
      message: '无效的参数'
    })
  }

  const chapter = await prisma.chapter.findFirst({
    where: {
      id: chapterId,
      novelId
    },
    include: {
      novel: {
        select: {
          id: true,
          title: true,
          author: {
            select: { id: true, username: true, avatar: true }
          }
        }
      },
      comments: {
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
        where: { parentId: null },
        orderBy: { createdAt: 'desc' }
      }
    }
  })

  if (!chapter) {
    throw createError({
      statusCode: 404,
      message: '章节不存在'
    })
  }

  // 获取相邻章节
  const [prevChapter, nextChapter] = await Promise.all([
    prisma.chapter.findFirst({
      where: {
        novelId,
        order: { lt: chapter.order }
      },
      orderBy: { order: 'desc' },
      select: { id: true, title: true, order: true }
    }),
    prisma.chapter.findFirst({
      where: {
        novelId,
        order: { gt: chapter.order }
      },
      orderBy: { order: 'asc' },
      select: { id: true, title: true, order: true }
    })
  ])

  return {
    ...chapter,
    prevChapter,
    nextChapter
  }
})
