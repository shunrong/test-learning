# 前端测试完整指南

这份指南将帮助你深入理解前端测试的各个方面，从基础概念到高级技巧。

## 目录

1. [测试基础概念](#测试基础概念)
2. [测试环境配置](#测试环境配置)
3. [测试文件组织](#测试文件组织)
4. [测试类型详解](#测试类型详解)
5. [Mock 技术详解](#mock-技术详解)
6. [React 测试策略](#react-测试策略)
7. [最佳实践](#最佳实践)
8. [常见问题与解决方案](#常见问题与解决方案)

## 测试基础概念

### 测试金字塔

```
    E2E 测试
   -----------
  集成测试
 -------------
单元测试
```

- **单元测试**: 测试单个函数或组件
- **集成测试**: 测试多个模块协同工作
- **E2E 测试**: 测试完整的用户流程

### 测试的3A原则

- **Arrange（准备）**: 设置测试数据和环境
- **Act（执行）**: 执行被测试的操作
- **Assert（断言）**: 验证结果是否符合预期

```javascript
test("应该正确计算两数之和", () => {
  // Arrange
  const a = 2;
  const b = 3;
  
  // Act
  const result = add(a, b);
  
  // Assert
  expect(result).toBe(5);
});
```

## 测试环境配置

### Jest 配置详解

我们的 `jest.config.js` 配置解释：

```javascript
module.exports = {
  // 使用 ts-jest 预设处理 TypeScript
  preset: "ts-jest",
  
  // 使用 jsdom 环境模拟浏览器 DOM
  testEnvironment: "jsdom",
  
  // 测试设置文件，用于全局配置
  setupFilesAfterEnv: ["<rootDir>/tests/setup.ts"],
  
  // 模块路径映射，处理静态资源
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    "\\.(gif|ttf|eot|svg|png)$": "<rootDir>/tests/__mocks__/fileMock.js"
  },
  
  // 转换配置，处理不同文件类型
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
    "^.+\\.(js|jsx)$": "babel-jest"
  },
  
  // TypeScript 全局配置
  globals: {
    "ts-jest": {
      tsconfig: "tsconfig.json"
    }
  },
  
  // 测试文件匹配模式
  testMatch: [
    "<rootDir>/src/**/__tests__/**/*.(ts|tsx|js)",
    "<rootDir>/tests/**/*.(test|spec).(ts|tsx|js)"
  ]
};
```

### Babel 配置

`.babelrc` 用于转换 ES6+ 语法：

```json
{
  "presets": [
    ["@babel/preset-env", { "targets": { "node": "current" } }],
    "@babel/preset-react",
    "@babel/preset-typescript"
  ]
}
```

### TypeScript 配置

`tsconfig.json` 中的测试相关配置：

```json
{
  "compilerOptions": {
    "types": ["jest", "@testing-library/jest-dom"],
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true
  }
}
```

## 测试文件组织

### 目录结构

```
src/
├── components/
│   ├── Counter.tsx
│   └── __tests__/
│       └── Counter.test.tsx
├── hooks/
│   ├── useCounter.ts
│   └── __tests__/
│       └── useCounter.test.ts
├── utils/
│   ├── mathUtils.ts
│   └── __tests__/
│       └── mathUtils.test.ts
└── services/
    ├── apiService.ts
    └── __tests__/
        └── apiService.test.ts

tests/
├── setup.ts                 # 全局测试设置
├── __mocks__/               # 全局 Mock 文件
├── mocks/                   # Mock 示例
├── snapshots/               # 快照测试
├── dom/                     # DOM 测试
└── integration/             # 集成测试
```

### 命名约定

- 测试文件：`*.test.ts` 或 `*.spec.ts`
- Mock 文件：`__mocks__/` 目录下
- 测试描述：使用中文描述具体行为

```javascript
describe("mathUtils", () => {
  describe("add", () => {
    test("应该正确计算两个正数的和", () => {
      // ...
    });
    
    test("应该正确处理负数", () => {
      // ...
    });
  });
});
```

## 测试类型详解

### 1. 单元测试

测试单个函数或组件的独立功能。

```javascript
// 测试纯函数
test("capitalize 应该将首字母转为大写", () => {
  expect(capitalize("hello")).toBe("Hello");
  expect(capitalize("")).toBe("");
  expect(capitalize("HELLO")).toBe("HELLO");
});

// 测试边界条件
test("divide 在除数为0时应该抛出错误", () => {
  expect(() => divide(10, 0)).toThrow("不能除以零");
});
```

### 2. 组件测试

测试 React 组件的渲染和交互。

```javascript
test("Counter 组件应该正确渲染初始状态", () => {
  render(<Counter />);
  
  expect(screen.getByText("计数: 0")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "增加" })).toBeInTheDocument();
});

test("点击增加按钮应该增加计数", async () => {
  render(<Counter />);
  
  const incrementButton = screen.getByRole("button", { name: "增加" });
  await userEvent.click(incrementButton);
  
  expect(screen.getByText("计数: 1")).toBeInTheDocument();
});
```

### 3. Hook 测试

使用 `@testing-library/react-hooks` 测试自定义 Hook。

```javascript
test("useCounter 应该正确初始化", () => {
  const { result } = renderHook(() => useCounter(5));
  
  expect(result.current.count).toBe(5);
  expect(typeof result.current.increment).toBe("function");
});

test("useCounter 增加功能应该正常工作", () => {
  const { result } = renderHook(() => useCounter(0));
  
  act(() => {
    result.current.increment();
  });
  
  expect(result.current.count).toBe(1);
});
```

### 4. 集成测试

测试多个组件或模块的协同工作。

```javascript
test("TodoList 完整工作流程", async () => {
  render(<TodoList />);
  
  // 添加待办事项
  const input = screen.getByPlaceholderText("添加新的待办事项...");
  await userEvent.type(input, "学习测试");
  await userEvent.click(screen.getByText("添加"));
  
  // 验证添加成功
  expect(screen.getByText("学习测试")).toBeInTheDocument();
  
  // 标记完成
  const checkbox = screen.getByRole("checkbox");
  await userEvent.click(checkbox);
  
  // 验证状态更新
  expect(checkbox).toBeChecked();
});
```

## Mock 技术详解

### 1. 函数 Mock

```javascript
// 基础 Mock
const mockFn = jest.fn();
mockFn("arg1", "arg2");
expect(mockFn).toHaveBeenCalledWith("arg1", "arg2");

// Mock 返回值
const mockAdd = jest.fn().mockReturnValue(10);
expect(mockAdd(2, 3)).toBe(10);

// Mock 异步返回
const mockAsyncFn = jest.fn().mockResolvedValue("success");
const result = await mockAsyncFn();
expect(result).toBe("success");

// Mock 实现
const mockCalculate = jest.fn().mockImplementation((a, b) => a * b);
expect(mockCalculate(3, 4)).toBe(12);
```

### 2. 模块 Mock

```javascript
// 自动 Mock 整个模块
jest.mock("../services/apiService");

// 部分 Mock
jest.mock("../services/apiService", () => ({
  ...jest.requireActual("../services/apiService"),
  userService: {
    getUsers: jest.fn().mockResolvedValue([])
  }
}));

// 动态 Mock
beforeEach(() => {
  jest.doMock("../config", () => ({
    API_URL: "http://test-api.com"
  }));
});
```

### 3. 类 Mock

```javascript
// Mock 类构造函数
jest.mock("../UserService", () => {
  return jest.fn().mockImplementation(() => {
    return {
      getUser: jest.fn().mockResolvedValue({ id: 1, name: "Test" }),
      createUser: jest.fn()
    };
  });
});

// Mock 类方法
const mockUserService = UserService as jest.MockedClass<typeof UserService>;
const mockInstance = mockUserService.mock.instances[0];
mockInstance.getUser.mockResolvedValue({ id: 2, name: "Mock User" });
```

### 4. 第三方库 Mock

```javascript
// Mock Axios
import axios from "axios";
const mockedAxios = axios as jest.Mocked<typeof axios>;

mockedAxios.get.mockResolvedValue({
  data: { users: [] }
});

// Mock React Router
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate
}));
```

### 5. 浏览器 API Mock

```javascript
// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn()
};
Object.defineProperty(window, "localStorage", {
  value: localStorageMock
});

// Mock fetch
global.fetch = jest.fn().mockResolvedValue({
  ok: true,
  json: jest.fn().mockResolvedValue({ data: "test" })
});

// Mock Date
const mockDate = new Date("2023-01-01");
jest.spyOn(global, "Date").mockImplementation(() => mockDate);
```

## React 测试策略

### 1. 组件渲染测试

```javascript
test("应该渲染所有必要的元素", () => {
  render(<UserProfile user={mockUser} />);
  
  // 使用角色查询
  expect(screen.getByRole("heading")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "编辑" })).toBeInTheDocument();
  
  // 使用文本查询
  expect(screen.getByText(mockUser.name)).toBeInTheDocument();
  
  // 使用测试 ID
  expect(screen.getByTestId("user-avatar")).toBeInTheDocument();
});
```

### 2. 用户交互测试

```javascript
test("应该响应用户输入", async () => {
  render(<SearchComponent />);
  
  const searchInput = screen.getByRole("textbox");
  
  // 模拟用户输入
  await userEvent.type(searchInput, "search term");
  expect(searchInput).toHaveValue("search term");
  
  // 模拟键盘事件
  await userEvent.keyboard("{Enter}");
  expect(mockOnSearch).toHaveBeenCalledWith("search term");
});
```

### 3. 异步操作测试

```javascript
test("应该处理异步数据加载", async () => {
  // Mock API 调用
  mockApiService.getUsers.mockResolvedValue([mockUser]);
  
  render(<UserList />);
  
  // 等待加载完成
  await waitFor(() => {
    expect(screen.getByText(mockUser.name)).toBeInTheDocument();
  });
  
  // 验证加载状态消失
  expect(screen.queryByText("加载中...")).not.toBeInTheDocument();
});
```

### 4. 错误处理测试

```javascript
test("应该显示错误信息", async () => {
  // Mock API 错误
  mockApiService.getUsers.mockRejectedValue(new Error("网络错误"));
  
  render(<UserList />);
  
  await waitFor(() => {
    expect(screen.getByText("加载失败")).toBeInTheDocument();
  });
});
```

### 5. 快照测试

```javascript
test("组件快照应该匹配", () => {
  const { container } = render(<Counter initialValue={5} />);
  expect(container.firstChild).toMatchSnapshot();
});

// 内联快照
test("格式化货币快照", () => {
  expect(formatCurrency(123.45)).toMatchInlineSnapshot(`"¥123.45"`);
});
```

## 最佳实践

### 1. 测试命名

```javascript
// ❌ 不好的命名
test("test user component", () => {});

// ✅ 好的命名
test("当用户未登录时应该显示登录按钮", () => {});
test("点击删除按钮应该显示确认对话框", () => {});
```

### 2. 测试组织

```javascript
describe("UserProfile 组件", () => {
  const mockUser = { id: 1, name: "张三", email: "zhang@example.com" };
  
  describe("渲染", () => {
    test("应该显示用户基本信息", () => {});
    test("应该显示用户头像", () => {});
  });
  
  describe("编辑功能", () => {
    test("点击编辑按钮应该进入编辑模式", () => {});
    test("保存修改应该调用更新API", () => {});
  });
  
  describe("错误处理", () => {
    test("当用户数据无效时应该显示错误信息", () => {});
  });
});
```

### 3. 测试数据管理

```javascript
// 使用工厂函数创建测试数据
const createMockUser = (overrides = {}) => ({
  id: 1,
  name: "测试用户",
  email: "test@example.com",
  isActive: true,
  ...overrides
});

// 在测试中使用
const inactiveUser = createMockUser({ isActive: false });
```

### 4. 清理和隔离

```javascript
describe("UserService", () => {
  beforeEach(() => {
    // 每个测试前重置 Mock
    jest.clearAllMocks();
    
    // 重置 localStorage
    localStorage.clear();
  });
  
  afterEach(() => {
    // 清理副作用
    cleanup();
  });
});
```

### 5. 测试覆盖率

```javascript
// 关注重要的代码路径
test("应该处理所有可能的用户状态", () => {
  // 测试活跃用户
  render(<UserCard user={activeUser} />);
  expect(screen.getByText("活跃")).toBeInTheDocument();
  
  // 测试非活跃用户
  render(<UserCard user={inactiveUser} />);
  expect(screen.getByText("非活跃")).toBeInTheDocument();
  
  // 测试VIP用户
  render(<UserCard user={vipUser} />);
  expect(screen.getByText("VIP")).toBeInTheDocument();
});
```

## 常见问题与解决方案

### 1. 异步测试问题

**问题**: 异步操作测试不稳定

**解决方案**: 使用 `waitFor` 和合适的查询方法

```javascript
// ❌ 错误做法
test("异步加载数据", () => {
  render(<AsyncComponent />);
  expect(screen.getByText("数据")).toBeInTheDocument(); // 可能失败
});

// ✅ 正确做法
test("异步加载数据", async () => {
  render(<AsyncComponent />);
  await waitFor(() => {
    expect(screen.getByText("数据")).toBeInTheDocument();
  });
});
```

### 2. Mock 不生效

**问题**: Mock 函数没有被调用

**解决方案**: 检查 Mock 的作用域和时机

```javascript
// ❌ Mock 时机错误
import { userService } from "../services/apiService";
jest.mock("../services/apiService");

// ✅ 正确的 Mock 顺序
jest.mock("../services/apiService");
import { userService } from "../services/apiService";
```

### 3. DOM 查询失败

**问题**: 找不到预期的 DOM 元素

**解决方案**: 使用合适的查询方法和调试工具

```javascript
test("查询 DOM 元素", () => {
  render(<MyComponent />);
  
  // 调试当前 DOM 结构
  screen.debug();
  
  // 使用更宽松的查询
  expect(screen.getByText(/部分匹配/i)).toBeInTheDocument();
  
  // 检查元素是否存在但不可见
  expect(screen.getByText("隐藏文本", { hidden: true })).toBeInTheDocument();
});
```

### 4. 时间相关测试

**问题**: 时间相关的功能测试不稳定

**解决方案**: 使用 Jest 的时间控制功能

```javascript
test("延迟执行", () => {
  jest.useFakeTimers();
  
  const callback = jest.fn();
  setTimeout(callback, 1000);
  
  // 快进时间
  jest.advanceTimersByTime(1000);
  
  expect(callback).toHaveBeenCalled();
  
  jest.useRealTimers();
});
```

### 5. 内存泄漏

**问题**: 测试运行时出现内存泄漏警告

**解决方案**: 正确清理副作用

```javascript
describe("组件测试", () => {
  let component;
  
  beforeEach(() => {
    component = render(<MyComponent />);
  });
  
  afterEach(() => {
    // 清理组件
    component.unmount();
    
    // 清理定时器
    jest.clearAllTimers();
    
    // 清理 Mock
    jest.clearAllMocks();
  });
});
```

## 总结

前端测试是确保代码质量的重要手段。通过合理的测试策略和丰富的测试技巧，我们可以：

1. **提高代码质量**: 及早发现和修复问题
2. **增强重构信心**: 安全地修改和优化代码
3. **改善开发体验**: 减少手动测试的时间
4. **文档化代码行为**: 测试即文档

记住，好的测试应该：
- 可读性强
- 运行快速
- 独立隔离
- 覆盖关键路径
- 易于维护

继续实践和完善你的测试技能，让测试成为开发流程中不可或缺的一部分！
