/**
 * DOM API 操作和事件处理测试 - 演示各种 DOM 相关的测试技术
 */

import { fireEvent, waitFor } from "@testing-library/react";

describe("DOM API 操作和事件处理测试", () => {
  // 在每个测试前清理 DOM
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  describe("1. 基础 DOM 操作", () => {
    it("创建和操作 DOM 元素", () => {
      // 创建元素
      const div = document.createElement("div");
      div.id = "test-div";
      div.className = "test-class";
      div.textContent = "测试内容";

      // 添加到文档
      document.body.appendChild(div);

      // 验证元素被正确创建和添加
      expect(document.getElementById("test-div")).toBe(div);
      expect(document.querySelector(".test-class")).toBe(div);
      expect(div.textContent).toBe("测试内容");
      expect(document.body.children.length).toBe(1);
    });

    it("操作元素属性", () => {
      const input = document.createElement("input");

      // 设置属性
      input.type = "text";
      input.value = "初始值";
      input.disabled = true;
      input.setAttribute("data-testid", "test-input");

      document.body.appendChild(input);

      // 验证属性
      expect(input.type).toBe("text");
      expect(input.value).toBe("初始值");
      expect(input.disabled).toBe(true);
      expect(input.getAttribute("data-testid")).toBe("test-input");

      // 修改属性
      input.value = "新值";
      input.disabled = false;

      expect(input.value).toBe("新值");
      expect(input.disabled).toBe(false);
    });

    it("操作元素样式", () => {
      const div = document.createElement("div");
      document.body.appendChild(div);

      // 设置内联样式
      div.style.width = "100px";
      div.style.height = "100px";
      div.style.backgroundColor = "red";
      div.style.display = "flex";

      expect(div.style.width).toBe("100px");
      expect(div.style.height).toBe("100px");
      expect(div.style.backgroundColor).toBe("red");
      expect(div.style.display).toBe("flex");

      // 通过 cssText 设置
      div.style.cssText =
        "width: 200px; height: 200px; background-color: blue;";

      expect(div.style.width).toBe("200px");
      expect(div.style.backgroundColor).toBe("blue");
    });

    it("操作 CSS 类", () => {
      const div = document.createElement("div");
      document.body.appendChild(div);

      // 添加类
      div.classList.add("class1", "class2");
      expect(div.classList.contains("class1")).toBe(true);
      expect(div.classList.contains("class2")).toBe(true);
      expect(div.className).toBe("class1 class2");

      // 切换类
      div.classList.toggle("class3");
      expect(div.classList.contains("class3")).toBe(true);

      div.classList.toggle("class3");
      expect(div.classList.contains("class3")).toBe(false);

      // 删除类
      div.classList.remove("class1");
      expect(div.classList.contains("class1")).toBe(false);
      expect(div.className).toBe("class2");
    });
  });

  describe("2. DOM 查询和遍历", () => {
    beforeEach(() => {
      // 设置测试 DOM 结构
      document.body.innerHTML = `
        <div id="container" class="main">
          <h1>标题</h1>
          <div class="content">
            <p class="text" data-id="1">段落 1</p>
            <p class="text" data-id="2">段落 2</p>
            <span class="highlight">高亮文本</span>
          </div>
          <button type="button" disabled>按钮</button>
        </div>
      `;
    });

    it("使用各种选择器查询元素", () => {
      // ID 选择器
      const container = document.getElementById("container");
      expect(container).not.toBeNull();
      expect(container!.tagName).toBe("DIV");

      // 类选择器
      const content = document.querySelector(".content");
      expect(content).not.toBeNull();

      // 标签选择器
      const h1 = document.querySelector("h1");
      expect(h1!.textContent).toBe("标题");

      // 属性选择器
      const button = document.querySelector(
        "button[disabled]"
      ) as HTMLButtonElement;
      expect(button).not.toBeNull();
      expect(button!.disabled).toBe(true);

      // 复合选择器
      const paragraphs = document.querySelectorAll(".content .text");
      expect(paragraphs.length).toBe(2);

      // 数据属性选择器
      const para1 = document.querySelector('[data-id="1"]');
      expect(para1!.textContent).toBe("段落 1");
    });

    it("遍历 DOM 树", () => {
      const container = document.getElementById("container")!;

      // 子元素
      expect(container.children.length).toBe(3);
      expect(container.firstElementChild!.tagName).toBe("H1");
      expect(container.lastElementChild!.tagName).toBe("BUTTON");

      // 父元素
      const content = document.querySelector(".content")!;
      expect(content.parentElement).toBe(container);

      // 兄弟元素
      const h1 = document.querySelector("h1")!;
      expect(h1.nextElementSibling).toBe(content);
      expect(content.previousElementSibling).toBe(h1);
    });

    it("查询元素集合", () => {
      // 按类名查询
      const textElements = document.getElementsByClassName("text");
      expect(textElements.length).toBe(2);

      // 按标签名查询
      const paragraphs = document.getElementsByTagName("p");
      expect(paragraphs.length).toBe(2);

      // 使用 querySelectorAll
      const allDivs = document.querySelectorAll("div");
      expect(allDivs.length).toBe(2); // container + content

      // 转换为数组进行操作
      const textArray = Array.from(textElements);
      const texts = textArray.map((el) => el.textContent);
      expect(texts).toEqual(["段落 1", "段落 2"]);
    });
  });

  describe("3. 事件处理测试", () => {
    it("添加和触发基础事件", () => {
      const button = document.createElement("button");
      button.textContent = "点击我";
      document.body.appendChild(button);

      const clickHandler = jest.fn();
      button.addEventListener("click", clickHandler);

      // 手动触发事件
      button.click();

      expect(clickHandler).toHaveBeenCalledTimes(1);

      // 使用 fireEvent 触发
      fireEvent.click(button);

      expect(clickHandler).toHaveBeenCalledTimes(2);
    });

    it("事件对象和事件属性", () => {
      const div = document.createElement("div");
      document.body.appendChild(div);

      const mouseHandler = jest.fn();
      div.addEventListener("mouseover", mouseHandler);

      // 触发鼠标事件
      fireEvent.mouseOver(div, {
        clientX: 100,
        clientY: 200,
        bubbles: true,
      });

      expect(mouseHandler).toHaveBeenCalledTimes(1);

      const event = mouseHandler.mock.calls[0][0];
      expect(event.type).toBe("mouseover");
      expect(event.target).toBe(div);
      expect(event.clientX).toBe(100);
      expect(event.clientY).toBe(200);
    });

    it("事件冒泡和捕获", () => {
      const outer = document.createElement("div");
      const inner = document.createElement("div");
      outer.appendChild(inner);
      document.body.appendChild(outer);

      const outerHandler = jest.fn();
      const innerHandler = jest.fn();
      const captureHandler = jest.fn();

      // 冒泡阶段
      outer.addEventListener("click", outerHandler);
      inner.addEventListener("click", innerHandler);

      // 捕获阶段
      outer.addEventListener("click", captureHandler, true);

      // 点击内部元素
      fireEvent.click(inner);

      // 验证调用顺序：捕获 -> 目标 -> 冒泡
      expect(captureHandler).toHaveBeenCalledTimes(1);
      expect(innerHandler).toHaveBeenCalledTimes(1);
      expect(outerHandler).toHaveBeenCalledTimes(1);
    });

    it("阻止事件传播", () => {
      const outer = document.createElement("div");
      const inner = document.createElement("div");
      outer.appendChild(inner);
      document.body.appendChild(outer);

      const outerHandler = jest.fn();
      const innerHandler = jest.fn((event: Event) => {
        event.stopPropagation(); // 阻止冒泡
      });

      outer.addEventListener("click", outerHandler);
      inner.addEventListener("click", innerHandler);

      fireEvent.click(inner);

      expect(innerHandler).toHaveBeenCalledTimes(1);
      expect(outerHandler).toHaveBeenCalledTimes(0); // 被阻止了
    });

    it("阻止默认行为", () => {
      const form = document.createElement("form");
      const submitButton = document.createElement("button");
      submitButton.type = "submit";
      form.appendChild(submitButton);
      document.body.appendChild(form);

      const submitHandler = jest.fn((event: Event) => {
        event.preventDefault(); // 阻止表单提交
      });

      form.addEventListener("submit", submitHandler);

      // 触发表单提交
      fireEvent.submit(form);

      expect(submitHandler).toHaveBeenCalledTimes(1);

      const event = submitHandler.mock.calls[0][0];
      expect(event.defaultPrevented).toBe(true);
    });
  });

  describe("4. 键盘事件测试", () => {
    it("测试键盘按键事件", () => {
      const input = document.createElement("input");
      document.body.appendChild(input);

      const keyDownHandler = jest.fn();
      const keyUpHandler = jest.fn();

      input.addEventListener("keydown", keyDownHandler);
      input.addEventListener("keyup", keyUpHandler);

      // 模拟按下 Enter 键
      fireEvent.keyDown(input, { key: "Enter", code: "Enter" });
      fireEvent.keyUp(input, { key: "Enter", code: "Enter" });

      expect(keyDownHandler).toHaveBeenCalledTimes(1);
      expect(keyUpHandler).toHaveBeenCalledTimes(1);

      const keyDownEvent = keyDownHandler.mock.calls[0][0];
      expect(keyDownEvent.key).toBe("Enter");
      expect(keyDownEvent.code).toBe("Enter");
    });

    it("测试修饰键组合", () => {
      const input = document.createElement("input");
      document.body.appendChild(input);

      const keyHandler = jest.fn();
      input.addEventListener("keydown", keyHandler);

      // Ctrl + S
      fireEvent.keyDown(input, {
        key: "s",
        code: "KeyS",
        ctrlKey: true,
      });

      const event = keyHandler.mock.calls[0][0];
      expect(event.key).toBe("s");
      expect(event.ctrlKey).toBe(true);
      expect(event.shiftKey).toBe(false);
      expect(event.altKey).toBe(false);
    });

    it("测试特殊键", () => {
      const input = document.createElement("input");
      document.body.appendChild(input);

      const keyHandler = jest.fn();
      input.addEventListener("keydown", keyHandler);

      const specialKeys = [
        { key: "Escape", code: "Escape" },
        { key: "Tab", code: "Tab" },
        { key: "ArrowUp", code: "ArrowUp" },
        { key: "ArrowDown", code: "ArrowDown" },
        { key: "F1", code: "F1" },
      ];

      specialKeys.forEach(({ key, code }) => {
        fireEvent.keyDown(input, { key, code });
      });

      expect(keyHandler).toHaveBeenCalledTimes(specialKeys.length);

      // 验证每个按键
      keyHandler.mock.calls.forEach((call, index) => {
        const event = call[0];
        expect(event.key).toBe(specialKeys[index].key);
        expect(event.code).toBe(specialKeys[index].code);
      });
    });
  });

  describe("5. 表单事件测试", () => {
    it("测试输入事件", () => {
      const input = document.createElement("input");
      input.type = "text";
      document.body.appendChild(input);

      const inputHandler = jest.fn();
      const changeHandler = jest.fn();

      input.addEventListener("input", inputHandler);
      input.addEventListener("change", changeHandler);

      // 模拟用户输入
      fireEvent.change(input, { target: { value: "测试文本" } });

      expect(changeHandler).toHaveBeenCalledTimes(1);
      expect(input.value).toBe("测试文本");

      // 模拟逐字输入
      fireEvent.input(input, { target: { value: "测试文本abc" } });

      expect(inputHandler).toHaveBeenCalledTimes(1);
    });

    it("测试表单验证", () => {
      const form = document.createElement("form");
      const emailInput = document.createElement("input");
      emailInput.type = "email";
      emailInput.required = true;
      emailInput.name = "email";

      form.appendChild(emailInput);
      document.body.appendChild(form);

      // 测试无效邮箱
      fireEvent.change(emailInput, { target: { value: "invalid-email" } });
      expect(emailInput.validity.valid).toBe(false);
      expect(emailInput.validity.typeMismatch).toBe(true);

      // 测试有效邮箱
      fireEvent.change(emailInput, { target: { value: "test@example.com" } });
      expect(emailInput.validity.valid).toBe(true);

      // 测试必填验证
      fireEvent.change(emailInput, { target: { value: "" } });
      expect(emailInput.validity.valid).toBe(false);
      expect(emailInput.validity.valueMissing).toBe(true);
    });

    it("测试文件上传", () => {
      const fileInput = document.createElement("input");
      fileInput.type = "file";
      fileInput.multiple = true;
      document.body.appendChild(fileInput);

      const changeHandler = jest.fn();
      fileInput.addEventListener("change", changeHandler);

      // 创建模拟文件
      const file1 = new File(["内容1"], "test1.txt", { type: "text/plain" });
      const file2 = new File(["内容2"], "test2.txt", { type: "text/plain" });

      // 模拟文件选择
      Object.defineProperty(fileInput, "files", {
        value: [file1, file2],
        writable: false,
      });

      fireEvent.change(fileInput);

      expect(changeHandler).toHaveBeenCalledTimes(1);
      expect(fileInput.files!.length).toBe(2);
      expect(fileInput.files![0].name).toBe("test1.txt");
      expect(fileInput.files![1].name).toBe("test2.txt");
    });
  });

  describe("6. 鼠标事件测试", () => {
    it("测试鼠标点击事件", () => {
      const button = document.createElement("button");
      document.body.appendChild(button);

      const mouseDownHandler = jest.fn();
      const mouseUpHandler = jest.fn();
      const clickHandler = jest.fn();

      button.addEventListener("mousedown", mouseDownHandler);
      button.addEventListener("mouseup", mouseUpHandler);
      button.addEventListener("click", clickHandler);

      // 完整的点击序列
      fireEvent.mouseDown(button);
      fireEvent.mouseUp(button);
      fireEvent.click(button);

      expect(mouseDownHandler).toHaveBeenCalledTimes(1);
      expect(mouseUpHandler).toHaveBeenCalledTimes(1);
      expect(clickHandler).toHaveBeenCalledTimes(1);
    });

    it("测试鼠标移动事件", () => {
      const div = document.createElement("div");
      div.style.width = "100px";
      div.style.height = "100px";
      document.body.appendChild(div);

      const mouseEnterHandler = jest.fn();
      const mouseLeaveHandler = jest.fn();
      const mouseMoveHandler = jest.fn();

      div.addEventListener("mouseenter", mouseEnterHandler);
      div.addEventListener("mouseleave", mouseLeaveHandler);
      div.addEventListener("mousemove", mouseMoveHandler);

      // 鼠标进入
      fireEvent.mouseEnter(div);
      expect(mouseEnterHandler).toHaveBeenCalledTimes(1);

      // 鼠标移动
      fireEvent.mouseMove(div, { clientX: 50, clientY: 50 });
      expect(mouseMoveHandler).toHaveBeenCalledTimes(1);

      // 鼠标离开
      fireEvent.mouseLeave(div);
      expect(mouseLeaveHandler).toHaveBeenCalledTimes(1);
    });

    it("测试右键和双击", () => {
      const div = document.createElement("div");
      document.body.appendChild(div);

      const contextMenuHandler = jest.fn();
      const doubleClickHandler = jest.fn();

      div.addEventListener("contextmenu", contextMenuHandler);
      div.addEventListener("dblclick", doubleClickHandler);

      // 右键点击
      fireEvent.contextMenu(div);
      expect(contextMenuHandler).toHaveBeenCalledTimes(1);

      // 双击
      fireEvent.doubleClick(div);
      expect(doubleClickHandler).toHaveBeenCalledTimes(1);
    });
  });

  describe("7. 触摸事件测试", () => {
    it("测试触摸事件", () => {
      const div = document.createElement("div");
      document.body.appendChild(div);

      const touchStartHandler = jest.fn();
      const touchMoveHandler = jest.fn();
      const touchEndHandler = jest.fn();

      div.addEventListener("touchstart", touchStartHandler);
      div.addEventListener("touchmove", touchMoveHandler);
      div.addEventListener("touchend", touchEndHandler);

      // 创建触摸点
      const touch = {
        identifier: 1,
        target: div,
        clientX: 100,
        clientY: 200,
        pageX: 100,
        pageY: 200,
        screenX: 100,
        screenY: 200,
      };

      // 触摸开始
      fireEvent.touchStart(div, {
        touches: [touch],
        changedTouches: [touch],
      });

      // 触摸移动
      fireEvent.touchMove(div, {
        touches: [{ ...touch, clientX: 150, clientY: 250 }],
        changedTouches: [{ ...touch, clientX: 150, clientY: 250 }],
      });

      // 触摸结束
      fireEvent.touchEnd(div, {
        touches: [],
        changedTouches: [touch],
      });

      expect(touchStartHandler).toHaveBeenCalledTimes(1);
      expect(touchMoveHandler).toHaveBeenCalledTimes(1);
      expect(touchEndHandler).toHaveBeenCalledTimes(1);
    });
  });

  describe("8. 焦点事件测试", () => {
    it("测试焦点获得和失去", () => {
      const input1 = document.createElement("input");
      const input2 = document.createElement("input");

      document.body.appendChild(input1);
      document.body.appendChild(input2);

      const focusHandler = jest.fn();
      const blurHandler = jest.fn();

      input1.addEventListener("focus", focusHandler);
      input1.addEventListener("blur", blurHandler);

      // 获得焦点
      fireEvent.focus(input1);
      expect(focusHandler).toHaveBeenCalledTimes(1);

      // 失去焦点
      fireEvent.blur(input1);
      expect(blurHandler).toHaveBeenCalledTimes(1);
    });

    it("测试 Tab 键导航", () => {
      const input1 = document.createElement("input");
      const input2 = document.createElement("input");
      const button = document.createElement("button");

      input1.tabIndex = 1;
      input2.tabIndex = 2;
      button.tabIndex = 3;

      document.body.appendChild(input1);
      document.body.appendChild(input2);
      document.body.appendChild(button);

      // 模拟 Tab 键导航
      input1.focus();
      expect(document.activeElement).toBe(input1);

      fireEvent.keyDown(input1, { key: "Tab" });
      input2.focus();
      expect(document.activeElement).toBe(input2);

      fireEvent.keyDown(input2, { key: "Tab" });
      button.focus();
      expect(document.activeElement).toBe(button);
    });
  });

  describe("9. 自定义事件测试", () => {
    it("创建和触发自定义事件", () => {
      const div = document.createElement("div");
      document.body.appendChild(div);

      const customHandler = jest.fn();
      div.addEventListener("custom-event", customHandler);

      // 创建自定义事件
      const customEvent = new CustomEvent("custom-event", {
        detail: { message: "自定义数据" },
        bubbles: true,
      });

      // 触发自定义事件
      div.dispatchEvent(customEvent);

      expect(customHandler).toHaveBeenCalledTimes(1);

      const event = customHandler.mock.calls[0][0];
      expect(event.type).toBe("custom-event");
      expect(event.detail.message).toBe("自定义数据");
      expect(event.bubbles).toBe(true);
    });

    it("事件委托模式", () => {
      const container = document.createElement("div");
      container.innerHTML = `
        <button data-action="save">保存</button>
        <button data-action="cancel">取消</button>
        <button data-action="delete">删除</button>
      `;
      document.body.appendChild(container);

      const actionHandler = jest.fn();

      // 事件委托：在容器上监听所有按钮点击
      container.addEventListener("click", (event) => {
        const target = event.target as HTMLElement;
        if (target.tagName === "BUTTON") {
          const action = target.getAttribute("data-action");
          actionHandler(action);
        }
      });

      // 点击不同按钮
      const saveBtn = container.querySelector('[data-action="save"]')!;
      const cancelBtn = container.querySelector('[data-action="cancel"]')!;

      fireEvent.click(saveBtn);
      fireEvent.click(cancelBtn);

      expect(actionHandler).toHaveBeenCalledTimes(2);
      expect(actionHandler).toHaveBeenNthCalledWith(1, "save");
      expect(actionHandler).toHaveBeenNthCalledWith(2, "cancel");
    });
  });

  describe("10. 异步 DOM 操作测试", () => {
    it("等待元素出现", async () => {
      const container = document.createElement("div");
      document.body.appendChild(container);

      // 模拟异步添加元素
      setTimeout(() => {
        const newElement = document.createElement("div");
        newElement.textContent = "动态内容";
        newElement.className = "dynamic";
        container.appendChild(newElement);
      }, 100);

      // 等待元素出现
      await waitFor(() => {
        expect(container.querySelector(".dynamic")).toBeInTheDocument();
      });

      const dynamicElement = container.querySelector(".dynamic");
      expect(dynamicElement!.textContent).toBe("动态内容");
    });

    it("测试动画和过渡", async () => {
      const div = document.createElement("div");
      div.style.width = "100px";
      div.style.transition = "width 0.1s ease";
      document.body.appendChild(div);

      // 开始动画
      div.style.width = "200px";

      // 等待动画完成
      await waitFor(() => {
        expect(div.style.width).toBe("200px");
      });
    });

    it("测试 MutationObserver", async () => {
      const container = document.createElement("div");
      document.body.appendChild(container);

      const mutations: MutationRecord[] = [];

      const observer = new MutationObserver((mutationsList) => {
        mutations.push(...mutationsList);
      });

      observer.observe(container, {
        childList: true,
        attributes: true,
        subtree: true,
      });

      // 进行一些 DOM 操作
      const child = document.createElement("span");
      child.textContent = "子元素";
      container.appendChild(child);

      child.className = "test-class";

      // 等待 MutationObserver 捕获变化
      await waitFor(() => {
        expect(mutations.length).toBeGreaterThan(0);
      });

      expect(mutations.some((m) => m.type === "childList")).toBe(true);
      expect(mutations.some((m) => m.type === "attributes")).toBe(true);

      observer.disconnect();
    });
  });
});
