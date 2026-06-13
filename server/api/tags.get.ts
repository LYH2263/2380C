import prisma from '~/server/utils/prisma'

export default defineEventHandler(async () => {
  // 获取所有使用的标签
  const novels = await prisma.novel.findMany({
    select: { tags: true }
  })

  const tagCount: Record<string, number> = {}
  novels.forEach(novel => {
    novel.tags.forEach(tag => {
      tagCount[tag] = (tagCount[tag] || 0) + 1
    })
  })

  const tags = Object.entries(tagCount)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)

  return { tags }
})
