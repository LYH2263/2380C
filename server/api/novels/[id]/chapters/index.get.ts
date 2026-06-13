import prisma from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const novelId = Number(event.context.params?.id)

  if (!novelId || isNaN(novelId)) {
    throw createError({
      statusCode: 400,
      message: '无效的小说ID'
    })
  }

  const chapters = await prisma.chapter.findMany({
    where: { novelId },
    orderBy: { order: 'asc' },
    select: {
      id: true,
      title: true,
      order: true,
      wordCount: true,
      createdAt: true
    }
  })

  return { chapters }
})
