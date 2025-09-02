// 用户相关类型
export interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  isActive?: boolean;
}

// 待办事项类型
export interface Todo {
  id: number;
  text: string;
  completed: boolean;
  createdAt: Date;
}

// API 响应类型
export interface ApiResponse<T = any> {
  data: T;
  message: string;
  status: number;
}

// 表单数据类型
export interface FormData {
  name: string;
  email: string;
  message: string;
}

// 计数器状态类型
export interface CounterState {
  count: number;
  step: number;
}
