/**
 * 计数器组件 - 用于演示基础组件测试
 */

import React from "react";
import { useCounter } from "@/hooks/useCounter";

export interface CounterProps {
  initialValue?: number;
  min?: number;
  max?: number;
  step?: number;
  onCountChange?: (count: number) => void;
}

export const Counter: React.FC<CounterProps> = ({
  initialValue = 0,
  min,
  max,
  step = 1,
  onCountChange,
}) => {
  const { count, increment, decrement, reset, canIncrement, canDecrement } =
    useCounter({
      initialValue,
      min,
      max,
      step,
    });

  React.useEffect(() => {
    onCountChange?.(count);
  }, [count, onCountChange]);

  const buttonStyle: React.CSSProperties = {
    padding: "8px 16px",
    margin: "0 4px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "16px",
  };

  const disabledStyle: React.CSSProperties = {
    ...buttonStyle,
    opacity: 0.5,
    cursor: "not-allowed",
  };

  return (
    <div data-testid="counter">
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <button
          type="button"
          data-testid="decrement-button"
          onClick={decrement}
          disabled={!canDecrement}
          style={
            canDecrement
              ? { ...buttonStyle, backgroundColor: "#ff6b6b" }
              : disabledStyle
          }
        >
          -
        </button>

        <span
          data-testid="count-display"
          style={{
            fontSize: "24px",
            fontWeight: "bold",
            minWidth: "60px",
            textAlign: "center",
          }}
        >
          {count}
        </span>

        <button
          type="button"
          data-testid="increment-button"
          onClick={increment}
          disabled={!canIncrement}
          style={
            canIncrement
              ? { ...buttonStyle, backgroundColor: "#51cf66" }
              : disabledStyle
          }
        >
          +
        </button>

        <button
          type="button"
          data-testid="reset-button"
          onClick={reset}
          style={{ ...buttonStyle, backgroundColor: "#74c0fc" }}
        >
          重置
        </button>
      </div>

      {(min !== undefined || max !== undefined) && (
        <div style={{ marginTop: "8px", fontSize: "14px", color: "#666" }}>
          范围: {min ?? "-∞"} ~ {max ?? "+∞"}
        </div>
      )}
    </div>
  );
};
