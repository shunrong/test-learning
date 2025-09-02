/**
 * Fetch Hook - 用于演示异步数据获取和错误处理的测试
 */

import { useState, useEffect, useCallback, useRef } from "react";

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

  const abortControllerRef = useRef<AbortController | null>(null);

  const execute = useCallback(async () => {
    // 取消之前的请求
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    const controller = abortControllerRef.current;

    setState((prev) => ({ ...prev, loading: true, error: null }));

    let timeoutId: NodeJS.Timeout | undefined;

    try {
      timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(url, {
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // 检查请求是否被取消
      if (!controller.signal.aborted) {
        setState({ data, loading: false, error: null });
      }
    } catch (error) {
      if (timeoutId) clearTimeout(timeoutId);

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

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [execute, immediate]);

  return {
    ...state,
    execute,
    reset,
  };
}
