<template>
  <div class="space-y-2">
    <label v-if="label" :for="id" class="block text-sm font-medium text-white/70">
      {{ label }}
      <span v-if="required" class="text-neuro-primary">*</span>
    </label>
    <textarea
      :id="id"
      :value="modelValue"
      @input="emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
      :placeholder="placeholder"
      :rows="rows"
      :disabled="disabled"
      :class="[
        'input-field resize-none',
        { 'border-red-500': error }
      ]"
    />
    <p v-if="error" class="text-red-400 text-sm">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: string
  label?: string
  placeholder?: string
  rows?: number
  error?: string
  required?: boolean
  disabled?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const id = `textarea-${Math.random().toString(36).slice(2)}`
</script>
