<template>
  <div class="min-h-screen flex">
    <!-- Sidebar -->
    <aside class="w-64 glass border-r border-white/10 flex-shrink-0">
      <div class="p-4 border-b border-white/10">
        <NuxtLink to="/" class="flex items-center gap-2 hover:opacity-80 transition">
          <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-neuro-primary to-neuro-secondary flex items-center justify-center">
            <Icon name="ph:gear-six-fill" class="text-white" />
          </div>
          <span class="font-bold">管理后台</span>
        </NuxtLink>
      </div>

      <nav class="p-4 space-y-2">
        <NuxtLink
          to="/admin"
          class="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 transition"
          active-class="bg-white/10 text-neuro-primary"
        >
          <Icon name="ph:chart-line" />
          <span>数据概览</span>
        </NuxtLink>
        <NuxtLink
          to="/admin/novels"
          class="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 transition"
          active-class="bg-white/10 text-neuro-primary"
        >
          <Icon name="ph:book" />
          <span>小说管理</span>
        </NuxtLink>
        <NuxtLink
          to="/admin/users"
          class="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 transition"
          active-class="bg-white/10 text-neuro-primary"
        >
          <Icon name="ph:users" />
          <span>用户管理</span>
        </NuxtLink>
      </nav>

      <div class="absolute bottom-4 left-4 right-4">
        <NuxtLink to="/" class="btn-secondary w-full text-center">
          <Icon name="ph:arrow-left" class="mr-2" />
          返回前台
        </NuxtLink>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 p-8 overflow-auto">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'admin'
})
</script>
