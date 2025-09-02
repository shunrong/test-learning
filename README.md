# React + TypeScript + Jest 测试框架学习项目

这是一个专门用于学习前端测试框架的完整项目，涵盖了从基础配置到高级测试技巧的所有内容。

## 项目概述

本项目使用现代前端技术栈，专门设计用于学习和掌握前端测试的各个方面：

- **React 18** - 现代 React 开发
- **TypeScript** - 类型安全的 JavaScript
- **Webpack 5** - 模块打包工具
- **Jest** - JavaScript 测试框架
- **Testing Library** - React 组件测试工具
- **Babel** - JavaScript 编译器

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 运行开发服务器

```bash
npm run dev
```

访问 http://localhost:3000 查看应用。

### 3. 运行测试

```bash
# 运行所有测试
npm test

# 监听模式运行测试
npm run test:watch

# 生成覆盖率报告
npm run test:coverage

# 详细输出模式
npm run test:verbose

# 调试模式
npm run test:debug
```

### 4. 构建项目

```bash
npm run build
```

## 项目结构

```
test-learning/
├── src/                          # 源代码
│   ├── components/               # React 组件
│   │   ├── __tests__/           # 组件测试
│   │   ├── Counter.tsx          # 计数器组件
│   │   ├── UserProfile.tsx      # 用户信息组件
│   │   ├── TodoList.tsx         # 待办列表组件
│   │   └── ApiExample.tsx       # API 示例组件
│   ├── hooks/                   # 自定义 Hooks
│   │   ├── __tests__/          # Hook 测试
│   │   ├── useCounter.ts       # 计数器 Hook
│   │   ├── useLocalStorage.ts  # 本地存储 Hook
│   │   └── useFetch.ts         # 数据获取 Hook
│   ├── utils/                  # 工具函数
│   │   ├── __tests__/         # 工具函数测试
│   │   ├── mathUtils.ts       # 数学工具
│   │   ├── stringUtils.ts     # 字符串工具
│   │   └── dateUtils.ts       # 日期工具
│   ├── services/              # 服务层
│   │   ├── __tests__/        # 服务测试
│   │   └── apiService.ts     # API 服务
│   ├── types/                # TypeScript 类型定义
│   ├── App.tsx              # 主应用组件
│   └── index.tsx            # 应用入口
├── tests/                   # 测试相关文件
│   ├── __mocks__/          # Mock 文件
│   ├── mocks/              # Mock 示例
│   ├── snapshots/          # 快照测试示例
│   ├── dom/                # DOM 测试示例
│   ├── integration/        # 集成测试示例
│   └── setup.ts           # 测试环境设置
├── public/                 # 静态文件
├── coverage/              # 测试覆盖率报告
├── jest.config.js         # Jest 配置
├── webpack.config.js      # Webpack 配置
├── tsconfig.json         # TypeScript 配置
├── .babelrc             # Babel 配置
└── package.json         # 项目配置
```

## 学习内容概览

### 1. 测试框架基础配置

#### Jest 配置详解

Jest 是项目的核心测试框架，配置文件 `jest.config.js` 包含了所有重要设置：

- **测试环境**: `jsdom` - 模拟浏览器环境
- **文件匹配**: 支持多种测试文件命名模式
- **模块映射**: 支持 TypeScript 路径别名
- **覆盖率配置**: 设置覆盖率阈值和报告格式
- **Mock 配置**: 自动 Mock 静态资源

#### 关键配置选项

```javascript
module.exports = {
  testEnvironment: 'jsdom',           // 浏览器环境模拟
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'], // 测试环境设置
  collectCoverageFrom: ['src/**/*.{ts,tsx}'], // 覆盖率收集
  coverageThreshold: {                // 覆盖率阈值
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  }
};
```

### 2. 单元测试 (Unit Tests)

单元测试专注于测试独立的函数和组件，位于 `src/*/__tests__/` 目录中。

#### 数学工具函数测试 (`src/utils/__tests__/mathUtils.test.ts`)

学习要点：
- 基础函数测试
- 边界值测试
- 错误处理测试
- 性能测试
- 属性测试（Property-based testing）

```typescript
describe('add 函数', () => {
  it('应该正确计算两个正数的和', () => {
    expect(add(2, 3)).toBe(5);
  });

  it('应该处理边界情况', () => {
    expect(add(0, 0)).toBe(0);
    expect(add(-1, 1)).toBe(0);
  });
});
```

