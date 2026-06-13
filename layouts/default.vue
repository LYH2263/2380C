<template>
  <div class="min-h-screen flex flex-col">
    <!-- Header -->
    <header class="sticky top-0 z-50 glass border-b border-white/10">
      <div class="container mx-auto px-4 h-16 flex items-center justify-between">
        <!-- Logo -->
        <NuxtLink to="/" class="flex items-center gap-3 hover:opacity-80 transition">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-neuro-primary to-neuro-secondary flex items-center justify-center">
            <Icon name="ph:book-open-text-fill" class="text-white text-xl" />
          </div>
          <span class="text-xl font-bold bg-gradient-to-r from-neuro-primary to-neuro-secondary bg-clip-text text-transparent">
            Neuro 小说站
          </span>
        </NuxtLink>

        <!-- Navigation -->
        <nav class="hidden md:flex items-center gap-6">
          <NuxtLink 
            to="/" 
            class="text-white/70 hover:text-white transition"
            active-class="text-white font-semibold"
          >
            首页
          </NuxtLink>
          <NuxtLink 
            to="/novels" 
            class="text-white/70 hover:text-white transition"
            active-class="text-white font-semibold"
          >
            小说库
          </NuxtLink>
          <NuxtLink 
            v-if="user" 
            to="/user/favorites" 
            class="text-white/70 hover:text-white transition"
            active-class="text-white font-semibold"
          >
            我的收藏
          </NuxtLink>
        </nav>

        <!-- User Actions -->
        <div class="flex items-center gap-4">
          <template v-if="user">
            <div class="relative" ref="dropdownRef">
              <button 
                @click="showDropdown = !showDropdown"
                class="flex items-center gap-2 hover:opacity-80 transition"
              >
                <img 
                  :src="user.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'" 
                  :alt="user.username"
                  class="w-8 h-8 rounded-full border-2 border-neuro-primary"
                />
                <span class="hidden md:block text-sm">{{ user.username }}</span>
                <Icon name="ph:caret-down" class="text-white/70" />
              </button>

              <!-- Dropdown -->
              <Transition
                enter-active-class="transition duration-200 ease-out"
                enter-from-class="opacity-0 scale-95"
                enter-to-class="opacity-100 scale-100"
                leave-active-class="transition duration-150 ease-in"
                leave-from-class="opacity-100 scale-100"
                leave-to-class="opacity-0 scale-95"
              >
                <div 
                  v-if="showDropdown"
                  class="absolute right-0 mt-2 w-48 glass rounded-xl shadow-xl overflow-hidden"
                >
                  <NuxtLink 
                    to="/user/favorites" 
                    class="block px-4 py-3 hover:bg-white/10 transition"
                    @click="showDropdown = false"
                  >
                    <Icon name="ph:heart" class="mr-2" />
                    我的收藏
                  </NuxtLink>
                  <NuxtLink 
                    v-if="user.role === 'ADMIN'"
                    to="/admin" 
                    class="block px-4 py-3 hover:bg-white/10 transition"
                    @click="showDropdown = false"
                  >
                    <Icon name="ph:gear" class="mr-2" />
                    管理后台
                  </NuxtLink>
                  <button 
                    @click="handleLogout"
                    class="w-full text-left px-4 py-3 hover:bg-white/10 transition text-red-400"
                  >
                    <Icon name="ph:sign-out" class="mr-2" />
                    退出登录
                  </button>
                </div>
              </Transition>
            </div>
          </template>
          <template v-else>
            <NuxtLink to="/auth/login" class="btn-secondary text-sm py-2 px-4">
              登录
            </NuxtLink>
            <NuxtLink to="/auth/register" class="btn-primary text-sm py-2 px-4">
              注册
            </NuxtLink>
          </template>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="glass border-t border-white/10 py-8">
      <div class="container mx-auto px-4 text-center text-white/50">
        <p class="mb-2">
          💜 Neurosama 粉丝二创小说阅读平台
        </p>
        <p class="text-sm">
          本站所有内容均为粉丝创作，与官方无关
        </p>
      </div>
    </footer>

    <!-- Toast -->
    <Toast />
  </div>
</template>

<script setup lang="ts">
import { onClickOutside } from '@vueuse/core'

const { user, logout } = useAuth()
const showDropdown = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)

onClickOutside(dropdownRef, () => {
  showDropdown.value = false
})

const handleLogout = async () => {
  await logout()
  showDropdown.value = false
  navigateTo('/')
}
</script>
