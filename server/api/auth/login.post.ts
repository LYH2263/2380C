import bcrypt from 'bcryptjs'
import prisma from '~/server/utils/prisma'
import { loginSchema } from '~/server/utils/validators'
import { signToken } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  
  // 验证输入
  const result = loginSchema.safeParse(body)
  if (!result.success) {
    throw createError({
      statusCode: 400,
      message: result.error.errors[0].message
    })
  }

  const { email, password } = result.data

  // 查找用户
  const user = await prisma.user.findUnique({
    where: { email }
  })

  if (!user) {
    throw createError({
      statusCode: 401,
      message: '邮箱或密码错误'
    })
  }

  // 验证密码
  const isValid = await bcrypt.compare(password, user.password)
  if (!isValid) {
    throw createError({
      statusCode: 401,
      message: '邮箱或密码错误'
    })
  }

  // 生成 token
  const token = signToken({
    userId: user.id,
    email: user.email,
    role: user.role
  })

  // 设置 cookie
  setCookie(event, 'auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7 // 7 days
  })

  return {
    success: true,
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
      avatar: user.avatar,
      role: user.role
    },
    token
  }
})
