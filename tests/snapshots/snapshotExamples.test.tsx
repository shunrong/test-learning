/**
 * 快照测试示例 - 演示快照测试的各种用法和最佳实践
 */

import React from "react";
import { render } from "@testing-library/react";
import { Counter } from "@/components/Counter";
import { UserProfile } from "@/components/UserProfile";
import { TodoList } from "@/components/TodoList";

describe("快照测试示例", () => {
  describe("1. 基础快照测试", () => {
    it("Counter 组件默认状态快照", () => {
      const { container } = render(<Counter />);
      expect(container.firstChild).toMatchSnapshot();
    });

    it("Counter 组件带参数快照", () => {
      const { container } = render(
        <Counter initialValue={10} min={0} max={20} step={2} />
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it("UserProfile 组件在线状态快照", () => {
      const { container } = render(
        <UserProfile
          name="张三"
          email="zhangsan@example.com"
          avatar="https://example.com/avatar.jpg"
          isActive={true}
        />
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it("UserProfile 组件离线状态快照", () => {
      const { container } = render(
        <UserProfile name="李四" email="lisi@example.com" isActive={false} />
      );
      expect(container.firstChild).toMatchSnapshot();
    });
  });

  describe("2. 条件渲染快照", () => {
    it("有头像 vs 无头像的快照对比", () => {
      // 有头像
      const { container: withAvatar } = render(
        <UserProfile
          name="用户A"
          email="usera@example.com"
          avatar="https://example.com/avatar.jpg"
        />
      );
      expect(withAvatar.firstChild).toMatchSnapshot("用户信息-有头像");

      // 无头像
      const { container: withoutAvatar } = render(
        <UserProfile name="用户B" email="userb@example.com" />
      );
      expect(withoutAvatar.firstChild).toMatchSnapshot("用户信息-无头像");
    });

    it("显示/隐藏编辑按钮的快照", () => {
      const props = {
        name: "测试用户",
        email: "test@example.com",
      };

      // 显示编辑按钮
      const { container: withButton } = render(
        <UserProfile {...props} showEditButton={true} />
      );
      expect(withButton.firstChild).toMatchSnapshot("用户信息-显示编辑按钮");

      // 隐藏编辑按钮
      const { container: withoutButton } = render(
        <UserProfile {...props} showEditButton={false} />
      );
      expect(withoutButton.firstChild).toMatchSnapshot("用户信息-隐藏编辑按钮");
    });
  });

  describe("3. 列表组件快照", () => {
    const sampleTodos = [
      {
        id: 1,
        text: "学习React测试",
        completed: false,
        createdAt: new Date("2023-06-15T10:00:00Z"),
      },
      {
        id: 2,
        text: "编写单元测试",
        completed: true,
        createdAt: new Date("2023-06-15T11:00:00Z"),
      },
      {
        id: 3,
        text: "掌握快照测试",
        completed: false,
        createdAt: new Date("2023-06-15T12:00:00Z"),
      },
    ];

    it("空待办列表快照", () => {
      const { container } = render(<TodoList initialTodos={[]} />);
      expect(container.firstChild).toMatchSnapshot();
    });

    it("有数据的待办列表快照", () => {
      const { container } = render(<TodoList initialTodos={sampleTodos} />);
      expect(container.firstChild).toMatchSnapshot();
    });

    it("只有已完成任务的列表快照", () => {
      const completedTodos = sampleTodos.filter((todo) => todo.completed);
      const { container } = render(<TodoList initialTodos={completedTodos} />);
      expect(container.firstChild).toMatchSnapshot();
    });
  });

  describe("4. 内联快照测试", () => {
    it("简单文本内容的内联快照", () => {
      const greeting = (name: string) => `你好, ${name}!`;

      expect(greeting("世界")).toMatchInlineSnapshot(`"你好, 世界!"`);
    });

    it("对象的内联快照", () => {
      const userInfo = {
        id: 1,
        name: "张三",
        email: "zhangsan@example.com",
        role: "admin",
        createdAt: new Date("2023-06-15T10:00:00Z"),
        settings: {
          theme: "dark",
          language: "zh-CN",
          notifications: true,
        },
      };

      expect(userInfo).toMatchInlineSnapshot(`
        {
          "createdAt": 2023-06-15T10:00:00.000Z,
          "email": "zhangsan@example.com",
          "id": 1,
          "name": "张三",
          "role": "admin",
          "settings": {
            "language": "zh-CN",
            "notifications": true,
            "theme": "dark",
          },
        }
      `);
    });

    it("数组的内联快照", () => {
      const numbers = [1, 2, 3].map((n) => n * 2);

      expect(numbers).toMatchInlineSnapshot(`
        [
          2,
          4,
          6,
        ]
      `);
    });
  });

  describe("5. 自定义序列化器示例", () => {
    // 自定义序列化器用于处理特殊对象
    it("Date 对象快照（使用自定义序列化）", () => {
      const event = {
        name: "会议",
        date: new Date("2023-06-15T14:30:00Z"),
        attendees: ["张三", "李四"],
      };

      // 可以在 jest.config.js 中配置全局序列化器
      // 或者在这里进行数据预处理
      const serializedEvent = {
        ...event,
        date: event.date.toISOString(),
      };

      expect(serializedEvent).toMatchSnapshot();
    });

    it("函数属性快照（需要特殊处理）", () => {
      const component = {
        name: "Button",
        props: {
          onClick: "function", // 函数不能直接序列化
          disabled: false,
          children: "点击我",
        },
      };

      expect(component).toMatchSnapshot();
    });
  });

  describe("6. 快照更新场景", () => {
    // 这些测试展示何时需要更新快照

    it("样式变化会影响快照", () => {
      const StyledComponent = ({ className }: { className?: string }) => (
        <div className={className} style={{ padding: "10px", margin: "5px" }}>
          样式化组件
        </div>
      );

      const { container } = render(<StyledComponent className="test-class" />);
      expect(container.firstChild).toMatchSnapshot();
    });

    it("文案变化会影响快照", () => {
      const MessageComponent = ({ type }: { type: "success" | "error" }) => (
        <div className={`message ${type}`}>
          {type === "success" ? "操作成功！" : "操作失败，请重试"}
        </div>
      );

      const { container: successContainer } = render(
        <MessageComponent type="success" />
      );
      expect(successContainer.firstChild).toMatchSnapshot("成功消息");

      const { container: errorContainer } = render(
        <MessageComponent type="error" />
      );
      expect(errorContainer.firstChild).toMatchSnapshot("错误消息");
    });
  });

  describe("7. 快照测试最佳实践", () => {
    it("使用描述性的快照名称", () => {
      const { container } = render(
        <Counter initialValue={5} min={0} max={10} />
      );

      // 好的做法：使用描述性名称
      expect(container.firstChild).toMatchSnapshot("计数器-初始值5-范围0到10");
    });

    it("避免快照过于庞大", () => {
      // 只测试特定部分，而不是整个应用
      const { getByTestId } = render(
        <UserProfile name="测试" email="test@example.com" />
      );

      // 只快照特定元素
      expect(getByTestId("user-name")).toMatchSnapshot("用户名称元素");
      expect(getByTestId("user-email")).toMatchSnapshot("用户邮箱元素");
    });

    it("处理动态内容", () => {
      // 对于包含时间戳等动态内容的组件
      const DynamicComponent = () => (
        <div>
          <h1>当前时间</h1>
          <p data-testid="timestamp">
            {/* 在实际测试中，应该 mock Date.now() */}
            2023-06-15T10:00:00Z
          </p>
        </div>
      );

      const { container } = render(<DynamicComponent />);
      expect(container.firstChild).toMatchSnapshot();
    });

    it("组合组件的快照", () => {
      const Dashboard = () => (
        <div className="dashboard">
          <header>
            <h1>仪表板</h1>
          </header>
          <main>
            <UserProfile name="管理员" email="admin@example.com" />
            <Counter initialValue={0} max={100} />
          </main>
        </div>
      );

      const { container } = render(<Dashboard />);
      expect(container.firstChild).toMatchSnapshot();
    });
  });

  describe("8. 序列化和属性快照", () => {
    it("React 元素属性快照", () => {
      const element = (
        <button type="button" disabled className="btn btn-primary">
          提交
        </button>
      );

      // 快照 React 元素的 props
      expect(element.props).toMatchSnapshot();
    });

    it("组件 props 快照", () => {
      const props = {
        name: "张三",
        email: "zhangsan@example.com",
        avatar: "https://example.com/avatar.jpg",
        isActive: true,
        showEditButton: true,
        onEdit: jest.fn(),
      };

      // 快照 props 对象（排除函数）
      const { onEdit, ...serializableProps } = props;
      expect(serializableProps).toMatchSnapshot();
    });
  });

  describe("9. 错误状态快照", () => {
    const ErrorBoundary = ({
      children,
      hasError,
    }: {
      children: React.ReactNode;
      hasError: boolean;
    }) => {
      if (hasError) {
        return (
          <div className="error-boundary">
            <h2>出错了！</h2>
            <p>请刷新页面重试</p>
          </div>
        );
      }
      return <>{children}</>;
    };

    it("错误边界组件快照", () => {
      const { container: normalContainer } = render(
        <ErrorBoundary hasError={false}>
          <div>正常内容</div>
        </ErrorBoundary>
      );
      expect(normalContainer.firstChild).toMatchSnapshot("正常状态");

      const { container: errorContainer } = render(
        <ErrorBoundary hasError={true}>
          <div>这不会被渲染</div>
        </ErrorBoundary>
      );
      expect(errorContainer.firstChild).toMatchSnapshot("错误状态");
    });
  });

  describe("10. 快照维护技巧", () => {
    it("版本化快照 - 记录重要变更", () => {
      // 这个快照记录了 v1.0 版本的 UI
      const { container } = render(
        <div className="app-header-v1">
          <h1>应用标题</h1>
          <nav>
            <a href="/">首页</a>
            <a href="/about">关于</a>
          </nav>
        </div>
      );

      expect(container.firstChild).toMatchSnapshot("应用头部-v1.0");
    });

    it("渐进式快照更新", () => {
      // 当组件发生变化时，可以创建新的快照来对比
      const OldButton = () => (
        <button className="old-button">旧按钮样式</button>
      );

      const NewButton = () => (
        <button className="new-button modern">新按钮样式</button>
      );

      // 保留旧版本快照作为参考
      const { container: oldContainer } = render(<OldButton />);
      expect(oldContainer.firstChild).toMatchSnapshot("按钮-旧版本");

      // 新版本快照
      const { container: newContainer } = render(<NewButton />);
      expect(newContainer.firstChild).toMatchSnapshot("按钮-新版本");
    });
  });
});
