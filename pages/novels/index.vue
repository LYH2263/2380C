<template>
  <div class="min-h-screen py-8">
    <div class="container mx-auto px-4">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold mb-4">小说库</h1>
        
        <!-- Filters -->
        <div class="flex flex-wrap gap-4 items-center">
          <!-- Search -->
          <div class="flex-1 min-w-[200px] max-w-md">
            <div class="relative">
              <Icon name="ph:magnifying-glass" class="absolute left-3 top-1/2 -translate-y-1/2 text-white/50" />
              <input
                v-model="search"
                type="text"
                placeholder="搜索小说..."
                class="input-field pl-10"
                @keyup.enter="handleSearch"
              />
            </div>
          </div>

          <!-- Status Filter -->
          <select v-model="status" class="input-field w-auto">
            <option value="">全部状态</option>
            <option value="ONGOING">连载中</option>
            <option value="COMPLETED">已完结</option>
            <option value="HIATUS">暂停更新</option>
          </select>

          <!-- Sort -->
          <select v-model="sort" class="input-field w-auto">
            <option value="latest">最新更新</option>
            <option value="popular">最多阅读</option>
            <option value="rating">最高评分</option>
          </select>
        </div>

        <!-- Active Tag -->
        <div v-if="tag" class="mt-4 flex items-center gap-2">
          <span class="text-white/70">当前标签:</span>
          <span class="px-3 py-1 bg-neuro-primary/20 border border-neuro-primary/50 rounded-full flex items-center gap-2">
            #{{ tag }}
            <button @click="tag = ''" class="hover:text-neuro-primary">
              <Icon name="ph:x" />
            </button>
          </span>
        </div>
      </div>

      <!-- Results -->
      <div v-if="pending" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <NovelCardSkeleton v-for="i in 8" :key="i" />
      </div>
      <div v-else-if="novels.length === 0" class="text-center py-20">
        <Icon name="ph:book-open" class="text-6xl text-white/30 mb-4" />
        <p class="text-xl text-white/50">暂无小说</p>
        <p class="text-white/30 mt-2">换个搜索条件试试？</p>
      </div>
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <NovelCard v-for="novel in novels" :key="novel.id" :novel="novel" />
      </div>

      <!-- Pagination -->
      <div v-if="pagination && pagination.totalPages > 1" class="mt-12 flex justify-center gap-2">
        <button
          @click="page = page - 1"
          :disabled="page <= 1"
          class="btn-secondary px-4 py-2 disabled:opacity-50"
        >
          <Icon name="ph:caret-left" />
        </button>
        
        <template v-for="p in displayPages" :key="p">
          <button
            v-if="p === '...'"
            disabled
            class="px-4 py-2 text-white/50"
          >
            ...
          </button>
          <button
            v-else
            @click="page = p as number"
            :class="[
              'px-4 py-2 rounded-xl transition',
              page === p ? 'bg-neuro-primary text-white' : 'hover:bg-white/10'
            ]"
          >
            {{ p }}
          </button>
        </template>

        <button
          @click="page = page + 1"
          :disabled="page >= pagination.totalPages"
          class="btn-secondary px-4 py-2 disabled:opacity-50"
        >
          <Icon name="ph:caret-right" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const router = useRouter()

const page = ref(Number(route.query.page) || 1)
const search = ref((route.query.search as string) || '')
const tag = ref((route.query.tag as string) || '')
const status = ref((route.query.status as string) || '')
const sort = ref((route.query.sort as string) || 'latest')

const { data, pending, refresh } = await useFetch('/api/novels', {
  query: computed(() => ({
    page: page.value,
    search: search.value,
    tag: tag.value,
    status: status.value,
    sort: sort.value,
    limit: 12
  })),
  watch: [page, tag, status, sort]
})

const novels = computed(() => data.value?.novels || [])
const pagination = computed(() => data.value?.pagination)

const displayPages = computed(() => {
  if (!pagination.value) return []
  const total = pagination.value.totalPages
  const current = page.value
  const pages: (number | string)[] = []

  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i)
  } else {
    pages.push(1)
    if (current > 3) pages.push('...')
    for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
      pages.push(i)
    }
    if (current < total - 2) pages.push('...')
    pages.push(total)
  }

  return pages
})

const handleSearch = () => {
  page.value = 1
  refresh()
}

// 同步 URL
watch([page, search, tag, status, sort], () => {
  const query: any = {}
  if (page.value > 1) query.page = page.value
  if (search.value) query.search = search.value
  if (tag.value) query.tag = tag.value
  if (status.value) query.status = status.value
  if (sort.value !== 'latest') query.sort = sort.value
  
  router.replace({ query })
})

useHead({
  title: '小说库 - Neurosama 粉丝小说站'
})
</script>
