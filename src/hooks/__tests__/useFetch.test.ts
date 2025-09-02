/**
 * useFetch Hook 测试 - 演示异步Hook和网络请求的测试
 */

import { renderHook, waitFor } from "@testing-library/react";
import { act } from "react";
import { useFetch } from "../useFetch";

// Mock fetch API
global.fetch = jest.fn();

// 类型化的fetch mock
const fetchMock = global.fetch as jest.MockedFunction<typeof fetch>;

describe("useFetch", () => {
  beforeEach(() => {
    fetchMock.mockClear();
  });

  describe("基础功能", () => {
    it("应该初始化为正确的默认状态", () => {
      fetchMock.mockResolvedValue({
        ok: true,
        json: async () => ({ data: "test" }),
      } as Response);

      const { result } = renderHook(() =>
        useFetch("https://api.example.com/data", { immediate: false })
      );

      expect(result.current.data).toBe(null);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe(null);
    });

    it("应该在immediate为true时自动发起请求", async () => {
      const testData = { id: 1, name: "Test" };

      fetchMock.mockResolvedValue({
        ok: true,
        json: async () => testData,
      } as Response);

      const { result } = renderHook(() =>
        useFetch("https://api.example.com/data", { immediate: true })
      );

      // 初始状态应该是loading
      expect(result.current.loading).toBe(true);
      expect(result.current.data).toBe(null);
      expect(result.current.error).toBe(null);

      // 等待请求完成
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.data).toEqual(testData);
      expect(result.current.error).toBe(null);
      expect(fetchMock).toHaveBeenCalledWith("https://api.example.com/data", {
        signal: expect.any(AbortSignal),
      });
    });

    it("应该能够手动执行请求", async () => {
      const testData = { message: "Hello World" };

      fetchMock.mockResolvedValue({
        ok: true,
        json: async () => testData,
      } as Response);

      const { result } = renderHook(() =>
        useFetch("https://api.example.com/manual", { immediate: false })
      );

      // 初始状态
      expect(result.current.loading).toBe(false);

      // 手动执行
      act(() => {
        result.current.execute();
      });

      expect(result.current.loading).toBe(true);

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.data).toEqual(testData);
      expect(result.current.error).toBe(null);
    });

    it("应该能够重置状态", async () => {
      const testData = { data: "test" };

      fetchMock.mockResolvedValue({
        ok: true,
        json: async () => testData,
      } as Response);

      const { result } = renderHook(() =>
        useFetch("https://api.example.com/data")
      );

      // 等待请求完成
      await waitFor(() => {
        expect(result.current.data).toEqual(testData);
      });

      // 重置状态
      act(() => {
        result.current.reset();
      });

      expect(result.current.data).toBe(null);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe(null);
    });
  });

  describe("错误处理", () => {
    it("应该处理HTTP错误", async () => {
      fetchMock.mockResolvedValue({
        ok: false,
        status: 404,
      } as Response);

      const { result } = renderHook(() =>
        useFetch("https://api.example.com/notfound")
      );

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.data).toBe(null);
      expect(result.current.error).toBeInstanceOf(Error);
      expect(result.current.error?.message).toBe("HTTP error! status: 404");
    });

    it("应该处理网络错误", async () => {
      fetchMock.mockRejectedValue(new Error("Network error"));

      const { result } = renderHook(() =>
        useFetch("https://api.example.com/error")
      );

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.data).toBe(null);
      expect(result.current.error).toBeInstanceOf(Error);
      expect(result.current.error?.message).toBe("Network error");
    });

    it("应该处理JSON解析错误", async () => {
      fetchMock.mockResolvedValue({
        ok: true,
        status: 200,
        statusText: "OK",
        headers: new Headers(),
        redirected: false,
        type: "basic",
        url: "",
        clone: jest.fn(),
        body: null,
        bodyUsed: false,
        arrayBuffer: jest.fn(),
        blob: jest.fn(),
        formData: jest.fn(),
        text: jest.fn(),
        bytes: jest.fn(),
        json: async () => {
          throw new Error("Invalid JSON");
        },
      } as unknown as Response);

      const { result } = renderHook(() =>
        useFetch("https://api.example.com/invalid-json")
      );

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.data).toBe(null);
      expect(result.current.error).toBeInstanceOf(Error);
      expect(result.current.error?.message).toBe("Invalid JSON");
    });

    it("应该处理未知错误类型", async () => {
      fetchMock.mockRejectedValue("string error");

      const { result } = renderHook(() =>
        useFetch("https://api.example.com/unknown-error")
      );

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.error?.message).toBe("Unknown error occurred");
    });
  });

  describe("超时处理", () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it("应该在超时时取消请求", async () => {
      let abortSignal: AbortSignal | undefined;

      fetchMock.mockImplementation((url, options) => {
        abortSignal = options?.signal as AbortSignal;
        return new Promise((_, reject) => {
          // 监听 abort 事件并拒绝 promise
          options?.signal?.addEventListener("abort", () => {
            reject(
              new DOMException("The operation was aborted.", "AbortError")
            );
          });
        });
      });

      const { result } = renderHook(() =>
        useFetch("https://api.example.com/slow", { timeout: 1000 })
      );

      expect(result.current.loading).toBe(true);

      // 快进时间触发超时
      act(() => {
        jest.advanceTimersByTime(1000);
      });

      // 等待状态更新
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // 验证请求被取消和错误状态
      expect(abortSignal?.aborted).toBe(true);
      expect(result.current.error?.message).toBe("Request timed out");
    });

    it("应该在请求完成时清除超时", async () => {
      const testData = { data: "quick response" };

      fetchMock.mockResolvedValue({
        ok: true,
        json: async () => testData,
      } as Response);

      const { result } = renderHook(() =>
        useFetch("https://api.example.com/quick", { timeout: 5000 })
      );

      // 等待请求快速完成
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.data).toEqual(testData);
      expect(result.current.error).toBe(null);

      // 即使时间过去了很久，也不应该触发超时错误
      act(() => {
        jest.advanceTimersByTime(10000);
      });

      expect(result.current.data).toEqual(testData);
      expect(result.current.error).toBe(null);
    });
  });

  describe("URL变化处理", () => {
    it("URL变化时应该重新发起请求", async () => {
      const testData1 = { id: 1 };
      const testData2 = { id: 2 };

      fetchMock
        .mockResolvedValueOnce({
          ok: true,
          json: async () => testData1,
        } as Response)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => testData2,
        } as Response);

      let url = "https://api.example.com/data/1";
      const { result, rerender } = renderHook(({ url }) => useFetch(url), {
        initialProps: { url },
      });

      // 等待第一个请求完成
      await waitFor(() => {
        expect(result.current.data).toEqual(testData1);
      });

      // 改变URL
      url = "https://api.example.com/data/2";
      rerender({ url });

      // 等待第二个请求完成
      await waitFor(() => {
        expect(result.current.data).toEqual(testData2);
      });

      expect(fetchMock).toHaveBeenCalledTimes(2);
    });
  });

  describe("并发请求处理", () => {
    it("应该正确处理快速连续的请求", async () => {
      const testData = { data: "final result" };

      fetchMock.mockResolvedValue({
        ok: true,
        json: async () => testData,
      } as Response);

      const { result } = renderHook(() =>
        useFetch("https://api.example.com/data", { immediate: false })
      );

      // 快速连续发起多个请求
      act(() => {
        result.current.execute();
        result.current.execute();
        result.current.execute();
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.data).toEqual(testData);
    });
  });

  describe("Hook生命周期", () => {
    it("应该在组件卸载时取消正在进行的请求", async () => {
      let abortSignal: AbortSignal | undefined;

      fetchMock.mockImplementation((url, options) => {
        abortSignal = options?.signal as AbortSignal;
        return new Promise(() => {}); // 永远不resolve
      });

      const { unmount } = renderHook(() =>
        useFetch("https://api.example.com/data")
      );

      // 等待一下确保请求开始
      await new Promise((resolve) => setTimeout(resolve, 10));

      // 卸载组件
      unmount();

      // 验证请求被取消
      expect(abortSignal?.aborted).toBe(true);
    });
  });

  describe("状态转换", () => {
    it("应该正确管理loading状态", async () => {
      const testData = { data: "test" };

      fetchMock.mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(
              () =>
                resolve({
                  ok: true,
                  json: async () => testData,
                } as Response),
              100
            )
          )
      );

      const { result } = renderHook(() =>
        useFetch("https://api.example.com/data", { immediate: false })
      );

      // 初始状态
      expect(result.current.loading).toBe(false);

      // 开始请求
      act(() => {
        result.current.execute();
      });

      expect(result.current.loading).toBe(true);
      expect(result.current.error).toBe(null);

      // 等待请求完成
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.data).toEqual(testData);
    });

    it("错误状态下loading应该为false", async () => {
      fetchMock.mockRejectedValue(new Error("Test error"));

      const { result } = renderHook(() =>
        useFetch("https://api.example.com/error")
      );

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.error).toBeInstanceOf(Error);
    });
  });

  describe("复杂数据类型", () => {
    it("应该正确处理复杂的JSON响应", async () => {
      const complexData = {
        users: [
          { id: 1, name: "John", active: true },
          { id: 2, name: "Jane", active: false },
        ],
        pagination: {
          total: 2,
          page: 1,
          limit: 10,
        },
        metadata: {
          timestamp: "2023-06-15T12:00:00Z",
          version: "1.0",
        },
      };

      fetchMock.mockResolvedValue({
        ok: true,
        json: async () => complexData,
      } as Response);

      const { result } = renderHook(() =>
        useFetch("https://api.example.com/complex")
      );

      await waitFor(() => {
        expect(result.current.data).toEqual(complexData);
      });
    });
  });

  describe("性能测试", () => {
    it("多次调用execute应该性能良好", async () => {
      fetchMock.mockResolvedValue({
        ok: true,
        json: async () => ({ data: "test" }),
      } as Response);

      const { result } = renderHook(() =>
        useFetch("https://api.example.com/data", { immediate: false })
      );

      const start = performance.now();

      // 连续调用多次
      for (let i = 0; i < 10; i++) {
        act(() => {
          result.current.execute();
        });
      }

      const end = performance.now();

      expect(end - start).toBeLessThan(50); // 应该很快完成

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
    });
  });

  describe("实际使用场景", () => {
    it("应该模拟真实的API调用流程", async () => {
      // 模拟实际的API响应
      const apiResponse = {
        success: true,
        data: {
          id: 123,
          title: "Test Article",
          content: "This is a test article",
          author: {
            id: 1,
            name: "John Doe",
          },
          tags: ["test", "article"],
          publishedAt: "2023-06-15T10:00:00Z",
        },
        message: "Article fetched successfully",
      };

      fetchMock.mockResolvedValue({
        ok: true,
        status: 200,
        headers: new Headers({
          "Content-Type": "application/json",
        }),
        json: async () => apiResponse,
      } as Response);

      const { result } = renderHook(() =>
        useFetch<typeof apiResponse>("https://api.example.com/articles/123")
      );

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.data).toEqual(apiResponse);
      expect(result.current.error).toBe(null);

      // 验证返回的数据结构
      expect(result.current.data?.success).toBe(true);
      expect(result.current.data?.data.id).toBe(123);
      expect(result.current.data?.data.author.name).toBe("John Doe");
      expect(result.current.data?.data.tags).toContain("test");
    });
  });
});
