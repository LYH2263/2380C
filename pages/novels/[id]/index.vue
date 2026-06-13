<template>
  <div class="min-h-screen py-8">
    <div class="container mx-auto px-4">
      <!-- Loading State -->
      <div v-if="pending" class="animate-pulse space-y-8">
        <div class="flex gap-8">
          <div class="w-64 h-96 bg-white/10 rounded-2xl flex-shrink-0" />
          <div class="flex-1 space-y-4">
            <div class="h-10 bg-white/10 rounded w-1/2" />
            <div class="h-4 bg-white/10 rounded w-full" />
            <div class="h-4 bg-white/10 rounded w-3/4" />
          </div>
        </div>
      </div>

      <!-- Content -->
      <div v-else-if="novel" class="space-y-8">
        <!-- Header -->
        <div class="flex flex-col md:flex-row gap-8">
          <!-- Cover -->
          <div class="w-full md:w-64 flex-shrink-0">
            <img
              :src="novel.cover || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400'"
              :alt="novel.title"
              class="w-full aspect-[3/4] object-cover rounded-2xl shadow-2xl"
            />
          </div>

          <!-- Info -->
          <div class="flex-1">
            <div class="flex items-start justify-between gap-4 mb-4">
              <h1 class="text-3xl md:text-4xl font-bold">{{ novel.title }}</h1>
              <span :class="[
                'px-3 py-1 rounded-lg text-sm font-medium flex-shrink-0',
                statusClasses[novel.status]
              ]">
                {{ statusLabels[novel.status] }}
              </span>
            </div>

            <!-- Author -->
            <div class="flex items-center gap-3 mb-4">
              <img
                :src="novel.author?.avatar"
                :alt="novel.author?.username"
                class="w-10 h-10 rounded-full border-2 border-neuro-primary"
              />
              <div>
                <p class="font-medium">{{ novel.author?.username }}</p>
                <p class="text-sm text-white/50">作者</p>
              </div>
            </div>

            <!-- Stats -->
            <div class="flex flex-wrap gap-6 mb-6 text-white/70">
              <div class="flex items-center gap-2">
                <Icon name="ph:eye" class="text-xl" />
                <span>{{ formatNumber(novel.viewCount) }} 阅读</span>
              </div>
              <div class="flex items-center gap-2">
                <Icon name="ph:heart-fill" class="text-xl text-neuro-primary" />
                <span>{{ novel._count?.likes || 0 }} 点赞</span>
              </div>
              <div class="flex items-center gap-2">
                <Icon name="ph:bookmark-simple-fill" class="text-xl text-neuro-secondary" />
                <span>{{ novel._count?.favorites || 0 }} 收藏</span>
              </div>
              <div class="flex items-center gap-2">
                <Icon name="ph:star-fill" class="text-xl text-yellow-400" />
                <span>{{ novel.avgRating || 0 }} 分 ({{ novel._count?.ratings || 0 }} 人评分)</span>
              </div>
            </div>

            <!-- Tags -->
            <div class="flex flex-wrap gap-2 mb-6">
              <NuxtLink
                v-for="tag in novel.tags"
                :key="tag"
                :to="`/novels?tag=${tag}`"
                class="px-3 py-1 bg-white/10 hover:bg-white/20 rounded-full text-sm transition"
              >
                #{{ tag }}
              </NuxtLink>
            </div>

            <!-- Description -->
            <p class="text-white/80 leading-relaxed mb-6">
              {{ novel.description }}
            </p>

            <!-- Actions -->
            <div class="flex flex-wrap gap-4">
              <NuxtLink
                v-if="novel.chapters?.length > 0"
                :to="`/novels/${novel.id}/chapters/${novel.chapters[0].id}`"
                class="btn-primary"
              >
                <Icon name="ph:book-open" class="mr-2" />
                开始阅读
              </NuxtLink>

              <button
                @click="handleLike"
                :disabled="!user || likeLoading"
                :class="[
                  'btn-secondary flex items-center gap-2',
                  novel.isLiked && 'bg-neuro-primary/20 border-neuro-primary'
                ]"
              >
                <Icon :name="novel.isLiked ? 'ph:heart-fill' : 'ph:heart'" class="text-neuro-primary" />
                {{ novel.isLiked ? '已点赞' : '点赞' }}
              </button>

              <button
                @click="handleFavorite"
                :disabled="!user || favoriteLoading"
                :class="[
                  'btn-secondary flex items-center gap-2',
                  novel.isFavorited && 'bg-neuro-secondary/20 border-neuro-secondary'
                ]"
              >
                <Icon :name="novel.isFavorited ? 'ph:bookmark-simple-fill' : 'ph:bookmark-simple'" class="text-neuro-secondary" />
                {{ novel.isFavorited ? '已收藏' : '收藏' }}
              </button>
            </div>

            <!-- Rating -->
            <div v-if="user" class="mt-6 p-4 glass rounded-xl">
              <p class="text-sm text-white/70 mb-2">我的评分:</p>
              <div class="flex items-center gap-4">
                <StarRating v-model="userRating" />
                <Button
                  v-if="userRating !== novel.userRating"
                  @click="handleRating"
                  :loading="ratingLoading"
                  variant="primary"
                  size="sm"
                >
                  提交评分
                </Button>
              </div>
            </div>
          </div>
        </div>

        <!-- Chapters List -->
        <div class="card p-6">
          <h2 class="text-xl font-bold mb-4 flex items-center gap-2">
            <Icon name="ph:list-numbers" />
            章节列表 ({{ novel.chapters?.length || 0 }} 章)
          </h2>

          <div v-if="novel.chapters?.length === 0" class="text-center py-8 text-white/50">
            暂无章节
          </div>
          <div v-else class="grid gap-2">
            <NuxtLink
              v-for="chapter in novel.chapters"
              :key="chapter.id"
              :to="`/novels/${novel.id}/chapters/${chapter.id}`"
              class="flex items-center justify-between p-4 rounded-xl hover:bg-white/10 transition group"
            >
              <div class="flex items-center gap-4">
                <span class="text-white/50 w-8">{{ chapter.order }}</span>
                <span class="group-hover:text-neuro-primary transition">{{ chapter.title }}</span>
              </div>
              <div class="flex items-center gap-4 text-sm text-white/50">
                <span>{{ chapter.wordCount }} 字</span>
                <span>{{ formatDate(chapter.createdAt) }}</span>
                <Icon name="ph:caret-right" class="group-hover:translate-x-1 transition" />
              </div>
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Not Found -->
      <div v-else class="text-center py-20">
        <Icon name="ph:warning" class="text-6xl text-white/30 mb-4" />
        <p class="text-xl text-white/50">小说不存在</p>
        <NuxtLink to="/novels" class="btn-primary mt-4 inline-block">
          返回小说库
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const { user } = useAuth()
const toast = useToast()

