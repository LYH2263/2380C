import { defineStore } from 'pinia'
import { authService } from '~/services/auth'
import type { User, LoginCredentials, RegisterCredentials } from '~/types'

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false
  }),

  getters: {
    isAdmin: (state) => state.user?.role === 'ADMIN',
    userId: (state) => state.user?.id
  },

  actions: {
    initialize() {
      if (process.client) {
        const token = localStorage.getItem('auth_token')
        const userStr = localStorage.getItem('auth_user')
        if (token && userStr) {
          try {
            this.token = token
            this.user = JSON.parse(userStr)
            this.isAuthenticated = true
          } catch (e) {
            this.clearAuth()
          }
        }
      }
    },

    setToken(token: string) {
      this.token = token
      if (process.client) {
        localStorage.setItem('auth_token', token)
      }
    },

    setUser(user: User) {
      this.user = user
      this.isAuthenticated = true
      if (process.client) {
        localStorage.setItem('auth_user', JSON.stringify(user))
      }
    },

    clearAuth() {
      this.user = null
      this.token = null
      this.isAuthenticated = false
      if (process.client) {
        localStorage.removeItem('auth_token')
        localStorage.removeItem('auth_user')
      }
    },

    async login(credentials: LoginCredentials) {
      this.isLoading = true
      try {
        const response = await authService.login(credentials)
        this.setToken(response.token)
        this.setUser(response.user)
        return response
      } finally {
        this.isLoading = false
      }
    },

    async register(credentials: RegisterCredentials) {
      this.isLoading = true
      try {
        const response = await authService.register(credentials)
        this.setToken(response.token)
        this.setUser(response.user)
        return response
      } finally {
        this.isLoading = false
      }
    },

    async logout() {
      try {
        await authService.logout()
      } finally {
        this.clearAuth()
        const router = useRouter()
        router.push('/')
      }
    },

    async fetchUser() {
      this.isLoading = true
      try {
        const response = await authService.getCurrentUser()
        if (response.user) {
          this.setUser(response.user)
          return response.user
        }
        return null
      } catch (error) {
        this.clearAuth()
        return null
      } finally {
        this.isLoading = false
      }
    },

    async validateSession() {
      if (!this.token) {
        this.initialize()
      }
      if (this.token && !this.user) {
        await this.fetchUser()
      }
      return this.isAuthenticated
    }
  }
})
