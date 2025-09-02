# API 参考文档

这个文档详细说明了项目中所有工具函数、Hook 和服务的 API 接口。

## 工具函数 (Utils)

### mathUtils.ts

#### 基础数学运算

```typescript
add(a: number, b: number): number
```
- **功能**: 两数相加
- **参数**: 
  - `a`: 第一个数字
  - `b`: 第二个数字
- **返回**: 相加结果
- **示例**: `add(2, 3) // 返回 5`

```typescript
subtract(a: number, b: number): number
```
- **功能**: 两数相减
- **参数**: 
  - `a`: 被减数
  - `b`: 减数
- **返回**: 相减结果

```typescript
multiply(a: number, b: number): number
```
- **功能**: 两数相乘
- **参数**: 
  - `a`: 第一个因数
  - `b`: 第二个因数
- **返回**: 相乘结果

```typescript
divide(a: number, b: number): number
```
- **功能**: 两数相除
- **参数**: 
  - `a`: 被除数
  - `b`: 除数（不能为0）
- **返回**: 相除结果
- **抛出**: 当除数为0时抛出错误

#### 高级数学函数

```typescript
factorial(n: number): number
```
- **功能**: 计算阶乘
- **参数**: `n` - 非负整数
- **返回**: n的阶乘
- **抛出**: 当n为负数时抛出错误

```typescript
isPrime(n: number): boolean
```
- **功能**: 判断是否为质数
- **参数**: `n` - 要检查的数字
- **返回**: 是质数返回true，否则返回false

```typescript
fibonacci(n: number): number
```
- **功能**: 计算斐波那契数列第n项
- **参数**: `n` - 项数（从0开始）
- **返回**: 第n项的值

#### 数组操作

```typescript
sum(numbers: number[]): number
```
- **功能**: 计算数组元素之和
- **参数**: `numbers` - 数字数组
- **返回**: 所有元素的和

```typescript
average(numbers: number[]): number
```
- **功能**: 计算数组平均值
- **参数**: `numbers` - 数字数组
- **返回**: 平均值
- **抛出**: 当数组为空时抛出错误

```typescript
max(numbers: number[]): number
```
- **功能**: 找出数组中的最大值
- **参数**: `numbers` - 数字数组
- **返回**: 最大值

```typescript
min(numbers: number[]): number
```
- **功能**: 找出数组中的最小值
- **参数**: `numbers` - 数字数组
- **返回**: 最小值

### stringUtils.ts

#### 基础字符串操作

```typescript
capitalize(str: string): string
```
- **功能**: 首字母大写
- **参数**: `str` - 输入字符串
- **返回**: 首字母大写的字符串

```typescript
reverse(str: string): string
```
- **功能**: 反转字符串
- **参数**: `str` - 输入字符串
- **返回**: 反转后的字符串

```typescript
truncate(str: string, length: number): string
```
- **功能**: 截断字符串并添加省略号
- **参数**: 
  - `str` - 输入字符串
  - `length` - 最大长度
- **返回**: 截断后的字符串

#### 验证函数

```typescript
isEmail(email: string): boolean
```
- **功能**: 验证邮箱格式
- **参数**: `email` - 邮箱字符串
- **返回**: 格式正确返回true

```typescript
isPhoneNumber(phone: string): boolean
```
- **功能**: 验证电话号码格式
- **参数**: `phone` - 电话号码字符串
- **返回**: 格式正确返回true

```typescript
isStrongPassword(password: string): boolean
```
- **功能**: 验证强密码（至少8位，包含大小写字母、数字和特殊字符）
- **参数**: `password` - 密码字符串
- **返回**: 符合要求返回true

#### 格式化函数

```typescript
formatCurrency(amount: number, currency?: string): string
```
- **功能**: 格式化货币
- **参数**: 
  - `amount` - 金额
  - `currency` - 货币符号（默认为"¥"）
- **返回**: 格式化后的货币字符串

```typescript
formatPhoneNumber(phone: string): string
```
- **功能**: 格式化电话号码
- **参数**: `phone` - 电话号码
- **返回**: 格式化后的电话号码

#### 文本统计

```typescript
getWordCount(text: string): number
```
- **功能**: 统计单词数量
- **参数**: `text` - 文本
- **返回**: 单词数量

```typescript
getCharacterCount(text: string): number
```
- **功能**: 统计字符数量
- **参数**: `text` - 文本
- **返回**: 字符数量

```typescript
getTextStatistics(text: string): { words: number; characters: number; sentences: number }
```
- **功能**: 获取文本统计信息
- **参数**: `text` - 文本
- **返回**: 包含单词、字符、句子数量的对象

### dateUtils.ts

#### 日期格式化

```typescript
formatDate(date: Date, format: string): string
```
- **功能**: 格式化日期
- **参数**: 
  - `date` - 日期对象
  - `format` - 格式字符串（支持 YYYY、MM、DD、HH、mm、ss）
- **返回**: 格式化后的日期字符串

```typescript
getRelativeTime(date: Date): string
```
- **功能**: 获取相对时间描述
- **参数**: `date` - 日期对象
- **返回**: 相对时间字符串（如"2小时前"）

#### 日期计算

