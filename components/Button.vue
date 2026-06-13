<template>
  <button
    :disabled="loading"
    :class="[
      'relative overflow-hidden transition-all duration-300',
      variantClasses[variant],
      sizeClasses[size],
      { 'opacity-50 cursor-not-allowed': loading || disabled }
    ]"
  >
    <span :class="{ 'opacity-0': loading }">
      <slot />
    </span>
    <div v-if="loading" class="absolute inset-0 flex items-center justify-center">
      <Icon name="ph:spinner" class="animate-spin" />
    </div>
  </button>
</template>

<script setup lang="ts">
defineProps<{
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  disabled?: boolean
}>()

const variantClasses: Record<string, string> = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  ghost: 'hover:bg-white/10 rounded-xl transition',
  danger: 'bg-red-500/80 hover:bg-red-500 text-white rounded-xl transition'
}

const sizeClasses: Record<string, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2',
  lg: 'px-6 py-3 text-lg'
}
</script>
