<template>
  <Transition
    enter-active-class="transition duration-200"
    enter-from-class="opacity-0 scale-95"
    enter-to-class="opacity-100 scale-100"
    leave-active-class="transition duration-150"
    leave-from-class="opacity-100 scale-100"
    leave-to-class="opacity-0 scale-95"
  >
    <div
      v-if="isActive"
      class="mt-2 mb-4 p-4 glass rounded-xl"
    >
      <div class="flex items-center justify-between mb-3">
        <h4 class="font-bold text-sm">段落评论</h4>
        <button @click="$emit('close')" class="text-white/50 hover:text-white">
          <Icon name="ph:x" />
        </button>
      </div>

      <div
        v-if="comments?.length"
        class="space-y-3 mb-4 max-h-48 overflow-y-auto"
      >
        <div
          v-for="comment in comments"
          :key="comment.id"
          class="flex gap-3 text-sm"
        >
          <img
            :src="comment.user.avatar || undefined"
            :alt="comment.user.username"
            class="w-6 h-6 rounded-full flex-shrink-0"
          />
          <div>
            <span class="font-medium text-neuro-primary">
              {{ comment.user.username }}
            </span>
            <p class="text-white/80">{{ comment.content }}</p>
          </div>
        </div>
      </div>

      <div v-if="user" class="flex gap-2">
        <input
          :value="modelValue"
          @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
          type="text"
          placeholder="写下你的评论..."
          class="input-field text-sm py-2"
          @keyup.enter="$emit('submit')"
        />
        <Button
          @click="$emit('submit')"
          :loading="loading"
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
</template>

<script setup lang="ts">
import type { Comment, CommentUser } from '~/types/comment'

interface Props {
  isActive: boolean
  comments: readonly Comment[] | undefined
  modelValue: string
  loading?: boolean
}

withDefaults(defineProps<Props>(), {
  loading: false,
})

defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'close'): void
  (e: 'submit'): void
}>()

const { user } = useAuth() as { user: Ref<CommentUser | null> }
</script>
