interface ToastOptions {
  message: string
  type?: 'success' | 'error' | 'info' | 'warning'
  duration?: number
}

interface Toast extends ToastOptions {
  id: number
}

export const useToast = () => {
  const toasts = useState<Toast[]>('toasts', () => [])
  let nextId = 0

  const show = (options: ToastOptions) => {
    const id = nextId++
    const toast: Toast = {
      id,
      message: options.message,
      type: options.type || 'info',
      duration: options.duration || 3000
    }

    toasts.value.push(toast)

    setTimeout(() => {
      remove(id)
    }, toast.duration)
  }

  const remove = (id: number) => {
    const index = toasts.value.findIndex(t => t.id === id)
    if (index > -1) {
      toasts.value.splice(index, 1)
    }
  }

  const success = (message: string) => show({ message, type: 'success' })
  const error = (message: string) => show({ message, type: 'error' })
  const info = (message: string) => show({ message, type: 'info' })
  const warning = (message: string) => show({ message, type: 'warning' })

  return {
    toasts,
    show,
    remove,
    success,
    error,
    info,
    warning
  }
}
