<template>
  <div class="sticky bottom-0 glass border-t border-white/10 px-4 py-4">
    <div class="flex items-center justify-between">
      <NuxtLink
        v-if="chapter.prevChapter"
        :to="`/novels/${novelId}/chapters/${chapter.prevChapter.id}`"
        class="btn-secondary"
      >
        <Icon name="ph:caret-left" class="mr-1" />
        上一章
      </NuxtLink>
      <div v-else />
      <NuxtLink :to="`/novels/${novelId}`" class="btn-secondary">
        <Icon name="ph:list" class="mr-1" />
        目录
      </NuxtLink>
      <NuxtLink
        v-if="chapter.nextChapter"
        :to="`/novels/${novelId}/chapters/${chapter.nextChapter.id}`"
        class="btn-secondary"
      >
        下一章
        <Icon name="ph:caret-right" class="ml-1" />
      </NuxtLink>
      <div v-else />
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
