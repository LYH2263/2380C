export default defineNuxtPlugin(async () => {
  const { fetchUser } = useAuth()
  
  // 在客户端初始化时获取用户信息
  if (import.meta.client) {
    await fetchUser()
  }
})
