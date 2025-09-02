# 配置指南

这个文档详细解释了项目中各种配置文件的作用、配置项的含义，以及在什么情况下需要什么配置。

## 目录

1. [Jest 配置详解](#jest-配置详解)
2. [TypeScript 配置](#typescript-配置)
3. [Babel 配置](#babel-配置)
4. [Webpack 配置](#webpack-配置)
5. [测试环境设置](#测试环境设置)
6. [常见配置场景](#常见配置场景)
7. [配置排错指南](#配置排错指南)

## Jest 配置详解

### jest.config.js 完整解析

```javascript
module.exports = {
  // 基础配置
  preset: "ts-jest",                    // 使用 TypeScript 预设
  testEnvironment: "jsdom",             // 测试环境：jsdom 用于前端，node 用于后端
  
  // 文件匹配
  testMatch: [                          // 测试文件匹配模式
    "<rootDir>/src/**/__tests__/**/*.(ts|tsx|js)",
    "<rootDir>/tests/**/*.(test|spec).(ts|tsx|js)"
  ],
  
  // 转换配置
  transform: {                          // 文件转换规则
    "^.+\\.(ts|tsx)$": "ts-jest",      // TypeScript 文件用 ts-jest 转换
    "^.+\\.(js|jsx)$": "babel-jest"    // JavaScript 文件用 babel-jest 转换
  },
  
  // 模块映射
  moduleNameMapper: {                   // 模块路径映射
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",  // CSS 文件映射
    "\\.(gif|ttf|eot|svg|png)$": "<rootDir>/tests/__mocks__/fileMock.js"  // 静态资源映射
  },
  
  // 设置文件
  setupFilesAfterEnv: [                 // 每个测试文件运行前的设置
    "<rootDir>/tests/setup.ts"
  ],
  
  // TypeScript 配置
  globals: {                            // 全局变量配置
    "ts-jest": {
      tsconfig: "tsconfig.json"         // 指定 TypeScript 配置文件
    }
  },
  
  // 覆盖率配置
  collectCoverageFrom: [                // 收集覆盖率的文件
    "src/**/*.{ts,tsx}",
    "!src/**/*.d.ts",                   // 排除类型定义文件
    "!src/index.tsx"                    // 排除入口文件
  ],
  
  // 其他配置
  testPathIgnorePatterns: [             // 忽略的测试路径
    "<rootDir>/node_modules/",
    "<rootDir>/build/"
  ],
  
  moduleFileExtensions: [               // 支持的文件扩展名
    "ts", "tsx", "js", "jsx", "json"
  ]
};
```

### 何时需要特定配置

#### 1. 不同的测试环境

```javascript
// 前端项目（需要 DOM API）
testEnvironment: "jsdom"

// 后端/Node.js 项目
testEnvironment: "node"

// 自定义环境
testEnvironment: "./my-custom-environment"
```

#### 2. 不同的文件类型处理

```javascript
// 处理 CSS-in-JS
moduleNameMapper: {
  "\\.(css|less|scss)$": "identity-obj-proxy"
}

// 处理图片等静态资源
moduleNameMapper: {
  "\\.(jpg|jpeg|png|gif|svg)$": "<rootDir>/__mocks__/fileMock.js"
}

// 处理绝对路径导入
moduleNameMapper: {
  "^@/(.*)$": "<rootDir>/src/$1"
}
```

#### 3. 不同的转换需求

```javascript
// 只有 TypeScript
transform: {
  "^.+\\.tsx?$": "ts-jest"
}

// TypeScript + Babel（需要特殊 Babel 插件）
transform: {
  "^.+\\.tsx?$": "ts-jest",
  "^.+\\.jsx?$": "babel-jest"
}

// 自定义转换器
transform: {
  "^.+\\.vue$": "vue-jest",
  "^.+\\.svg$": "./svg-transformer.js"
}
```

## TypeScript 配置

### tsconfig.json 测试相关配置

```json
{
  "compilerOptions": {
    // 基础配置
    "target": "es5",                     // 编译目标
    "lib": ["dom", "dom.iterable"],      // 包含的库
    "allowJs": true,                     // 允许 JS 文件
    "skipLibCheck": true,                // 跳过库文件检查
    "esModuleInterop": true,             // ES 模块互操作
    "allowSyntheticDefaultImports": true, // 允许合成默认导入
    "strict": true,                      // 严格模式
    "forceConsistentCasingInFileNames": true, // 强制文件名大小写一致
    
    // 模块解析
    "moduleResolution": "node",          // Node 模块解析
    "resolveJsonModule": true,           // 解析 JSON 模块
    "isolatedModules": true,             // 独立模块
    "noEmit": true,                      // 不生成输出文件
    
    // JSX 配置
    "jsx": "react-jsx",                  // JSX 模式
    
    // 测试相关类型
    "types": [                           // 包含的类型定义
      "jest",                            // Jest 类型
      "@testing-library/jest-dom",       // Testing Library DOM 扩展
      "node"                             // Node.js 类型
    ],
    
    // 路径映射
    "baseUrl": ".",                      // 基础路径
    "paths": {                           // 路径映射
      "@/*": ["src/*"],
      "@/components/*": ["src/components/*"],
      "@/utils/*": ["src/utils/*"]
    }
  },
  
  // 包含的文件
  "include": [
    "src",                               // 源代码
    "tests",                             // 测试文件
    "**/*.test.ts",                      // 测试文件模式
    "**/*.test.tsx"
  ],
  
  // 排除的文件
  "exclude": [
    "node_modules",                      // 依赖包
    "build",                             // 构建输出
    "dist"                               // 分发目录
  ]
}
```

### 何时需要特定 TypeScript 配置

#### 1. 不同的编译目标

```json
// 现代浏览器
{
  "target": "es2018",
  "lib": ["es2018", "dom"]
}

// 兼容旧浏览器
{
  "target": "es5",
  "lib": ["es5", "dom", "es6.promise"]
}

// Node.js 环境
{
  "target": "es2018",
  "lib": ["es2018"],
  "types": ["node", "jest"]
}
```

#### 2. 不同的模块系统

```json
// ES 模块
{
  "module": "esnext",
  "moduleResolution": "node"
}

// CommonJS
{
  "module": "commonjs",
  "esModuleInterop": true
}
```

## Babel 配置

### .babelrc 详解

```json
{
  "presets": [
    [
      "@babel/preset-env",               // ES6+ 转换
      {
        "targets": {                     // 目标环境
          "node": "current"              // 当前 Node 版本（用于测试）
        },
        "modules": false                 // 保持 ES 模块（Webpack 处理）
      }
    ],
    "@babel/preset-react",               // React JSX 转换
    "@babel/preset-typescript"           // TypeScript 转换
  ],
  
  "plugins": [
    "@babel/plugin-proposal-class-properties",  // 类属性支持
    "@babel/plugin-proposal-object-rest-spread" // 对象展开支持
  ],
  
  "env": {                               // 环境特定配置
    "test": {                            // 测试环境
      "presets": [
        [
          "@babel/preset-env",
          {
            "targets": {
              "node": "current"          // 测试时使用当前 Node 版本
            }
          }
        ]
      ]
    }
  }
}
```

### 何时需要特定 Babel 配置

#### 1. 不同的 React 版本

```json
// React 17+（新的 JSX 转换）
{
  "presets": [
    ["@babel/preset-react", {
      "runtime": "automatic"
    }]
  ]
}

// React 16 及以下
{
  "presets": [
    ["@babel/preset-react", {
      "runtime": "classic"
    }]
  ]
}
```

#### 2. 特殊语法支持

```json
// 装饰器支持
{
  "plugins": [
    ["@babel/plugin-proposal-decorators", {
      "legacy": true
    }]
  ]
}

// 动态导入支持
{
  "plugins": [
    "@babel/plugin-syntax-dynamic-import"
  ]
}
```

## Webpack 配置

### webpack.config.js 测试相关部分

```javascript
module.exports = {
  mode: "development",                   // 开发模式
  
  entry: "./src/index.tsx",              // 入口文件
  
  resolve: {
    extensions: [".tsx", ".ts", ".js"],  // 文件扩展名解析
    alias: {                             // 路径别名
      "@": path.resolve(__dirname, "src")
    }
  },
  
  module: {
    rules: [
      {
        test: /\.tsx?$/,                 // TypeScript 文件
        use: "ts-loader",
        exclude: /node_modules/
      },
      {
        test: /\.css$/,                  // CSS 文件
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,  // 图片文件
        type: "asset/resource"
      }
    ]
  }
};
```

## 测试环境设置

### tests/setup.ts 详解

```typescript
// 扩展 Jest 匹配器
import "@testing-library/jest-dom";

// Mock 浏览器 API
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// 抑制 React 18 警告
const originalError = console.error;
beforeAll(() => {
  console.error = (...args: any[]) => {
    if (
      typeof args[0] === "string" &&
      args[0].includes("Warning: ReactDOM.render is deprecated")
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});

// 每个测试后清理
afterEach(() => {
  // 清理 DOM
  document.body.innerHTML = "";
  
  // 清理 localStorage
  localStorage.clear();
  
  // 清理 sessionStorage
  sessionStorage.clear();
});
```

### 何时需要特定设置

#### 1. 不同的测试库

```typescript
// React Testing Library
import "@testing-library/jest-dom";

// Enzyme（已不推荐）
import { configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
configure({ adapter: new Adapter() });
```

#### 2. 特定浏览器 API Mock

```typescript
// Mock fetch
global.fetch = jest.fn();

// Mock WebSocket
global.WebSocket = jest.fn();

// Mock geolocation
const mockGeolocation = {
  getCurrentPosition: jest.fn(),
  watchPosition: jest.fn()
};
Object.defineProperty(global.navigator, "geolocation", {
  value: mockGeolocation
});
```

## 常见配置场景

### 场景 1: 新建 React 项目

1. **基础依赖**:
```json
{
  "devDependencies": {
    "@testing-library/react": "^13.0.0",
    "@testing-library/jest-dom": "^5.16.0",
    "@testing-library/user-event": "^14.0.0",
    "jest": "^28.0.0",
    "ts-jest": "^28.0.0"
  }
}
```

2. **Jest 配置**:
```javascript
module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"]
};
```

### 场景 2: 添加 CSS-in-JS 支持

1. **安装依赖**:
```bash
npm install --save-dev identity-obj-proxy
```

2. **配置 Jest**:
```javascript
module.exports = {
  moduleNameMapper: {
    "\\.(css|less|scss)$": "identity-obj-proxy"
  }
};
```

### 场景 3: 支持绝对路径导入

1. **TypeScript 配置**:
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

2. **Jest 配置**:
```javascript
module.exports = {
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1"
  }
};
```

### 场景 4: Next.js 项目测试

1. **Jest 配置**:
```javascript
const nextJest = require("next/jest");

const createJestConfig = nextJest({
  dir: "./"
});

const customJestConfig = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  moduleNameMapper: {
    "^@/components/(.*)$": "<rootDir>/components/$1",
    "^@/pages/(.*)$": "<rootDir>/pages/$1"
  },
  testEnvironment: "jest-environment-jsdom"
};

module.exports = createJestConfig(customJestConfig);
```

## 配置排错指南

### 常见问题 1: 模块解析失败

**错误信息**: `Cannot find module '@/components/Button'`

**解决方案**:
1. 检查 TypeScript 路径映射
2. 检查 Jest moduleNameMapper
3. 确保两者配置一致

### 常见问题 2: CSS 导入失败

**错误信息**: `Unexpected token '.'`

**解决方案**:
```javascript
// jest.config.js
module.exports = {
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy"
  }
};
```

### 常见问题 3: 异步测试超时

**错误信息**: `Timeout - Async callback was not invoked`

**解决方案**:
```javascript
// 增加超时时间
jest.setTimeout(10000);

// 或在测试中
test("异步测试", async () => {
  // ...
}, 10000);
```

### 常见问题 4: DOM API 未定义

**错误信息**: `ReferenceError: window is not defined`

**解决方案**:
```javascript
// jest.config.js
module.exports = {
  testEnvironment: "jsdom"  // 确保使用 jsdom 环境
};
```

### 常见问题 5: TypeScript 类型错误

**错误信息**: `Type 'jest.MockedFunction<...>' is not assignable`

**解决方案**:
```typescript
// 安装类型定义
npm install --save-dev @types/jest

// tsconfig.json
{
  "compilerOptions": {
    "types": ["jest", "@testing-library/jest-dom"]
  }
}
```

## 配置最佳实践

### 1. 分层配置

```
├── jest.config.js          # 主配置
├── jest.setup.js           # 全局设置
├── .babelrc                # Babel 配置
└── tsconfig.json           # TypeScript 配置
```

### 2. 环境分离

```javascript
// jest.config.js
module.exports = {
  projects: [
    {
      displayName: "unit",
      testMatch: ["<rootDir>/src/**/__tests__/**/*.test.(ts|tsx)"]
    },
    {
      displayName: "integration", 
      testMatch: ["<rootDir>/tests/integration/**/*.test.(ts|tsx)"]
    }
  ]
};
```

### 3. 配置继承

```javascript
// jest.config.base.js
module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom"
};

// jest.config.js
const base = require("./jest.config.base");

module.exports = {
  ...base,
  setupFilesAfterEnv: ["<rootDir>/tests/setup.ts"]
};
```

通过合理的配置，你可以创建一个高效、稳定的测试环境，支持各种复杂的测试场景！
