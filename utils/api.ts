import type { ApiRequestConfig, ApiErrorResponse } from '~/types'

class ApiClient {
  private baseURL = '/api'
  private abortControllers = new Map<string, AbortController>()

  private async request<T>(
    endpoint: string,
    config: ApiRequestConfig = {}
  ): Promise<T> {
    const {
      method = 'GET',
      headers = {},
      body,
      query,
      signal,
      showErrorToast = true,
      showSuccessToast = false,
      successMessage
    } = config

    const requestKey = `${method}:${endpoint}:${JSON.stringify(query || {})}:${JSON.stringify(body || {})}`

    if (signal) {
      signal.addEventListener('abort', () => {
        this.abortControllers.get(requestKey)?.abort()
      })
    }

    if (this.abortControllers.has(requestKey)) {
      this.abortControllers.get(requestKey)?.abort()
    }

    const controller = new AbortController()
    this.abortControllers.set(requestKey, controller)

    const token = this.getToken()
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    let url = this.baseURL + endpoint
    if (query && Object.keys(query).length > 0) {
      const queryParams = new URLSearchParams()
      Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, String(value))
        }
      })
      const queryString = queryParams.toString()
      if (queryString) {
        url += `?${queryString}`
      }
    }

    const fetchConfig: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      },
      signal: controller.signal
    }

    if (body && method !== 'GET') {
      fetchConfig.body = JSON.stringify(body)
    }

    try {
      const response = await $fetch.raw(url, fetchConfig)

      this.abortControllers.delete(requestKey)

      if (showSuccessToast && successMessage) {
        const toast = useToast()
        toast.success(successMessage)
      }

      return response._data as T
    } catch (error: any) {
      this.abortControllers.delete(requestKey)

      if (error.name === 'AbortError') {
        throw error
      }

      const errorResponse: ApiErrorResponse = {
        statusCode: error.statusCode || error.response?.status || 500,
        statusMessage: error.statusMessage || error.response?.statusText || 'Unknown Error',
        message: error.data?.message || error.message || '请求失败',
        data: error.data
      }

      if (showErrorToast) {
        const toast = useToast()
        toast.error(errorResponse.message)
      }

      if (errorResponse.statusCode === 401) {
        const authStore = useAuthStore()
        authStore.logout()
      }

      throw errorResponse
    }
  }

  private getToken(): string | null {
    if (process.client) {
      return localStorage.getItem('auth_token')
    }
    return null
  }

  get<T>(endpoint: string, config: ApiRequestConfig = {}): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'GET' })
  }

  post<T>(endpoint: string, body?: any, config: ApiRequestConfig = {}): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'POST', body })
  }

  put<T>(endpoint: string, body?: any, config: ApiRequestConfig = {}): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'PUT', body })
  }

  delete<T>(endpoint: string, config: ApiRequestConfig = {}): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'DELETE' })
  }

  patch<T>(endpoint: string, body?: any, config: ApiRequestConfig = {}): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'PATCH', body })
  }

  cancelRequest(requestKey: string): void {
    const controller = this.abortControllers.get(requestKey)
    if (controller) {
      controller.abort()
      this.abortControllers.delete(requestKey)
    }
  }

  cancelAllRequests(): void {
    this.abortControllers.forEach(controller => controller.abort())
    this.abortControllers.clear()
  }
}

export const api = new ApiClient()

export default api
