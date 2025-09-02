/**
 * LocalStorage Hook - 用于演示存储相关的测试
 */

import { useState, useEffect, useCallback } from "react";

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void, () => void] {
  // 获取初始值
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // 设置值的函数
  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      setStoredValue((currentValue) => {
        // 允许 value 是一个函数，这样我们就有了与 useState 相同的 API
        const valueToStore =
          value instanceof Function ? value(currentValue) : value;

        try {
          // 保存到 localStorage
          if (valueToStore === undefined) {
            window.localStorage.removeItem(key);
            return initialValue;
          } else if (valueToStore === null) {
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
            return valueToStore;
          } else {
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
            return valueToStore;
          }
        } catch (error) {
          console.error(`Error setting localStorage key "${key}":`, error);
          // 即使 localStorage 操作失败，我们仍然更新内存状态
          return valueToStore === undefined ? initialValue : valueToStore;
        }
      });
    },
    [key, initialValue]
  );

  // 删除值的函数
  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  // 监听其他标签页的 localStorage 变化
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setStoredValue(JSON.parse(e.newValue));
        } catch (error) {
          console.error(
            `Error parsing localStorage value for key "${key}":`,
            error
          );
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [key]);

  return [storedValue, setValue, removeValue];
}
