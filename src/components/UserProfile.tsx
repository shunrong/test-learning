/**
 * 用户信息组件 - 用于演示 Props 和状态测试
 */

import React, { useState } from "react";
import { User } from "@/types";

export interface UserProfileProps {
  name: string;
  email: string;
  avatar?: string;
  isActive?: boolean;
  onEdit?: (user: Partial<User>) => void;
  showEditButton?: boolean;
}

export const UserProfile: React.FC<UserProfileProps> = ({
  name,
  email,
  avatar,
  isActive = true,
  onEdit,
  showEditButton = true,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name, email });
  const [imageError, setImageError] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    try {
      onEdit?.(editForm);
      setIsEditing(false);
    } catch (error) {
      console.error("Error in onEdit callback:", error);
      // 即使回调出错，也要保持组件稳定性
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditForm({ name, email });
    setIsEditing(false);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const containerStyle: React.CSSProperties = {
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "16px",
    maxWidth: "300px",
    backgroundColor: isActive ? "#fff" : "#f5f5f5",
  };

  const avatarStyle: React.CSSProperties = {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    objectFit: "cover",
    marginBottom: "12px",
  };

  const statusStyle: React.CSSProperties = {
    display: "inline-block",
    padding: "2px 8px",
    borderRadius: "12px",
    fontSize: "12px",
    fontWeight: "bold",
    color: "white",
    backgroundColor: isActive ? "#51cf66" : "#868e96",
  };

  if (isEditing) {
    return (
      <div data-testid="user-profile-edit" style={containerStyle}>
        <h3>编辑用户信息</h3>
        <div style={{ marginBottom: "12px" }}>
          <label
            htmlFor="edit-name-input"
            style={{ display: "block", marginBottom: "4px" }}
          >
            姓名:
          </label>
          <input
            id="edit-name-input"
            data-testid="edit-name-input"
            type="text"
            value={editForm.name}
            onChange={(e) =>
              setEditForm((prev) => ({ ...prev, name: e.target.value }))
            }
            style={{
              width: "100%",
              padding: "8px",
              border: "1px solid #ddd",
              borderRadius: "4px",
            }}
          />
        </div>
        <div style={{ marginBottom: "16px" }}>
          <label
            htmlFor="edit-email-input"
            style={{ display: "block", marginBottom: "4px" }}
          >
            邮箱:
          </label>
          <input
            id="edit-email-input"
            data-testid="edit-email-input"
            type="email"
            value={editForm.email}
            onChange={(e) =>
              setEditForm((prev) => ({ ...prev, email: e.target.value }))
            }
            style={{
              width: "100%",
              padding: "8px",
              border: "1px solid #ddd",
              borderRadius: "4px",
            }}
          />
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            data-testid="save-button"
            onClick={handleSave}
            style={{
              padding: "8px 16px",
              backgroundColor: "#51cf66",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            保存
          </button>
          <button
            data-testid="cancel-button"
            onClick={handleCancel}
            style={{
              padding: "8px 16px",
              backgroundColor: "#868e96",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            取消
          </button>
        </div>
      </div>
    );
  }

  return (
    <div data-testid="user-profile" style={containerStyle}>
      <div style={{ textAlign: "center" }}>
        {avatar && !imageError ? (
          <img
            data-testid="user-avatar"
            src={avatar}
            alt={`${name}的头像`}
            style={avatarStyle}
            onError={handleImageError}
          />
        ) : (
          <div
            data-testid="default-avatar"
            style={{
              ...avatarStyle,
              backgroundColor: "#ddd",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "24px",
              color: "#666",
              margin: "0 auto 12px",
            }}
          >
            {name.charAt(0).toUpperCase()}
          </div>
        )}

        <h3 data-testid="user-name" style={{ margin: "0 0 8px 0" }}>
          {name}
        </h3>

        <p
          data-testid="user-email"
          style={{ margin: "0 0 12px 0", color: "#666" }}
        >
          {email}
        </p>

        <span data-testid="user-status" style={statusStyle}>
          {isActive ? "在线" : "离线"}
        </span>

        {showEditButton && (
          <div style={{ marginTop: "16px" }}>
            <button
              data-testid="edit-button"
              onClick={handleEdit}
              style={{
                padding: "8px 16px",
                backgroundColor: "#74c0fc",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              编辑
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
