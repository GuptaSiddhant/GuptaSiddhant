import axios, { type CancelTokenSource } from "axios"
import { useCallback, useEffect, useState } from "react"

const cache: Record<string, { data: unknown; timestamp: number }> = {}
const CACHE_TIME = 1000 * 60 // 1 minute
const REQUEST_TIMEOUT = 10000 // 10 seconds
// const BASE_URL = "http://localhost:3000/api?"
const BASE_URL = "https://guptasiddhant.com/api?"

const LOAD_ERROR_MESSAGE =
  "Could not load this content. Please try again later."
const TIMEOUT_ERROR_MESSAGE =
  "This is taking too long to load. Please try again later."

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

    fetcher<T>(query, { cancelTokenSource, cacheTime, baseUrl })
      .then((result) => {
        if (isMounted) setData(result)
      })
      .catch((e: unknown) => {
        if (isMounted) setError(toQueryError(e))
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

export function getCache() {
  return cache
}

export function clearCache(): void {
  Object.keys(cache).forEach((key) => delete cache[key])
}

// Helpers

function toQueryError(e: unknown): Error {
  const isTimeout =
    axios.isAxiosError(e) &&
    (e.code === "ECONNABORTED" || e.code === "ETIMEDOUT")

  return new Error(isTimeout ? TIMEOUT_ERROR_MESSAGE : LOAD_ERROR_MESSAGE)
}

async function fetcher<T>(
  query: string,
  options: {
    cancelTokenSource?: CancelTokenSource
    cacheTime?: number
    baseUrl?: string
  },
): Promise<T> {
  const { cancelTokenSource, cacheTime, baseUrl } = options
  try {
    return getFromCache<T>(query, cacheTime)
  } catch {
    return fetchFromServer<T>(query, cancelTokenSource, baseUrl)
  }
}

async function fetchFromServer<T = unknown>(
  query: string,
  cancelTokenSource?: CancelTokenSource,
  baseUrl: string = BASE_URL,
): Promise<T> {
  const res = await axios.get<T>(baseUrl + query, {
    cancelToken: cancelTokenSource?.token,
    timeout: REQUEST_TIMEOUT,
  })
  const data = res.data
  cache[query] = { data, timestamp: Date.now() }
  return data
}

function getFromCache<T>(key: string, cacheTime: number = CACHE_TIME): T {
  const cacheValue = cache[key]
  if (cacheValue?.data) {
    const isValid = Date.now() - cacheValue.timestamp <= cacheTime
    if (isValid) {
      return cacheValue.data as T
    }
  }
  throw new Error("No cache found.")
}
