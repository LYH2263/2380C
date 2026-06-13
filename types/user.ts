export type UserRole = 'USER' | 'ADMIN'

export interface User {
  id: number
  email: string
  username: string
  avatar: string | null
  role: UserRole
  createdAt: string
  updatedAt: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  email: string
  username: string
  password: string
}

export interface AuthResponse {
  success: boolean
  user: User
  token: string
}

export interface UserProfile {
  id: number
  username: string
  avatar: string | null
}
