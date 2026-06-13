<template>
  <div class="flex items-center gap-1">
    <button
      v-for="i in 5"
      :key="i"
      @click="handleClick(i)"
      :disabled="readonly"
      class="transition-transform hover:scale-110 disabled:cursor-default disabled:hover:scale-100"
    >
      <Icon 
        :name="i <= displayValue ? 'ph:star-fill' : 'ph:star'"
        :class="[
          'text-2xl transition-colors',
          i <= displayValue ? 'text-yellow-400' : 'text-white/30'
        ]"
      />
    </button>
    <span v-if="showValue" class="ml-2 text-white/70">
      {{ modelValue || 0 }} / 5
    </span>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue?: number
  readonly?: boolean
  showValue?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void
}>()

const hoverValue = ref(0)

const displayValue = computed(() => {
  if (hoverValue.value > 0 && !props.readonly) {
    return hoverValue.value
  }
  return props.modelValue || 0
})

const handleClick = (value: number) => {
  if (!props.readonly) {
    emit('update:modelValue', value)
  }
}
</script>
