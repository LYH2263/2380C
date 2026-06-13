<template>
  <div class="px-4 py-8">
    <div class="card p-6">
      <h3 class="text-xl font-bold mb-4 flex items-center gap-2">
        <Icon name="ph:chat-circle-text" />
        章节评论
      </h3>

      <div v-if="user" class="mb-6">
        <FormTextarea
          :value="chapterComment"
          @update:model-value="emit('update:chapterComment', $event)"
          placeholder="分享你对这一章的看法..."
          :rows="3"
        />
        <Button
          @click="emit('submit')"
          :loading="loading"
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

      <div v-if="comments.length" class="space-y-4">
        <div
          v-for="comment in comments"
          :key="comment.id"
          class="p-4 glass rounded-xl"
        >
          <div class="flex items-start gap-3">
            <img
              :src="comment.user.avatar || undefined"
              :alt="comment.user.username"
              class="w-10 h-10 rounded-full"
            />
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-1">
                <span class="font-medium">{{ comment.user.username }}</span>
                <span class="text-xs text-white/50">{{ formatDate(comment.createdAt) }}</span>
              </div>
              <p class="text-white/80">{{ comment.content }}</p>

              <div
                v-if="comment.replies?.length"
                class="mt-3 space-y-2 pl-4 border-l-2 border-white/10"
              >
                <div
                  v-for="reply in comment.replies"
                  :key="reply.id"
                  class="flex items-start gap-2"
                >
                  <img
                    :src="reply.user.avatar || undefined"
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
</template>

<script setup lang="ts">
import type { Comment, CommentUser } from '~/types/comment'

interface Props {
  comments: readonly Comment[]
  chapterComment: string
  loading?: boolean
  user: CommentUser | null
}

withDefaults(defineProps<Props>(), {
  loading: false,
})

const emit = defineEmits<{
  (e: 'update:chapterComment', value: string): void
  (e: 'submit'): void
}>()

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
</script>
