export const useAuth = () => {
  const user = useState<any>('user', () => null)
  const token = useState<string | null>('token', () => null)

  const fetchUser = async () => {
    try {
      const { data } = await useFetch('/api/auth/me')
      if (data.value?.user) {
        user.value = data.value.user
      }
    } catch (error) {
      user.value = null
    }
  }

  const login = async (email: string, password: string) => {
    const { data, error } = await useFetch('/api/auth/login', {
      method: 'POST',
      body: { email, password }
    })

    if (error.value) {
      throw new Error(error.value.data?.message || '登录失败')
    }

    if (data.value) {
      user.value = data.value.user
      token.value = data.value.token
    }

    return data.value
  }

  const register = async (email: string, username: string, password: string) => {
    const { data, error } = await useFetch('/api/auth/register', {
      method: 'POST',
      body: { email, username, password }
    })

    if (error.value) {
      throw new Error(error.value.data?.message || '注册失败')
    }

    if (data.value) {
      user.value = data.value.user
      token.value = data.value.token
    }

    return data.value
  }

  const logout = async () => {
    await useFetch('/api/auth/logout', { method: 'POST' })
    user.value = null
    token.value = null
  }

  const isAdmin = computed(() => user.value?.role === 'ADMIN')

  return {
    user,
    token,
    isAdmin,
    fetchUser,
    login,
    register,
    logout
  }
}
