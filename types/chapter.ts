import type { Comment } from './comment'

export interface Chapter {
  id: number
  novelId: number
  title: string
  content: string
  order: number
  wordCount: number
  createdAt: string
  updatedAt: string
}

export interface ChapterDetail extends Chapter {
  novel: {
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

export interface ChapterListParams {
  novelId: number
}

export interface ChapterCreatePayload {
  novelId: number
  title: string
  content: string
  order: number
}

export interface ChapterUpdatePayload {
  title?: string
  content?: string
  order?: number
}
