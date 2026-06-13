<template>
  <div>
    <h1 class="text-3xl font-bold mb-8">用户管理</h1>

    <!-- Users Table -->
    <div class="card overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-white/5">
            <tr>
              <th class="px-6 py-4 text-left text-sm font-medium text-white/70">用户</th>
              <th class="px-6 py-4 text-left text-sm font-medium text-white/70">邮箱</th>
              <th class="px-6 py-4 text-left text-sm font-medium text-white/70">角色</th>
              <th class="px-6 py-4 text-left text-sm font-medium text-white/70">小说</th>
              <th class="px-6 py-4 text-left text-sm font-medium text-white/70">评论</th>
              <th class="px-6 py-4 text-left text-sm font-medium text-white/70">注册时间</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-white/10">
            <tr
              v-for="user in users"
              :key="user.id"
              class="hover:bg-white/5 transition"
            >
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <img
                    :src="user.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'"
                    :alt="user.username"
                    class="w-10 h-10 rounded-full"
                  />
                  <span class="font-medium">{{ user.username }}</span>
                </div>
              </td>
              <td class="px-6 py-4 text-white/70">
                {{ user.email }}
              </td>
              <td class="px-6 py-4">
                <span :class="[
                  'px-2 py-1 rounded text-xs font-medium',
                  user.role === 'ADMIN' ? 'bg-neuro-primary/20 text-neuro-primary' : 'bg-white/10 text-white/70'
                ]">
                  {{ user.role === 'ADMIN' ? '管理员' : '用户' }}
                </span>
              </td>
              <td class="px-6 py-4 text-white/70">
                {{ user._count?.novels || 0 }}
              </td>
              <td class="px-6 py-4 text-white/70">
                {{ user._count?.comments || 0 }}
              </td>
              <td class="px-6 py-4 text-white/70">
                {{ formatDate(user.createdAt) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="pagination && pagination.totalPages > 1" class="p-4 border-t border-white/10 flex justify-center gap-2">
        <button
          @click="page--"
          :disabled="page <= 1"
          class="btn-secondary px-3 py-1 disabled:opacity-50"
        >
          上一页
        </button>
        <span class="px-4 py-1 text-white/70">
          {{ page }} / {{ pagination.totalPages }}
        </span>
        <button
          @click="page++"
          :disabled="page >= pagination.totalPages"
          class="btn-secondary px-3 py-1 disabled:opacity-50"
        >
          下一页
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: 'admin'
})

const page = ref(1)

const { data } = await useFetch('/api/admin/users', {
  query: computed(() => ({ page: page.value, limit: 20 })),
  watch: [page]
})

const users = computed(() => data.value?.users || [])
const pagination = computed(() => data.value?.pagination)

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('zh-CN')
}

useHead({
  title: '用户管理 - 管理后台'
})
</script>