#### 字符串工具函数测试 (`src/utils/__tests__/stringUtils.test.ts`)

学习要点：
- 字符串处理测试
- 正则表达式测试
- 验证函数测试
- 格式化函数测试

#### 日期工具函数测试 (`src/utils/__tests__/dateUtils.test.ts`)

学习要点：
- 日期对象测试
- 时间 Mock 技术
- 时区处理
- 相对时间计算

### 3. React 组件测试

#### 基础组件测试 (`src/components/__tests__/Counter.test.tsx`)

学习要点：
- 组件渲染测试
- 用户交互测试
- Props 传递测试
- 状态变化测试
- 事件处理测试

```typescript
it('点击递增按钮应该增加计数', async () => {
  const user = userEvent.setup();
  render(<Counter />);
  
  const incrementButton = screen.getByTestId('increment-button');
  await user.click(incrementButton);
  
  expect(screen.getByTestId('count-display')).toHaveTextContent('1');
});
```

#### 复杂组件测试 (`src/components/__tests__/UserProfile.test.tsx`)

学习要点：
- 表单测试
- 条件渲染测试
- 图片加载测试
- 编辑模式切换测试

### 4. 自定义 Hooks 测试

#### useCounter Hook 测试 (`src/hooks/__tests__/useCounter.test.ts`)

学习要点：
- `renderHook` 的使用
- Hook 状态测试
- Hook 副作用测试
- 依赖数组测试

```typescript
it('应该正确递增', () => {
  const { result } = renderHook(() => useCounter());
  
  act(() => {
    result.current.increment();
  });
  
  expect(result.current.count).toBe(1);
});
```

#### useLocalStorage Hook 测试 (`src/hooks/__tests__/useLocalStorage.test.ts`)

学习要点：
- localStorage Mock
- 存储副作用测试
- 错误处理测试
- 跨标签页同步测试

#### useFetch Hook 测试 (`src/hooks/__tests__/useFetch.test.ts`)

学习要点：
- 异步 Hook 测试
- 网络请求 Mock
- 加载状态测试
- 错误状态测试
- 超时处理测试

### 5. Mock 技术完全指南

#### API 服务 Mock (`src/services/__tests__/apiService.test.ts`)

学习要点：
- axios Mock
- 请求拦截器测试
- 错误处理 Mock
- 重试机制测试

#### Mock 技术示例 (`tests/mocks/mockExamples.test.ts`)

这个文件是 Mock 技术的完整教程，包含：

1. **基础 Mock 函数**
   ```typescript
   const mockFn = jest.fn();
   mockFn.mockReturnValue('mocked value');
   expect(mockFn()).toBe('mocked value');
   ```

2. **对象和类的 Mock**
   ```typescript
   const spy = jest.spyOn(object, 'method');
   spy.mockReturnValue('mocked');
   ```

3. **模块 Mock**
   ```typescript
   jest.mock('axios');
   const mockedAxios = axios as jest.Mocked<typeof axios>;
   ```

4. **时间 Mock**
   ```typescript
   jest.useFakeTimers();
   jest.advanceTimersByTime(1000);
   ```

5. **DOM API Mock**
   ```typescript
   Object.defineProperty(window, 'localStorage', {
     value: mockLocalStorage
   });
   ```

### 6. 快照测试

#### 快照测试示例 (`tests/snapshots/snapshotExamples.test.tsx`)

学习要点：
- 基础快照测试
- 内联快照
- 条件渲染快照
- 快照更新策略
- 快照维护最佳实践

```typescript
it('应该匹配组件快照', () => {
  const { container } = render(<Component />);
  expect(container.firstChild).toMatchSnapshot();
});
```

### 7. DOM 操作和事件测试

#### DOM 测试示例 (`tests/dom/domExamples.test.ts`)

学习要点：
- DOM 元素创建和操作
- 事件处理测试
- 键盘事件测试
- 鼠标事件测试
- 表单事件测试
- 异步 DOM 操作测试

### 8. 集成测试

#### 集成测试示例 (`tests/integration/integrationExamples.test.tsx`)

学习要点：
- 应用级别测试
- 组件间交互测试
- 完整用户流程测试
- API 集成测试
- 表单集成测试
- 性能集成测试

## 测试最佳实践

### 1. 测试组织原则

