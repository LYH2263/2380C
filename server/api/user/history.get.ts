import prisma from '~/server/utils/prisma'
import { requireAuth } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const user = requireAuth(event)

  const history = await prisma.readHistory.findMany({
    where: { userId: user.userId },
    include: {
      novel: {
        include: {
          author: {
            select: { id: true, username: true, avatar: true }
          },
          _count: {
            select: { chapters: true }
          }
        }
      }
    },
    orderBy: { updatedAt: 'desc' },
    take: 20
  })

  return { history }
})
