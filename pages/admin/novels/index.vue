<template>
  <div>
    <div class="flex items-center justify-between mb-8">
      <h1 class="text-3xl font-bold">小说管理</h1>
      <NuxtLink to="/admin/novels/new" class="btn-primary">
        <Icon name="ph:plus" class="mr-2" />
        添加小说
      </NuxtLink>
    </div>

    <!-- Novels Table -->
    <div class="card overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-white/5">
            <tr>
              <th class="px-6 py-4 text-left text-sm font-medium text-white/70">小说</th>
              <th class="px-6 py-4 text-left text-sm font-medium text-white/70">作者</th>
              <th class="px-6 py-4 text-left text-sm font-medium text-white/70">状态</th>
              <th class="px-6 py-4 text-left text-sm font-medium text-white/70">章节</th>
              <th class="px-6 py-4 text-left text-sm font-medium text-white/70">阅读量</th>
              <th class="px-6 py-4 text-right text-sm font-medium text-white/70">操作</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-white/10">
            <tr
              v-for="novel in novels"
              :key="novel.id"
              class="hover:bg-white/5 transition"
            >
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <img
                    :src="novel.cover || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=100'"
                    :alt="novel.title"
                    class="w-12 h-16 object-cover rounded"
                  />
                  <div>
                    <p class="font-medium">{{ novel.title }}</p>
                    <p class="text-sm text-white/50 line-clamp-1 max-w-xs">{{ novel.description }}</p>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 text-white/70">
                {{ novel.author?.username }}
              </td>
              <td class="px-6 py-4">
                <span :class="[
                  'px-2 py-1 rounded text-xs font-medium',
                  statusClasses[novel.status]
                ]">
                  {{ statusLabels[novel.status] }}
                </span>
              </td>
              <td class="px-6 py-4 text-white/70">
                {{ novel._count?.chapters || 0 }} 章
              </td>
              <td class="px-6 py-4 text-white/70">
                {{ novel.viewCount }}
              </td>
              <td class="px-6 py-4 text-right">
                <div class="flex items-center justify-end gap-2">
                  <NuxtLink
                    :to="`/admin/novels/${novel.id}/edit`"
                    class="p-2 hover:bg-white/10 rounded-lg transition"
                    title="编辑"
                  >
                    <Icon name="ph:pencil" />
                  </NuxtLink>
                  <NuxtLink
                    :to="`/admin/novels/${novel.id}/chapters`"
                    class="p-2 hover:bg-white/10 rounded-lg transition"
                    title="章节管理"
                  >
                    <Icon name="ph:list" />
                  </NuxtLink>
                  <button
                    @click="handleDelete(novel)"
                    class="p-2 hover:bg-red-500/20 text-red-400 rounded-lg transition"
                    title="删除"
                  >
                    <Icon name="ph:trash" />
                  </button>
                </div>
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

    <!-- Delete Confirmation Modal -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition duration-200"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition duration-150"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div v-if="deleteTarget" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div class="card p-6 max-w-md w-full">
            <h3 class="text-xl font-bold mb-4">确认删除</h3>
            <p class="text-white/70 mb-6">
              确定要删除小说「{{ deleteTarget.title }}」吗？此操作不可撤销，所有章节和评论也将被删除。
            </p>
            <div class="flex justify-end gap-4">
              <Button @click="deleteTarget = null" variant="secondary">取消</Button>
              <Button @click="confirmDelete" :loading="deleteLoading" variant="danger">删除</Button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: 'admin'
})

const toast = useToast()

const page = ref(1)

const { data, refresh } = await useFetch('/api/novels', {
  query: computed(() => ({ page: page.value, limit: 10 })),
  watch: [page]
})

const novels = computed(() => data.value?.novels || [])
const pagination = computed(() => data.value?.pagination)

const statusLabels: Record<string, string> = {
  ONGOING: '连载中',
  COMPLETED: '已完结',
  HIATUS: '暂停更新'
}

const statusClasses: Record<string, string> = {
  ONGOING: 'bg-green-500/80 text-white',
  COMPLETED: 'bg-blue-500/80 text-white',
  HIATUS: 'bg-yellow-500/80 text-white'
}

const deleteTarget = ref<any>(null)
const deleteLoading = ref(false)

const handleDelete = (novel: any) => {
  deleteTarget.value = novel
}

const confirmDelete = async () => {
  if (!deleteTarget.value) return
  
  deleteLoading.value = true
  try {
    await $fetch(`/api/novels/${deleteTarget.value.id}`, { method: 'DELETE' })
    toast.success('删除成功')
    deleteTarget.value = null
    await refresh()
  } catch (e: any) {
    toast.error(e.message || '删除失败')
  } finally {
    deleteLoading.value = false
  }
}

useHead({
  title: '小说管理 - 管理后台'
})
</script>
