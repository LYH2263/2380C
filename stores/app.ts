import { defineStore } from 'pinia'

interface AppConfig {
  appName: string
  theme: 'light' | 'dark'
  language: string
  notificationsEnabled: boolean
}

interface AppState {
  config: AppConfig
  isSidebarOpen: boolean
  isMobile: boolean
  currentPageTitle: string
}

export const useAppStore = defineStore('app', {
  state: (): AppState => ({
    config: {
      appName: 'Neurosama Novels',
      theme: 'dark',
      language: 'zh-CN',
      notificationsEnabled: true
    },
    isSidebarOpen: false,
    isMobile: false,
    currentPageTitle: ''
  }),

  getters: {
    isDarkTheme: (state) => state.config.theme === 'dark'
  },

  actions: {
    toggleSidebar() {
      this.isSidebarOpen = !this.isSidebarOpen
    },

    setSidebarOpen(open: boolean) {
      this.isSidebarOpen = open
    },

    setTheme(theme: 'light' | 'dark') {
      this.config.theme = theme
      if (process.client) {
        localStorage.setItem('app_theme', theme)
      }
    },

    toggleTheme() {
      const newTheme = this.config.theme === 'dark' ? 'light' : 'dark'
      this.setTheme(newTheme)
    },

    setLanguage(language: string) {
      this.config.language = language
      if (process.client) {
        localStorage.setItem('app_language', language)
      }
    },

    setMobile(isMobile: boolean) {
      this.isMobile = isMobile
    },

    setPageTitle(title: string) {
      this.currentPageTitle = title
    },

    initializeConfig() {
      if (process.client) {
        const savedTheme = localStorage.getItem('app_theme') as 'light' | 'dark' | null
        const savedLanguage = localStorage.getItem('app_language')

        if (savedTheme) {
          this.config.theme = savedTheme
        }
        if (savedLanguage) {
          this.config.language = savedLanguage
        }
      }
    }
  }
})
