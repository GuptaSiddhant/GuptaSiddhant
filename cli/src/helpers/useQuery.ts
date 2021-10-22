import { useState, useEffect } from "react";
import axios, { CancelTokenSource } from "axios";

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
const CACHE_TIME = 60 * 60; // 1 hour

async function fetcher(query: string, cancelTokenSource: CancelTokenSource) {
  try {
    return getFromCache(query);
  } catch {
    return fetchFromServer(query, cancelTokenSource);
  }
}

async function fetchFromServer(query: string, { token }: CancelTokenSource) {
  const res = await axios.get<any>(
    "https://lxjtqhm1.api.sanity.io/v1/data/query/production?query=" + query,
    { cancelToken: token }
  );
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
