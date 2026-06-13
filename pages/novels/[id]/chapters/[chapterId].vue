<template>
  <div class="min-h-screen">
    <!-- Loading -->
    <div v-if="pending" class="container mx-auto px-4 py-8">
      <div class="animate-pulse space-y-4">
        <div class="h-8 bg-white/10 rounded w-1/3" />
        <div class="h-4 bg-white/10 rounded w-full" />
        <div class="h-4 bg-white/10 rounded w-full" />
        <div class="h-4 bg-white/10 rounded w-2/3" />
      </div>
    </div>

    <!-- Content -->
    <div v-else-if="chapter" class="max-w-4xl mx-auto">
      <!-- Chapter Header -->
      <div class="sticky top-16 z-40 glass border-b border-white/10 px-4 py-3">
        <div class="flex items-center justify-between">
          <NuxtLink
            :to="`/novels/${novelId}`"
            class="flex items-center gap-2 text-white/70 hover:text-white transition"
          >
            <Icon name="ph:caret-left" />
            <span class="hidden md:inline">{{ chapter.novel?.title }}</span>
          </NuxtLink>

          <h1 class="font-bold truncate max-w-md">
            {{ chapter.title }}
          </h1>

          <div class="w-8"></div>
        </div>
      </div>

      <!-- Chapter Content -->
      <article 
        class="px-4 md:px-8 py-8"
      >
        <div class="prose-novel">
          <div
            v-for="(para, index) in paragraphs"
            :key="index"
            class="relative group"
          >
            <p class="mb-4 indent-8 hover:bg-white/5 rounded transition cursor-pointer"
               @click="toggleParagraphComment(index)"
            >
              {{ para }}
            </p>
            
            <!-- Paragraph Comment Indicator -->
            <button
              v-if="paragraphComments[index]?.length"
              @click.stop="toggleParagraphComment(index)"
              class="absolute -right-8 top-0 text-neuro-primary hover:scale-110 transition"
            >
              <Icon name="ph:chat-circle-dots-fill" />
              <span class="text-xs">{{ paragraphComments[index].length }}</span>
            </button>

            <!-- Paragraph Comments -->
            <Transition
              enter-active-class="transition duration-200"
              enter-from-class="opacity-0 scale-95"
              enter-to-class="opacity-100 scale-100"
              leave-active-class="transition duration-150"
              leave-from-class="opacity-100 scale-100"
              leave-to-class="opacity-0 scale-95"
            >
              <div
                v-if="activeParagraph === index"
                class="mt-2 mb-4 p-4 glass rounded-xl"
              >
                <div class="flex items-center justify-between mb-3">
                  <h4 class="font-bold text-sm">段落评论</h4>
                  <button @click="activeParagraph = null" class="text-white/50 hover:text-white">
                    <Icon name="ph:x" />
                  </button>
                </div>

                <!-- Comments List -->
                <div v-if="paragraphComments[index]?.length" class="space-y-3 mb-4 max-h-48 overflow-y-auto">
                  <div
                    v-for="comment in paragraphComments[index]"
                    :key="comment.id"
                    class="flex gap-3 text-sm"
                  >
                    <img
                      :src="comment.user.avatar"
                      :alt="comment.user.username"
                      class="w-6 h-6 rounded-full flex-shrink-0"
                    />
                    <div>
                      <span class="font-medium text-neuro-primary">{{ comment.user.username }}</span>
                      <p class="text-white/80">{{ comment.content }}</p>
                    </div>
                  </div>
                </div>

                <!-- Add Comment -->
                <div v-if="user" class="flex gap-2">
                  <input
                    v-model="newComment"
                    type="text"
                    placeholder="写下你的评论..."
                    class="input-field text-sm py-2"
                    @keyup.enter="submitComment(index)"
                  />
                  <Button
                    @click="submitComment(index)"
                    :loading="commentLoading"
                    variant="primary"
                    size="sm"
                  >
                    发送
                  </Button>
                </div>
                <p v-else class="text-sm text-white/50">
                  <NuxtLink to="/auth/login" class="text-neuro-primary hover:underline">登录</NuxtLink>
                  后可以发表评论
                </p>
              </div>
            </Transition>
          </div>
        </div>
      </article>

      <!-- Chapter Navigation -->
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

          <NuxtLink
            :to="`/novels/${novelId}`"
            class="btn-secondary"
          >
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

      <!-- Chapter Comments Section -->
      <div class="px-4 py-8">
        <div class="card p-6">
          <h3 class="text-xl font-bold mb-4 flex items-center gap-2">
            <Icon name="ph:chat-circle-text" />
            章节评论
          </h3>

          <!-- Comment Form -->
          <div v-if="user" class="mb-6">
            <FormTextarea
              v-model="chapterComment"
              placeholder="分享你对这一章的看法..."
              :rows="3"
            />
            <Button
              @click="submitChapterComment"
              :loading="chapterCommentLoading"
              variant="primary"
              class="mt-2"
            >
              发表评论
            </Button>
          </div>
          <div v-else class="mb-6 p-4 glass rounded-xl text-center">
            <NuxtLink to="/auth/login" class="text-neuro-primary hover:underline">登录</NuxtLink>
            后可以发表评论
          </div>

          <!-- Comments List -->
          <div v-if="chapter.comments?.length" class="space-y-4">
            <div
              v-for="comment in chapter.comments"
              :key="comment.id"
              class="p-4 glass rounded-xl"
            >
              <div class="flex items-start gap-3">
                <img
                  :src="comment.user.avatar"
                  :alt="comment.user.username"
                  class="w-10 h-10 rounded-full"
                />
                <div class="flex-1">
                  <div class="flex items-center gap-2 mb-1">
                    <span class="font-medium">{{ comment.user.username }}</span>
                    <span class="text-xs text-white/50">{{ formatDate(comment.createdAt) }}</span>
                  </div>
                  <p class="text-white/80">{{ comment.content }}</p>

                  <!-- Replies -->
                  <div v-if="comment.replies?.length" class="mt-3 space-y-2 pl-4 border-l-2 border-white/10">
                    <div
                      v-for="reply in comment.replies"
                      :key="reply.id"
                      class="flex items-start gap-2"
                    >
                      <img
                        :src="reply.user.avatar"
                        :alt="reply.user.username"
                        class="w-6 h-6 rounded-full"
                      />
                      <div>
                        <span class="font-medium text-sm">{{ reply.user.username }}</span>
                        <p class="text-sm text-white/70">{{ reply.content }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="text-center py-8 text-white/50">
            暂无评论，来发表第一条评论吧！
          </div>
        </div>
      </div>
    </div>

    <!-- Not Found -->
    <div v-else class="container mx-auto px-4 py-20 text-center">
      <Icon name="ph:warning" class="text-6xl text-white/30 mb-4" />
      <p class="text-xl text-white/50">章节不存在</p>
      <NuxtLink to="/novels" class="btn-primary mt-4 inline-block">
        返回小说库
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const { user } = useAuth()
const toast = useToast()

const novelId = computed(() => route.params.id)
const chapterId = computed(() => route.params.chapterId)

const { data: chapter, pending, refresh } = await useFetch(
  () => `/api/novels/${novelId.value}/chapters/${chapterId.value}`
)

// Comments
const activeParagraph = ref<number | null>(null)
const newComment = ref('')
const chapterComment = ref('')
const commentLoading = ref(false)
const chapterCommentLoading = ref(false)

// Split content into paragraphs
const paragraphs = computed(() => {
  if (!chapter.value?.content) return []
  return chapter.value.content
    .split('\n')
    .map((p: string) => p.trim())
    .filter((p: string) => p.length > 0)
})

// Group comments by paragraph
const paragraphComments = computed(() => {
  if (!chapter.value?.comments) return {}
  const grouped: Record<number, any[]> = {}
  chapter.value.comments.forEach((comment: any) => {
    if (comment.paragraph !== null) {
      if (!grouped[comment.paragraph]) {
        grouped[comment.paragraph] = []
      }
      grouped[comment.paragraph].push(comment)
    }
  })
  return grouped
})

const toggleParagraphComment = (index: number) => {
  activeParagraph.value = activeParagraph.value === index ? null : index
}

const submitComment = async (paragraphIndex: number) => {
  if (!newComment.value.trim()) return
  
  commentLoading.value = true
  try {
    await $fetch(`/api/chapters/${chapterId.value}/comments`, {
      method: 'POST',
      body: {
        content: newComment.value,
        paragraph: paragraphIndex
      }
    })
    newComment.value = ''
    await refresh()
    toast.success('评论成功')
  } catch (e: any) {
    toast.error(e.message || '评论失败')
  } finally {
    commentLoading.value = false
  }
}

const submitChapterComment = async () => {
  if (!chapterComment.value.trim()) return
  
  chapterCommentLoading.value = true
  try {
    await $fetch(`/api/chapters/${chapterId.value}/comments`, {
      method: 'POST',
      body: {
        content: chapterComment.value
      }
    })
    chapterComment.value = ''
    await refresh()
    toast.success('评论成功')
  } catch (e: any) {
    toast.error(e.message || '评论失败')
  } finally {
    chapterCommentLoading.value = false
  }
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

useHead({
  title: computed(() => chapter.value ? `${chapter.value.title} - ${chapter.value.novel?.title}` : '加载中...')
})
</script>
