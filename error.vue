<template>
  <div class="min-h-screen flex items-center justify-center p-4">
    <div class="card p-12 text-center max-w-md">
      <div class="w-20 h-20 rounded-2xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center mx-auto mb-6">
        <Icon name="ph:warning" class="text-4xl text-white" />
      </div>
      <h1 class="text-3xl font-bold mb-4">出错了</h1>
      <p class="text-white/60 mb-6">
        {{ error?.statusCode === 404 ? '页面不存在' : '发生了一些错误' }}
      </p>
      <p v-if="error?.message" class="text-sm text-white/40 mb-6">
        {{ error.message }}
      </p>
      <div class="flex justify-center gap-4">
        <button @click="handleError" class="btn-primary">
          返回首页
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  error: {
    statusCode: number
    message: string
  }
}>()

const handleError = () => {
  clearError({ redirect: '/' })
}
</script>
