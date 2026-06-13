<template>
  <div>
    <h1 class="text-3xl font-bold mb-8">数据概览</h1>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div class="card p-6">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-neuro-primary/20 flex items-center justify-center">
            <Icon name="ph:book-fill" class="text-2xl text-neuro-primary" />
          </div>
          <div>
            <p class="text-white/60 text-sm">总小说数</p>
            <p class="text-2xl font-bold">{{ stats?.totalNovels || 0 }}</p>
          </div>
        </div>
      </div>

      <div class="card p-6">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-neuro-secondary/20 flex items-center justify-center">
            <Icon name="ph:users-fill" class="text-2xl text-neuro-secondary" />
          </div>
          <div>
            <p class="text-white/60 text-sm">注册用户</p>
            <p class="text-2xl font-bold">{{ stats?.totalUsers || 0 }}</p>
          </div>
        </div>
      </div>

      <div class="card p-6">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-neuro-accent/20 flex items-center justify-center">
            <Icon name="ph:file-text-fill" class="text-2xl text-neuro-accent" />
          </div>
          <div>
            <p class="text-white/60 text-sm">总章节数</p>
            <p class="text-2xl font-bold">{{ stats?.totalChapters || 0 }}</p>
          </div>
        </div>
      </div>

      <div class="card p-6">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-yellow-400/20 flex items-center justify-center">
            <Icon name="ph:chat-circle-text-fill" class="text-2xl text-yellow-400" />
          </div>
          <div>
            <p class="text-white/60 text-sm">总评论数</p>
            <p class="text-2xl font-bold">{{ stats?.totalComments || 0 }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Recent Novels -->
      <div class="card p-6">
        <h2 class="text-xl font-bold mb-4 flex items-center gap-2">
          <Icon name="ph:clock" />
          最新小说
        </h2>
        <div class="space-y-3">
          <div
            v-for="novel in recentNovels"
            :key="novel.id"
            class="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition"
          >
            <div>
              <p class="font-medium">{{ novel.title }}</p>
              <p class="text-sm text-white/50">{{ novel.author?.username }}</p>
            </div>
            <NuxtLink
              :to="`/admin/novels/${novel.id}/edit`"
              class="text-neuro-primary hover:underline text-sm"
            >
              编辑
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Popular Novels -->
      <div class="card p-6">
        <h2 class="text-xl font-bold mb-4 flex items-center gap-2">
          <Icon name="ph:fire" />
          热门小说
        </h2>
        <div class="space-y-3">
          <div
            v-for="novel in popularNovels"
            :key="novel.id"
            class="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition"
          >
            <div>
              <p class="font-medium">{{ novel.title }}</p>
            </div>
            <div class="flex items-center gap-2 text-white/50">
              <Icon name="ph:eye" />
              <span>{{ novel.viewCount }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: 'admin'
})

const { data } = await useFetch('/api/admin/stats')
const stats = computed(() => data.value?.stats)
const recentNovels = computed(() => data.value?.recentNovels || [])
const popularNovels = computed(() => data.value?.popularNovels || [])

useHead({
  title: '管理后台 - Neurosama 粉丝小说站'
})
</script>
