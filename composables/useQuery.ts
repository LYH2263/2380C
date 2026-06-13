interface QueryCacheEntry<T> {
  data: T
  timestamp: number
  staleTime: number
}

interface PendingRequestEntry<T> {
  promise: Promise<T>
  resolvers: Array<{ resolve: (value: T) => void; reject: (reason: any) => void }>
}

interface UseQueryOptions<T> {
  immediate?: boolean
  staleTime?: number
  cacheTime?: number
  refetchOnMount?: boolean
  refetchOnWindowFocus?: boolean
  optimisticUpdates?: boolean
  onSuccess?: (data: T) => void
  onError?: (error: any) => void
}

interface UseQueryResult<T> {
  data: Ref<T | null>
  isLoading: Ref<boolean>
  error: Ref<any>
  refetch: () => Promise<T | null>
  invalidate: () => void
  setOptimisticData: (updater: (prev: T | null) => T | null) => void
}

interface UseMutationOptions<TData, TVariables> {
  onSuccess?: (data: TData, variables: TVariables) => void
  onError?: (error: any, variables: TVariables) => void
  onMutate?: (variables: TVariables) => any
  invalidateQueries?: string[]
}

interface UseMutationResult<TData, TVariables> {
  data: Ref<TData | null>
  isLoading: Ref<boolean>
  error: Ref<any>
  mutate: (variables: TVariables) => Promise<TData | null>
  reset: () => void
}

const queryCache = new Map<string, QueryCacheEntry<any>>()
const pendingRequests = new Map<string, PendingRequestEntry<any>>()
const staleTimeDefault = 5 * 60 * 1000
const cacheTimeDefault = 30 * 60 * 1000

function getCacheKey(key: string, params?: any): string {
  return params ? `${key}:${JSON.stringify(params)}` : key
}

export function useQuery<T>(
  queryKey: string,
  fetcher: () => Promise<T>,
  options: UseQueryOptions<T> = {}
): UseQueryResult<T> {
  const {
    immediate = true,
    staleTime = staleTimeDefault,
    refetchOnMount = true,
    refetchOnWindowFocus = false,
    onSuccess,
    onError
  } = options

  const data = ref<T | null>(null)
  const isLoading = ref(false)
  const error = ref<any>(null)
  const cacheKey = getCacheKey(queryKey)

  const fetchData = async (force = false): Promise<T | null> => {
    const cachedEntry = queryCache.get(cacheKey)

    if (!force && cachedEntry) {
      const isStale = Date.now() - cachedEntry.timestamp > cachedEntry.staleTime
      if (!isStale) {
        data.value = cachedEntry.data
        return cachedEntry.data
      }
    }

    const pendingEntry = pendingRequests.get(cacheKey)
    if (pendingEntry) {
      isLoading.value = true
      return new Promise((resolve, reject) => {
        pendingEntry.resolvers.push({ resolve, reject })
      })
    }

    isLoading.value = true
    error.value = null

    const resolvers: Array<{ resolve: (value: T) => void; reject: (reason: any) => void }> = []
    const promise = fetcher()

    pendingRequests.set(cacheKey, { promise, resolvers })

    try {
      const result = await promise

      queryCache.set(cacheKey, {
        data: result,
        timestamp: Date.now(),
        staleTime
      })

      data.value = result
      onSuccess?.(result)

      resolvers.forEach(r => r.resolve(result))
      pendingRequests.delete(cacheKey)

      return result
    } catch (err) {
      error.value = err
      onError?.(err)

      resolvers.forEach(r => r.reject(err))
      pendingRequests.delete(cacheKey)

      return null
    } finally {
      isLoading.value = false
    }
  }

  const invalidate = () => {
    queryCache.delete(cacheKey)
    pendingRequests.delete(cacheKey)
  }

  const setOptimisticData = (updater: (prev: T | null) => T | null) => {
    const newData = updater(data.value)
    if (newData !== null) {
      data.value = newData
      queryCache.set(cacheKey, {
        data: newData,
        timestamp: Date.now(),
        staleTime
      })
    }
  }

  const refetch = () => fetchData(true)

  if (refetchOnMount && immediate) {
    const cachedEntry = queryCache.get(cacheKey)
    if (cachedEntry) {
      data.value = cachedEntry.data
      const isStale = Date.now() - cachedEntry.timestamp > cachedEntry.staleTime
      if (isStale) {
        fetchData(true)
      }
    } else {
      fetchData()
    }
  }

  if (refetchOnWindowFocus && process.client) {
    useEventListener(window, 'focus', () => fetchData(true))
  }

  return {
    data,
    isLoading,
    error,
    refetch,
    invalidate,
    setOptimisticData
  }
}

export function useMutation<TData, TVariables = void>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options: UseMutationOptions<TData, TVariables> = {}
): UseMutationResult<TData, TVariables> {
  const data = ref<TData | null>(null)
  const isLoading = ref(false)
  const error = ref<any>(null)

  const mutate = async (variables: TVariables): Promise<TData | null> => {
    isLoading.value = true
    error.value = null

    let context: any
    if (options.onMutate) {
      context = options.onMutate(variables)
    }

    try {
      const result = await mutationFn(variables)
      data.value = result
      options.onSuccess?.(result, variables)

      if (options.invalidateQueries) {
        options.invalidateQueries.forEach(key => {
          queryCache.delete(key)
        })
      }

      return result
    } catch (err) {
      error.value = err
      options.onError?.(err, variables)
      return null
    } finally {
      isLoading.value = false
    }
  }

  const reset = () => {
    data.value = null
    error.value = null
    isLoading.value = false
  }

  return {
    data,
    isLoading,
    error,
    mutate,
    reset
  }
}

export function invalidateQuery(queryKey: string): void {
  queryCache.delete(queryKey)
}

export function invalidateAllQueries(): void {
  queryCache.clear()
}

export function setQueryData<T>(queryKey: string, data: T): void {
  queryCache.set(queryKey, {
    data,
    timestamp: Date.now(),
    staleTime: staleTimeDefault
  })
}

export function getQueryData<T>(queryKey: string): T | undefined {
  return queryCache.get(queryKey)?.data
}
