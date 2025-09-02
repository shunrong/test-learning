/**
 * 待办事项列表组件 - 用于演示列表渲染和交互测试
 */

import React, { useState } from "react";
import { Todo } from "@/types";

export interface TodoListProps {
  initialTodos?: Todo[];
  onTodosChange?: (todos: Todo[]) => void;
}

export const TodoList: React.FC<TodoListProps> = ({
  initialTodos = [],
  onTodosChange,
}) => {
  const [todos, setTodos] = useState<Todo[]>(initialTodos);
  const [newTodoText, setNewTodoText] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");

  const updateTodos = (newTodos: Todo[]) => {
    setTodos(newTodos);
    onTodosChange?.(newTodos);
  };

  const addTodo = () => {
    if (newTodoText.trim()) {
      const newTodo: Todo = {
        id: Date.now(),
        text: newTodoText.trim(),
        completed: false,
        createdAt: new Date(),
      };
      updateTodos([...todos, newTodo]);
      setNewTodoText("");
    }
  };

  const toggleTodo = (id: number) => {
    updateTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: number) => {
    updateTodos(todos.filter((todo) => todo.id !== id));
  };

  const clearCompleted = () => {
    updateTodos(todos.filter((todo) => !todo.completed));
  };

  const filteredTodos = todos.filter((todo) => {
    switch (filter) {
      case "active":
        return !todo.completed;
      case "completed":
        return todo.completed;
      default:
        return true;
    }
  });

  const activeTodoCount = todos.filter((todo) => !todo.completed).length;
  const completedTodoCount = todos.filter((todo) => todo.completed).length;

  return (
    <div data-testid="todo-list" style={{ maxWidth: "500px" }}>
      {/* 添加新待办事项 */}
      <div style={{ marginBottom: "16px", display: "flex", gap: "8px" }}>
        <input
          data-testid="new-todo-input"
          type="text"
          value={newTodoText}
          onChange={(e) => setNewTodoText(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && addTodo()}
          placeholder="添加新的待办事项..."
          style={{
            flex: 1,
            padding: "8px",
            border: "1px solid #ddd",
            borderRadius: "4px",
          }}
        />
        <button
          data-testid="add-todo-button"
          onClick={addTodo}
          disabled={!newTodoText.trim()}
          style={{
            padding: "8px 16px",
            backgroundColor: newTodoText.trim() ? "#51cf66" : "#ddd",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: newTodoText.trim() ? "pointer" : "not-allowed",
          }}
        >
          添加
        </button>
      </div>

      {/* 过滤器 */}
      <div style={{ marginBottom: "16px", display: "flex", gap: "8px" }}>
        {(["all", "active", "completed"] as const).map((filterType) => (
          <button
            key={filterType}
            data-testid={`filter-${filterType}`}
            onClick={() => setFilter(filterType)}
            style={{
              padding: "4px 12px",
              backgroundColor: filter === filterType ? "#74c0fc" : "#f8f9fa",
              color: filter === filterType ? "white" : "#495057",
              border: "1px solid #dee2e6",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            {filterType === "all"
              ? "全部"
              : filterType === "active"
              ? "进行中"
              : "已完成"}
          </button>
        ))}
      </div>

      {/* 统计信息 */}
      <div
        data-testid="todo-stats"
        style={{
          marginBottom: "16px",
          padding: "8px",
          backgroundColor: "#f8f9fa",
          borderRadius: "4px",
          fontSize: "14px",
        }}
      >
        总计: {todos.length} | 进行中: {activeTodoCount} | 已完成:{" "}
        {completedTodoCount}
      </div>

      {/* 待办事项列表 */}
      <div data-testid="todo-items">
        {filteredTodos.length === 0 ? (
          <div
            data-testid="empty-message"
            style={{
              textAlign: "center",
              color: "#666",
              padding: "20px",
              fontStyle: "italic",
            }}
          >
            {filter === "all"
              ? "暂无待办事项"
              : filter === "active"
              ? "暂无进行中的事项"
              : "暂无已完成的事项"}
          </div>
        ) : (
          filteredTodos.map((todo) => (
            <div
              key={todo.id}
              data-testid={`todo-item-${todo.id}`}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "12px",
                border: "1px solid #dee2e6",
                borderRadius: "4px",
                marginBottom: "8px",
                backgroundColor: todo.completed ? "#f8f9fa" : "white",
              }}
            >
              <input
                data-testid={`todo-checkbox-${todo.id}`}
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
                style={{ marginRight: "12px" }}
              />
              <span
                data-testid={`todo-text-${todo.id}`}
                style={{
                  flex: 1,
                  textDecoration: todo.completed ? "line-through" : "none",
                  color: todo.completed ? "#666" : "#000",
                }}
              >
                {todo.text}
              </span>
              <button
                data-testid={`delete-todo-${todo.id}`}
                onClick={() => deleteTodo(todo.id)}
                style={{
                  padding: "4px 8px",
                  backgroundColor: "#ff6b6b",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                删除
              </button>
            </div>
          ))
        )}
      </div>

      {/* 清除已完成 */}
      {completedTodoCount > 0 && (
        <div style={{ marginTop: "16px", textAlign: "center" }}>
          <button
            data-testid="clear-completed-button"
            onClick={clearCompleted}
            style={{
              padding: "8px 16px",
              backgroundColor: "#868e96",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            清除已完成 ({completedTodoCount})
          </button>
        </div>
      )}
    </div>
  );
};
