<template>
  <div>
    <div class="flex items-center gap-4 mb-8">
      <NuxtLink to="/admin/novels" class="p-2 hover:bg-white/10 rounded-lg transition">
        <Icon name="ph:arrow-left" />
      </NuxtLink>
      <div class="flex-1">
        <h1 class="text-3xl font-bold">章节管理</h1>
        <p v-if="novel" class="text-white/60">{{ novel.title }}</p>
      </div>
      <Button @click="showAddModal = true" variant="primary">
        <Icon name="ph:plus" class="mr-2" />
        添加章节
      </Button>
    </div>

    <!-- Chapters List -->
    <div class="card overflow-hidden">
      <div v-if="!chapters.length" class="p-12 text-center text-white/50">
        <Icon name="ph:file-text" class="text-4xl mb-4" />
        <p>暂无章节，点击右上角添加</p>
      </div>
      <div v-else class="divide-y divide-white/10">
        <div
          v-for="chapter in chapters"
          :key="chapter.id"
          class="flex items-center justify-between p-4 hover:bg-white/5 transition"
        >
          <div class="flex items-center gap-4">
            <span class="text-white/50 w-8">{{ chapter.order }}</span>
            <div>
              <p class="font-medium">{{ chapter.title }}</p>
              <p class="text-sm text-white/50">{{ chapter.wordCount }} 字</p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <button
              @click="editChapter(chapter)"
              class="p-2 hover:bg-white/10 rounded-lg transition"
              title="编辑"
            >
              <Icon name="ph:pencil" />
            </button>
            <button
              @click="deleteChapter(chapter)"
              class="p-2 hover:bg-red-500/20 text-red-400 rounded-lg transition"
              title="删除"
            >
              <Icon name="ph:trash" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition duration-200"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition duration-150"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div v-if="showAddModal || editTarget" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
          <div class="card p-6 w-full max-w-4xl my-8">
            <h3 class="text-xl font-bold mb-6">
              {{ editTarget ? '编辑章节' : '添加章节' }}
            </h3>

            <form @submit.prevent="handleSubmit" class="space-y-6">
              <FormInput
                v-model="chapterForm.title"
                label="章节标题"
                placeholder="第一章：xxx"
                required
              />

              <div class="space-y-2">
                <label class="block text-sm font-medium text-white/70">
                  章节内容 <span class="text-neuro-primary">*</span>
                </label>
                <textarea
                  v-model="chapterForm.content"
                  rows="20"
                  class="input-field font-mono text-sm"
                  placeholder="在这里输入章节内容...&#10;&#10;段落之间用空行分隔"
                />
                <p class="text-sm text-white/50">
                  字数：{{ chapterForm.content.replace(/\s/g, '').length }}
                </p>
              </div>

              <div class="flex justify-end gap-4">
                <Button @click="closeModal" type="button" variant="secondary">取消</Button>
                <Button type="submit" :loading="submitLoading" variant="primary">
                  {{ editTarget ? '保存修改' : '添加章节' }}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Delete Confirmation -->
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
              确定要删除章节「{{ deleteTarget.title }}」吗？此操作不可撤销。
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

const route = useRoute()
const toast = useToast()

const novelId = computed(() => route.params.id)

const { data: novelData } = await useFetch(`/api/novels/${novelId.value}`)
const novel = computed(() => novelData.value)

const { data: chaptersData, refresh } = await useFetch(`/api/novels/${novelId.value}/chapters`)
const chapters = computed(() => chaptersData.value?.chapters || [])

const showAddModal = ref(false)
const editTarget = ref<any>(null)
const deleteTarget = ref<any>(null)

const chapterForm = reactive({
  title: '',
  content: ''
})

const submitLoading = ref(false)
const deleteLoading = ref(false)

const editChapter = async (chapter: any) => {
  // 获取完整章节内容
  const { data } = await useFetch(`/api/novels/${novelId.value}/chapters/${chapter.id}`)
  if (data.value) {
    editTarget.value = chapter
    chapterForm.title = data.value.title
    chapterForm.content = data.value.content
  }
}

const deleteChapter = (chapter: any) => {
  deleteTarget.value = chapter
}

const closeModal = () => {
  showAddModal.value = false
  editTarget.value = null
  chapterForm.title = ''
  chapterForm.content = ''
}

const handleSubmit = async () => {
  if (!chapterForm.title.trim() || !chapterForm.content.trim()) {
    toast.warning('请填写完整信息')
    return
  }

  submitLoading.value = true
  try {
    if (editTarget.value) {
      await $fetch(`/api/novels/${novelId.value}/chapters/${editTarget.value.id}`, {
        method: 'PUT',
        body: chapterForm
      })
      toast.success('保存成功')
    } else {
      await $fetch(`/api/novels/${novelId.value}/chapters`, {
        method: 'POST',
        body: chapterForm
      })
      toast.success('添加成功')
    }
    closeModal()
    await refresh()
  } catch (e: any) {
    toast.error(e.message || '操作失败')
  } finally {
    submitLoading.value = false
  }
}

const confirmDelete = async () => {
  if (!deleteTarget.value) return

  deleteLoading.value = true
  try {
    await $fetch(`/api/novels/${novelId.value}/chapters/${deleteTarget.value.id}`, {
      method: 'DELETE'
    })
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
  title: computed(() => novel.value ? `章节管理 - ${novel.value.title}` : '加载中...')
})
</script>
