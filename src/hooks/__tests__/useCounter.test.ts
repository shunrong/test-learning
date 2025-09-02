/**
 * useCounter Hook 测试 - 演示自定义 Hook 的测试方法
 */

import { renderHook } from "@testing-library/react";
import { act } from "react";
import { useCounter } from "../useCounter";

describe("useCounter", () => {
  describe("基础功能", () => {
    it("应该初始化为默认值 0", () => {
      const { result } = renderHook(() => useCounter());

      expect(result.current.count).toBe(0);
    });

    it("应该使用自定义初始值", () => {
      const { result } = renderHook(() => useCounter({ initialValue: 10 }));

      expect(result.current.count).toBe(10);
    });

    it("应该正确递增", () => {
      const { result } = renderHook(() => useCounter());

      act(() => {
        result.current.increment();
      });

      expect(result.current.count).toBe(1);
    });

    it("应该正确递减", () => {
      const { result } = renderHook(() => useCounter({ initialValue: 5 }));

      act(() => {
        result.current.decrement();
      });

      expect(result.current.count).toBe(4);
    });

    it("应该重置到初始值", () => {
      const { result } = renderHook(() => useCounter({ initialValue: 10 }));

      // 改变计数
      act(() => {
        result.current.increment();
        result.current.increment();
      });

      expect(result.current.count).toBe(12);

      // 重置
      act(() => {
        result.current.reset();
      });

      expect(result.current.count).toBe(10);
    });

    it("应该设置为指定值", () => {
      const { result } = renderHook(() => useCounter());

      act(() => {
        result.current.set(42);
      });

      expect(result.current.count).toBe(42);
    });
  });

  describe("自定义步长", () => {
    it("应该使用自定义步长递增", () => {
      const { result } = renderHook(() => useCounter({ step: 5 }));

      act(() => {
        result.current.increment();
      });

      expect(result.current.count).toBe(5);
    });

    it("应该使用自定义步长递减", () => {
      const { result } = renderHook(() =>
        useCounter({ initialValue: 10, step: 3 })
      );

      act(() => {
        result.current.decrement();
      });

      expect(result.current.count).toBe(7);
    });

    it("多次操作应该累积步长", () => {
      const { result } = renderHook(() => useCounter({ step: 2 }));

      act(() => {
        result.current.increment();
        result.current.increment();
        result.current.decrement();
      });

      expect(result.current.count).toBe(2); // 0 + 2 + 2 - 2 = 2
    });
  });

  describe("边界限制", () => {
    describe("最大值限制", () => {
      it("不应该超过最大值", () => {
        const { result } = renderHook(() =>
          useCounter({
            initialValue: 8,
            max: 10,
            step: 3,
          })
        );

        act(() => {
          result.current.increment(); // 8 + 3 = 11 > 10，应该保持在 8
        });

        expect(result.current.count).toBe(8);
      });

      it("应该正确指示是否能够递增", () => {
        const { result } = renderHook(() =>
          useCounter({
            initialValue: 9,
            max: 10,
          })
        );

        expect(result.current.canIncrement).toBe(true);

        act(() => {
          result.current.increment(); // 达到最大值
        });

        expect(result.current.count).toBe(10);
        expect(result.current.canIncrement).toBe(false);
      });

      it("set 方法应该受最大值限制", () => {
        const { result } = renderHook(() => useCounter({ max: 10 }));

        act(() => {
          result.current.set(15); // 超过最大值，应该不生效
        });

        expect(result.current.count).toBe(0); // 保持初始值

        act(() => {
          result.current.set(5); // 在范围内，应该生效
        });

        expect(result.current.count).toBe(5);
      });
    });

    describe("最小值限制", () => {
      it("不应该低于最小值", () => {
        const { result } = renderHook(() =>
          useCounter({
            initialValue: 2,
            min: 0,
            step: 3,
          })
        );

        act(() => {
          result.current.decrement(); // 2 - 3 = -1 < 0，应该保持在 2
        });

        expect(result.current.count).toBe(2);
      });

      it("应该正确指示是否能够递减", () => {
        const { result } = renderHook(() =>
          useCounter({
            initialValue: 1,
            min: 0,
          })
        );

        expect(result.current.canDecrement).toBe(true);

        act(() => {
          result.current.decrement(); // 达到最小值
        });

        expect(result.current.count).toBe(0);
        expect(result.current.canDecrement).toBe(false);
      });

      it("set 方法应该受最小值限制", () => {
        const { result } = renderHook(() => useCounter({ min: 0 }));

        act(() => {
          result.current.set(-5); // 低于最小值，应该不生效
        });

        expect(result.current.count).toBe(0); // 保持初始值
      });
    });

    describe("同时有最大值和最小值", () => {
      it("应该在范围内正常工作", () => {
        const { result } = renderHook(() =>
          useCounter({
            initialValue: 5,
            min: 0,
            max: 10,
          })
        );

        expect(result.current.canIncrement).toBe(true);
        expect(result.current.canDecrement).toBe(true);

        // 递增到接近上限
        act(() => {
          result.current.set(9);
        });

        expect(result.current.canIncrement).toBe(true);
        expect(result.current.canDecrement).toBe(true);

        // 达到上限
        act(() => {
          result.current.increment();
        });

        expect(result.current.count).toBe(10);
        expect(result.current.canIncrement).toBe(false);
        expect(result.current.canDecrement).toBe(true);
      });
    });
  });

  describe("Hook 依赖性和重新渲染", () => {
    it("选项改变时应该重新创建函数", () => {
      let options = { step: 1 };
      const { result, rerender } = renderHook(
        ({ step }) => useCounter({ step }),
        { initialProps: { step: 1 } }
      );

      const firstIncrement = result.current.increment;

      // 改变选项
      rerender({ step: 2 });

      const secondIncrement = result.current.increment;

      // 函数应该是新的实例（因为 step 改变了）
      expect(firstIncrement).not.toBe(secondIncrement);
    });

    it("相同选项时函数应该保持稳定", () => {
      const { result, rerender } = renderHook(() => useCounter({ step: 1 }));

      const firstIncrement = result.current.increment;
      const firstReset = result.current.reset;

      // 重新渲染但选项不变
      rerender();

      const secondIncrement = result.current.increment;
      const secondReset = result.current.reset;

      // reset 函数应该保持稳定（依赖不变）
      expect(firstReset).toBe(secondReset);
      // increment 也应该保持稳定（依赖不变）
      expect(firstIncrement).toBe(secondIncrement);
    });
  });

  describe("复杂操作序列", () => {
    it("应该正确处理复杂的操作序列", () => {
      const { result } = renderHook(() =>
        useCounter({
          initialValue: 5,
          min: 0,
          max: 15,
          step: 3,
        })
      );

      // 初始状态
      expect(result.current.count).toBe(5);
      expect(result.current.canIncrement).toBe(true);
      expect(result.current.canDecrement).toBe(true);

      act(() => {
        // 递增两次: 5 -> 8 -> 11
        result.current.increment();
        result.current.increment();
      });

      expect(result.current.count).toBe(11);

      act(() => {
        // 尝试再次递增: 11 + 3 = 14 (在范围内)
        result.current.increment();
      });

      expect(result.current.count).toBe(14);
      expect(result.current.canIncrement).toBe(false); // 14 + 3 = 17 > 15，不能再递增

      act(() => {
        // 再次递增: 14 + 3 = 17 > 15，应该保持在 14
        result.current.increment();
      });

      expect(result.current.count).toBe(14);
      expect(result.current.canIncrement).toBe(false);

      act(() => {
        // 重置
        result.current.reset();
      });

      expect(result.current.count).toBe(5);
      expect(result.current.canIncrement).toBe(true);
      expect(result.current.canDecrement).toBe(true);
    });
  });

  describe("边界情况", () => {
    it("应该处理无限边界", () => {
      const { result } = renderHook(() => useCounter());

      // 默认情况下应该没有限制
      expect(result.current.canIncrement).toBe(true);
      expect(result.current.canDecrement).toBe(true);

      act(() => {
        result.current.set(Number.MAX_SAFE_INTEGER);
      });

      expect(result.current.count).toBe(Number.MAX_SAFE_INTEGER);
    });

    it("应该处理零步长（虽然不推荐）", () => {
      const { result } = renderHook(() => useCounter({ step: 0 }));

      act(() => {
        result.current.increment();
      });

      expect(result.current.count).toBe(0); // 应该保持不变
    });

    it("应该处理负步长", () => {
      const { result } = renderHook(() => useCounter({ step: -1 }));

      act(() => {
        result.current.increment(); // 实际上会减少
      });

      expect(result.current.count).toBe(-1);

      act(() => {
        result.current.decrement(); // 实际上会增加
      });

      expect(result.current.count).toBe(0);
    });
  });

  describe("性能测试", () => {
    it("大量操作应该性能良好", () => {
      const { result } = renderHook(() => useCounter());

      const start = performance.now();

      act(() => {
        for (let i = 0; i < 1000; i++) {
          result.current.increment();
        }
      });

      const end = performance.now();

      expect(result.current.count).toBe(1000);
      expect(end - start).toBeLessThan(100); // 应该在100ms内完成
    });
  });
});
