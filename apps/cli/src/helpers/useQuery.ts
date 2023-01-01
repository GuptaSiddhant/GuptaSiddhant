import axios, { type CancelTokenSource } from "axios"
import { useCallback, useEffect, useState } from "react"

const cache: Record<string, { data: any; timestamp: number }> = {}
const CACHE_TIME = 1000 * 60 // 1 minute
// const BASE_URL = "http://localhost:3000/api?"
const BASE_URL = "https://guptasiddhant.com/api?"

export interface UseQueryOptions {
  skip?: boolean
  cacheTime?: number
  baseUrl?: string
}

export interface UseQueryReturn<T> {
  data?: T
  loading: boolean
  error?: Error
  execute: () => () => void
}

export default function useQuery<T>(
  query: string,
  { skip = false, cacheTime, baseUrl }: UseQueryOptions = {},
): UseQueryReturn<T> {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | undefined>(undefined)
  const [data, setData] = useState<T | undefined>(undefined)

  const execute = useCallback(() => {
    setLoading(true)
    setError(undefined)
    let isMounted = true
    const cancelTokenSource = axios.CancelToken.source()

    fetcher(query, { cancelTokenSource, cacheTime, baseUrl })
      .then((data: any) => {
        if (isMounted) setData(data as T)
      })
      .catch((e) => {
        if (isMounted) setError(new Error(e))
      })
      .finally(() => {
        if (isMounted) setLoading(false)
      })

    return () => {
      isMounted = false
      cancelTokenSource.cancel()
    }
  }, [query, baseUrl, cacheTime])

  useEffect(() => {
    if (skip) return

    return execute()
  }, [execute, skip])

  return { data, loading, error, execute }
}

export function usePrefetchQuery(query: string): void {
  useEffect(() => {
    if (!cache[query]?.data) fetchFromServer(query)
  }, [query])
}

export function usePrefetchQueries(...queries: string[]): void {
  useEffect(() => {
    queries.forEach((query) => {
      if (!cache[query]?.data) {
        console.log("prefetching")
        fetchFromServer(query)
      }
    })
  }, [queries])
}

export function getCache() {
  return cache
}

export function clearCache(): void {
  Object.keys(cache).forEach((key) => delete cache[key])
}

// Helpers

async function fetcher(
  query: string,
  options: {
    cancelTokenSource?: CancelTokenSource
    cacheTime?: number
    baseUrl?: string
  },
) {
  const { cancelTokenSource, cacheTime, baseUrl } = options
  try {
    return getFromCache(query, cacheTime)
  } catch {
    return fetchFromServer(query, cancelTokenSource, baseUrl)
  }
}

async function fetchFromServer(
  query: string,
  cancelTokenSource?: CancelTokenSource,
  baseUrl: string = BASE_URL,
) {
  const res = await axios.get<any>(baseUrl + query, {
    cancelToken: cancelTokenSource?.token,
  })
  const data = res.data
  cache[query] = { data, timestamp: Date.now() }
  return data
}

function getFromCache(key: string, cacheTime: number = CACHE_TIME) {
  const cacheValue = cache[key]
  if (cacheValue?.data) {
    const isValid = Date.now() - cacheValue.timestamp <= cacheTime
    if (isValid) {
      return cacheValue.data
    }
  }
  throw new Error("No cache found.")
}
