import React, { useState } from "react";
import { Counter } from "@/components/Counter";
import { UserProfile } from "@/components/UserProfile";
import { TodoList } from "@/components/TodoList";
import { ApiExample } from "@/components/ApiExample";
import { User } from "@/types";

const App: React.FC = () => {
  const [userInfo, setUserInfo] = useState({
    name: "张三",
    email: "zhangsan@example.com",
    avatar: "https://via.placeholder.com/100",
  });

  const handleUserEdit = (updatedUser: Partial<User>) => {
    setUserInfo((prev) => ({ ...prev, ...updatedUser }));
  };

  return (
    <div
      style={{
        padding: "20px",
        fontFamily: "Arial, sans-serif",
        width: "80%",
        maxWidth: "800px",
        margin: "32px auto",
      }}
    >
      <h1>React Testing Learning 示例应用</h1>
      <p>这个应用包含了各种测试场景的示例组件</p>

      <div style={{ marginBottom: "30px" }}>
        <h2>1. 基础计数器组件 (单元测试示例)</h2>
        <Counter />
      </div>

      <div style={{ marginBottom: "30px" }}>
        <h2>2. 用户信息组件 (Props 和状态测试)</h2>
        <UserProfile
          name={userInfo.name}
          email={userInfo.email}
          avatar={userInfo.avatar}
          onEdit={handleUserEdit}
        />
      </div>

      <div style={{ marginBottom: "30px" }}>
        <h2>3. 待办事项列表 (列表渲染和交互测试)</h2>
        <TodoList />
      </div>

      <div style={{ marginBottom: "30px" }}>
        <h2>4. API 调用示例 (异步测试和 Mock)</h2>
        <ApiExample />
      </div>
    </div>
  );
};

export default App;
