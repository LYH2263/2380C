import { api } from '~/utils/api'
import type {
  NovelListParams,
  NovelListResponse,
  NovelDetail,
  LikeResponse,
  FavoriteResponse,
  RatingPayload,
  RatingResponse
} from '~/types'

class NovelsService {
  async getNovels(params: NovelListParams = {}): Promise<NovelListResponse> {
    return api.get<NovelListResponse>('/novels', { query: params })
  }

  async getNovelById(id: number): Promise<NovelDetail> {
    return api.get<NovelDetail>(`/novels/${id}`)
  }

  async createNovel(data: any): Promise<any> {
    return api.post('/novels', data, {
      showSuccessToast: true,
      successMessage: '创建成功'
    })
  }

  async updateNovel(id: number, data: any): Promise<any> {
    return api.put(`/novels/${id}`, data, {
      showSuccessToast: true,
      successMessage: '更新成功'
    })
  }

  async deleteNovel(id: number): Promise<void> {
    await api.delete(`/novels/${id}`, {
      showSuccessToast: true,
      successMessage: '删除成功'
    })
  }

  async likeNovel(id: number): Promise<LikeResponse> {
    return api.post<LikeResponse>(`/novels/${id}/like`)
  }

  async favoriteNovel(id: number): Promise<FavoriteResponse> {
    return api.post<FavoriteResponse>(`/novels/${id}/favorite`)
  }

  async rateNovel(id: number, payload: RatingPayload): Promise<RatingResponse> {
    return api.post<RatingResponse>(`/novels/${id}/rating`, payload, {
      showSuccessToast: true,
      successMessage: '评分成功'
    })
  }

  async getNovelChapters(novelId: number): Promise<any[]> {
    return api.get<any[]>(`/novels/${novelId}/chapters`)
  }

  async createChapter(novelId: number, data: any): Promise<any> {
    return api.post(`/novels/${novelId}/chapters`, data, {
      showSuccessToast: true,
      successMessage: '章节创建成功'
    })
  }

  async updateChapter(novelId: number, chapterId: number, data: any): Promise<any> {
    return api.put(`/novels/${novelId}/chapters/${chapterId}`, data, {
      showSuccessToast: true,
      successMessage: '章节更新成功'
    })
  }

  async deleteChapter(novelId: number, chapterId: number): Promise<void> {
    await api.delete(`/novels/${novelId}/chapters/${chapterId}`, {
      showSuccessToast: true,
      successMessage: '章节删除成功'
    })
  }
}

export const novelsService = new NovelsService()

export default novelsService
