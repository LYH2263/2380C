export default defineNuxtRouteMiddleware((to, from) => {
  const { user, isAdmin } = useAuth()
  
  if (!user.value) {
    return navigateTo('/auth/login')
  }
  
  if (!isAdmin.value) {
    return navigateTo('/')
  }
})
