<template>
  <div class="min-h-screen">
    <template v-if="pending">
      <div class="container mx-auto px-4 py-8">
        <div class="animate-pulse space-y-4">
          <div class="h-8 bg-white/10 rounded w-1/3" />
          <div class="h-4 bg-white/10 rounded w-full" />
          <div class="h-4 bg-white/10 rounded w-full" />
          <div class="h-4 bg-white/10 rounded w-2/3" />
        </div>
      </div>
    </template>

    <template v-else-if="chapter">
      <ChapterHeader :chapter="chapter" :novel-id="String(novelId)" />

      <article class="px-4 md:px-8 py-8">
        <div class="prose-novel">
          <div
            v-for="(para, index) in paragraphs"
            :key="index"
            class="relative group"
          >
            <ParagraphContent
              :para="para"
              :has-comments="!!paragraphComments[index]?.length"
              :comment-count="paragraphComments[index]?.length ?? 0"
              @click="toggleParagraphComment(index)"
              @indicator-click="toggleParagraphComment(index)"
            />

            <ParagraphCommentBlock
              :is-active="activeParagraph === index"
              :comments="paragraphComments[index]"
              v-model="newComment"
              :loading="paragraphCommentLoading"
              @close="activeParagraph = null"
              @submit="submitParagraphComment(index)"
            />
          </div>
        </div>
      </article>

      <ChapterNavigation :chapter="chapter" :novel-id="String(novelId)" />

      <ChapterCommentsSection
        :comments="chapterComments"
        v-model:chapter-comment="chapterComment"
        :loading="chapterCommentLoading"
        :user="user"
        @submit="submitChapterComment"
      />
    </template>

    <template v-else>
      <div class="container mx-auto px-4 py-20 text-center">
        <Icon name="ph:warning" class="text-6xl text-white/30 mb-4" />
        <p class="text-xl text-white/50">章节不存在</p>
        <NuxtLink to="/novels" class="btn-primary mt-4 inline-block">
          返回小说库
        </NuxtLink>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { ChapterWithComments, CommentUser } from '~/types/comment'

const route = useRoute()
const { user } = useAuth() as { user: Ref<CommentUser | null> }

const novelId = computed(() => route.params.id)
const chapterId = computed(() => route.params.chapterId)

const { data: chapter, pending, refresh } = await useFetch<ChapterWithComments>(
  () => `/api/novels/${novelId.value}/chapters/${chapterId.value}`,
)

const {
  activeParagraph,
  newComment,
  chapterComment,
  paragraphCommentLoading,
  chapterCommentLoading,
  paragraphComments,
  toggleParagraphComment,
  submitParagraphComment,
  submitChapterComment,
} = useChapterComments(chapterId, chapter, refresh)

const paragraphs = computed<string[]>(() => {
  if (!chapter.value?.content) return []
  return chapter.value.content
    .split('\n')
    .map((p) => p.trim())
    .filter((p) => p.length > 0)
})

const chapterComments = computed(() => {
  if (!chapter.value?.comments) return []
  return chapter.value.comments.filter((c) => c.paragraph === null)
})

useHead({
  title: computed(() =>
    chapter.value ? `${chapter.value.title} - ${chapter.value.novel?.title}` : '加载中...',
  ),
})
</script>