```typescript
addDays(date: Date, days: number): Date
```
- **功能**: 增加天数
- **参数**: 
  - `date` - 基准日期
  - `days` - 要增加的天数
- **返回**: 新的日期对象

```typescript
subtractDays(date: Date, days: number): Date
```
- **功能**: 减少天数
- **参数**: 
  - `date` - 基准日期
  - `days` - 要减少的天数
- **返回**: 新的日期对象

```typescript
getDaysBetween(date1: Date, date2: Date): number
```
- **功能**: 计算两个日期之间的天数
- **参数**: 
  - `date1` - 第一个日期
  - `date2` - 第二个日期
- **返回**: 天数差（绝对值）

## React Hooks

### useCounter.ts

```typescript
useCounter(initialValue?: number, options?: { min?: number; max?: number; step?: number })
```

- **功能**: 计数器 Hook
- **参数**: 
  - `initialValue` - 初始值（默认0）
  - `options` - 配置选项
    - `min` - 最小值
    - `max` - 最大值
    - `step` - 步长（默认1）
- **返回**: 
  ```typescript
  {
    count: number;
    increment: () => void;
    decrement: () => void;
    reset: () => void;
    set: (value: number) => void;
  }
  ```

### useLocalStorage.ts

```typescript
useLocalStorage<T>(key: string, initialValue: T)
```

- **功能**: localStorage 状态管理 Hook
- **参数**: 
  - `key` - localStorage 键名
  - `initialValue` - 初始值
- **返回**: 
  ```typescript
  [T, (value: T | ((val: T) => T)) => void]
  ```

### useFetch.ts

```typescript
useFetch<T>(url: string, options?: { 
  immediate?: boolean; 
  timeout?: number; 
})
```

- **功能**: 数据获取 Hook
- **参数**: 
  - `url` - 请求 URL
  - `options` - 配置选项
    - `immediate` - 是否立即执行（默认true）
    - `timeout` - 超时时间（默认10000ms）
- **返回**: 
  ```typescript
  {
    data: T | null;
    loading: boolean;
    error: string | null;
    execute: () => Promise<void>;
  }
  ```

## 服务 (Services)

### apiService.ts

#### API 客户端

```typescript
const apiClient: AxiosInstance
```
- **功能**: 配置好的 Axios 实例
- **特性**: 
  - 自动添加认证头
  - 请求/响应拦截器
  - 错误处理

#### 工具函数

```typescript
delay(ms: number): Promise<void>
```
- **功能**: 延迟执行
- **参数**: `ms` - 延迟毫秒数
- **返回**: Promise

```typescript
retry<T>(fn: () => Promise<T>, retries: number): Promise<T>
```
- **功能**: 重试机制
- **参数**: 
  - `fn` - 要重试的函数
  - `retries` - 重试次数
- **返回**: Promise

```typescript
simulateRandomFailure(): void
```
- **功能**: 模拟随机失败（用于测试）

#### 用户服务

```typescript
userService.getUsers(): Promise<User[]>
```
- **功能**: 获取用户列表
- **返回**: 用户数组

```typescript
userService.getUserById(id: number): Promise<User>
```
- **功能**: 根据ID获取用户
- **参数**: `id` - 用户ID
- **返回**: 用户对象

```typescript
userService.createUser(userData: Omit<User, 'id'>): Promise<User>
```
- **功能**: 创建用户
- **参数**: `userData` - 用户数据（不包含ID）
- **返回**: 创建的用户对象

```typescript
userService.updateUser(id: number, userData: Partial<User>): Promise<User>
```
- **功能**: 更新用户
- **参数**: 
  - `id` - 用户ID
  - `userData` - 要更新的用户数据
- **返回**: 更新后的用户对象

```typescript
userService.deleteUser(id: number): Promise<void>
```
- **功能**: 删除用户
- **参数**: `id` - 用户ID
- **返回**: Promise<void>

## 类型定义

### User

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  isActive: boolean;
}
```

### Todo

```typescript
interface Todo {
  id: number;
  text: string;
  completed: boolean;
  createdAt: Date;
}
```

### ApiResponse

```typescript
interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}
```

## 测试相关

### Mock 工具

项目中包含了丰富的 Mock 示例，涵盖：

- **函数 Mock**: `jest.fn()`, `mockReturnValue()`, `mockImplementation()`
- **模块 Mock**: `jest.mock()`, 自动 Mock, 部分 Mock
- **时间 Mock**: `jest.useFakeTimers()`, `jest.runAllTimers()`
- **网络请求 Mock**: Axios Mock, Fetch Mock
- **DOM API Mock**: `window.location`, `localStorage`, `matchMedia`

### 测试工具

- **React Testing Library**: 组件渲染和查询
- **Jest DOM**: DOM 断言扩展
- **User Event**: 用户交互模拟
- **Fire Event**: 事件触发

## 最佳实践

1. **测试组织**: 按功能模块组织测试文件
2. **Mock 策略**: 只 Mock 必要的依赖
3. **断言**: 使用语义化的断言方法
4. **清理**: 在测试后清理状态和 Mock
5. **覆盖率**: 关注关键路径的测试覆盖

更多详细信息请参考各个测试文件中的具体示例。
