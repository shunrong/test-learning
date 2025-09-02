/**
 * API 服务测试 - 演示各种 Mock 技术
 */

import axios from "axios";
import {
  userService,
  fetchData,
  fetchWithRetry,
  fetchWithDelay,
  fetchWithRandomFailure,
} from "../apiService";
import { User } from "@/types";

// Mock axios
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock axios 实例
const mockAxiosInstance = {
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
  interceptors: {
    request: {
      use: jest.fn(),
    },
    response: {
      use: jest.fn(),
    },
  },
};

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, "localStorage", { value: localStorageMock });

// Mock window.location
Object.defineProperty(window, "location", {
  value: {
    href: "http://localhost:3000",
  },
  writable: true,
});

// 全局测试数据
const mockUser: User = {
  id: 1,
  name: "John Doe",
  email: "john@example.com",
};

describe("apiService Mock 测试", () => {
  beforeEach(() => {
    // 重置所有 mocks
    jest.clearAllMocks();

    // Mock axios.create 返回我们的 mock 实例
    mockedAxios.create.mockReturnValue(mockAxiosInstance as any);

    // 清除 localStorage mock
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
    localStorageMock.removeItem.mockClear();
  });

  describe("userService - API Mock 示例", () => {
    describe("getUsers", () => {
      it("应该成功获取用户列表", async () => {
        const mockUsers = [mockUser, { ...mockUser, id: 2, name: "Jane Doe" }];

        // Mock API 响应
        mockAxiosInstance.get.mockResolvedValueOnce({
          data: mockUsers,
          status: 200,
          statusText: "OK",
        });

        const result = await userService.getUsers();

        expect(result).toEqual(mockUsers);
        expect(mockAxiosInstance.get).toHaveBeenCalledWith("/users");
        expect(mockAxiosInstance.get).toHaveBeenCalledTimes(1);
      });

      it("应该处理 API 错误", async () => {
        // Mock API 错误
        mockAxiosInstance.get.mockRejectedValueOnce(new Error("Network Error"));

        await expect(userService.getUsers()).rejects.toThrow(
          "Failed to fetch users"
        );
        expect(mockAxiosInstance.get).toHaveBeenCalledWith("/users");
      });

      it("应该处理不同的错误类型", async () => {
        // Mock 不同类型的错误
        const errorCases = [
          {
            error: new Error("Network timeout"),
            expected: "Failed to fetch users",
          },
          {
            error: { response: { status: 500 } },
            expected: "Failed to fetch users",
          },
          { error: "String error", expected: "Failed to fetch users" },
        ];

        for (const { error, expected } of errorCases) {
          mockAxiosInstance.get.mockRejectedValueOnce(error);
          await expect(userService.getUsers()).rejects.toThrow(expected);
        }
      });
    });

    describe("getUserById", () => {
      it("应该根据 ID 获取用户", async () => {
        mockAxiosInstance.get.mockResolvedValueOnce({
          data: mockUser,
        });

        const result = await userService.getUserById(1);

        expect(result).toEqual(mockUser);
        expect(mockAxiosInstance.get).toHaveBeenCalledWith("/users/1");
      });

      it("应该处理用户不存在的情况", async () => {
        mockAxiosInstance.get.mockRejectedValueOnce({
          response: { status: 404 },
        });

        await expect(userService.getUserById(999)).rejects.toThrow(
          "Failed to fetch user with id 999"
        );
      });
    });

    describe("createUser", () => {
      it("应该创建新用户", async () => {
        const newUserData = { name: "New User", email: "new@example.com" };
        const createdUser = { ...newUserData, id: 3 };

        mockAxiosInstance.post.mockResolvedValueOnce({
          data: createdUser,
        });

        const result = await userService.createUser(newUserData);

        expect(result).toEqual(createdUser);
        expect(mockAxiosInstance.post).toHaveBeenCalledWith(
          "/users",
          newUserData
        );
      });
    });

    describe("updateUser", () => {
      it("应该更新用户信息", async () => {
        const updateData = { name: "Updated Name" };
        const updatedUser = { ...mockUser, ...updateData };

        mockAxiosInstance.put.mockResolvedValueOnce({
          data: updatedUser,
        });

        const result = await userService.updateUser(1, updateData);

        expect(result).toEqual(updatedUser);
        expect(mockAxiosInstance.put).toHaveBeenCalledWith(
          "/users/1",
          updateData
        );
      });
    });

    describe("deleteUser", () => {
      it("应该删除用户", async () => {
        mockAxiosInstance.delete.mockResolvedValueOnce({});

        await userService.deleteUser(1);

        expect(mockAxiosInstance.delete).toHaveBeenCalledWith("/users/1");
      });
    });

    describe("searchUsers", () => {
      it("应该搜索用户", async () => {
        const searchResults = [mockUser];
        mockAxiosInstance.get.mockResolvedValueOnce({
          data: searchResults,
        });

        const result = await userService.searchUsers("john");

        expect(result).toEqual(searchResults);
        expect(mockAxiosInstance.get).toHaveBeenCalledWith("/users?q=john");
      });
    });
  });

  describe("通用函数 Mock 示例", () => {
    describe("fetchData", () => {
      it("应该成功获取数据", async () => {
        const testData = { message: "Hello World" };
        mockAxiosInstance.get.mockResolvedValueOnce({
          data: testData,
        });

        const result = await fetchData("/test");

        expect(result).toEqual(testData);
        expect(mockAxiosInstance.get).toHaveBeenCalledWith("/test");
      });
    });

    describe("fetchWithRetry - 重试机制 Mock", () => {
      beforeEach(() => {
        // Mock setTimeout for faster tests
        jest.useFakeTimers();
      });

      afterEach(() => {
        jest.useRealTimers();
      });

      it("应该在失败后重试", async () => {
        const testData = { success: true };

        // 前两次失败，第三次成功
        mockAxiosInstance.get
          .mockRejectedValueOnce(new Error("Network error"))
          .mockRejectedValueOnce(new Error("Timeout"))
          .mockResolvedValueOnce({ data: testData });

        const promise = fetchWithRetry("/retry-test", 3, 100);

        // 快进时间，触发重试
        jest.advanceTimersByTime(100);
        jest.advanceTimersByTime(200); // 指数退避，第二次延迟更长

        const result = await promise;

        expect(result).toEqual(testData);
        expect(mockAxiosInstance.get).toHaveBeenCalledTimes(3);
      });

      it("应该在达到最大重试次数后失败", async () => {
        mockAxiosInstance.get.mockRejectedValue(new Error("Persistent error"));

        const promise = fetchWithRetry("/fail-test", 2, 100);

        // 快进时间
        jest.advanceTimersByTime(100);
        jest.advanceTimersByTime(200);

        await expect(promise).rejects.toThrow("Persistent error");
        expect(mockAxiosInstance.get).toHaveBeenCalledTimes(3); // 初始调用 + 2次重试
      });
    });

    describe("fetchWithDelay - 时间 Mock", () => {
      beforeEach(() => {
        jest.useFakeTimers();
      });

      afterEach(() => {
        jest.useRealTimers();
      });

      it("应该在指定延迟后返回数据", async () => {
        const testData = { delayed: true };

        const promise = fetchWithDelay(testData, 1000);

        // 快进时间
        jest.advanceTimersByTime(1000);

        const result = await promise;
        expect(result).toEqual(testData);
      });

      it("延迟未到时不应该返回", async () => {
        const testData = { delayed: true };
        let resolved = false;

        fetchWithDelay(testData, 1000).then(() => {
          resolved = true;
        });

        // 只快进一半时间
        jest.advanceTimersByTime(500);

        expect(resolved).toBe(false);

        // 快进剩余时间
        jest.advanceTimersByTime(500);

        // 等待下一个 tick
        await Promise.resolve();
        expect(resolved).toBe(true);
      });
    });

    describe("fetchWithRandomFailure - 随机性 Mock", () => {
      it("应该在 Math.random Mock 下可预测地失败", async () => {
        // Mock Math.random 返回固定值
        const originalRandom = Math.random;
        Math.random = jest.fn();

        // 模拟失败情况 (返回值 < 0.3)
        (Math.random as jest.Mock).mockReturnValue(0.2);

        await expect(
          fetchWithRandomFailure({ data: "test" }, 0.3)
        ).rejects.toThrow("Random failure occurred");

        // 模拟成功情况 (返回值 >= 0.3)
        (Math.random as jest.Mock).mockReturnValue(0.5);

        const result = await fetchWithRandomFailure({ data: "test" }, 0.3);
        expect(result).toEqual({ data: "test" });

        // 恢复原始 Math.random
        Math.random = originalRandom;
      });

      it("应该使用 jest.spyOn 监听 Math.random", async () => {
        const randomSpy = jest.spyOn(Math, "random");

        // 设置返回值
        randomSpy.mockReturnValue(0.8); // 成功

        const result = await fetchWithRandomFailure({ success: true });

        expect(randomSpy).toHaveBeenCalled();
        expect(result).toEqual({ success: true });

        randomSpy.mockRestore();
      });
    });
  });

  describe("localStorage Mock 示例", () => {
    it("应该模拟 localStorage 操作", () => {
      // 测试获取不存在的 token
      localStorageMock.getItem.mockReturnValue(null);

      const token = localStorage.getItem("authToken");
      expect(token).toBe(null);
      expect(localStorageMock.getItem).toHaveBeenCalledWith("authToken");
    });

    it("应该模拟设置和获取 token", () => {
      const testToken = "abc123";

      // 模拟设置 token
      localStorage.setItem("authToken", testToken);
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        "authToken",
        testToken
      );

      // 模拟获取 token
      localStorageMock.getItem.mockReturnValue(testToken);
      const retrievedToken = localStorage.getItem("authToken");

      expect(retrievedToken).toBe(testToken);
      expect(localStorageMock.getItem).toHaveBeenCalledWith("authToken");
    });
  });

  describe("拦截器 Mock 示例", () => {
    it("应该测试请求拦截器逻辑", () => {
      // 由于拦截器在模块初始化时设置，我们可以验证它们被调用
      expect(mockAxiosInstance.interceptors.request.use).toHaveBeenCalled();
      expect(mockAxiosInstance.interceptors.response.use).toHaveBeenCalled();
    });

    it("应该模拟拦截器行为", async () => {
      // 获取拦截器函数
      const requestInterceptorCall =
        mockAxiosInstance.interceptors.request.use.mock.calls[0];
      const requestInterceptor = requestInterceptorCall[0];

      // 测试请求拦截器添加 token
      localStorageMock.getItem.mockReturnValue("test-token");

      const config = { headers: {} };
      const result = requestInterceptor(config);

      expect(result.headers.Authorization).toBe("Bearer test-token");
    });
  });

  describe("模块 Mock 示例", () => {
    // 这个例子展示如何 mock 整个模块
    it("应该可以 mock 整个 axios 模块", () => {
      expect(jest.isMockFunction(mockedAxios.create)).toBe(true);
      expect(mockedAxios.create).toHaveBeenCalled();
    });
  });

  describe("函数 Mock 高级用法", () => {
    it("mockImplementation - 自定义实现", async () => {
      mockAxiosInstance.get.mockImplementation((url) => {
        if (url === "/users/1") {
          return Promise.resolve({ data: mockUser });
        }
        return Promise.reject(new Error("Not found"));
      });

      const result = await userService.getUserById(1);
      expect(result).toEqual(mockUser);

      await expect(userService.getUserById(2)).rejects.toThrow(
        "Failed to fetch user with id 2"
      );
    });

    it("mockImplementationOnce - 一次性实现", async () => {
      mockAxiosInstance.get
        .mockImplementationOnce(() => Promise.resolve({ data: { id: 1 } }))
        .mockImplementationOnce(() => Promise.resolve({ data: { id: 2 } }));

      const result1 = await fetchData("/test1");
      const result2 = await fetchData("/test2");

      expect(result1).toEqual({ id: 1 });
      expect(result2).toEqual({ id: 2 });
    });

    it("mockReturnValue vs mockResolvedValue", async () => {
      // mockReturnValue 用于同步函数
      const syncMock = jest.fn();
      syncMock.mockReturnValue("sync result");
      expect(syncMock()).toBe("sync result");

      // mockResolvedValue 用于异步函数
      const asyncMock = jest.fn();
      asyncMock.mockResolvedValue("async result");
      expect(await asyncMock()).toBe("async result");

      // mockRejectedValue 用于模拟 Promise rejection
      const rejectMock = jest.fn();
      rejectMock.mockRejectedValue(new Error("rejected"));
      await expect(rejectMock()).rejects.toThrow("rejected");
    });
  });

  describe("Mock 监听和验证", () => {
    it("应该验证函数调用", async () => {
      mockAxiosInstance.get.mockResolvedValue({ data: {} });

      await fetchData("/test");

      // 验证调用次数
      expect(mockAxiosInstance.get).toHaveBeenCalledTimes(1);

      // 验证调用参数
      expect(mockAxiosInstance.get).toHaveBeenCalledWith("/test");

      // 验证最后一次调用
      expect(mockAxiosInstance.get).toHaveBeenLastCalledWith("/test");

      // 验证第 n 次调用
      expect(mockAxiosInstance.get).toHaveBeenNthCalledWith(1, "/test");
    });

    it("应该验证复杂的调用模式", async () => {
      mockAxiosInstance.get.mockResolvedValue({ data: {} });
      mockAxiosInstance.post.mockResolvedValue({ data: {} });

      await fetchData("/users");
      await userService.createUser({ name: "Test", email: "test@example.com" });

      // 验证多个调用
      expect(mockAxiosInstance.get).toHaveBeenCalledWith("/users");
      expect(mockAxiosInstance.post).toHaveBeenCalledWith("/users", {
        name: "Test",
        email: "test@example.com",
      });

      // 验证调用顺序（如果重要）
      const calls = mockAxiosInstance.get.mock.calls.concat(
        mockAxiosInstance.post.mock.calls
      );
      expect(calls).toHaveLength(2);
    });
  });

  describe("局部 Mock 示例", () => {
    it("应该使用 jest.spyOn 进行局部 mock", () => {
      // 创建真实对象
      const realObject = {
        method1: () => "real1",
        method2: () => "real2",
      };

      // 只 mock 一个方法
      const spy = jest.spyOn(realObject, "method1").mockReturnValue("mocked1");

      expect(realObject.method1()).toBe("mocked1"); // 被 mock
      expect(realObject.method2()).toBe("real2"); // 真实实现

      // 恢复原始实现
      spy.mockRestore();
      expect(realObject.method1()).toBe("real1");
    });
  });

  describe("Mock 清理", () => {
    it("应该正确清理 mock 状态", () => {
      const mockFn = jest.fn();

      mockFn("test1");
      mockFn("test2");

      expect(mockFn).toHaveBeenCalledTimes(2);

      // 清除调用历史但保留实现
      mockFn.mockClear();
      expect(mockFn).toHaveBeenCalledTimes(0);

      // 重置实现和调用历史
      mockFn.mockReset();
      expect(mockFn).toHaveBeenCalledTimes(0);
      expect(mockFn()).toBeUndefined();

      // 完全恢复（如果是 spy）
      // mockFn.mockRestore();
    });
  });
});
