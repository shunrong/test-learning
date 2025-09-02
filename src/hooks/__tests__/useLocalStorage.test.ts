/**
 * useLocalStorage Hook 测试 - 演示存储和副作用的测试
 */

import { renderHook, act } from "@testing-library/react";
import { useLocalStorage } from "../useLocalStorage";

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
    get length() {
      return Object.keys(store).length;
    },
    key: jest.fn((index: number) => Object.keys(store)[index] || null),
  };
})();

// Mock window.localStorage
Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
  writable: true,
});

// Mock console.error to test error handling
const consoleErrorSpy = jest
  .spyOn(console, "error")
  .mockImplementation(() => {});

describe("useLocalStorage", () => {
  beforeEach(() => {
    localStorageMock.clear();
    jest.clearAllMocks();
  });

  afterAll(() => {
    consoleErrorSpy.mockRestore();
  });

  describe("基础功能", () => {
    it("应该返回初始值当localStorage为空时", () => {
      const { result } = renderHook(() =>
        useLocalStorage("test-key", "initial-value")
      );

      expect(result.current[0]).toBe("initial-value");
    });

    it("应该从localStorage读取现有值", () => {
      // 预先设置localStorage
      localStorageMock.setItem(
        "existing-key",
        JSON.stringify("existing-value")
      );

      const { result } = renderHook(() =>
        useLocalStorage("existing-key", "initial-value")
      );

      expect(result.current[0]).toBe("existing-value");
    });

    it("应该能够设置值", () => {
      const { result } = renderHook(() =>
        useLocalStorage("test-key", "initial")
      );

      act(() => {
        result.current[1]("new-value");
      });

      expect(result.current[0]).toBe("new-value");
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        "test-key",
        JSON.stringify("new-value")
      );
    });

    it("应该支持函数式更新", () => {
      const { result } = renderHook(() => useLocalStorage("counter", 0));

      act(() => {
        result.current[1]((prev) => prev + 1);
      });

      expect(result.current[0]).toBe(1);

      act(() => {
        result.current[1]((prev) => prev * 2);
      });

      expect(result.current[0]).toBe(2);
    });

    it("应该能够删除值", () => {
      const { result } = renderHook(() =>
        useLocalStorage("test-key", "initial")
      );

      // 设置一个值
      act(() => {
        result.current[1]("some-value");
      });

      expect(result.current[0]).toBe("some-value");

      // 删除值
      act(() => {
        result.current[2]();
      });

      expect(result.current[0]).toBe("initial"); // 应该回到初始值
      expect(localStorageMock.removeItem).toHaveBeenCalledWith("test-key");
    });
  });

  describe("数据类型处理", () => {
    it("应该正确处理字符串", () => {
      const { result } = renderHook(() =>
        useLocalStorage("string-key", "default")
      );

      act(() => {
        result.current[1]("test string");
      });

      expect(result.current[0]).toBe("test string");
    });

    it("应该正确处理数字", () => {
      const { result } = renderHook(() => useLocalStorage("number-key", 0));

      act(() => {
        result.current[1](42);
      });

      expect(result.current[0]).toBe(42);
      expect(typeof result.current[0]).toBe("number");
    });

    it("应该正确处理布尔值", () => {
      const { result } = renderHook(() =>
        useLocalStorage("boolean-key", false)
      );

      act(() => {
        result.current[1](true);
      });

      expect(result.current[0]).toBe(true);
      expect(typeof result.current[0]).toBe("boolean");
    });

    it("应该正确处理对象", () => {
      const initialObject = { name: "test", count: 0 };
      const { result } = renderHook(() =>
        useLocalStorage("object-key", initialObject)
      );

      const newObject = { name: "updated", count: 5, active: true };

      act(() => {
        result.current[1](newObject);
      });

      expect(result.current[0]).toEqual(newObject);
    });

    it("应该正确处理数组", () => {
      const { result } = renderHook(() =>
        useLocalStorage("array-key", [] as number[])
      );

      const newArray = [1, 2, 3, 4, 5];

      act(() => {
        result.current[1](newArray);
      });

      expect(result.current[0]).toEqual(newArray);
    });

    it("应该正确处理null和undefined", () => {
      const { result } = renderHook(() =>
        useLocalStorage("null-key", "default")
      );

      act(() => {
        result.current[1](null as any);
      });

      expect(result.current[0]).toBe(null);

      act(() => {
        result.current[1](undefined as any);
      });

      expect(localStorageMock.removeItem).toHaveBeenCalledWith("null-key");
      expect(result.current[0]).toBe("default"); // 应该回到初始值
    });
  });

  describe("错误处理", () => {
    it("应该处理JSON解析错误", () => {
      // 设置无效的JSON
      localStorageMock.setItem("invalid-json", "invalid json string");

      const { result } = renderHook(() =>
        useLocalStorage("invalid-json", "default")
      );

      expect(result.current[0]).toBe("default");
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error reading localStorage key "invalid-json":',
        expect.any(SyntaxError)
      );
    });

    it("应该处理localStorage读取错误", () => {
      // Mock getItem to throw an error
      const originalGetItem = localStorageMock.getItem;
      localStorageMock.getItem.mockImplementation(() => {
        throw new Error("localStorage access denied");
      });

      const { result } = renderHook(() =>
        useLocalStorage("error-key", "default")
      );

      expect(result.current[0]).toBe("default");
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error reading localStorage key "error-key":',
        expect.any(Error)
      );

      // 恢复原始实现
      localStorageMock.getItem.mockImplementation(originalGetItem);
    });

    it("应该处理localStorage写入错误", () => {
      const { result } = renderHook(() =>
        useLocalStorage("test-key", "default")
      );

      // Mock setItem to throw an error
      localStorageMock.setItem.mockImplementation(() => {
        throw new Error("localStorage quota exceeded");
      });

      act(() => {
        result.current[1]("new-value");
      });

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error setting localStorage key "test-key":',
        expect.any(Error)
      );
    });

    it("应该处理localStorage删除错误", () => {
      const { result } = renderHook(() =>
        useLocalStorage("test-key", "default")
      );

      // Mock removeItem to throw an error
      localStorageMock.removeItem.mockImplementation(() => {
        throw new Error("localStorage access denied");
      });

      act(() => {
        result.current[2]();
      });

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error removing localStorage key "test-key":',
        expect.any(Error)
      );
    });
  });

  describe("跨标签页同步", () => {
    it("应该监听storage事件", () => {
      const { result } = renderHook(() =>
        useLocalStorage("sync-key", "initial")
      );

      expect(result.current[0]).toBe("initial");

      // 模拟另一个标签页修改了localStorage
      act(() => {
        const storageEvent = new StorageEvent("storage", {
          key: "sync-key",
          newValue: JSON.stringify("updated-from-another-tab"),
          oldValue: JSON.stringify("initial"),
          storageArea: window.localStorage,
        });
        window.dispatchEvent(storageEvent);
      });

      expect(result.current[0]).toBe("updated-from-another-tab");
    });

    it("应该忽略无关的storage事件", () => {
      const { result } = renderHook(() => useLocalStorage("my-key", "initial"));

      expect(result.current[0]).toBe("initial");

      // 模拟另一个key的变化
      act(() => {
        const storageEvent = new StorageEvent("storage", {
          key: "other-key",
          newValue: JSON.stringify("other-value"),
          storageArea: window.localStorage,
        });
        window.dispatchEvent(storageEvent);
      });

      expect(result.current[0]).toBe("initial"); // 应该保持不变
    });

    it("应该处理storage事件中的JSON解析错误", () => {
      const { result } = renderHook(() =>
        useLocalStorage("sync-key", "initial")
      );

      // 模拟接收到无效JSON
      act(() => {
        const storageEvent = new StorageEvent("storage", {
          key: "sync-key",
          newValue: "invalid json",
          storageArea: window.localStorage,
        });
        window.dispatchEvent(storageEvent);
      });

      expect(result.current[0]).toBe("initial"); // 应该保持原值
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error parsing localStorage value for key "sync-key":',
        expect.any(SyntaxError)
      );
    });
  });

  describe("Hook生命周期", () => {
    it("应该在卸载时清理事件监听器", () => {
      const addEventListenerSpy = jest.spyOn(window, "addEventListener");
      const removeEventListenerSpy = jest.spyOn(window, "removeEventListener");

      const { unmount } = renderHook(() =>
        useLocalStorage("test-key", "default")
      );

      expect(addEventListenerSpy).toHaveBeenCalledWith(
        "storage",
        expect.any(Function)
      );

      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        "storage",
        expect.any(Function)
      );

      addEventListenerSpy.mockRestore();
      removeEventListenerSpy.mockRestore();
    });

    it("不同的key应该独立工作", () => {
      const { result: result1 } = renderHook(() =>
        useLocalStorage("key1", "default1")
      );

      const { result: result2 } = renderHook(() =>
        useLocalStorage("key2", "default2")
      );

      expect(result1.current[0]).toBe("default1");
      expect(result2.current[0]).toBe("default2");

      act(() => {
        result1.current[1]("value1");
      });

      act(() => {
        result2.current[1]("value2");
      });

      expect(result1.current[0]).toBe("value1");
      expect(result2.current[0]).toBe("value2");
    });
  });

  describe("复杂使用场景", () => {
    it("应该正确处理复杂对象的更新", () => {
      interface User {
        id: number;
        name: string;
        preferences: {
          theme: string;
          language: string;
        };
      }

      const initialUser: User = {
        id: 1,
        name: "John",
        preferences: {
          theme: "light",
          language: "en",
        },
      };

      const { result } = renderHook(() => useLocalStorage("user", initialUser));

      // 使用函数式更新修改嵌套属性
      act(() => {
        result.current[1]((prev) => ({
          ...prev,
          preferences: {
            ...prev.preferences,
            theme: "dark",
          },
        }));
      });

      expect(result.current[0]).toEqual({
        ...initialUser,
        preferences: {
          ...initialUser.preferences,
          theme: "dark",
        },
      });
    });

    it("应该能够处理频繁的更新", () => {
      const { result } = renderHook(() => useLocalStorage("counter", 0));

      // 快速连续更新
      act(() => {
        for (let i = 1; i <= 10; i++) {
          result.current[1]((prev) => prev + 1);
        }
      });

      expect(result.current[0]).toBe(10);
      expect(localStorageMock.setItem).toHaveBeenCalledTimes(10);
    });
  });

  describe("性能测试", () => {
    it("大量数据操作应该性能良好", () => {
      const largeArray = Array.from({ length: 1000 }, (_, i) => ({
        id: i,
        value: `item-${i}`,
      }));

      const { result } = renderHook(() =>
        useLocalStorage("large-data", largeArray)
      );

      const start = performance.now();

      act(() => {
        result.current[1]((prev) => [...prev, { id: 1000, value: "new-item" }]);
      });

      const end = performance.now();

      expect(result.current[0]).toHaveLength(1001);
      expect(end - start).toBeLessThan(100); // 应该在100ms内完成
    });
  });
});
