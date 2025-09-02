/**
 * API 示例组件 - 用于演示异步测试和 Mock
 */

import React, { useState } from "react";
import { useFetch } from "@/hooks/useFetch";
import { userService } from "@/services/apiService";
import { User } from "@/types";

export const ApiExample: React.FC = () => {
  const [userId, setUserId] = useState<string>("1");
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 使用自定义 useFetch Hook
  const {
    data: fetchedUser,
    loading: fetchLoading,
    error: fetchError,
    execute: executeUserFetch,
  } = useFetch<User>(`https://jsonplaceholder.typicode.com/users/${userId}`, {
    immediate: false,
  });

  const handleFetchUser = async () => {
    await executeUserFetch();
  };

  const handleFetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedUsers = await userService.getUsers();
      setUsers(fetchedUsers);
    } catch (err) {
      setError(err instanceof Error ? err.message : "获取用户列表失败");
    } finally {
      setLoading(false);
    }
  };

  const handleGetUserById = async () => {
    if (!userId || isNaN(Number(userId))) {
      setError("请输入有效的用户 ID");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const user = await userService.getUserById(Number(userId));
      setSelectedUser(user);
    } catch (err) {
      setError(err instanceof Error ? err.message : "获取用户信息失败");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async () => {
    setLoading(true);
    setError(null);
    try {
      const newUser = await userService.createUser({
        name: "新用户",
        email: "newuser@example.com",
      });
      setUsers((prev) => [...prev, newUser]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "创建用户失败");
    } finally {
      setLoading(false);
    }
  };

  const containerStyle: React.CSSProperties = {
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "16px",
    maxWidth: "600px",
  };

  const sectionStyle: React.CSSProperties = {
    marginBottom: "20px",
    padding: "12px",
    backgroundColor: "#f8f9fa",
    borderRadius: "4px",
  };

  const buttonStyle: React.CSSProperties = {
    padding: "8px 16px",
    margin: "4px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    backgroundColor: "#74c0fc",
    color: "white",
  };

  const disabledButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    backgroundColor: "#ddd",
    cursor: "not-allowed",
  };

  return (
    <div data-testid="api-example" style={containerStyle}>
      <h3>API 调用示例</h3>

      {/* 错误显示 */}
      {(error || fetchError) && (
        <div
          data-testid="error-message"
          style={{
            padding: "8px",
            backgroundColor: "#ffe6e6",
            color: "#d63031",
            borderRadius: "4px",
            marginBottom: "16px",
          }}
        >
          {error || fetchError?.message}
        </div>
      )}

      {/* 加载状态 */}
      {(loading || fetchLoading) && (
        <div
          data-testid="loading-indicator"
          style={{
            padding: "8px",
            backgroundColor: "#e3f2fd",
            color: "#1976d2",
            borderRadius: "4px",
            marginBottom: "16px",
          }}
        >
          加载中...
        </div>
      )}

      {/* 获取所有用户 */}
      <div style={sectionStyle}>
        <h4>获取所有用户</h4>
        <button
          data-testid="fetch-users-button"
          onClick={handleFetchUsers}
          disabled={loading}
          style={loading ? disabledButtonStyle : buttonStyle}
        >
          获取用户列表
        </button>
        {users.length > 0 && (
          <div data-testid="users-list" style={{ marginTop: "12px" }}>
            <p>获取到 {users.length} 个用户:</p>
            <ul style={{ maxHeight: "150px", overflowY: "auto" }}>
              {users.slice(0, 5).map((user) => (
                <li key={user.id} data-testid={`user-item-${user.id}`}>
                  {user.name} ({user.email})
                </li>
              ))}
              {users.length > 5 && <li>...</li>}
            </ul>
          </div>
        )}
      </div>

      {/* 根据 ID 获取用户 */}
      <div style={sectionStyle}>
        <h4>根据 ID 获取用户</h4>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "8px",
          }}
        >
          <label>用户 ID:</label>
          <input
            data-testid="user-id-input"
            type="number"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            style={{
              padding: "4px 8px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              width: "100px",
            }}
          />
          <button
            data-testid="get-user-button"
            onClick={handleGetUserById}
            disabled={loading}
            style={loading ? disabledButtonStyle : buttonStyle}
          >
            获取用户
          </button>
        </div>
        {selectedUser && (
          <div data-testid="selected-user" style={{ marginTop: "12px" }}>
            <p>
              <strong>姓名:</strong> {selectedUser.name}
            </p>
            <p>
              <strong>邮箱:</strong> {selectedUser.email}
            </p>
          </div>
        )}
      </div>

      {/* 使用 useFetch Hook */}
      <div style={sectionStyle}>
        <h4>使用 useFetch Hook</h4>
        <button
          data-testid="use-fetch-button"
          onClick={handleFetchUser}
          disabled={fetchLoading}
          style={fetchLoading ? disabledButtonStyle : buttonStyle}
        >
          通过 Hook 获取用户
        </button>
        {fetchedUser && (
          <div data-testid="fetched-user" style={{ marginTop: "12px" }}>
            <p>
              <strong>姓名:</strong> {fetchedUser.name}
            </p>
            <p>
              <strong>邮箱:</strong> {fetchedUser.email}
            </p>
          </div>
        )}
      </div>

      {/* 创建用户 */}
      <div style={sectionStyle}>
        <h4>创建新用户</h4>
        <button
          data-testid="create-user-button"
          onClick={handleCreateUser}
          disabled={loading}
          style={loading ? disabledButtonStyle : buttonStyle}
        >
          创建用户
        </button>
      </div>
    </div>
  );
};
