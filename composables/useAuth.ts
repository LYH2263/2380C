import { storeToRefs } from 'pinia'

export const useAuth = () => {
  const authStore = useAuthStore()

  const { user, token, isAuthenticated, isLoading } = storeToRefs(authStore)
  const isAdmin = computed(() => authStore.isAdmin)

  const fetchUser = async () => {
    return await authStore.fetchUser()
  }

  const login = async (email: string, password: string) => {
    return await authStore.login({ email, password })
  }

  const register = async (email: string, username: string, password: string) => {
    return await authStore.register({ email, username, password })
  }

  const logout = async () => {
    await authStore.logout()
  }

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    isAdmin,
    fetchUser,
    login,
    register,
    logout
  }
}
