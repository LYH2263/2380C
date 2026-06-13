<template>
  <div class="min-h-screen py-8">
    <div class="container mx-auto px-4">
      <h1 class="text-3xl font-bold mb-8">我的收藏</h1>

      <div v-if="pending" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <NovelCardSkeleton v-for="i in 4" :key="i" />
      </div>
      <div v-else-if="favorites.length === 0" class="text-center py-20">
        <Icon name="ph:heart" class="text-6xl text-white/30 mb-4" />
        <p class="text-xl text-white/50">还没有收藏任何小说</p>
        <NuxtLink to="/novels" class="btn-primary mt-4 inline-block">
          去小说库看看
        </NuxtLink>
      </div>
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <NovelCard v-for="novel in favorites" :key="novel.id" :novel="novel" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})

const { data, pending } = await useFetch('/api/user/favorites')
const favorites = computed(() => data.value?.favorites || [])

useHead({
  title: '我的收藏 - Neurosama 粉丝小说站'
})
</script>
