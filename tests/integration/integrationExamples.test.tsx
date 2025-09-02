/**
 * 集成测试示例 - 演示组件间交互和端到端测试场景
 */

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "@/App";
import { TodoList } from "@/components/TodoList";
import { ApiExample } from "@/components/ApiExample";
import { userService } from "@/services/apiService";
import { User } from "@/types";

// Mock API service
jest.mock("@/services/apiService");
const mockedUserService = userService as jest.Mocked<typeof userService>;

// Mock fetch for ApiExample
global.fetch = jest.fn();
const mockedFetch = global.fetch as jest.MockedFunction<typeof fetch>;

describe("集成测试示例", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("1. 应用级别集成测试", () => {
    it("应该渲染完整的应用", () => {
      render(<App />);

      // 验证主要组件都被渲染
      expect(
        screen.getByText("React Testing Learning 示例应用")
      ).toBeInTheDocument();
      expect(
        screen.getByText("1. 基础计数器组件 (单元测试示例)")
      ).toBeInTheDocument();
      expect(
        screen.getByText("2. 用户信息组件 (Props 和状态测试)")
      ).toBeInTheDocument();
      expect(
        screen.getByText("3. 待办事项列表 (列表渲染和交互测试)")
      ).toBeInTheDocument();
      expect(
        screen.getByText("4. API 调用示例 (异步测试和 Mock)")
      ).toBeInTheDocument();

      // 验证所有主要组件都存在
      expect(screen.getByTestId("counter")).toBeInTheDocument();
      expect(screen.getByTestId("user-profile")).toBeInTheDocument();
      expect(screen.getByTestId("todo-list")).toBeInTheDocument();
      expect(screen.getByTestId("api-example")).toBeInTheDocument();
    });

    it("应该支持整个应用的用户工作流", async () => {
      const user = userEvent.setup();
      render(<App />);

      // 1. 操作计数器
      const incrementButton = screen.getByTestId("increment-button");
      await user.click(incrementButton);
      await user.click(incrementButton);
      expect(screen.getByTestId("count-display")).toHaveTextContent("2");

      // 2. 编辑用户信息
      const editButton = screen.getByTestId("edit-button");
      await user.click(editButton);

      const nameInput = screen.getByTestId("edit-name-input");
      await user.clear(nameInput);
      await user.type(nameInput, "修改后的名称");

      const saveButton = screen.getByTestId("save-button");
      await user.click(saveButton);

      expect(screen.getByTestId("user-name")).toHaveTextContent("修改后的名称");

      // 3. 添加待办事项
      const todoInput = screen.getByTestId("new-todo-input");
      const addTodoButton = screen.getByTestId("add-todo-button");

      await user.type(todoInput, "集成测试任务");
      await user.click(addTodoButton);

      expect(screen.getByText("集成测试任务")).toBeInTheDocument();
    });
  });

  describe("2. TodoList 组件集成测试", () => {
    const initialTodos = [
      {
        id: 1,
        text: "学习 React",
        completed: false,
        createdAt: new Date("2023-06-15T10:00:00Z"),
      },
      {
        id: 2,
        text: "写测试",
        completed: true,
        createdAt: new Date("2023-06-15T11:00:00Z"),
      },
    ];

    it("应该支持完整的待办事项管理流程", async () => {
      const user = userEvent.setup();
      const onTodosChange = jest.fn();

      render(
        <TodoList initialTodos={initialTodos} onTodosChange={onTodosChange} />
      );

      // 验证初始状态
      expect(
        screen.getByText("总计: 2 | 进行中: 1 | 已完成: 1")
      ).toBeInTheDocument();

      // 1. 添加新任务
      const newTodoInput = screen.getByTestId("new-todo-input");
      const addButton = screen.getByTestId("add-todo-button");

      await user.type(newTodoInput, "新任务");
      await user.click(addButton);

      expect(screen.getByText("新任务")).toBeInTheDocument();
      expect(
        screen.getByText("总计: 3 | 进行中: 2 | 已完成: 1")
      ).toBeInTheDocument();
      expect(onTodosChange).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ text: "新任务", completed: false }),
        ])
      );

      // 2. 切换任务状态
      const firstTodoCheckbox = screen.getByTestId("todo-checkbox-1");
      await user.click(firstTodoCheckbox);

      expect(
        screen.getByText("总计: 3 | 进行中: 1 | 已完成: 2")
      ).toBeInTheDocument();

      // 3. 过滤任务
      const completedFilter = screen.getByTestId("filter-completed");
      await user.click(completedFilter);

      expect(screen.getByText("学习 React")).toBeInTheDocument();
      expect(screen.getByText("写测试")).toBeInTheDocument();
      expect(screen.queryByText("新任务")).not.toBeInTheDocument();

      // 4. 删除任务
      const deleteButton = screen.getByTestId("delete-todo-2");
      await user.click(deleteButton);

      expect(screen.queryByText("写测试")).not.toBeInTheDocument();

      // 5. 清除已完成任务
      const activeFilter = screen.getByTestId("filter-all");
      await user.click(activeFilter);

      const clearCompletedButton = screen.getByTestId("clear-completed-button");
      await user.click(clearCompletedButton);

      expect(screen.queryByText("学习 React")).not.toBeInTheDocument();
      expect(screen.getByText("新任务")).toBeInTheDocument();
    });

    it("应该正确处理边界情况", async () => {
      const user = userEvent.setup();
      render(<TodoList />);

      // 空输入不应该添加任务
      const addButton = screen.getByTestId("add-todo-button");
      expect(addButton).toBeDisabled();

      const newTodoInput = screen.getByTestId("new-todo-input");
      await user.type(newTodoInput, "   ");
      expect(addButton).toBeDisabled();

      // 输入有效内容后按钮应该启用
      await user.clear(newTodoInput);
      await user.type(newTodoInput, "有效任务");
      expect(addButton).toBeEnabled();

      // Enter 键应该添加任务
      await user.keyboard("{Enter}");
      expect(screen.getByText("有效任务")).toBeInTheDocument();
      expect(newTodoInput).toHaveValue(""); // 输入框应该被清空
    });
  });

  describe("3. API 集成测试", () => {
    const mockUsers: User[] = [
      { id: 1, name: "用户1", email: "user1@example.com" },
      { id: 2, name: "用户2", email: "user2@example.com" },
    ];

    beforeEach(() => {
      // Mock userService
      mockedUserService.getUsers.mockResolvedValue(mockUsers);
      mockedUserService.getUserById.mockResolvedValue(mockUsers[0]);
      mockedUserService.createUser.mockResolvedValue({
        id: 3,
        name: "新用户",
        email: "newuser@example.com",
      });

      // Mock fetch for useFetch hook
      mockedFetch.mockResolvedValue({
        ok: true,
        json: async () => mockUsers[0],
      } as Response);
    });

    it("应该完整测试 API 调用流程", async () => {
      const user = userEvent.setup();
      render(<ApiExample />);

      // 1. 获取用户列表
      const fetchUsersButton = screen.getByTestId("fetch-users-button");
      await user.click(fetchUsersButton);

      await waitFor(() => {
        expect(screen.getByTestId("users-list")).toBeInTheDocument();
      });

      expect(screen.getByText("获取到 2 个用户:")).toBeInTheDocument();
      expect(screen.getByText("用户1 (user1@example.com)")).toBeInTheDocument();
      expect(mockedUserService.getUsers).toHaveBeenCalledTimes(1);

      // 2. 根据 ID 获取用户
      const userIdInput = screen.getByTestId("user-id-input");
      const getUserButton = screen.getByTestId("get-user-button");

      await user.clear(userIdInput);
      await user.type(userIdInput, "1");
      await user.click(getUserButton);

      await waitFor(() => {
        expect(screen.getByTestId("selected-user")).toBeInTheDocument();
      });

      expect(screen.getByText("姓名: 用户1")).toBeInTheDocument();
      expect(screen.getByText("邮箱: user1@example.com")).toBeInTheDocument();
      expect(mockedUserService.getUserById).toHaveBeenCalledWith(1);

      // 3. 使用 useFetch Hook
      const useFetchButton = screen.getByTestId("use-fetch-button");
      await user.click(useFetchButton);

      await waitFor(() => {
        expect(screen.getByTestId("fetched-user")).toBeInTheDocument();
      });

      expect(mockedFetch).toHaveBeenCalledWith(
        "https://jsonplaceholder.typicode.com/users/1",
        expect.objectContaining({ signal: expect.any(AbortSignal) })
      );

      // 4. 创建用户
      const createUserButton = screen.getByTestId("create-user-button");
      await user.click(createUserButton);

      await waitFor(() => {
        expect(mockedUserService.createUser).toHaveBeenCalledWith({
          name: "新用户",
          email: "newuser@example.com",
        });
      });
    });

    it("应该处理 API 错误情况", async () => {
      const user = userEvent.setup();

      // Mock API 错误
      mockedUserService.getUsers.mockRejectedValue(new Error("网络错误"));

      render(<ApiExample />);

      const fetchUsersButton = screen.getByTestId("fetch-users-button");
      await user.click(fetchUsersButton);

      await waitFor(() => {
        expect(screen.getByTestId("error-message")).toBeInTheDocument();
      });

      expect(screen.getByText("网络错误")).toBeInTheDocument();
    });

    it("应该显示加载状态", async () => {
      const user = userEvent.setup();

      // Mock 慢速 API 响应
      mockedUserService.getUsers.mockImplementation(
        () =>
          new Promise((resolve) => setTimeout(() => resolve(mockUsers), 100))
      );

      render(<ApiExample />);

      const fetchUsersButton = screen.getByTestId("fetch-users-button");
      await user.click(fetchUsersButton);

      // 应该立即显示加载状态
      expect(screen.getByTestId("loading-indicator")).toBeInTheDocument();
      expect(screen.getByText("加载中...")).toBeInTheDocument();

      // 等待加载完成
      await waitFor(() => {
        expect(
          screen.queryByTestId("loading-indicator")
        ).not.toBeInTheDocument();
      });

      expect(screen.getByTestId("users-list")).toBeInTheDocument();
    });
  });

  describe("4. 跨组件交互测试", () => {
    it("应该测试父子组件间的数据传递", async () => {
      const user = userEvent.setup();

      const ParentComponent = () => {
        const [count, setCount] = React.useState(0);

        return (
          <div>
            <div data-testid="parent-count">父组件计数: {count}</div>
            <TodoList onTodosChange={(todos) => setCount(todos.length)} />
          </div>
        );
      };

      render(<ParentComponent />);

      expect(screen.getByTestId("parent-count")).toHaveTextContent(
        "父组件计数: 0"
      );

      // 添加待办事项
      const newTodoInput = screen.getByTestId("new-todo-input");
      const addButton = screen.getByTestId("add-todo-button");

      await user.type(newTodoInput, "第一个任务");
      await user.click(addButton);

      expect(screen.getByTestId("parent-count")).toHaveTextContent(
        "父组件计数: 1"
      );

      await user.type(newTodoInput, "第二个任务");
      await user.click(addButton);

      expect(screen.getByTestId("parent-count")).toHaveTextContent(
        "父组件计数: 2"
      );
    });

    it("应该测试兄弟组件间的状态同步", async () => {
      const user = userEvent.setup();

      const SiblingComponents = () => {
        const [sharedData, setSharedData] = React.useState("初始值");

        return (
          <div>
            <div>
              <input
                data-testid="input1"
                value={sharedData}
                onChange={(e) => setSharedData(e.target.value)}
              />
            </div>
            <div>
              <input
                data-testid="input2"
                value={sharedData}
                onChange={(e) => setSharedData(e.target.value)}
              />
            </div>
            <div data-testid="shared-display">共享数据: {sharedData}</div>
          </div>
        );
      };

      render(<SiblingComponents />);

      const input1 = screen.getByTestId("input1");
      const input2 = screen.getByTestId("input2");
      const display = screen.getByTestId("shared-display");

      expect(display).toHaveTextContent("共享数据: 初始值");

      // 从第一个输入框修改
      await user.clear(input1);
      await user.type(input1, "从输入框1修改");

      expect(input2).toHaveValue("从输入框1修改");
      expect(display).toHaveTextContent("共享数据: 从输入框1修改");

      // 从第二个输入框修改
      await user.clear(input2);
      await user.type(input2, "从输入框2修改");

      expect(input1).toHaveValue("从输入框2修改");
      expect(display).toHaveTextContent("共享数据: 从输入框2修改");
    });
  });

  describe("5. 表单集成测试", () => {
    const ContactForm = () => {
      const [formData, setFormData] = React.useState({
        name: "",
        email: "",
        message: "",
      });
      const [submitted, setSubmitted] = React.useState(false);
      const [errors, setErrors] = React.useState<Record<string, string>>({});

      const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) {
          newErrors.name = "姓名不能为空";
        }

        if (!formData.email.trim()) {
          newErrors.email = "邮箱不能为空";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
          newErrors.email = "邮箱格式不正确";
        }

        if (!formData.message.trim()) {
          newErrors.message = "消息不能为空";
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
          setSubmitted(true);
        }
      };

      if (submitted) {
        return (
          <div data-testid="success-message">
            感谢您的留言，{formData.name}！我们会尽快回复到 {formData.email}
          </div>
        );
      }

      return (
        <form onSubmit={handleSubmit} data-testid="contact-form">
          <div>
            <label htmlFor="name">姓名:</label>
            <input
              id="name"
              data-testid="name-input"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
            />
            {errors.name && <div data-testid="name-error">{errors.name}</div>}
          </div>

          <div>
            <label htmlFor="email">邮箱:</label>
            <input
              id="email"
              type="email"
              data-testid="email-input"
              value={formData.email}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, email: e.target.value }))
              }
            />
            {errors.email && (
              <div data-testid="email-error">{errors.email}</div>
            )}
          </div>

          <div>
            <label htmlFor="message">消息:</label>
            <textarea
              id="message"
              data-testid="message-input"
              value={formData.message}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, message: e.target.value }))
              }
            />
            {errors.message && (
              <div data-testid="message-error">{errors.message}</div>
            )}
          </div>

          <button type="submit" data-testid="submit-button">
            提交
          </button>
        </form>
      );
    };

    it("应该完整测试表单提交流程", async () => {
      const user = userEvent.setup();
      render(<ContactForm />);

      // 1. 测试表单验证
      const submitButton = screen.getByTestId("submit-button");
      await user.click(submitButton);

      expect(screen.getByTestId("name-error")).toHaveTextContent(
        "姓名不能为空"
      );
      expect(screen.getByTestId("email-error")).toHaveTextContent(
        "邮箱不能为空"
      );
      expect(screen.getByTestId("message-error")).toHaveTextContent(
        "消息不能为空"
      );

      // 2. 测试邮箱格式验证
      const emailInput = screen.getByTestId("email-input");
      await user.type(emailInput, "invalid-email");
      await user.click(submitButton);

      expect(screen.getByTestId("email-error")).toHaveTextContent(
        "邮箱格式不正确"
      );

      // 3. 填写正确数据
      const nameInput = screen.getByTestId("name-input");
      const messageInput = screen.getByTestId("message-input");

      await user.type(nameInput, "张三");
      await user.clear(emailInput);
      await user.type(emailInput, "zhangsan@example.com");
      await user.type(messageInput, "这是一条测试消息");

      // 4. 成功提交
      await user.click(submitButton);

      expect(screen.getByTestId("success-message")).toHaveTextContent(
        "感谢您的留言，张三！我们会尽快回复到 zhangsan@example.com"
      );
      expect(screen.queryByTestId("contact-form")).not.toBeInTheDocument();
    });
  });

  describe("6. 路由集成测试（概念示例）", () => {
    // 注意：这里是概念示例，实际项目中需要配置路由
    it("应该测试路由导航", () => {
      // 模拟路由组件
      const MockRouter = ({ currentPath }: { currentPath: string }) => {
        switch (currentPath) {
          case "/":
            return <div data-testid="home-page">首页</div>;
          case "/about":
            return <div data-testid="about-page">关于页面</div>;
          case "/contact":
            return <div data-testid="contact-page">联系页面</div>;
          default:
            return <div data-testid="not-found">页面未找到</div>;
        }
      };

      const { rerender } = render(<MockRouter currentPath="/" />);
      expect(screen.getByTestId("home-page")).toBeInTheDocument();

      rerender(<MockRouter currentPath="/about" />);
      expect(screen.getByTestId("about-page")).toBeInTheDocument();

      rerender(<MockRouter currentPath="/invalid" />);
      expect(screen.getByTestId("not-found")).toBeInTheDocument();
    });
  });

  describe("7. 性能集成测试", () => {
    it("应该测试大量数据的渲染性能", () => {
      const largeTodoList = Array.from({ length: 1000 }, (_, i) => ({
        id: i + 1,
        text: `任务 ${i + 1}`,
        completed: i % 3 === 0,
        createdAt: new Date(),
      }));

      const start = performance.now();
      render(<TodoList initialTodos={largeTodoList} />);
      const end = performance.now();

      // 验证渲染时间在合理范围内
      expect(end - start).toBeLessThan(1000); // 应该在1秒内完成

      // 验证内容正确渲染
      expect(screen.getByText("总计: 1000")).toBeInTheDocument();
      expect(screen.getByText("任务 1")).toBeInTheDocument();
    });

    it("应该测试频繁状态更新的性能", async () => {
      const user = userEvent.setup();
      render(<App />);

      const incrementButton = screen.getByTestId("increment-button");

      const start = performance.now();

      // 快速点击多次
      for (let i = 0; i < 50; i++) {
        await user.click(incrementButton);
      }

      const end = performance.now();

      expect(screen.getByTestId("count-display")).toHaveTextContent("50");
      expect(end - start).toBeLessThan(2000); // 50次点击应该在2秒内完成
    });
  });

  describe("8. 错误边界集成测试", () => {
    const ErrorBoundary = ({ children }: { children: React.ReactNode }) => {
      const [hasError, setHasError] = React.useState(false);

      React.useEffect(() => {
        const handleError = () => setHasError(true);
        window.addEventListener("error", handleError);
        return () => window.removeEventListener("error", handleError);
      }, []);

      if (hasError) {
        return <div data-testid="error-fallback">出现了错误</div>;
      }

      return <>{children}</>;
    };

    const ThrowingComponent = ({ shouldThrow }: { shouldThrow: boolean }) => {
      if (shouldThrow) {
        throw new Error("测试错误");
      }
      return <div data-testid="normal-component">正常组件</div>;
    };

    it("应该测试错误边界的错误处理", () => {
      // 静默 console.error 以避免测试输出中的错误信息
      const consoleSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const { rerender } = render(
        <ErrorBoundary>
          <ThrowingComponent shouldThrow={false} />
        </ErrorBoundary>
      );

      expect(screen.getByTestId("normal-component")).toBeInTheDocument();

      // 触发错误
      expect(() => {
        rerender(
          <ErrorBoundary>
            <ThrowingComponent shouldThrow={true} />
          </ErrorBoundary>
        );
      }).toThrow("测试错误");

      consoleSpy.mockRestore();
    });
  });
});
