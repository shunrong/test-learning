/**
 * UserProfile 组件测试 - 演示复杂组件状态和表单交互测试
 */

import React, { act } from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { UserProfile } from "../UserProfile";

describe("UserProfile组件", () => {
  const defaultProps = {
    name: "John Doe",
    email: "john@example.com",
    avatar: "https://example.com/avatar.jpg",
  };

  describe("基础渲染", () => {
    it("应该渲染用户信息", () => {
      render(<UserProfile {...defaultProps} />);

      expect(screen.getByTestId("user-profile")).toBeInTheDocument();
      expect(screen.getByTestId("user-name")).toHaveTextContent("John Doe");
      expect(screen.getByTestId("user-email")).toHaveTextContent(
        "john@example.com"
      );
      expect(screen.getByTestId("user-avatar")).toBeInTheDocument();
    });

    it("应该显示头像图片", () => {
      render(<UserProfile {...defaultProps} />);

      const avatar = screen.getByTestId("user-avatar") as HTMLImageElement;
      expect(avatar).toHaveAttribute("src", "https://example.com/avatar.jpg");
      expect(avatar).toHaveAttribute("alt", "John Doe的头像");
    });

    it("没有头像时应该显示默认头像", () => {
      render(<UserProfile name="Jane" email="jane@example.com" />);

      expect(screen.getByTestId("default-avatar")).toBeInTheDocument();
      expect(screen.getByTestId("default-avatar")).toHaveTextContent("J");
      expect(screen.queryByTestId("user-avatar")).not.toBeInTheDocument();
    });

    it("应该显示在线状态", () => {
      const { rerender } = render(
        <UserProfile {...defaultProps} isActive={true} />
      );

      expect(screen.getByTestId("user-status")).toHaveTextContent("在线");

      rerender(<UserProfile {...defaultProps} isActive={false} />);
      expect(screen.getByTestId("user-status")).toHaveTextContent("离线");
    });

    it("默认应该显示为在线状态", () => {
      render(<UserProfile {...defaultProps} />);

      expect(screen.getByTestId("user-status")).toHaveTextContent("在线");
    });

    it("应该显示编辑按钮", () => {
      render(<UserProfile {...defaultProps} />);

      expect(screen.getByTestId("edit-button")).toBeInTheDocument();
    });

    it("可以隐藏编辑按钮", () => {
      render(<UserProfile {...defaultProps} showEditButton={false} />);

      expect(screen.queryByTestId("edit-button")).not.toBeInTheDocument();
    });
  });

  describe("头像处理", () => {
    it("头像加载失败时应该显示默认头像", async () => {
      render(<UserProfile {...defaultProps} />);

      const avatar = screen.getByTestId("user-avatar");

      // 模拟图片加载失败
      fireEvent.error(avatar);

      await waitFor(() => {
        expect(screen.getByTestId("default-avatar")).toBeInTheDocument();
      });

      expect(screen.queryByTestId("user-avatar")).not.toBeInTheDocument();
      expect(screen.getByTestId("default-avatar")).toHaveTextContent("J");
    });

    it("默认头像应该显示名称首字母", () => {
      const { rerender } = render(
        <UserProfile name="alice" email="alice@example.com" />
      );

      expect(screen.getByTestId("default-avatar")).toHaveTextContent("A");

      rerender(<UserProfile name="bob smith" email="bob@example.com" />);
      expect(screen.getByTestId("default-avatar")).toHaveTextContent("B");

      rerender(<UserProfile name="123test" email="test@example.com" />);
      expect(screen.getByTestId("default-avatar")).toHaveTextContent("1");
    });
  });

  describe("编辑功能", () => {
    it("点击编辑按钮应该进入编辑模式", async () => {
      const user = userEvent.setup();
      render(<UserProfile {...defaultProps} />);

      await act(async () => {
        await user.click(screen.getByTestId("edit-button"));
      });

      expect(screen.getByTestId("user-profile-edit")).toBeInTheDocument();
      expect(screen.getByTestId("edit-name-input")).toBeInTheDocument();
      expect(screen.getByTestId("edit-email-input")).toBeInTheDocument();
      expect(screen.getByTestId("save-button")).toBeInTheDocument();
      expect(screen.getByTestId("cancel-button")).toBeInTheDocument();
    });

    it("编辑模式应该预填充当前值", async () => {
      const user = userEvent.setup();
      render(<UserProfile {...defaultProps} />);

      await act(async () => {
        await user.click(screen.getByTestId("edit-button"));
      });

      const nameInput = screen.getByTestId(
        "edit-name-input"
      ) as HTMLInputElement;
      const emailInput = screen.getByTestId(
        "edit-email-input"
      ) as HTMLInputElement;

      expect(nameInput.value).toBe("John Doe");
      expect(emailInput.value).toBe("john@example.com");
    });

    it("应该能够修改输入值", async () => {
      const user = userEvent.setup();
      render(<UserProfile {...defaultProps} />);

      await act(async () => {
        await user.click(screen.getByTestId("edit-button"));
      });

      const nameInput = screen.getByTestId("edit-name-input");
      const emailInput = screen.getByTestId("edit-email-input");

      await act(async () => {
        await user.clear(nameInput);
        await user.type(nameInput, "Jane Smith");

        await user.clear(emailInput);
        await user.type(emailInput, "jane.smith@example.com");
      });

      expect(nameInput).toHaveValue("Jane Smith");
      expect(emailInput).toHaveValue("jane.smith@example.com");
    });

    it("保存应该调用onEdit回调并退出编辑模式", async () => {
      const user = userEvent.setup();
      const onEdit = jest.fn();
      render(<UserProfile {...defaultProps} onEdit={onEdit} />);

      await act(async () => {
        await user.click(screen.getByTestId("edit-button"));
      });

      const nameInput = screen.getByTestId("edit-name-input");
      await act(async () => {
        await user.clear(nameInput);
        await user.type(nameInput, "Updated Name");
      });

      await act(async () => {
        await user.click(screen.getByTestId("save-button"));
      });

      expect(onEdit).toHaveBeenCalledWith({
        name: "Updated Name",
        email: "john@example.com",
      });

      // 应该退出编辑模式
      expect(screen.getByTestId("user-profile")).toBeInTheDocument();
      expect(screen.queryByTestId("user-profile-edit")).not.toBeInTheDocument();
    });

    it("取消应该恢复原始值并退出编辑模式", async () => {
      const user = userEvent.setup();
      const onEdit = jest.fn();
      render(<UserProfile {...defaultProps} onEdit={onEdit} />);

      await act(async () => {
        await user.click(screen.getByTestId("edit-button"));
      });

      // 修改值
      const nameInput = screen.getByTestId("edit-name-input");
      await act(async () => {
        await user.clear(nameInput);
        await user.type(nameInput, "Changed Name");
      });

      // 取消
      await act(async () => {
        await user.click(screen.getByTestId("cancel-button"));
      });

      expect(onEdit).not.toHaveBeenCalled();

      // 应该退出编辑模式
      expect(screen.getByTestId("user-profile")).toBeInTheDocument();

      // 再次进入编辑模式，值应该是原始值
      await act(async () => {
        await user.click(screen.getByTestId("edit-button"));
      });
      const nameInputAfterCancel = screen.getByTestId(
        "edit-name-input"
      ) as HTMLInputElement;
      expect(nameInputAfterCancel.value).toBe("John Doe");
    });
  });

  describe("样式和布局", () => {
    it("激活状态应该影响容器样式", () => {
      const { rerender } = render(
        <UserProfile {...defaultProps} isActive={true} />
      );

      const container = screen.getByTestId("user-profile");
      expect(container).toHaveStyle({ backgroundColor: "#fff" });

      rerender(<UserProfile {...defaultProps} isActive={false} />);
      expect(container).toHaveStyle({ backgroundColor: "#f5f5f5" });
    });

    it("状态指示器应该有正确的样式", () => {
      const { rerender } = render(
        <UserProfile {...defaultProps} isActive={true} />
      );

      const status = screen.getByTestId("user-status");
      expect(status).toHaveStyle({ backgroundColor: "#51cf66" });

      rerender(<UserProfile {...defaultProps} isActive={false} />);
      expect(status).toHaveStyle({ backgroundColor: "#868e96" });
    });
  });

  describe("表单验证", () => {
    it("输入框应该有正确的类型", async () => {
      const user = userEvent.setup();
      render(<UserProfile {...defaultProps} />);

      await act(async () => {
        await user.click(screen.getByTestId("edit-button"));
      });

      const nameInput = screen.getByTestId("edit-name-input");
      const emailInput = screen.getByTestId("edit-email-input");

      expect(nameInput).toHaveAttribute("type", "text");
      expect(emailInput).toHaveAttribute("type", "email");
    });
  });

  describe("键盘交互", () => {
    it("应该支持Tab键导航", async () => {
      const user = userEvent.setup();
      render(<UserProfile {...defaultProps} />);

      await act(async () => {
        await user.click(screen.getByTestId("edit-button"));
      });

      const nameInput = screen.getByTestId("edit-name-input");
      const emailInput = screen.getByTestId("edit-email-input");
      const saveButton = screen.getByTestId("save-button");
      const cancelButton = screen.getByTestId("cancel-button");

      // 测试Tab键顺序
      await user.tab();
      expect(nameInput).toHaveFocus();

      await user.tab();
      expect(emailInput).toHaveFocus();

      await user.tab();
      expect(saveButton).toHaveFocus();

      await user.tab();
      expect(cancelButton).toHaveFocus();
    });

    it("应该支持Enter键保存", async () => {
      const user = userEvent.setup();
      const onEdit = jest.fn();
      render(<UserProfile {...defaultProps} onEdit={onEdit} />);

      await act(async () => {
        await user.click(screen.getByTestId("edit-button"));
      });

      const nameInput = screen.getByTestId("edit-name-input");
      await act(async () => {
        await user.clear(nameInput);
        await user.type(nameInput, "New Name{enter}");
      });

      // 注意：在这个例子中我们没有实现Enter键保存功能
      // 这个测试演示了如何测试键盘事件
      expect(onEdit).not.toHaveBeenCalled();
    });
  });

  describe("Props变化处理", () => {
    it("Props变化时应该更新显示", () => {
      const { rerender } = render(<UserProfile {...defaultProps} />);

      expect(screen.getByTestId("user-name")).toHaveTextContent("John Doe");

      rerender(<UserProfile {...defaultProps} name="Jane Smith" />);
      expect(screen.getByTestId("user-name")).toHaveTextContent("Jane Smith");
    });

    it("编辑模式下Props变化不应该影响表单", async () => {
      const user = userEvent.setup();
      const { rerender } = render(<UserProfile {...defaultProps} />);

      await act(async () => {
        await user.click(screen.getByTestId("edit-button"));
      });

      // 在表单中修改值
      const nameInput = screen.getByTestId("edit-name-input");
      await act(async () => {
        await user.clear(nameInput);
        await user.type(nameInput, "Form Value");
      });

      // 改变Props
      rerender(<UserProfile {...defaultProps} name="Props Value" />);

      // 表单值应该保持不变
      expect(nameInput).toHaveValue("Form Value");
    });
  });

  describe("边界情况", () => {
    it("应该处理空名称", () => {
      render(<UserProfile name="" email="test@example.com" />);

      expect(screen.getByTestId("user-name")).toHaveTextContent("");
      expect(screen.getByTestId("default-avatar")).toHaveTextContent("");
    });

    it("应该处理特殊字符", () => {
      const specialName = 'John "Johnny" O\'Connor <test@example.com>';
      render(<UserProfile name={specialName} email="john@example.com" />);

      expect(screen.getByTestId("user-name")).toHaveTextContent(specialName);
    });

    it("应该处理长文本", () => {
      const longName = "A".repeat(100);
      const longEmail = "a".repeat(50) + "@" + "b".repeat(50) + ".com";

      render(<UserProfile name={longName} email={longEmail} />);

      expect(screen.getByTestId("user-name")).toHaveTextContent(longName);
      expect(screen.getByTestId("user-email")).toHaveTextContent(longEmail);
    });
  });

  describe("无障碍性", () => {
    it("头像应该有适当的alt文本", () => {
      render(<UserProfile {...defaultProps} />);

      const avatar = screen.getByTestId("user-avatar");
      expect(avatar).toHaveAttribute("alt", "John Doe的头像");
    });

    it("表单标签应该正确关联", async () => {
      const user = userEvent.setup();
      render(<UserProfile {...defaultProps} />);

      await act(async () => {
        await user.click(screen.getByTestId("edit-button"));
      });

      // 检查label和input的关联
      expect(screen.getByLabelText("姓名:")).toBeInTheDocument();
      expect(screen.getByLabelText("邮箱:")).toBeInTheDocument();
    });
  });

  describe("快照测试", () => {
    it("应该匹配默认状态快照", () => {
      const { container } = render(<UserProfile {...defaultProps} />);
      expect(container.firstChild).toMatchSnapshot();
    });

    it("应该匹配编辑状态快照", async () => {
      const user = userEvent.setup();
      const { container } = render(<UserProfile {...defaultProps} />);

      await act(async () => {
        await user.click(screen.getByTestId("edit-button"));
      });
      expect(container.firstChild).toMatchSnapshot();
    });

    it("应该匹配离线状态快照", () => {
      const { container } = render(
        <UserProfile {...defaultProps} isActive={false} />
      );
      expect(container.firstChild).toMatchSnapshot();
    });
  });

  describe("错误边界", () => {
    // 这里可以测试错误边界的情况
    // 例如：onEdit回调抛出错误时的处理

    it("onEdit回调错误不应该崩溃组件", async () => {
      const user = userEvent.setup();
      const onEdit = jest.fn().mockImplementation(() => {
        throw new Error("Save failed");
      });

      // 监听console.error
      const consoleSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});

      render(<UserProfile {...defaultProps} onEdit={onEdit} />);

      await act(async () => {
        await user.click(screen.getByTestId("edit-button"));
      });

      // 应该不会因为回调错误而崩溃
      await act(async () => {
        await user.click(screen.getByTestId("save-button"));
      });

      // 验证错误被记录
      expect(consoleSpy).toHaveBeenCalledWith(
        "Error in onEdit callback:",
        expect.any(Error)
      );

      // 验证组件仍然正常工作（应该退出编辑模式）
      expect(screen.getByTestId("user-profile")).toBeInTheDocument();
      expect(screen.queryByTestId("user-profile-edit")).not.toBeInTheDocument();

      consoleSpy.mockRestore();
    });
  });

  describe("性能测试", () => {
    it("频繁的编辑操作应该性能良好", async () => {
      const user = userEvent.setup();
      const onEdit = jest.fn();
      render(<UserProfile {...defaultProps} onEdit={onEdit} />);

      const start = performance.now();

      // 执行多次编辑操作
      for (let i = 0; i < 10; i++) {
        await act(async () => {
          await user.click(screen.getByTestId("edit-button"));
        });
        await act(async () => {
          await user.click(screen.getByTestId("cancel-button"));
        });
      }

      const end = performance.now();

      expect(end - start).toBeLessThan(1000); // 应该在1秒内完成
    });
  });
});
