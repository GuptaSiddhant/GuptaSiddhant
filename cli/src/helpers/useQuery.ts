import axios, { CancelTokenSource } from "axios";
import { useState, useEffect } from "react";

export default function useQuery<T>(query: string) {
  const encodedQuery = encodeURIComponent(query);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<T | undefined>(undefined);

  useEffect(() => {
    setLoading(true);
    setError(null);
    let isMounted = true;
    const cancelTokenSource = axios.CancelToken.source();

    fetcher(encodedQuery, cancelTokenSource)
      .then((data: any) => {
        if (isMounted) setData(data as T);
      })
      .catch((e) => {
        if (isMounted) setError(new Error(e));
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
      cancelTokenSource.cancel();
    };
  }, [encodedQuery]);

  return { data, loading, error };
}

const cache: Record<string, { data: any; timestamp: number }> = {};
const CACHE_TIME = 1000 * 60; // 1 min
const baseUrl =
  "https://lxjtqhm1.api.sanity.io/v1/data/query/production?query=";

async function fetcher(query: string, cancelTokenSource?: CancelTokenSource) {
  try {
    return getFromCache(query);
  } catch {
    return fetchFromServer(query, cancelTokenSource);
  }
}

async function fetchFromServer(
  query: string,
  cancelTokenSource?: CancelTokenSource
) {
  const res = await axios.get<any>(baseUrl + query, {
    cancelToken: cancelTokenSource?.token,
  });
  const data = res.data.result;
  cache[query] = { data, timestamp: Date.now() };
  return data;
}

function getFromCache(key: string) {
  const cacheValue = cache[key];
  if (cacheValue?.data) {
    const isValid = Date.now() - cacheValue.timestamp <= CACHE_TIME;
    if (isValid) {
      return cacheValue.data;
    }
  }
  throw new Error("No cache found.");
}

export function usePrefetchQuery(query: string) {
  useEffect(() => {
    if (!cache[query]?.data) fetchFromServer(query);
  }, [query]);
}

export function usePrefetchQueries(...queries: string[]) {
  useEffect(() => {
    queries.forEach((query) => {
      if (!cache[query]?.data) {
        console.log("prefetching");
        fetchFromServer(query);
      }
    });
  }, [queries]);
}
