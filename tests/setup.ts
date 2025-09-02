/**
 * Jest 测试环境设置文件
 * 这个文件会在每个测试文件执行前运行，用于配置全局的测试环境
 */

// 引入 Jest DOM 扩展匹配器
import "@testing-library/jest-dom";

// 全局配置
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // 已废弃
    removeListener: jest.fn(), // 已废弃
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  root = null;
  rootMargin = "";
  thresholds = [];

  constructor() {}
  observe() {
    return null;
  }
  disconnect() {
    return null;
  }
  unobserve() {
    return null;
  }
  takeRecords() {
    return [];
  }
} as any;

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  observe() {
    return null;
  }
  disconnect() {
    return null;
  }
  unobserve() {
    return null;
  }
};

// 设置控制台警告处理
const originalError = console.error;
beforeAll(() => {
  console.error = (...args: any[]) => {
    // 过滤掉 React act 警告，这些在测试中使用 @testing-library/user-event 时是正常的
    const message = args[0]?.toString() || "";
    if (
      message.includes("Warning: An update to") &&
      message.includes("was not wrapped in act")
    ) {
      return; // 忽略 act 警告
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});

// 每个测试后清理 DOM
afterEach(() => {
  document.body.innerHTML = "";
});

// 设置测试超时
jest.setTimeout(10000);
