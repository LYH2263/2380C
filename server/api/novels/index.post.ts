import prisma from '~/server/utils/prisma'
import { requireAuth } from '~/server/utils/auth'
import { novelSchema } from '~/server/utils/validators'

export default defineEventHandler(async (event) => {
  const user = requireAuth(event)
  const body = await readBody(event)

  const result = novelSchema.safeParse(body)
  if (!result.success) {
    throw createError({
      statusCode: 400,
      message: result.error.errors[0].message
    })
  }

  const { title, description, cover, status, tags } = result.data

  const novel = await prisma.novel.create({
    data: {
      title,
      description,
      cover: cover || null,
      status: status || 'ONGOING',
      tags: tags || [],
      authorId: user.userId
    },
    include: {
      author: {
        select: { id: true, username: true, avatar: true }
      }
    }
  })

  return { success: true, novel }
})
