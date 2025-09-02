/**
 * Counter 组件测试 - 演示基础 React 组件测试
 */

import React, { act } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Counter } from "../Counter";

describe("Counter组件", () => {
  describe("基础渲染", () => {
    it("应该渲染计数器组件", () => {
      render(<Counter />);

      expect(screen.getByTestId("counter")).toBeInTheDocument();
      expect(screen.getByTestId("count-display")).toBeInTheDocument();
      expect(screen.getByTestId("increment-button")).toBeInTheDocument();
      expect(screen.getByTestId("decrement-button")).toBeInTheDocument();
      expect(screen.getByTestId("reset-button")).toBeInTheDocument();
    });

    it("应该显示默认初始值", () => {
      render(<Counter />);

      expect(screen.getByTestId("count-display")).toHaveTextContent("0");
    });

    it("应该显示自定义初始值", () => {
      render(<Counter initialValue={5} />);

      expect(screen.getByTestId("count-display")).toHaveTextContent("5");
    });

    it("应该显示范围信息当设置了最小值或最大值", () => {
      const { rerender } = render(<Counter min={0} max={10} />);

      expect(screen.getByText("范围: 0 ~ 10")).toBeInTheDocument();

      // 测试只有最小值
      rerender(<Counter min={5} />);
      expect(screen.getByText("范围: 5 ~ +∞")).toBeInTheDocument();

      // 测试只有最大值
      rerender(<Counter max={20} />);
      expect(screen.getByText("范围: -∞ ~ 20")).toBeInTheDocument();
    });
  });

  describe("用户交互", () => {
    it("点击递增按钮应该增加计数", async () => {
      const user = userEvent.setup();
      render(<Counter />);

      const incrementButton = screen.getByTestId("increment-button");
      const countDisplay = screen.getByTestId("count-display");

      expect(countDisplay).toHaveTextContent("0");

      await act(async () => {
        await user.click(incrementButton);
      });
      expect(countDisplay).toHaveTextContent("1");

      await act(async () => {
        await user.click(incrementButton);
      });
      expect(countDisplay).toHaveTextContent("2");
    });

    it("点击递减按钮应该减少计数", async () => {
      const user = userEvent.setup();
      render(<Counter initialValue={5} />);

      const decrementButton = screen.getByTestId("decrement-button");
      const countDisplay = screen.getByTestId("count-display");

      expect(countDisplay).toHaveTextContent("5");

      await act(async () => {
        await user.click(decrementButton);
      });
      expect(countDisplay).toHaveTextContent("4");

      await act(async () => {
        await user.click(decrementButton);
      });
      expect(countDisplay).toHaveTextContent("3");
    });

    it("点击重置按钮应该重置到初始值", async () => {
      const user = userEvent.setup();
      render(<Counter initialValue={10} />);

      const incrementButton = screen.getByTestId("increment-button");
      const resetButton = screen.getByTestId("reset-button");
      const countDisplay = screen.getByTestId("count-display");

      // 先改变计数
      await act(async () => {
        await user.click(incrementButton);
        await user.click(incrementButton);
      });
      expect(countDisplay).toHaveTextContent("12");

      // 重置
      await act(async () => {
        await user.click(resetButton);
      });
      expect(countDisplay).toHaveTextContent("10");
    });

    it("应该使用fireEvent进行事件测试", () => {
      render(<Counter />);

      const incrementButton = screen.getByTestId("increment-button");
      const countDisplay = screen.getByTestId("count-display");

      fireEvent.click(incrementButton);
      expect(countDisplay).toHaveTextContent("1");
    });
  });

  describe("自定义步长", () => {
    it("应该使用自定义步长", async () => {
      const user = userEvent.setup();
      render(<Counter step={5} />);

      const incrementButton = screen.getByTestId("increment-button");
      const decrementButton = screen.getByTestId("decrement-button");
      const countDisplay = screen.getByTestId("count-display");

      await act(async () => {
        await user.click(incrementButton);
      });
      expect(countDisplay).toHaveTextContent("5");

      await act(async () => {
        await user.click(incrementButton);
      });
      expect(countDisplay).toHaveTextContent("10");

      await act(async () => {
        await user.click(decrementButton);
      });
      expect(countDisplay).toHaveTextContent("5");
    });
  });

  describe("边界值限制", () => {
    describe("最大值限制", () => {
      it("应该在达到最大值时禁用递增按钮", async () => {
        const user = userEvent.setup();
        render(<Counter initialValue={9} max={10} />);

        const incrementButton = screen.getByTestId("increment-button");
        const countDisplay = screen.getByTestId("count-display");

        expect(incrementButton).toBeEnabled();

        await act(async () => {
          await user.click(incrementButton);
        });
        expect(countDisplay).toHaveTextContent("10");
        expect(incrementButton).toBeDisabled();
      });

      it("不应该超过最大值", async () => {
        const user = userEvent.setup();
        render(<Counter initialValue={8} max={10} step={3} />);

        const incrementButton = screen.getByTestId("increment-button");
        const countDisplay = screen.getByTestId("count-display");

        // 尝试递增，但会超过最大值，应该保持不变
        await act(async () => {
          await user.click(incrementButton);
        });
        expect(countDisplay).toHaveTextContent("8");
        expect(incrementButton).toBeDisabled();
      });
    });

    describe("最小值限制", () => {
      it("应该在达到最小值时禁用递减按钮", async () => {
        const user = userEvent.setup();
        render(<Counter initialValue={1} min={0} />);

        const decrementButton = screen.getByTestId("decrement-button");
        const countDisplay = screen.getByTestId("count-display");

        expect(decrementButton).toBeEnabled();

        await act(async () => {
          await user.click(decrementButton);
        });
        expect(countDisplay).toHaveTextContent("0");
        expect(decrementButton).toBeDisabled();
      });

      it("不应该低于最小值", async () => {
        const user = userEvent.setup();
        render(<Counter initialValue={2} min={0} step={3} />);

        const decrementButton = screen.getByTestId("decrement-button");
        const countDisplay = screen.getByTestId("count-display");

        // 尝试递减，但会低于最小值，应该保持不变
        await act(async () => {
          await user.click(decrementButton);
        });
        expect(countDisplay).toHaveTextContent("2");
        expect(decrementButton).toBeDisabled();
      });
    });

    describe("同时有最大值和最小值", () => {
      it("应该在范围内正常工作", async () => {
        const user = userEvent.setup();
        render(<Counter initialValue={5} min={0} max={10} />);

        const incrementButton = screen.getByTestId("increment-button");
        const decrementButton = screen.getByTestId("decrement-button");

        expect(incrementButton).toBeEnabled();
        expect(decrementButton).toBeEnabled();
      });
    });
  });

  describe("回调函数", () => {
    it("应该在计数改变时调用回调函数", async () => {
      const user = userEvent.setup();
      const onCountChange = jest.fn();

      render(<Counter onCountChange={onCountChange} />);

      const incrementButton = screen.getByTestId("increment-button");

      // 初始渲染时应该调用一次
      expect(onCountChange).toHaveBeenCalledWith(0);

      await act(async () => {
        await user.click(incrementButton);
      });
      expect(onCountChange).toHaveBeenCalledWith(1);

      await act(async () => {
        await user.click(incrementButton);
      });
      expect(onCountChange).toHaveBeenCalledWith(2);

      expect(onCountChange).toHaveBeenCalledTimes(3);
    });

    it("重置时也应该调用回调函数", async () => {
      const user = userEvent.setup();
      const onCountChange = jest.fn();

      render(<Counter initialValue={5} onCountChange={onCountChange} />);

      const incrementButton = screen.getByTestId("increment-button");
      const resetButton = screen.getByTestId("reset-button");

      onCountChange.mockClear(); // 清除初始调用

      await act(async () => {
        await user.click(incrementButton);
      });
      await act(async () => {
        await user.click(resetButton);
      });

      expect(onCountChange).toHaveBeenCalledWith(6);
      expect(onCountChange).toHaveBeenCalledWith(5);
    });
  });

  describe("可访问性", () => {
    it("按钮应该有适当的可访问性属性", () => {
      render(<Counter />);

      const incrementButton = screen.getByTestId("increment-button");
      const decrementButton = screen.getByTestId("decrement-button");
      const resetButton = screen.getByTestId("reset-button");

      expect(incrementButton).toHaveAttribute("type", "button");
      expect(decrementButton).toHaveAttribute("type", "button");
      expect(resetButton).toHaveAttribute("type", "button");
    });

    it("禁用的按钮应该有正确的属性", () => {
      render(<Counter initialValue={10} max={10} />);

      const incrementButton = screen.getByTestId("increment-button");

      expect(incrementButton).toBeDisabled();
      expect(incrementButton).toHaveAttribute("disabled");
    });
  });

  describe("样式和外观", () => {
    it("应该应用正确的样式", () => {
      render(<Counter />);

      const counter = screen.getByTestId("counter");
      const countDisplay = screen.getByTestId("count-display");

      expect(counter).toBeInTheDocument();
      expect(countDisplay).toHaveStyle({
        fontSize: "24px",
        fontWeight: "bold",
        textAlign: "center",
      });
    });

    it("启用的按钮应该有正确的样式", () => {
      render(<Counter />);

      const incrementButton = screen.getByTestId("increment-button");
      const decrementButton = screen.getByTestId("decrement-button");

      expect(incrementButton).toHaveStyle({
        backgroundColor: "#51cf66",
        cursor: "pointer",
      });

      expect(decrementButton).toHaveStyle({
        backgroundColor: "#ff6b6b",
        cursor: "pointer",
      });
    });

    it("禁用的按钮应该有正确的样式", () => {
      render(<Counter initialValue={0} min={0} />);

      const decrementButton = screen.getByTestId("decrement-button");

      expect(decrementButton).toHaveStyle({
        opacity: "0.5",
        cursor: "not-allowed",
      });
    });
  });

  describe("边界情况", () => {
    it("应该处理极大的初始值", () => {
      render(<Counter initialValue={Number.MAX_SAFE_INTEGER} />);

      expect(screen.getByTestId("count-display")).toHaveTextContent(
        String(Number.MAX_SAFE_INTEGER)
      );
    });

    it("应该处理负数初始值", () => {
      render(<Counter initialValue={-100} />);

      expect(screen.getByTestId("count-display")).toHaveTextContent("-100");
    });

    it("应该处理零步长", async () => {
      const user = userEvent.setup();
      render(<Counter step={0} />);

      const incrementButton = screen.getByTestId("increment-button");
      const countDisplay = screen.getByTestId("count-display");

      await act(async () => {
        await user.click(incrementButton);
      });
      expect(countDisplay).toHaveTextContent("0"); // 应该保持不变
    });
  });

  describe("快照测试", () => {
    it("应该匹配默认状态的快照", () => {
      const { container } = render(<Counter />);
      expect(container.firstChild).toMatchSnapshot();
    });

    it("应该匹配有限制的状态快照", () => {
      const { container } = render(
        <Counter initialValue={5} min={0} max={10} step={2} />
      );
      expect(container.firstChild).toMatchSnapshot();
    });
  });

  describe("性能测试", () => {
    it("快速点击应该性能良好", async () => {
      const user = userEvent.setup();
      render(<Counter />);

      const incrementButton = screen.getByTestId("increment-button");
      const start = performance.now();

      // 快速点击多次
      for (let i = 0; i < 20; i++) {
        await act(async () => {
          await user.click(incrementButton);
        });
      }

      const end = performance.now();

      expect(screen.getByTestId("count-display")).toHaveTextContent("20");
      expect(end - start).toBeLessThan(1000); // 应该在1秒内完成
    });
  });

  describe("组件生命周期", () => {
    it("卸载组件不应该导致错误", () => {
      const { unmount } = render(<Counter />);

      expect(() => {
        unmount();
      }).not.toThrow();
    });

    it("重新渲染时应该保持状态", () => {
      let props = { initialValue: 5, step: 1 };
      const { rerender } = render(<Counter {...props} />);

      expect(screen.getByTestId("count-display")).toHaveTextContent("5");

      // 改变其他props但不改变initialValue
      props = { ...props, step: 2 };
      rerender(<Counter {...props} />);

      // 计数应该保持（因为组件内部状态不会因为props变化而重置）
      expect(screen.getByTestId("count-display")).toHaveTextContent("5");
    });
  });
});
