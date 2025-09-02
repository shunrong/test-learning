/**
 * ApiExample 组件测试
 */

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ApiExample } from "../ApiExample";
import { userService } from "@/services/apiService";
import * as useFetchModule from "@/hooks/useFetch";

// Mock 依赖
jest.mock("@/services/apiService");
jest.mock("@/hooks/useFetch");

const mockUserService = userService as jest.Mocked<typeof userService>;
const mockUseFetch = useFetchModule.useFetch as jest.MockedFunction<
  typeof useFetchModule.useFetch
>;

// 模拟数据
const mockUser = {
  id: 1,
  name: "张三",
  email: "zhangsan@example.com",
};

const mockUsers = [
  { id: 1, name: "张三", email: "zhangsan@example.com" },
  { id: 2, name: "李四", email: "lisi@example.com" },
  { id: 3, name: "王五", email: "wangwu@example.com" },
];

describe("ApiExample组件", () => {
  const mockExecute = jest.fn();
  const mockReset = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    // 默认 useFetch mock
    mockUseFetch.mockReturnValue({
      data: null,
      loading: false,
      error: null,
      execute: mockExecute,
      reset: mockReset,
    });
  });

  describe("基础渲染", () => {
    it("应该正确渲染 API 示例组件", () => {
      render(<ApiExample />);

      expect(screen.getByTestId("api-example")).toBeInTheDocument();
      expect(screen.getByText("API 调用示例")).toBeInTheDocument();
      expect(screen.getByTestId("fetch-users-button")).toBeInTheDocument();
      expect(screen.getByTestId("get-user-button")).toBeInTheDocument();
      expect(screen.getByTestId("use-fetch-button")).toBeInTheDocument();
      expect(screen.getByTestId("create-user-button")).toBeInTheDocument();
    });

    it("应该显示用户 ID 输入框和默认值", () => {
      render(<ApiExample />);

      const userIdInput = screen.getByTestId("user-id-input");
      expect(userIdInput).toBeInTheDocument();
      expect(userIdInput).toHaveValue(1);
    });

    it("应该正确渲染各个功能区域", () => {
      render(<ApiExample />);

      expect(screen.getByText("获取所有用户")).toBeInTheDocument();
      expect(screen.getByText("根据 ID 获取用户")).toBeInTheDocument();
      expect(screen.getByText("使用 useFetch Hook")).toBeInTheDocument();
      expect(screen.getByText("创建新用户")).toBeInTheDocument();
    });
  });

  describe("获取用户列表功能", () => {
    it("应该能够成功获取用户列表", async () => {
      const user = userEvent.setup();
      mockUserService.getUsers.mockResolvedValue(mockUsers);

      render(<ApiExample />);

      const fetchUsersButton = screen.getByTestId("fetch-users-button");
      await user.click(fetchUsersButton);

      await waitFor(() => {
        expect(mockUserService.getUsers).toHaveBeenCalledTimes(1);
      });

      await waitFor(() => {
        expect(screen.getByTestId("users-list")).toBeInTheDocument();
        expect(screen.getByText("获取到 3 个用户:")).toBeInTheDocument();
        expect(
          screen.getByText("张三 (zhangsan@example.com)")
        ).toBeInTheDocument();
        expect(screen.getByText("李四 (lisi@example.com)")).toBeInTheDocument();
      });
    });

    it("应该在获取用户列表时显示加载状态", async () => {
      const user = userEvent.setup();
      mockUserService.getUsers.mockImplementation(
        () =>
          new Promise((resolve) => setTimeout(() => resolve(mockUsers), 100))
      );

      render(<ApiExample />);

      const fetchUsersButton = screen.getByTestId("fetch-users-button");
      await user.click(fetchUsersButton);

      expect(screen.getByTestId("loading-indicator")).toBeInTheDocument();
      expect(screen.getByText("加载中...")).toBeInTheDocument();

      await waitFor(() => {
        expect(
          screen.queryByTestId("loading-indicator")
        ).not.toBeInTheDocument();
      });
    });

    it("应该处理获取用户列表的错误", async () => {
      const user = userEvent.setup();
      const errorMessage = "网络错误";
      mockUserService.getUsers.mockRejectedValue(new Error(errorMessage));

      render(<ApiExample />);

      const fetchUsersButton = screen.getByTestId("fetch-users-button");
      await user.click(fetchUsersButton);

      await waitFor(() => {
        expect(screen.getByTestId("error-message")).toBeInTheDocument();
        expect(screen.getByText(errorMessage)).toBeInTheDocument();
      });
    });

    it("应该限制显示的用户数量不超过5个", async () => {
      const user = userEvent.setup();
      const manyUsers = Array.from({ length: 10 }, (_, i) => ({
        id: i + 1,
        name: `用户${i + 1}`,
        email: `user${i + 1}@example.com`,
      }));

      mockUserService.getUsers.mockResolvedValue(manyUsers);

      render(<ApiExample />);

      const fetchUsersButton = screen.getByTestId("fetch-users-button");
      await user.click(fetchUsersButton);

      await waitFor(() => {
        expect(screen.getByText("获取到 10 个用户:")).toBeInTheDocument();

        // 应该只显示前5个用户
        expect(
          screen.getByText("用户1 (user1@example.com)")
        ).toBeInTheDocument();
        expect(
          screen.getByText("用户5 (user5@example.com)")
        ).toBeInTheDocument();

        // 应该显示省略号
        expect(screen.getByText("...")).toBeInTheDocument();
      });
    });
  });

  describe("根据ID获取用户功能", () => {
    it("应该能够根据ID成功获取用户", async () => {
      const user = userEvent.setup();
      mockUserService.getUserById.mockResolvedValue(mockUser);

      render(<ApiExample />);

      const userIdInput = screen.getByTestId("user-id-input");
      const getUserButton = screen.getByTestId("get-user-button");

      await user.clear(userIdInput);
      await user.type(userIdInput, "1");
      await user.click(getUserButton);

      await waitFor(() => {
        expect(mockUserService.getUserById).toHaveBeenCalledWith(1);
      });

      await waitFor(() => {
        expect(screen.getByTestId("selected-user")).toBeInTheDocument();
        expect(screen.getByText("张三")).toBeInTheDocument();
        expect(screen.getByText("zhangsan@example.com")).toBeInTheDocument();
      });
    });

    it("应该验证用户ID的有效性", async () => {
      const user = userEvent.setup();

      render(<ApiExample />);

      const userIdInput = screen.getByTestId("user-id-input");
      const getUserButton = screen.getByTestId("get-user-button");

      await user.clear(userIdInput);
      await user.type(userIdInput, "abc");
      await user.click(getUserButton);

      await waitFor(() => {
        expect(screen.getByTestId("error-message")).toBeInTheDocument();
        expect(screen.getByText("请输入有效的用户 ID")).toBeInTheDocument();
      });

      expect(mockUserService.getUserById).not.toHaveBeenCalled();
    });

    it("应该处理空的用户ID", async () => {
      const user = userEvent.setup();

      render(<ApiExample />);

      const userIdInput = screen.getByTestId("user-id-input");
      const getUserButton = screen.getByTestId("get-user-button");

      await user.clear(userIdInput);
      await user.click(getUserButton);

      await waitFor(() => {
        expect(screen.getByTestId("error-message")).toBeInTheDocument();
        expect(screen.getByText("请输入有效的用户 ID")).toBeInTheDocument();
      });

      expect(mockUserService.getUserById).not.toHaveBeenCalled();
    });

    it("应该处理获取用户的错误", async () => {
      const user = userEvent.setup();
      const errorMessage = "用户不存在";
      mockUserService.getUserById.mockRejectedValue(new Error(errorMessage));

      render(<ApiExample />);

      const getUserButton = screen.getByTestId("get-user-button");
      await user.click(getUserButton);

      await waitFor(() => {
        expect(screen.getByTestId("error-message")).toBeInTheDocument();
        expect(screen.getByText(errorMessage)).toBeInTheDocument();
      });
    });
  });

  describe("useFetch Hook 功能", () => {
    it("应该使用 useFetch Hook 获取用户", async () => {
      const user = userEvent.setup();
      mockUseFetch.mockReturnValue({
        data: mockUser,
        loading: false,
        error: null,
        execute: mockExecute,
        reset: mockReset,
      });

      render(<ApiExample />);

      const useFetchButton = screen.getByTestId("use-fetch-button");
      await user.click(useFetchButton);

      expect(mockExecute).toHaveBeenCalledTimes(1);
      expect(screen.getByTestId("fetched-user")).toBeInTheDocument();
      expect(screen.getByText("张三")).toBeInTheDocument();
    });

    it("应该显示 useFetch 的加载状态", () => {
      mockUseFetch.mockReturnValue({
        data: null,
        loading: true,
        error: null,
        execute: mockExecute,
        reset: mockReset,
      });

      render(<ApiExample />);

      expect(screen.getByTestId("loading-indicator")).toBeInTheDocument();

      const useFetchButton = screen.getByTestId("use-fetch-button");
      expect(useFetchButton).toBeDisabled();
    });

    it("应该显示 useFetch 的错误状态", () => {
      const error = new Error("Hook 错误");
      mockUseFetch.mockReturnValue({
        data: null,
        loading: false,
        error,
        execute: mockExecute,
        reset: mockReset,
      });

      render(<ApiExample />);

      expect(screen.getByTestId("error-message")).toBeInTheDocument();
      expect(screen.getByText("Hook 错误")).toBeInTheDocument();
    });
  });

  describe("创建用户功能", () => {
    it("应该能够创建新用户", async () => {
      const user = userEvent.setup();
      const newUser = {
        id: 4,
        name: "新用户",
        email: "newuser@example.com",
      };

      mockUserService.createUser.mockResolvedValue(newUser);
      mockUserService.getUsers.mockResolvedValue(mockUsers);

      render(<ApiExample />);

      // 先获取用户列表
      const fetchUsersButton = screen.getByTestId("fetch-users-button");
      await user.click(fetchUsersButton);

      await waitFor(() => {
        expect(screen.getByText("获取到 3 个用户:")).toBeInTheDocument();
      });

      // 创建新用户
      const createUserButton = screen.getByTestId("create-user-button");
      await user.click(createUserButton);

      await waitFor(() => {
        expect(mockUserService.createUser).toHaveBeenCalledWith({
          name: "新用户",
          email: "newuser@example.com",
        });
      });
    });

    it("应该处理创建用户的错误", async () => {
      const user = userEvent.setup();
      const errorMessage = "创建失败";
      mockUserService.createUser.mockRejectedValue(new Error(errorMessage));

      render(<ApiExample />);

      const createUserButton = screen.getByTestId("create-user-button");
      await user.click(createUserButton);

      await waitFor(() => {
        expect(screen.getByTestId("error-message")).toBeInTheDocument();
        expect(screen.getByText(errorMessage)).toBeInTheDocument();
      });
    });
  });

  describe("加载状态管理", () => {
    it("在加载时应该禁用所有按钮", async () => {
      const user = userEvent.setup();
      mockUserService.getUsers.mockImplementation(
        () =>
          new Promise((resolve) => setTimeout(() => resolve(mockUsers), 100))
      );

      render(<ApiExample />);

      const fetchUsersButton = screen.getByTestId("fetch-users-button");
      await user.click(fetchUsersButton);

      // 检查所有按钮都被禁用
      expect(screen.getByTestId("fetch-users-button")).toBeDisabled();
      expect(screen.getByTestId("get-user-button")).toBeDisabled();
      expect(screen.getByTestId("create-user-button")).toBeDisabled();

      await waitFor(() => {
        expect(
          screen.queryByTestId("loading-indicator")
        ).not.toBeInTheDocument();
      });
    });
  });

  describe("错误处理", () => {
    it("应该清除之前的错误信息", async () => {
      const user = userEvent.setup();

      // 先触发一个错误
      mockUserService.getUsers.mockRejectedValue(new Error("第一个错误"));

      render(<ApiExample />);

      const fetchUsersButton = screen.getByTestId("fetch-users-button");
      await user.click(fetchUsersButton);

      await waitFor(() => {
        expect(screen.getByText("第一个错误")).toBeInTheDocument();
      });

      // 然后成功请求
      mockUserService.getUsers.mockResolvedValue(mockUsers);
      await user.click(fetchUsersButton);

      await waitFor(() => {
        expect(screen.queryByText("第一个错误")).not.toBeInTheDocument();
        expect(screen.getByTestId("users-list")).toBeInTheDocument();
      });
    });

    it("应该处理非 Error 对象的错误", async () => {
      const user = userEvent.setup();
      mockUserService.getUsers.mockRejectedValue("字符串错误");

      render(<ApiExample />);

      const fetchUsersButton = screen.getByTestId("fetch-users-button");
      await user.click(fetchUsersButton);

      await waitFor(() => {
        expect(screen.getByText("获取用户列表失败")).toBeInTheDocument();
      });
    });
  });

  describe("可访问性", () => {
    it("所有交互元素应该有正确的 data-testid", () => {
      render(<ApiExample />);

      expect(screen.getByTestId("api-example")).toBeInTheDocument();
      expect(screen.getByTestId("fetch-users-button")).toBeInTheDocument();
      expect(screen.getByTestId("user-id-input")).toBeInTheDocument();
      expect(screen.getByTestId("get-user-button")).toBeInTheDocument();
      expect(screen.getByTestId("use-fetch-button")).toBeInTheDocument();
      expect(screen.getByTestId("create-user-button")).toBeInTheDocument();
    });

    it("用户列表项应该有正确的 data-testid", async () => {
      const user = userEvent.setup();
      mockUserService.getUsers.mockResolvedValue(mockUsers);

      render(<ApiExample />);

      const fetchUsersButton = screen.getByTestId("fetch-users-button");
      await user.click(fetchUsersButton);

      await waitFor(() => {
        mockUsers.forEach((userData) => {
          expect(
            screen.getByTestId(`user-item-${userData.id}`)
          ).toBeInTheDocument();
        });
      });
    });
  });

  describe("快照测试", () => {
    it("应该匹配初始状态的快照", () => {
      const { container } = render(<ApiExample />);
      expect(container.firstChild).toMatchSnapshot();
    });

    it("应该匹配有数据状态的快照", async () => {
      const user = userEvent.setup();
      mockUserService.getUsers.mockResolvedValue(mockUsers);

      const { container } = render(<ApiExample />);

      const fetchUsersButton = screen.getByTestId("fetch-users-button");
      await user.click(fetchUsersButton);

      await waitFor(() => {
        expect(screen.getByTestId("users-list")).toBeInTheDocument();
      });

      expect(container.firstChild).toMatchSnapshot();
    });
  });

  describe("输入值变化", () => {
    it("应该正确更新用户ID输入值", async () => {
      const user = userEvent.setup();

      render(<ApiExample />);

      const userIdInput = screen.getByTestId("user-id-input");

      await user.clear(userIdInput);
      await user.type(userIdInput, "123");

      expect(userIdInput).toHaveValue(123);
    });
  });
});
