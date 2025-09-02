/**
 * API 服务 - 用于演示异步测试和 Mock
 */

import axios, { AxiosResponse } from "axios";
import { User, ApiResponse } from "@/types";

// 创建 axios 实例
const apiClient = axios.create({
  baseURL: "https://jsonplaceholder.typicode.com",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

// 请求拦截器
apiClient.interceptors.request.use(
  (config) => {
    // 添加认证 token
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // 处理未授权错误
      localStorage.removeItem("authToken");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// 用户相关 API
export const userService = {
  // 获取所有用户
  async getUsers(): Promise<User[]> {
    try {
      const response: AxiosResponse<User[]> = await apiClient.get("/users");
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch users");
    }
  },

  // 根据 ID 获取用户
  async getUserById(id: number): Promise<User> {
    try {
      const response: AxiosResponse<User> = await apiClient.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch user with id ${id}`);
    }
  },

  // 创建用户
  async createUser(user: Omit<User, "id">): Promise<User> {
    try {
      const response: AxiosResponse<User> = await apiClient.post(
        "/users",
        user
      );
      return response.data;
    } catch (error) {
      throw new Error("Failed to create user");
    }
  },

  // 更新用户
  async updateUser(id: number, user: Partial<User>): Promise<User> {
    try {
      const response: AxiosResponse<User> = await apiClient.put(
        `/users/${id}`,
        user
      );
      return response.data;
    } catch (error) {
      throw new Error(`Failed to update user with id ${id}`);
    }
  },

  // 删除用户
  async deleteUser(id: number): Promise<void> {
    try {
      await apiClient.delete(`/users/${id}`);
    } catch (error) {
      throw new Error(`Failed to delete user with id ${id}`);
    }
  },

  // 搜索用户
  async searchUsers(query: string): Promise<User[]> {
    try {
      const response: AxiosResponse<User[]> = await apiClient.get(
        `/users?q=${query}`
      );
      return response.data;
    } catch (error) {
      throw new Error("Failed to search users");
    }
  },
};

// 通用 API 请求函数
export const fetchData = async <T>(url: string): Promise<T> => {
  try {
    const response: AxiosResponse<T> = await apiClient.get(url);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch data from ${url}`);
  }
};

// 带重试的请求函数
export const fetchWithRetry = async <T>(
  url: string,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> => {
  let lastError: Error;

  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await fetchData<T>(url);
    } catch (error) {
      lastError = error as Error;
      if (i < maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, delay));
        delay *= 2; // 指数退避
      }
    }
  }

  throw lastError!;
};

// 模拟延迟的请求
export const fetchWithDelay = async <T>(
  data: T,
  delay: number = 1000
): Promise<T> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data);
    }, delay);
  });
};

// 模拟可能失败的请求
export const fetchWithRandomFailure = async <T>(
  data: T,
  failureRate: number = 0.3
): Promise<T> => {
  if (Math.random() < failureRate) {
    throw new Error("Random failure occurred");
  }
  return data;
};

export default apiClient;
