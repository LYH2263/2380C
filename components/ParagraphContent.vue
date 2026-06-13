<template>
  <p
    class="mb-4 indent-8 hover:bg-white/5 rounded transition cursor-pointer"
    @click="$emit('click')"
  >
    {{ para }}
  </p>
  <button
    v-if="hasComments"
    @click.stop="$emit('indicator-click')"
    class="absolute -right-8 top-0 text-neuro-primary hover:scale-110 transition"
  >
    <Icon name="ph:chat-circle-dots-fill" />
    <span class="text-xs">{{ commentCount }}</span>
  </button>
</template>

<script setup lang="ts">
defineProps<{
  para: string
  hasComments: boolean
  commentCount: number
}>()

defineEmits<{
  (e: 'click'): void
  (e: 'indicator-click'): void
}>()
</script>
