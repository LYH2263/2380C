<template>
  <div class="min-h-screen">
    <!-- Hero Section -->
    <section class="relative py-20 overflow-hidden">
      <!-- Animated Background -->
      <div class="absolute inset-0 overflow-hidden">
        <div class="absolute w-96 h-96 -top-48 -left-48 bg-neuro-primary/30 rounded-full blur-3xl animate-float" />
        <div class="absolute w-96 h-96 -bottom-48 -right-48 bg-neuro-secondary/30 rounded-full blur-3xl animate-float" style="animation-delay: 1s;" />
      </div>

      <div class="container mx-auto px-4 relative">
        <div class="max-w-3xl mx-auto text-center">
          <h1 class="text-5xl md:text-6xl font-bold mb-6">
            <span class="bg-gradient-to-r from-neuro-primary via-neuro-secondary to-neuro-accent bg-clip-text text-transparent">
              Neurosama
            </span>
            <br />
            粉丝二创小说站
          </h1>
          <p class="text-xl text-white/70 mb-8">
            在这里，探索关于 Neuro-sama、Evil Neuro 和 Vedal 的奇妙故事
            <br />
            沉浸在粉丝们创作的无限想象中 💜
          </p>
          <div class="flex justify-center gap-4">
            <NuxtLink to="/novels" class="btn-primary">
              <Icon name="ph:book-open" class="mr-2" />
              开始阅读
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- Popular Novels -->
    <section class="py-16">
      <div class="container mx-auto px-4">
        <div class="flex items-center justify-between mb-8">
          <h2 class="text-2xl font-bold flex items-center gap-2">
            <Icon name="ph:fire-simple-fill" class="text-neuro-primary" />
            热门小说
          </h2>
          <NuxtLink to="/novels?sort=popular" class="text-neuro-primary hover:underline">
            查看更多 →
          </NuxtLink>
        </div>

        <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <NovelCardSkeleton v-for="i in 4" :key="i" />
        </div>
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <NovelCard v-for="novel in popularNovels" :key="novel.id" :novel="novel" />
        </div>
      </div>
    </section>

    <!-- Latest Novels -->
    <section class="py-16">
      <div class="container mx-auto px-4">
        <div class="flex items-center justify-between mb-8">
          <h2 class="text-2xl font-bold flex items-center gap-2">
            <Icon name="ph:clock-fill" class="text-neuro-secondary" />
            最新更新
          </h2>
          <NuxtLink to="/novels?sort=latest" class="text-neuro-secondary hover:underline">
            查看更多 →
          </NuxtLink>
        </div>

        <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <NovelCardSkeleton v-for="i in 4" :key="i" />
        </div>
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <NovelCard v-for="novel in latestNovels" :key="novel.id" :novel="novel" />
        </div>
      </div>
    </section>

    <!-- Tags Section -->
    <section class="py-16">
      <div class="container mx-auto px-4">
        <h2 class="text-2xl font-bold mb-8 flex items-center gap-2">
          <Icon name="ph:tag-fill" class="text-neuro-accent" />
          热门标签
        </h2>
        <div class="flex flex-wrap gap-3">
          <NuxtLink
            v-for="tag in tags"
            :key="tag.name"
            :to="`/novels?tag=${tag.name}`"
            class="px-4 py-2 glass rounded-full hover:bg-white/20 transition flex items-center gap-2"
          >
            <span>#{{ tag.name }}</span>
            <span class="text-white/50 text-sm">({{ tag.count }})</span>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- CTA Section - Only show for non-logged-in users -->
    <section v-if="!user" class="py-20">
      <div class="container mx-auto px-4">
        <div class="card p-12 text-center animate-glow">
          <h2 class="text-3xl font-bold mb-4">
            准备好分享你的故事了吗？
          </h2>
          <p class="text-white/70 mb-8 max-w-xl mx-auto">
            加入我们的创作者社区，让你的 Neurosama 同人故事被更多人看到！
          </p>
          <NuxtLink to="/auth/register" class="btn-primary inline-flex items-center">
            <Icon name="ph:pencil-simple" class="mr-2" />
            立即开始创作
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const { user, fetchUser } = useAuth()

// 初始化用户状态
await fetchUser()

const loading = ref(true)
const popularNovels = ref<any[]>([])
const latestNovels = ref<any[]>([])
const tags = ref<any[]>([])

// 获取数据
const [popularRes, latestRes, tagsRes] = await Promise.all([
  useFetch('/api/novels', { query: { sort: 'popular', limit: 4 } }),
  useFetch('/api/novels', { query: { sort: 'latest', limit: 4 } }),
  useFetch('/api/tags')
])

popularNovels.value = popularRes.data.value?.novels || []
latestNovels.value = latestRes.data.value?.novels || []
tags.value = tagsRes.data.value?.tags?.slice(0, 10) || []
loading.value = false

// SEO
useHead({
  title: 'Neurosama 粉丝小说站 - 首页',
  meta: [
    { name: 'description', content: 'Neurosama 粉丝二创小说阅读平台，探索关于 Neuro-sama、Evil Neuro 和 Vedal 的奇妙故事' }
  ]
})
</script>
