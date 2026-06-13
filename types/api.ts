export interface ApiErrorResponse {
  statusCode: number
  statusMessage: string
  message: string
  data?: any
}

export interface ApiRequestConfig {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  headers?: Record<string, string>
  body?: any
  query?: Record<string, any>
  params?: Record<string, any>
  signal?: AbortSignal
  showErrorToast?: boolean
  showSuccessToast?: boolean
  successMessage?: string
}

export interface ApiResponse<T = any> {
  data: T
  error: ApiErrorResponse | null
  pending: boolean
}

export interface RequestInterceptor {
  (config: ApiRequestConfig): ApiRequestConfig | Promise<ApiRequestConfig>
}

export interface ResponseInterceptor<T = any> {
  (response: T): T | Promise<T>
}

export interface ErrorInterceptor {
  (error: ApiErrorResponse): void | Promise<void>
}
