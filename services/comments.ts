import { api } from '~/utils/api'
import type {
  Comment,
  CreateCommentPayload,
  ChapterWithComments
} from '~/types'

class CommentsService {
  async getChapterComments(chapterId: number): Promise<ChapterWithComments> {
    return api.get<ChapterWithComments>(`/chapters/${chapterId}/comments`)
  }

  async createComment(
    chapterId: number,
    payload: CreateCommentPayload
  ): Promise<Comment> {
    return api.post<Comment>(`/chapters/${chapterId}/comments`, payload, {
      showSuccessToast: true,
      successMessage: '评论发表成功'
    })
  }

  async deleteComment(commentId: number): Promise<void> {
    await api.delete(`/comments/${commentId}`, {
      showSuccessToast: true,
      successMessage: '评论删除成功'
    })
  }
}

export const commentsService = new CommentsService()

export default commentsService
