// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  
  modules: [
    '@nuxtjs/tailwindcss',
    '@vueuse/nuxt',
    '@nuxt/icon'
  ],

  css: ['~/assets/css/main.css'],

  app: {
    head: {
      title: 'Neurosama 粉丝小说站',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Neurosama 粉丝二创小说阅读平台' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  },

  runtimeConfig: {
    jwtSecret: process.env.JWT_SECRET || 'neuro-sama-secret-key-2024',
    public: {
      appName: 'Neurosama Novels'
    }
  },

  nitro: {
    preset: 'node-server'
  },

  compatibilityDate: '2024-01-01'
})
