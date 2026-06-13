import bcrypt from 'bcryptjs'
import prisma from '~/server/utils/prisma'
import { registerSchema } from '~/server/utils/validators'
import { signToken } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  
  // 验证输入
  const result = registerSchema.safeParse(body)
  if (!result.success) {
    throw createError({
      statusCode: 400,
      message: result.error.errors[0].message
    })
  }

  const { email, username, password } = result.data

  // 检查邮箱是否已存在
  const existingEmail = await prisma.user.findUnique({
    where: { email }
  })
  if (existingEmail) {
    throw createError({
      statusCode: 400,
      message: '该邮箱已被注册'
    })
  }

  // 检查用户名是否已存在
  const existingUsername = await prisma.user.findUnique({
    where: { username }
  })
  if (existingUsername) {
    throw createError({
      statusCode: 400,
      message: '该用户名已被使用'
    })
  }

  // 加密密码
  const hashedPassword = await bcrypt.hash(password, 10)

  // 创建用户
  const user = await prisma.user.create({
    data: {
      email,
      username,
      password: hashedPassword,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`
    }
  })

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
    maxAge: 60 * 60 * 24 * 7
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
