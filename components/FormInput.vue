<template>
  <div class="space-y-2">
    <label v-if="label" :for="id" class="block text-sm font-medium text-white/70">
      {{ label }}
      <span v-if="required" class="text-neuro-primary">*</span>
    </label>
    <div class="relative">
      <input
        :id="id"
        :type="showPassword ? 'text' : type"
        :value="modelValue"
        @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        :placeholder="placeholder"
        :disabled="disabled"
        :class="[
          'input-field',
          { 'pr-10': type === 'password' },
          { 'border-red-500': error }
        ]"
      />
      <button
        v-if="type === 'password'"
        type="button"
        @click="showPassword = !showPassword"
        class="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
      >
        <Icon :name="showPassword ? 'ph:eye-slash' : 'ph:eye'" />
      </button>
    </div>
    <p v-if="error" class="text-red-400 text-sm">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: string
  type?: string
  label?: string
  placeholder?: string
  error?: string
  required?: boolean
  disabled?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const id = `input-${Math.random().toString(36).slice(2)}`
const showPassword = ref(false)
</script>
