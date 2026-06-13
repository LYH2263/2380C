import { api } from '~/utils/api'
import type {
  User,
  LoginCredentials,
  RegisterCredentials,
  AuthResponse
} from '~/types'

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return api.post<AuthResponse>('/auth/login', credentials, {
      showSuccessToast: true,
      successMessage: '登录成功'
    })
  }

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    return api.post<AuthResponse>('/auth/register', credentials, {
      showSuccessToast: true,
      successMessage: '注册成功'
    })
  }

  async logout(): Promise<void> {
    await api.post('/auth/logout', {}, { showErrorToast: false })
  }

  async getCurrentUser(): Promise<{ user: User }> {
    return api.get<{ user: User }>('/auth/me')
  }
}

export const authService = new AuthService()

export default authService