- **按功能模块组织**: 每个模块都有自己的测试目录
- **测试文件命名**: 使用 `.test.` 或 `.spec.` 后缀
- **测试描述**: 使用清晰、描述性的测试名称

### 2. 测试编写原则

#### AAA 模式 (Arrange, Act, Assert)

```typescript
it('应该计算正确的总和', () => {
  // Arrange - 准备测试数据
  const numbers = [1, 2, 3, 4, 5];
  
  // Act - 执行测试操作
  const result = sum(numbers);
  
  // Assert - 验证结果
  expect(result).toBe(15);
});
```

#### 测试隔离

每个测试都应该是独立的，不依赖其他测试的结果：

```typescript
beforeEach(() => {
  // 每个测试前重置状态
  jest.clearAllMocks();
  localStorage.clear();
});
```

### 3. Mock 使用指南

#### 何时使用 Mock

1. **外部依赖**: API 调用、文件系统、数据库
2. **时间相关**: Date.now(), setTimeout, setInterval
3. **随机性**: Math.random()
4. **浏览器 API**: localStorage, sessionStorage, fetch

#### Mock 层次选择

1. **函数级别**: `jest.fn()`
2. **方法级别**: `jest.spyOn()`
3. **模块级别**: `jest.mock()`
4. **全局级别**: 在 setup 文件中配置

### 4. 测试覆盖率

#### 覆盖率指标理解

- **Lines**: 行覆盖率
- **Functions**: 函数覆盖率
- **Branches**: 分支覆盖率
- **Statements**: 语句覆盖率

#### 覆盖率目标

本项目设置的覆盖率目标：
- 所有指标 >= 70%
- 新代码 >= 80%
- 关键路径 >= 90%

### 5. 测试策略

#### 测试金字塔

1. **单元测试 (70%)**: 快速、可靠、隔离
2. **集成测试 (20%)**: 模块间交互
3. **端到端测试 (10%)**: 完整用户流程

#### 测试优先级

1. **核心业务逻辑**: 必须测试
2. **边界条件**: 重点测试
3. **错误处理**: 充分测试
4. **用户交互**: 重要测试

## 常用测试命令

### Jest 命令选项

```bash
# 监听模式
npm run test:watch

# 覆盖率报告
npm run test:coverage

# 更新快照
npm test -- --updateSnapshot

# 运行特定测试文件
npm test -- Counter.test.tsx

# 运行匹配模式的测试
npm test -- --testNamePattern="应该正确"

# 调试模式
npm run test:debug

# 静默模式
npm test -- --silent

# 详细输出
npm test -- --verbose
```

### 测试调试技巧

#### 1. 使用 screen.debug()

```typescript
import { screen } from '@testing-library/react';

it('调试测试', () => {
  render(<Component />);
  screen.debug(); // 输出当前 DOM 结构
});
```

#### 2. 查看测试覆盖率

```bash
npm run test:coverage
open coverage/lcov-report/index.html
```

#### 3. 只运行失败的测试

```bash
npm test -- --onlyFailures
```

## 依赖库说明

### 核心测试库

1. **Jest** (`^29.7.0`)
   - 测试框架核心
   - 断言库
   - Mock 功能
   - 覆盖率报告

2. **@testing-library/react** (`^13.4.0`)
   - React 组件测试
   - 用户行为模拟
   - DOM 查询工具

3. **@testing-library/jest-dom** (`^6.1.0`)
   - 扩展的 DOM 断言
   - 语义化断言方法

4. **@testing-library/user-event** (`^14.5.0`)
   - 真实用户交互模拟
   - 异步事件处理

### 辅助工具

1. **@testing-library/react-hooks** (`^8.0.1`)
   - 自定义 Hook 测试
   - renderHook 工具

2. **jest-environment-jsdom** (`^29.7.0`)
   - 浏览器环境模拟
   - DOM API 支持

### 类型定义

1. **@types/jest** (`^29.5.0`)
   - Jest TypeScript 类型
   - 断言方法类型

## 学习路径建议

### 第一阶段：基础概念（1-2周）

1. 理解测试的重要性和类型
2. 学习 Jest 基础语法和断言
3. 掌握简单函数的单元测试
4. 学习基础的 Mock 技术

**重点文件**:
- `src/utils/__tests__/mathUtils.test.ts`
- `tests/mocks/mockExamples.test.ts` (前半部分)