const novelId = computed(() => Number(route.params.id))

const { data: novel, pending, refresh } = await useFetch(`/api/novels/${novelId.value}`)

const userRating = ref(novel.value?.userRating || 0)
const likeLoading = ref(false)
const favoriteLoading = ref(false)
const ratingLoading = ref(false)

watch(() => novel.value?.userRating, (val) => {
  userRating.value = val || 0
})

const statusLabels: Record<string, string> = {
  ONGOING: '连载中',
  COMPLETED: '已完结',
  HIATUS: '暂停更新'
}

const statusClasses: Record<string, string> = {
  ONGOING: 'bg-green-500/80 text-white',
  COMPLETED: 'bg-blue-500/80 text-white',
  HIATUS: 'bg-yellow-500/80 text-white'
}

const formatNumber = (num: number) => {
  if (num >= 10000) return (num / 10000).toFixed(1) + 'w'
  if (num >= 1000) return (num / 1000).toFixed(1) + 'k'
  return num.toString()
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('zh-CN')
}

const handleLike = async () => {
  if (!user.value) {
    toast.warning('请先登录')
    return
  }
  likeLoading.value = true
  try {
    await $fetch(`/api/novels/${novelId.value}/like`, { method: 'POST' })
    await refresh()
    toast.success(novel.value?.isLiked ? '点赞成功' : '已取消点赞')
  } catch (e: any) {
    toast.error(e.message || '操作失败')
  } finally {
    likeLoading.value = false
  }
}

const handleFavorite = async () => {
  if (!user.value) {
    toast.warning('请先登录')
    return
  }
  favoriteLoading.value = true
  try {
    await $fetch(`/api/novels/${novelId.value}/favorite`, { method: 'POST' })
    await refresh()
    toast.success(novel.value?.isFavorited ? '收藏成功' : '已取消收藏')
  } catch (e: any) {
    toast.error(e.message || '操作失败')
  } finally {
    favoriteLoading.value = false
  }
}

const handleRating = async () => {
  ratingLoading.value = true
  try {
    await $fetch(`/api/novels/${novelId.value}/rating`, {
      method: 'POST',
      body: { score: userRating.value }
    })
    await refresh()
    toast.success('评分成功')
  } catch (e: any) {
    toast.error(e.message || '评分失败')
  } finally {
    ratingLoading.value = false
  }
}

useHead({
  title: computed(() => novel.value ? `${novel.value.title} - Neurosama 粉丝小说站` : '加载中...')
})
</script>
