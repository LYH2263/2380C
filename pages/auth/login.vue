<template>
  <div class="min-h-screen flex items-center justify-center py-12 px-4">
    <div class="w-full max-w-md">
      <div class="card p-8">
        <!-- Header -->
        <div class="text-center mb-8">
          <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-neuro-primary to-neuro-secondary flex items-center justify-center mx-auto mb-4">
            <Icon name="ph:user-circle" class="text-3xl text-white" />
          </div>
          <h1 class="text-2xl font-bold">欢迎回来</h1>
          <p class="text-white/60 mt-2">登录你的账号继续阅读</p>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <FormInput
            v-model="form.email"
            type="email"
            label="邮箱"
            placeholder="your@email.com"
            :error="errors.email"
            required
          />

          <FormInput
            v-model="form.password"
            type="password"
            label="密码"
            placeholder="••••••••"
            :error="errors.password"
            required
          />

          <Button
            type="submit"
            :loading="loading"
            variant="primary"
            class="w-full"
          >
            登录
          </Button>
        </form>

        <!-- Footer -->
        <div class="mt-6 text-center text-white/60">
          还没有账号？
          <NuxtLink to="/auth/register" class="text-neuro-primary hover:underline">
            立即注册
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default'
})

const { login } = useAuth()
const toast = useToast()
const router = useRouter()

const form = reactive({
  email: '',
  password: ''
})

const errors = reactive({
  email: '',
  password: ''
})

const loading = ref(false)

const validate = () => {
  errors.email = ''
  errors.password = ''
  
  if (!form.email) {
    errors.email = '请输入邮箱'
    return false
  }
  if (!/\S+@\S+\.\S+/.test(form.email)) {
    errors.email = '邮箱格式不正确'
    return false
  }
  if (!form.password) {
    errors.password = '请输入密码'
    return false
  }
  if (form.password.length < 6) {
    errors.password = '密码至少6位'
    return false
  }
  return true
}

const handleSubmit = async () => {
  if (!validate()) return

  loading.value = true
  try {
    await login(form.email, form.password)
    toast.success('登录成功')
    router.push('/')
  } catch (e: any) {
    toast.error(e.message || '登录失败')
  } finally {
    loading.value = false
  }
}

useHead({
  title: '登录 - Neurosama 粉丝小说站'
})
</script>
