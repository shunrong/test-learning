/**
 * Fetch Hook - 用于演示异步数据获取和错误处理的测试
 */

import { useState, useEffect, useCallback } from "react";

export interface UseFetchState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

export interface UseFetchOptions {
  immediate?: boolean;
  timeout?: number;
}

export interface UseFetchReturn<T> extends UseFetchState<T> {
  execute: () => Promise<void>;
  reset: () => void;
}

export function useFetch<T>(
  url: string,
  options: UseFetchOptions = {}
): UseFetchReturn<T> {
  const { immediate = true, timeout = 5000 } = options;

  const [state, setState] = useState<UseFetchState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(url, {
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setState({ data, loading: false, error: null });
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === "AbortError") {
          setState((prev) => ({
            ...prev,
            loading: false,
            error: new Error("Request timed out"),
          }));
        } else {
          setState((prev) => ({ ...prev, loading: false, error }));
        }
      } else {
        setState((prev) => ({
          ...prev,
          loading: false,
          error: new Error("Unknown error occurred"),
        }));
      }
    }
  }, [url, timeout]);

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
    });
  }, []);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return {
    ...state,
    execute,
    reset,
  };
}
