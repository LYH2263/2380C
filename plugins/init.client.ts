export default defineNuxtPlugin(() => {
  const authStore = useAuthStore()
  const appStore = useAppStore()

  authStore.initialize()
  appStore.initializeConfig()
})
