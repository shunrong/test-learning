/**
 * TodoList 组件测试
 */

import React, { act } from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TodoList } from "../TodoList";
import { Todo } from "@/types";

// 模拟的初始待办事项
const mockTodos: Todo[] = [
  {
    id: 1,
    text: "学习 React",
    completed: false,
    createdAt: new Date("2023-01-01"),
  },
  {
    id: 2,
    text: "写单元测试",
    completed: true,
    createdAt: new Date("2023-01-02"),
  },
  {
    id: 3,
    text: "完成项目",
    completed: false,
    createdAt: new Date("2023-01-03"),
  },
];

describe("TodoList组件", () => {
  describe("基础渲染", () => {
    it("应该正确渲染待办事项列表组件", () => {
      render(<TodoList />);
      expect(screen.getByTestId("todo-list")).toBeInTheDocument();
      expect(screen.getByTestId("new-todo-input")).toBeInTheDocument();
      expect(screen.getByTestId("add-todo-button")).toBeInTheDocument();
    });

    it("应该显示空状态消息", () => {
      render(<TodoList />);
      expect(screen.getByTestId("empty-message")).toBeInTheDocument();
      expect(screen.getByText("暂无待办事项")).toBeInTheDocument();
    });

    it("应该渲染初始待办事项", () => {
      render(<TodoList initialTodos={mockTodos} />);

      expect(screen.getByText("学习 React")).toBeInTheDocument();
      expect(screen.getByText("写单元测试")).toBeInTheDocument();
      expect(screen.getByText("完成项目")).toBeInTheDocument();
    });

    it("应该显示正确的统计信息", () => {
      render(<TodoList initialTodos={mockTodos} />);

      const stats = screen.getByTestId("todo-stats");
      expect(stats).toHaveTextContent("总计: 3");
      expect(stats).toHaveTextContent("进行中: 2");
      expect(stats).toHaveTextContent("已完成: 1");
    });
  });

  describe("添加待办事项", () => {
    it("应该能够添加新的待办事项", async () => {
      const user = userEvent.setup();
      const onTodosChange = jest.fn();

      render(<TodoList onTodosChange={onTodosChange} />);

      const input = screen.getByTestId("new-todo-input");
      const addButton = screen.getByTestId("add-todo-button");

      await user.type(input, "新的待办事项");
      await user.click(addButton);

      expect(screen.getByText("新的待办事项")).toBeInTheDocument();
      expect(onTodosChange).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            text: "新的待办事项",
            completed: false,
          }),
        ])
      );
    });

    it("应该在按下回车键时添加待办事项", async () => {
      const user = userEvent.setup();

      render(<TodoList />);

      const input = screen.getByTestId("new-todo-input");

      await user.type(input, "通过回车添加");
      await user.keyboard("{Enter}");

      expect(screen.getByText("通过回车添加")).toBeInTheDocument();
      expect(input).toHaveValue("");
    });

    it("不应该添加空白待办事项", async () => {
      const user = userEvent.setup();
      const onTodosChange = jest.fn();

      render(<TodoList onTodosChange={onTodosChange} />);

      const input = screen.getByTestId("new-todo-input");
      const addButton = screen.getByTestId("add-todo-button");

      await user.type(input, "   ");
      await user.click(addButton);

      expect(screen.getByTestId("empty-message")).toBeInTheDocument();
      expect(onTodosChange).not.toHaveBeenCalled();
    });

    it("添加按钮在输入为空时应该被禁用", () => {
      render(<TodoList />);

      const addButton = screen.getByTestId("add-todo-button");
      expect(addButton).toBeDisabled();
    });

    it("添加待办事项后应该清空输入框", async () => {
      const user = userEvent.setup();

      render(<TodoList />);

      const input = screen.getByTestId("new-todo-input");
      const addButton = screen.getByTestId("add-todo-button");

      await user.type(input, "测试清空");
      await user.click(addButton);

      expect(input).toHaveValue("");
    });
  });

  describe("待办事项操作", () => {
    it("应该能够切换待办事项的完成状态", async () => {
      const user = userEvent.setup();
      const onTodosChange = jest.fn();

      render(
        <TodoList initialTodos={mockTodos} onTodosChange={onTodosChange} />
      );

      const checkbox = screen.getByTestId("todo-checkbox-1");
      await user.click(checkbox);

      expect(onTodosChange).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            id: 1,
            completed: true,
          }),
        ])
      );
    });

    it("应该能够删除待办事项", async () => {
      const user = userEvent.setup();
      const onTodosChange = jest.fn();

      render(
        <TodoList initialTodos={mockTodos} onTodosChange={onTodosChange} />
      );

      const deleteButton = screen.getByTestId("delete-todo-1");
      await user.click(deleteButton);

      expect(screen.queryByText("学习 React")).not.toBeInTheDocument();
      expect(onTodosChange).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ id: 2 }),
          expect.objectContaining({ id: 3 }),
        ])
      );
    });

    it("应该正确显示完成的待办事项样式", () => {
      render(<TodoList initialTodos={mockTodos} />);

      const completedTodoText = screen.getByTestId("todo-text-2");
      const incompleteTodoText = screen.getByTestId("todo-text-1");

      expect(completedTodoText).toHaveStyle("text-decoration: line-through");
      expect(incompleteTodoText).toHaveStyle("text-decoration: none");
    });
  });

  describe("过滤功能", () => {
    it("应该正确过滤显示所有待办事项", async () => {
      const user = userEvent.setup();

      render(<TodoList initialTodos={mockTodos} />);

      const allFilter = screen.getByTestId("filter-all");
      await user.click(allFilter);

      expect(screen.getByText("学习 React")).toBeInTheDocument();
      expect(screen.getByText("写单元测试")).toBeInTheDocument();
      expect(screen.getByText("完成项目")).toBeInTheDocument();
    });

    it("应该正确过滤显示进行中的待办事项", async () => {
      const user = userEvent.setup();

      render(<TodoList initialTodos={mockTodos} />);

      const activeFilter = screen.getByTestId("filter-active");
      await user.click(activeFilter);

      expect(screen.getByText("学习 React")).toBeInTheDocument();
      expect(screen.getByText("完成项目")).toBeInTheDocument();
      expect(screen.queryByText("写单元测试")).not.toBeInTheDocument();
    });

    it("应该正确过滤显示已完成的待办事项", async () => {
      const user = userEvent.setup();

      render(<TodoList initialTodos={mockTodos} />);

      const completedFilter = screen.getByTestId("filter-completed");
      await user.click(completedFilter);

      expect(screen.getByText("写单元测试")).toBeInTheDocument();
      expect(screen.queryByText("学习 React")).not.toBeInTheDocument();
      expect(screen.queryByText("完成项目")).not.toBeInTheDocument();
    });

    it("应该在过滤后显示正确的空状态消息", async () => {
      const user = userEvent.setup();
      const onlyIncompleteTodos = mockTodos.filter((todo) => !todo.completed);

      render(<TodoList initialTodos={onlyIncompleteTodos} />);

      const completedFilter = screen.getByTestId("filter-completed");
      await user.click(completedFilter);

      expect(screen.getByText("暂无已完成的事项")).toBeInTheDocument();
    });

    it("应该高亮当前选中的过滤器", async () => {
      const user = userEvent.setup();

      render(<TodoList initialTodos={mockTodos} />);

      const activeFilter = screen.getByTestId("filter-active");
      await user.click(activeFilter);

      expect(activeFilter).toHaveStyle("background-color: rgb(116, 192, 252)");
      expect(activeFilter).toHaveStyle("color: white");
    });
  });

  describe("清除已完成功能", () => {
    it("应该显示清除已完成按钮当有已完成的待办事项时", () => {
      render(<TodoList initialTodos={mockTodos} />);

      const clearButton = screen.getByTestId("clear-completed-button");
      expect(clearButton).toBeInTheDocument();
      expect(clearButton).toHaveTextContent("清除已完成 (1)");
    });

    it("不应该显示清除已完成按钮当没有已完成的待办事项时", () => {
      const incompleteTodos = mockTodos.filter((todo) => !todo.completed);
      render(<TodoList initialTodos={incompleteTodos} />);

      expect(
        screen.queryByTestId("clear-completed-button")
      ).not.toBeInTheDocument();
    });

    it("应该能够清除所有已完成的待办事项", async () => {
      const user = userEvent.setup();
      const onTodosChange = jest.fn();

      render(
        <TodoList initialTodos={mockTodos} onTodosChange={onTodosChange} />
      );

      const clearButton = screen.getByTestId("clear-completed-button");
      await user.click(clearButton);

      expect(onTodosChange).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ id: 1, completed: false }),
          expect.objectContaining({ id: 3, completed: false }),
        ])
      );
      expect(onTodosChange).toHaveBeenCalledWith(
        expect.not.arrayContaining([
          expect.objectContaining({ completed: true }),
        ])
      );
    });
  });

  describe("可访问性", () => {
    it("所有交互元素应该有正确的 data-testid", () => {
      render(<TodoList initialTodos={mockTodos} />);

      expect(screen.getByTestId("todo-list")).toBeInTheDocument();
      expect(screen.getByTestId("new-todo-input")).toBeInTheDocument();
      expect(screen.getByTestId("add-todo-button")).toBeInTheDocument();
      expect(screen.getByTestId("filter-all")).toBeInTheDocument();
      expect(screen.getByTestId("filter-active")).toBeInTheDocument();
      expect(screen.getByTestId("filter-completed")).toBeInTheDocument();
      expect(screen.getByTestId("todo-stats")).toBeInTheDocument();
      expect(screen.getByTestId("todo-items")).toBeInTheDocument();
    });

    it("每个待办事项应该有正确的 data-testid", () => {
      render(<TodoList initialTodos={mockTodos} />);

      mockTodos.forEach((todo) => {
        expect(screen.getByTestId(`todo-item-${todo.id}`)).toBeInTheDocument();
        expect(
          screen.getByTestId(`todo-checkbox-${todo.id}`)
        ).toBeInTheDocument();
        expect(screen.getByTestId(`todo-text-${todo.id}`)).toBeInTheDocument();
        expect(
          screen.getByTestId(`delete-todo-${todo.id}`)
        ).toBeInTheDocument();
      });
    });
  });

  describe("边界情况", () => {
    it("应该处理空的初始待办事项数组", () => {
      render(<TodoList initialTodos={[]} />);

      expect(screen.getByTestId("empty-message")).toBeInTheDocument();
      expect(screen.getByText("暂无待办事项")).toBeInTheDocument();
    });

    it("应该处理很长的待办事项文本", async () => {
      const user = userEvent.setup();
      const longText =
        "这是一个非常非常非常非常非常长的待办事项文本，用来测试组件是否能正确处理长文本内容";

      render(<TodoList />);

      const input = screen.getByTestId("new-todo-input");
      const addButton = screen.getByTestId("add-todo-button");

      await user.type(input, longText);
      await user.click(addButton);

      expect(screen.getByText(longText)).toBeInTheDocument();
    });

    it("应该处理重复的待办事项文本", async () => {
      const user = userEvent.setup();

      render(<TodoList />);

      const input = screen.getByTestId("new-todo-input");
      const addButton = screen.getByTestId("add-todo-button");

      // 添加第一个
      await user.type(input, "重复文本");
      await user.click(addButton);

      // 添加第二个相同文本
      await user.type(input, "重复文本");
      await user.click(addButton);

      const todoItems = screen.getAllByText("重复文本");
      expect(todoItems).toHaveLength(2);
    });
  });

  describe("快照测试", () => {
    it("应该匹配空状态的快照", () => {
      const { container } = render(<TodoList />);
      expect(container.firstChild).toMatchSnapshot();
    });

    it("应该匹配有数据状态的快照", () => {
      const { container } = render(<TodoList initialTodos={mockTodos} />);
      expect(container.firstChild).toMatchSnapshot();
    });
  });

  describe("性能测试", () => {
    it("快速操作不应该导致性能问题", async () => {
      const user = userEvent.setup();

      render(<TodoList />);

      const input = screen.getByTestId("new-todo-input");
      const addButton = screen.getByTestId("add-todo-button");

      // 快速添加多个待办事项
      for (let i = 0; i < 10; i++) {
        await user.type(input, `快速测试 ${i}`);
        await user.click(addButton);
      }

      // 验证所有项目都被添加
      for (let i = 0; i < 10; i++) {
        expect(screen.getByText(`快速测试 ${i}`)).toBeInTheDocument();
      }
    });
  });
});
