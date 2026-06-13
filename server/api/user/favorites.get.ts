import prisma from '~/server/utils/prisma'
import { requireAuth } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const user = requireAuth(event)

  const favorites = await prisma.favorite.findMany({
    where: { userId: user.userId },
    include: {
      novel: {
        include: {
          author: {
            select: { id: true, username: true, avatar: true }
          },
          _count: {
            select: { chapters: true, likes: true }
          }
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  })

  return { favorites: favorites.map(f => f.novel) }
})