### 第二阶段：React 测试（2-3周）

1. 学习 Testing Library 的使用
2. 掌握组件渲染和查询
3. 学习用户事件模拟
4. 理解组件测试最佳实践

**重点文件**:
- `src/components/__tests__/Counter.test.tsx`
- `src/components/__tests__/UserProfile.test.tsx`

### 第三阶段：高级技术（2-3周）

1. 掌握自定义 Hook 测试
2. 学习异步测试技术
3. 深入理解 Mock 技术
4. 学习快照测试

**重点文件**:
- `src/hooks/__tests__/` 所有文件
- `tests/snapshots/snapshotExamples.test.tsx`
- `tests/mocks/mockExamples.test.ts` (后半部分)

### 第四阶段：集成和实践（1-2周）

1. 学习集成测试策略
2. 掌握测试覆盖率分析
3. 学习测试调试技巧
4. 实践完整项目测试

**重点文件**:
- `tests/integration/integrationExamples.test.tsx`
- `tests/dom/domExamples.test.ts`

## 常见问题和解决方案

### 1. 测试环境问题

**问题**: `ReferenceError: window is not defined`

**解决方案**: 确保 Jest 配置中设置了正确的测试环境：
```javascript
module.exports = {
  testEnvironment: 'jsdom'
};
```

### 2. 模块解析问题

**问题**: `Cannot resolve module '@/components/...'`

**解决方案**: 检查 Jest 配置中的 `moduleNameMapping`：
```javascript
moduleNameMapping: {
  '^@/(.*)$': '<rootDir>/src/$1'
}
```

### 3. 异步测试问题

**问题**: 异步操作没有等待完成

**解决方案**: 使用 `waitFor` 或 `findBy*` 方法：
```typescript
await waitFor(() => {
  expect(screen.getByText('Loading complete')).toBeInTheDocument();
});
```

### 4. Mock 问题

**问题**: Mock 没有生效

**解决方案**: 检查 Mock 的位置和时机：
```typescript
// 在测试文件顶部
jest.mock('@/services/apiService');

// 在每个测试前清理
beforeEach(() => {
  jest.clearAllMocks();
});
```

### 5. 测试覆盖率问题

**问题**: 某些代码没有被覆盖

**解决方案**: 
1. 检查测试是否覆盖所有分支
2. 添加错误处理测试
3. 测试边界条件

## 📚 详细文档

本项目包含三个重要的详细文档，深入讲解测试的各个方面：

- **[API 参考文档](docs/API_REFERENCE.md)** - 所有工具函数、Hook 和服务的详细 API 说明
- **[测试指南](docs/TESTING_GUIDE.md)** - 完整的前端测试学习指南，包含测试策略和最佳实践
- **[配置指南](docs/CONFIGURATION_GUIDE.md)** - 详细的配置说明，解释何时需要什么配置

## 扩展学习资源

### 官方文档

1. [Jest 官方文档](https://jestjs.io/)
2. [Testing Library 文档](https://testing-library.com/)
3. [React Testing 指南](https://reactjs.org/docs/testing.html)

### 推荐阅读

1. [测试驱动开发实践](https://testdrivendevelopment.com/)
2. [JavaScript 测试最佳实践](https://github.com/goldbergyoni/javascript-testing-best-practices)
3. [React 测试策略](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

### 相关工具

1. [Storybook](https://storybook.js.org/) - 组件开发和测试
2. [Cypress](https://www.cypress.io/) - 端到端测试
3. [Playwright](https://playwright.dev/) - 现代 E2E 测试

## 贡献指南

如果你想为这个学习项目贡献代码或改进：

1. Fork 项目
2. 创建特性分支
3. 提交你的更改
4. 推送到分支
5. 创建 Pull Request

## 许可证

MIT License

## 总结

这个项目为你提供了一个完整的前端测试学习环境，涵盖了从基础概念到高级技巧的所有内容。通过系统地学习和实践这些测试技术，你将能够：

1. 编写高质量的单元测试
2. 掌握 React 组件测试技巧
3. 熟练使用各种 Mock 技术
4. 理解和实施测试最佳实践
5. 建立完整的测试策略

记住，测试不仅仅是验证代码的正确性，更是提高代码质量、增强信心、促进重构的重要工具。通过持续的练习和应用，你将成为一名优秀的前端测试工程师。
