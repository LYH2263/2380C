export type NovelStatus = 'ONGOING' | 'COMPLETED' | 'HIATUS'

export interface NovelAuthor {
  id: number
  username: string
  avatar: string | null
}

export interface NovelCounts {
  chapters: number
  likes: number
  favorites: number
  ratings: number
}

export interface NovelListItem {
  id: number
  title: string
  description: string
  cover: string | null
  status: NovelStatus
  tags: string[]
  viewCount: number
  createdAt: string
  updatedAt: string
  author: NovelAuthor
  avgRating: number
  isLiked: boolean
  isFavorited: boolean
  _count: NovelCounts
}

export interface NovelChapter {
  id: number
  title: string
  order: number
  wordCount: number
  createdAt: string
}

export interface NovelDetail extends NovelListItem {
  chapters: NovelChapter[]
  userRating: number | null
}

export interface NovelListParams {
  page?: number
  limit?: number
  search?: string
  tag?: string
  status?: NovelStatus | ''
  sort?: 'latest' | 'popular' | 'rating'
}

export interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface NovelListResponse {
  novels: NovelListItem[]
  pagination: Pagination
}

export interface LikeResponse {
  liked: boolean
}

export interface FavoriteResponse {
  favorited: boolean
}

export interface RatingPayload {
  score: number
}

export interface RatingResponse {
  success: boolean
  avgRating: number
  userRating: number
}
