import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('邮箱格式不正确'),
  password: z.string().min(6, '密码至少6位')
})

export const registerSchema = z.object({
  email: z.string().email('邮箱格式不正确'),
  username: z.string().min(2, '用户名至少2个字符').max(20, '用户名最多20个字符'),
  password: z.string().min(6, '密码至少6位')
})

export const novelSchema = z.object({
  title: z.string().min(1, '标题不能为空').max(100, '标题最多100字'),
  description: z.string().min(10, '简介至少10个字符'),
  cover: z.string().url().optional().or(z.literal('')),
  status: z.enum(['ONGOING', 'COMPLETED', 'HIATUS']).optional(),
  tags: z.array(z.string()).optional()
})

export const chapterSchema = z.object({
  title: z.string().min(1, '章节标题不能为空'),
  content: z.string().min(10, '章节内容至少10个字符'),
  order: z.number().int().positive().optional()
})

export const commentSchema = z.object({
  content: z.string().min(1, '评论不能为空').max(1000, '评论最多1000字'),
  paragraph: z.number().int().nonnegative().optional(),
  parentId: z.number().int().positive().optional()
})

export const ratingSchema = z.object({
  score: z.number().int().min(1, '评分最少1分').max(5, '评分最多5分')
})
