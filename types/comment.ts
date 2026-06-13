export interface CommentUser {
  id: number
  username: string
  avatar: string | null
}

export interface Comment {
  id: number
  userId: number
  chapterId: number
  content: string
  paragraph: number | null
  parentId: number | null
  createdAt: string
  updatedAt: string
  user: CommentUser
  replies?: Comment[]
}

export interface ChapterWithComments {
  id: number
  novelId: number
  title: string
  content: string
  order: number
  wordCount: number
  createdAt: string
  updatedAt: string
  novel?: {
    id: number
    title: string
  }
  prevChapter?: {
    id: number
    title: string
  }
  nextChapter?: {
    id: number
    title: string
  }
  comments?: Comment[]
}

export type ParagraphCommentMap = Readonly<Record<number, readonly Comment[]>>

export interface CreateCommentPayload {
  content: string
  paragraph?: number
  parentId?: number
}

export interface SubmitCommentOptions {
  content: string
  paragraphIndex?: number
  onSuccess?: () => void | Promise<void>
}

export interface CommentListParams {
  chapterId: number
}
