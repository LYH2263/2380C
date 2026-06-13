<template>
  <div class="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
    <TransitionGroup
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 translate-x-8"
      enter-to-class="opacity-100 translate-x-0"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100 translate-x-0"
      leave-to-class="opacity-0 translate-x-8"
    >
      <div
        v-for="toast in toasts"
        :key="toast.id"
        :class="[
          'px-4 py-3 rounded-xl shadow-lg flex items-center gap-3 min-w-[280px]',
          typeClasses[toast.type || 'info']
        ]"
      >
        <Icon :name="typeIcons[toast.type || 'info']" class="text-xl flex-shrink-0" />
        <span class="flex-1">{{ toast.message }}</span>
        <button @click="remove(toast.id)" class="hover:opacity-70 transition">
          <Icon name="ph:x" />
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
const { toasts, remove } = useToast()

const typeClasses: Record<string, string> = {
  success: 'bg-green-500/90 text-white',
  error: 'bg-red-500/90 text-white',
  info: 'bg-blue-500/90 text-white',
  warning: 'bg-yellow-500/90 text-white'
}

const typeIcons: Record<string, string> = {
  success: 'ph:check-circle-fill',
  error: 'ph:x-circle-fill',
  info: 'ph:info-fill',
  warning: 'ph:warning-fill'
}
</script>
