import prisma from '~/server/utils/prisma'
import { requireAdmin } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  requireAdmin(event)

  const [
    totalNovels,
    totalUsers,
    totalChapters,
    totalComments,
    recentNovels,
    popularNovels
  ] = await Promise.all([
    prisma.novel.count(),
    prisma.user.count(),
    prisma.chapter.count(),
    prisma.comment.count(),
    prisma.novel.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        author: { select: { username: true } }
      }
    }),
    prisma.novel.findMany({
      take: 5,
      orderBy: { viewCount: 'desc' },
      select: { id: true, title: true, viewCount: true }
    })
  ])

  return {
    stats: {
      totalNovels,
      totalUsers,
      totalChapters,
      totalComments
    },
    recentNovels,
    popularNovels
  }
})
