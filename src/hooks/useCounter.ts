/**
 * 计数器 Hook - 用于演示自定义 Hook 的测试
 */

import { useState, useCallback } from "react";

export interface UseCounterOptions {
  initialValue?: number;
  min?: number;
  max?: number;
  step?: number;
}

export interface UseCounterReturn {
  count: number;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
  set: (value: number) => void;
  canIncrement: boolean;
  canDecrement: boolean;
}

export const useCounter = (
  options: UseCounterOptions = {}
): UseCounterReturn => {
  const {
    initialValue = 0,
    min = -Infinity,
    max = Infinity,
    step = 1,
  } = options;

  const [count, setCount] = useState(initialValue);

  const increment = useCallback(() => {
    setCount((prevCount) => {
      const newCount = prevCount + step;
      return newCount <= max ? newCount : prevCount;
    });
  }, [step, max]);

  const decrement = useCallback(() => {
    setCount((prevCount) => {
      const newCount = prevCount - step;
      return newCount >= min ? newCount : prevCount;
    });
  }, [step, min]);

  const reset = useCallback(() => {
    setCount(initialValue);
  }, [initialValue]);

  const set = useCallback(
    (value: number) => {
      if (value >= min && value <= max) {
        setCount(value);
      }
    },
    [min, max]
  );

  const canIncrement = count + step <= max;
  const canDecrement = count - step >= min;

  return {
    count,
    increment,
    decrement,
    reset,
    set,
    canIncrement,
    canDecrement,
  };
};
