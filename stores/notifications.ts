import { defineStore } from 'pinia'

export interface Notification {
  id: number
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  read: boolean
  createdAt: string
  action?: {
    label: string
    link: string
  }
}

interface NotificationsState {
  list: Notification[]
  unreadCount: number
}

let nextId = 0

export const useNotificationsStore = defineStore('notifications', {
  state: (): NotificationsState => ({
    list: [],
    unreadCount: 0
  }),

  getters: {
    unreadNotifications: (state) => state.list.filter(n => !n.read),
    recentNotifications: (state) => state.list.slice(0, 10)
  },

  actions: {
    addNotification(notification: Omit<Notification, 'id' | 'read' | 'createdAt'>) {
      const newNotification: Notification = {
        ...notification,
        id: nextId++,
        read: false,
        createdAt: new Date().toISOString()
      }

      this.list.unshift(newNotification)
      this.unreadCount++

      if (this.list.length > 100) {
        this.list = this.list.slice(0, 100)
      }

      return newNotification
    },

    markAsRead(id: number) {
      const notification = this.list.find(n => n.id === id)
      if (notification && !notification.read) {
        notification.read = true
        this.unreadCount--
      }
    },

    markAllAsRead() {
      this.list.forEach(n => {
        n.read = true
      })
      this.unreadCount = 0
    },

    removeNotification(id: number) {
      const index = this.list.findIndex(n => n.id === id)
      if (index > -1) {
        if (!this.list[index].read) {
          this.unreadCount--
        }
        this.list.splice(index, 1)
      }
    },

    clearAll() {
      this.list = []
      this.unreadCount = 0
    },

    success(title: string, message: string, action?: Notification['action']) {
      return this.addNotification({ type: 'success', title, message, action })
    },

    error(title: string, message: string, action?: Notification['action']) {
      return this.addNotification({ type: 'error', title, message, action })
    },

    warning(title: string, message: string, action?: Notification['action']) {
      return this.addNotification({ type: 'warning', title, message, action })
    },

    info(title: string, message: string, action?: Notification['action']) {
      return this.addNotification({ type: 'info', title, message, action })
    }
  }
})
