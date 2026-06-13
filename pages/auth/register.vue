<template>
  <div class="min-h-screen flex items-center justify-center py-12 px-4">
    <div class="w-full max-w-md">
      <div class="card p-8">
        <!-- Header -->
        <div class="text-center mb-8">
          <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-neuro-primary to-neuro-secondary flex items-center justify-center mx-auto mb-4">
            <Icon name="ph:user-plus" class="text-3xl text-white" />
          </div>
          <h1 class="text-2xl font-bold">创建账号</h1>
          <p class="text-white/60 mt-2">加入 Neurosama 粉丝社区</p>
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
            v-model="form.username"
            type="text"
            label="用户名"
            placeholder="你的昵称"
            :error="errors.username"
            required
          />

          <FormInput
            v-model="form.password"
            type="password"
            label="密码"
            placeholder="至少6位字符"
            :error="errors.password"
            required
          />

          <FormInput
            v-model="form.confirmPassword"
            type="password"
            label="确认密码"
            placeholder="再次输入密码"
            :error="errors.confirmPassword"
            required
          />

          <Button
            type="submit"
            :loading="loading"
            variant="primary"
            class="w-full"
          >
            注册
          </Button>
        </form>

        <!-- Footer -->
        <div class="mt-6 text-center text-white/60">
          已有账号？
          <NuxtLink to="/auth/login" class="text-neuro-primary hover:underline">
            立即登录
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

const { register } = useAuth()
const toast = useToast()
const router = useRouter()

const form = reactive({
  email: '',
  username: '',
  password: '',
  confirmPassword: ''
})

const errors = reactive({
  email: '',
  username: '',
  password: '',
  confirmPassword: ''
})

const loading = ref(false)

const validate = () => {
  errors.email = ''
  errors.username = ''
  errors.password = ''
  errors.confirmPassword = ''
  
  if (!form.email) {
    errors.email = '请输入邮箱'
    return false
  }
  if (!/\S+@\S+\.\S+/.test(form.email)) {
    errors.email = '邮箱格式不正确'
    return false
  }
  if (!form.username) {
    errors.username = '请输入用户名'
    return false
  }
  if (form.username.length < 2 || form.username.length > 20) {
    errors.username = '用户名长度应在2-20个字符之间'
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
  if (form.password !== form.confirmPassword) {
    errors.confirmPassword = '两次输入的密码不一致'
    return false
  }
  return true
}

const handleSubmit = async () => {
  if (!validate()) return

  loading.value = true
  try {
    await register(form.email, form.username, form.password)
    toast.success('注册成功')
    router.push('/')
  } catch (e: any) {
    toast.error(e.message || '注册失败')
  } finally {
    loading.value = false
  }
}

useHead({
  title: '注册 - Neurosama 粉丝小说站'
})
</script>
