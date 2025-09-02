/**
 * Mock 技术完整示例 - 演示各种 Mock 场景和技巧
 */

describe("Mock 技术完整指南", () => {
  describe("1. 基础 Mock 函数", () => {
    it("创建和使用 Mock 函数", () => {
      // 创建 Mock 函数
      const mockFn = jest.fn();

      // 调用 Mock 函数
      mockFn("arg1", "arg2");
      mockFn("arg3");

      // 验证调用
      expect(mockFn).toHaveBeenCalledTimes(2);
      expect(mockFn).toHaveBeenCalledWith("arg1", "arg2");
      expect(mockFn).toHaveBeenLastCalledWith("arg3");

      // 检查所有调用
      expect(mockFn.mock.calls).toEqual([["arg1", "arg2"], ["arg3"]]);
    });

    it("Mock 函数的返回值", () => {
      const mockFn = jest.fn();

      // 设置返回值
      mockFn.mockReturnValue("mocked value");
      expect(mockFn()).toBe("mocked value");

      // 设置一次性返回值
      mockFn.mockReturnValueOnce("once value");
      expect(mockFn()).toBe("once value");
      expect(mockFn()).toBe("mocked value"); // 回到默认返回值

      // 链式调用
      mockFn
        .mockReturnValueOnce("first")
        .mockReturnValueOnce("second")
        .mockReturnValue("default");

      expect(mockFn()).toBe("first");
      expect(mockFn()).toBe("second");
      expect(mockFn()).toBe("default");
    });

    it("Mock 异步函数", async () => {
      const asyncMock = jest.fn();

      // Mock resolved value
      asyncMock.mockResolvedValue("resolved");
      expect(await asyncMock()).toBe("resolved");

      // Mock rejected value
      asyncMock.mockRejectedValue(new Error("rejected"));
      await expect(asyncMock()).rejects.toThrow("rejected");

      // Mock 一次性异步返回
      asyncMock.mockResolvedValueOnce("once resolved");
      expect(await asyncMock()).toBe("once resolved");
    });

    it("Mock 实现", () => {
      const mockFn = jest.fn();

      // 自定义实现
      mockFn.mockImplementation((x: number) => x * 2);
      expect(mockFn(5)).toBe(10);

      // 一次性实现
      mockFn.mockImplementationOnce((x: number) => x * 3);
      expect(mockFn(5)).toBe(15); // 使用一次性实现
      expect(mockFn(5)).toBe(10); // 回到默认实现

      // 异步实现
      const asyncMockFn = jest.fn();
      asyncMockFn.mockImplementation(async (x: number) => {
        await new Promise((resolve) => setTimeout(resolve, 100));
        return x * 2;
      });

      // 注意：在实际测试中要使用 fake timers 或其他方法处理延迟
    });
  });

  describe("2. 对象和类的 Mock", () => {
    class Calculator {
      add(a: number, b: number): number {
        return a + b;
      }

      multiply(a: number, b: number): number {
        return a * b;
      }
    }

    it("Mock 对象方法", () => {
      const calculator = new Calculator();

      // Mock 特定方法
      const addSpy = jest.spyOn(calculator, "add");
      addSpy.mockReturnValue(100);

      expect(calculator.add(2, 3)).toBe(100); // 使用 Mock
      expect(calculator.multiply(2, 3)).toBe(6); // 使用真实实现

      // 验证调用
      expect(addSpy).toHaveBeenCalledWith(2, 3);

      // 恢复原始实现
      addSpy.mockRestore();
      expect(calculator.add(2, 3)).toBe(5); // 真实实现
    });

    it("Mock 整个类", () => {
      // 在实际测试文件中，这通常在文件顶部进行
      const MockedCalculator = jest.fn().mockImplementation(() => {
        return {
          add: jest.fn().mockReturnValue(999),
          multiply: jest.fn().mockReturnValue(888),
        };
      });

      const calculator = new MockedCalculator();

      expect(calculator.add(1, 2)).toBe(999);
      expect(calculator.multiply(1, 2)).toBe(888);
      expect(MockedCalculator).toHaveBeenCalledTimes(1);
    });

    it("Mock 静态方法", () => {
      class Utils {
        static formatDate(date: Date): string {
          return date.toISOString();
        }
      }

      const spy = jest.spyOn(Utils, "formatDate");
      spy.mockReturnValue("mocked-date");

      expect(Utils.formatDate(new Date())).toBe("mocked-date");

      spy.mockRestore();
    });
  });

  describe("3. 模块 Mock", () => {
    // 注意：实际的模块 mock 通常在文件顶部或 __mocks__ 目录中定义

    it("Mock 第三方模块（示例）", () => {
      // 这是一个概念示例，实际中会这样做：
      // jest.mock('axios');

      // 然后在测试中：
      // const mockedAxios = axios as jest.Mocked<typeof axios>;
      // mockedAxios.get.mockResolvedValue({ data: 'mocked' });

      expect(true).toBe(true); // 占位测试
    });

    it("部分 Mock 模块", () => {
      // 概念示例：
      // jest.mock('lodash', () => ({
      //   ...jest.requireActual('lodash'),
      //   debounce: jest.fn((fn) => fn), // 只 mock debounce
      // }));

      expect(true).toBe(true); // 占位测试
    });

    it("Mock ES6 模块", () => {
      // 概念示例：
      // import * as utils from './utils';
      // jest.mock('./utils');
      // const mockedUtils = utils as jest.Mocked<typeof utils>;

      expect(true).toBe(true); // 占位测试
    });
  });

  describe("4. 高级 Mock 技巧", () => {
    it("Mock 构造函数", () => {
      const MockedDate = jest.fn().mockImplementation(() => ({
        getTime: jest.fn().mockReturnValue(1234567890),
        toISOString: jest.fn().mockReturnValue("2023-01-01T00:00:00.000Z"),
      }));

      const date = new MockedDate();
      expect(date.getTime()).toBe(1234567890);
      expect(date.toISOString()).toBe("2023-01-01T00:00:00.000Z");
    });

    it("Mock with context (this)", () => {
      const obj = {
        value: 42,
        getValue() {
          return this.value;
        },
      };

      const spy = jest.spyOn(obj, "getValue");
      spy.mockImplementation(function (this: typeof obj) {
        return this.value * 2;
      });

      expect(obj.getValue()).toBe(84);

      spy.mockRestore();
    });

    it("条件性 Mock", () => {
      const conditionalMock = jest
        .fn()
        .mockImplementation((condition: boolean) => {
          if (condition) {
            return "success";
          }
          throw new Error("failure");
        });

      expect(conditionalMock(true)).toBe("success");
      expect(() => conditionalMock(false)).toThrow("failure");
    });
  });

  describe("5. Mock 数据生成", () => {
    it("生成随机数据", () => {
      const generateUser = jest.fn().mockImplementation(() => ({
        id: Math.floor(Math.random() * 1000),
        name: `User-${Date.now()}`,
        email: `user-${Date.now()}@example.com`,
      }));

      const user1 = generateUser();
      const user2 = generateUser();

      expect(user1).toHaveProperty("id");
      expect(user1).toHaveProperty("name");
      expect(user1).toHaveProperty("email");
      expect(user1.id).not.toBe(user2.id);
    });

    it("使用工厂函数", () => {
      const createMockUser = (overrides = {}) => ({
        id: 1,
        name: "Default User",
        email: "default@example.com",
        isActive: true,
        ...overrides,
      });

      const user1 = createMockUser();
      const user2 = createMockUser({ name: "Custom User", isActive: false });

      expect(user1.name).toBe("Default User");
      expect(user1.isActive).toBe(true);
      expect(user2.name).toBe("Custom User");
      expect(user2.isActive).toBe(false);
    });
  });

  describe("6. Mock 时间和定时器", () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it("Mock setTimeout", () => {
      const callback = jest.fn();

      setTimeout(callback, 1000);

      // 时间还没到，回调不应该被调用
      expect(callback).not.toHaveBeenCalled();

      // 快进时间
      jest.advanceTimersByTime(1000);

      expect(callback).toHaveBeenCalledTimes(1);
    });

    it("Mock setInterval", () => {
      const callback = jest.fn();

      setInterval(callback, 500);

      // 快进 1.5 秒，应该调用 3 次
      jest.advanceTimersByTime(1500);

      expect(callback).toHaveBeenCalledTimes(3);
    });

    it("Mock Date.now", () => {
      const mockDate = new Date("2023-01-01");
      jest.setSystemTime(mockDate);

      expect(Date.now()).toBe(mockDate.getTime());

      // 也可以用 spyOn
      const dateSpy = jest.spyOn(Date, "now");
      dateSpy.mockReturnValue(1234567890);

      expect(Date.now()).toBe(1234567890);

      dateSpy.mockRestore();
    });
  });

  describe("7. Mock 网络请求", () => {
    beforeEach(() => {
      // Mock fetch
      global.fetch = jest.fn();
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it("Mock fetch 成功响应", async () => {
      const mockData = { message: "success" };
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => mockData,
      });

      const response = await fetch("/api/data");
      const data = await response.json();

      expect(data).toEqual(mockData);
      expect(fetch).toHaveBeenCalledWith("/api/data");
    });

    it("Mock fetch 错误响应", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 404,
        statusText: "Not Found",
      });

      const response = await fetch("/api/nonexistent");

      expect(response.ok).toBe(false);
      expect(response.status).toBe(404);
    });

    it("Mock 网络错误", async () => {
      (global.fetch as jest.Mock).mockRejectedValue(new Error("Network error"));

      await expect(fetch("/api/data")).rejects.toThrow("Network error");
    });
  });

  describe("8. Mock DOM API", () => {
    it("Mock localStorage", () => {
      const localStorageMock = {
        getItem: jest.fn(),
        setItem: jest.fn(),
        removeItem: jest.fn(),
        clear: jest.fn(),
      };

      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });

      localStorage.setItem("key", "value");
      expect(localStorageMock.setItem).toHaveBeenCalledWith("key", "value");

      localStorageMock.getItem.mockReturnValue("value");
      expect(localStorage.getItem("key")).toBe("value");
    });

    it("Mock window methods", () => {
      const alertSpy = jest.spyOn(window, "alert");
      alertSpy.mockImplementation(() => {});

      window.alert("test message");

      expect(alertSpy).toHaveBeenCalledWith("test message");

      alertSpy.mockRestore();
    });

    it("Mock document methods", () => {
      const createElementSpy = jest.spyOn(document, "createElement");
      const mockElement = {
        setAttribute: jest.fn(),
        appendChild: jest.fn(),
      };
      createElementSpy.mockReturnValue(mockElement as any);

      const element = document.createElement("div");
      element.setAttribute("class", "test");

      expect(createElementSpy).toHaveBeenCalledWith("div");
      expect(mockElement.setAttribute).toHaveBeenCalledWith("class", "test");

      createElementSpy.mockRestore();
    });
  });

  describe("9. Mock 验证技巧", () => {
    it("验证调用参数", () => {
      const mockFn = jest.fn();

      mockFn("arg1", { prop: "value" }, [1, 2, 3]);

      // 精确匹配
      expect(mockFn).toHaveBeenCalledWith("arg1", { prop: "value" }, [1, 2, 3]);

      // 使用 matchers
      expect(mockFn).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ prop: "value" }),
        expect.arrayContaining([1, 2])
      );

      // 验证复杂对象
      expect(mockFn).toHaveBeenCalledWith(
        "arg1",
        expect.objectContaining({
          prop: expect.stringMatching(/val/),
        }),
        expect.any(Array)
      );
    });

    it("验证调用顺序", () => {
      const mock1 = jest.fn();
      const mock2 = jest.fn();

      mock1("first");
      mock2("second");
      mock1("third");

      // 验证调用顺序
      expect(mock1).toHaveBeenNthCalledWith(1, "first");
      expect(mock2).toHaveBeenNthCalledWith(1, "second");
      expect(mock1).toHaveBeenNthCalledWith(2, "third");

      // 或者检查调用历史
      expect(mock1.mock.calls).toEqual([["first"], ["third"]]);
      expect(mock2.mock.calls).toEqual([["second"]]);
    });

    it("验证异步调用", async () => {
      const asyncMock = jest.fn().mockResolvedValue("result");

      const promises = [
        asyncMock("arg1"),
        asyncMock("arg2"),
        asyncMock("arg3"),
      ];

      await Promise.all(promises);

      expect(asyncMock).toHaveBeenCalledTimes(3);
      expect(asyncMock).toHaveBeenCalledWith("arg1");
      expect(asyncMock).toHaveBeenCalledWith("arg2");
      expect(asyncMock).toHaveBeenCalledWith("arg3");
    });
  });

  describe("10. Mock 最佳实践", () => {
    it("使用有意义的 Mock 数据", () => {
      const userService = {
        getUser: jest.fn(),
      };

      // 好的 Mock 数据 - 真实且有意义
      const mockUser = {
        id: 1,
        name: "John Doe",
        email: "john.doe@example.com",
        role: "admin",
        createdAt: new Date("2023-01-01"),
        isActive: true,
      };

      userService.getUser.mockResolvedValue(mockUser);

      // 这样的数据让测试更容易理解和维护
      expect(userService.getUser).toBeDefined();
    });

    it("清理 Mock 状态", () => {
      const mockFn = jest.fn();

      // 使用 Mock
      mockFn("test");
      expect(mockFn).toHaveBeenCalledTimes(1);

      // 清理调用历史
      mockFn.mockClear();
      expect(mockFn).toHaveBeenCalledTimes(0);

      // 重置实现
      mockFn.mockReset();
      expect(mockFn()).toBeUndefined();
    });

    it("组合不同的 Mock 技术", () => {
      // 结合多种 Mock 技术
      const service = {
        cache: new Map(),
        async fetchData(id: string) {
          if (this.cache.has(id)) {
            return this.cache.get(id);
          }

          const response = await fetch(`/api/data/${id}`);
          const data = await response.json();
          this.cache.set(id, data);
          return data;
        },
      };

      // Mock fetch
      global.fetch = jest.fn();
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({ id: "1", value: "test" }),
      });

      // Mock Map
      const setSpy = jest.spyOn(service.cache, "set");
      const getSpy = jest.spyOn(service.cache, "get");
      const hasSpy = jest.spyOn(service.cache, "has");

      // 这样可以测试复杂的交互
      expect(setSpy).toBeDefined();
      expect(getSpy).toBeDefined();
      expect(hasSpy).toBeDefined();
    });
  });
});
