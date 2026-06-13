<template>
  <NuxtLink :to="`/novels/${novel.id}`" class="card group overflow-hidden">
    <!-- Cover Image -->
    <div class="relative aspect-[3/4] overflow-hidden">
      <img 
        :src="novel.cover || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400'" 
        :alt="novel.title"
        class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
      
      <!-- Status Badge -->
      <div 
        :class="[
          'absolute top-3 left-3 px-2 py-1 rounded-lg text-xs font-medium',
          statusClasses[novel.status]
        ]"
      >
        {{ statusLabels[novel.status] }}
      </div>

      <!-- Stats -->
      <div class="absolute bottom-3 left-3 right-3 flex items-center justify-between text-sm">
        <div class="flex items-center gap-3">
          <span class="flex items-center gap-1">
            <Icon name="ph:eye" />
            {{ formatNumber(novel.viewCount) }}
          </span>
          <span class="flex items-center gap-1">
            <Icon name="ph:heart-fill" class="text-neuro-primary" />
            {{ novel._count?.likes || 0 }}
          </span>
        </div>
        <span v-if="novel.avgRating" class="flex items-center gap-1">
          <Icon name="ph:star-fill" class="text-yellow-400" />
          {{ novel.avgRating }}
        </span>
      </div>
    </div>

    <!-- Content -->
    <div class="p-4">
      <h3 class="font-bold text-lg mb-2 line-clamp-1 group-hover:text-neuro-primary transition">
        {{ novel.title }}
      </h3>
      <p class="text-white/60 text-sm line-clamp-2 mb-3">
        {{ novel.description }}
      </p>
      
      <!-- Tags -->
      <div class="flex flex-wrap gap-1 mb-3">
        <span 
          v-for="tag in novel.tags?.slice(0, 3)" 
          :key="tag"
          class="px-2 py-0.5 bg-white/10 rounded-full text-xs text-white/70"
        >
          #{{ tag }}
        </span>
      </div>

      <!-- Author & Chapters -->
      <div class="flex items-center justify-between text-sm text-white/50">
        <div class="flex items-center gap-2">
          <img 
            :src="novel.author?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'" 
            :alt="novel.author?.username"
            class="w-5 h-5 rounded-full"
          />
          <span>{{ novel.author?.username }}</span>
        </div>
        <span>{{ novel._count?.chapters || 0 }} 章</span>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
interface Novel {
  id: number
  title: string
  description: string
  cover?: string
  status: 'ONGOING' | 'COMPLETED' | 'HIATUS'
  tags?: string[]
  viewCount: number
  avgRating?: number
  author?: {
    id: number
    username: string
    avatar?: string
  }
  _count?: {
    chapters: number
    likes: number
  }
}

defineProps<{
  novel: Novel
}>()

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
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + 'w'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k'
  }
  return num.toString()
}
</script>
