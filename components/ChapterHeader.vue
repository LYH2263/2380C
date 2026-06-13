<template>
  <div class="sticky top-16 z-40 glass border-b border-white/10 px-4 py-3">
    <div class="flex items-center justify-between">
      <NuxtLink
        :to="`/novels/${novelId}`"
        class="flex items-center gap-2 text-white/70 hover:text-white transition"
      >
        <Icon name="ph:caret-left" />
        <span class="hidden md:inline">{{ chapter.novel?.title }}</span>
      </NuxtLink>
      <h1 class="font-bold truncate max-w-md">{{ chapter.title }}</h1>
      <div class="w-8"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ChapterWithComments } from '~/types/comment'

defineProps<{
  chapter: ChapterWithComments
  novelId: string
}>()
</script>
