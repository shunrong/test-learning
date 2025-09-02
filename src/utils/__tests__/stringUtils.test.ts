/**
 * 字符串工具函数测试 - 演示字符串处理和正则表达式测试
 */

import {
  capitalize,
  reverseString,
  isPalindrome,
  isValidEmail,
  isValidPhone,
  isStrongPassword,
  formatPhoneNumber,
  truncateText,
  slugify,
  wordCount,
  characterCount,
  template,
} from "../stringUtils";

describe("stringUtils", () => {
  // 基础字符串操作
  describe("基础字符串操作", () => {
    describe("capitalize", () => {
      it("应该将首字母大写，其余小写", () => {
        expect(capitalize("hello")).toBe("Hello");
        expect(capitalize("WORLD")).toBe("World");
        expect(capitalize("hELLo WoRLD")).toBe("Hello world");
      });

      it("应该处理空字符串", () => {
        expect(capitalize("")).toBe("");
      });

      it("应该处理单个字符", () => {
        expect(capitalize("a")).toBe("A");
        expect(capitalize("A")).toBe("A");
      });

      it("应该处理特殊字符", () => {
        expect(capitalize("123abc")).toBe("123abc");
        expect(capitalize("!hello")).toBe("!hello");
      });
    });

    describe("reverseString", () => {
      it("应该正确反转字符串", () => {
        expect(reverseString("hello")).toBe("olleh");
        expect(reverseString("12345")).toBe("54321");
      });

      it("应该处理空字符串", () => {
        expect(reverseString("")).toBe("");
      });

      it("应该处理单个字符", () => {
        expect(reverseString("a")).toBe("a");
      });

      it("应该处理包含空格的字符串", () => {
        expect(reverseString("hello world")).toBe("dlrow olleh");
      });

      it("应该处理特殊字符", () => {
        expect(reverseString("a!@#$%^&*()z")).toBe("z)(*&^%$#@!a");
      });
    });

    describe("isPalindrome", () => {
      it("应该识别简单的回文", () => {
        expect(isPalindrome("aba")).toBe(true);
        expect(isPalindrome("racecar")).toBe(true);
        expect(isPalindrome("madam")).toBe(true);
      });

      it("应该识别非回文", () => {
        expect(isPalindrome("hello")).toBe(false);
        expect(isPalindrome("world")).toBe(false);
      });

      it("应该忽略大小写", () => {
        expect(isPalindrome("Aba")).toBe(true);
        expect(isPalindrome("RaceCar")).toBe(true);
      });

      it("应该忽略空格和标点", () => {
        expect(isPalindrome("A man a plan a canal Panama")).toBe(true);
        expect(isPalindrome("race a car")).toBe(false);
      });

      it("应该处理空字符串", () => {
        expect(isPalindrome("")).toBe(true);
      });

      it("应该处理数字", () => {
        expect(isPalindrome("12321")).toBe(true);
        expect(isPalindrome("12345")).toBe(false);
      });
    });
  });

  // 验证函数测试
  describe("验证函数", () => {
    describe("isValidEmail", () => {
      it("应该识别有效邮箱", () => {
        const validEmails = [
          "test@example.com",
          "user.name@domain.co.uk",
          "user+tag@example.org",
          "user123@test-domain.com",
        ];

        validEmails.forEach((email) => {
          expect(isValidEmail(email)).toBe(true);
        });
      });

      it("应该识别无效邮箱", () => {
        const invalidEmails = [
          "invalid-email",
          "@example.com",
          "user@",
          "user..name@example.com",
          "user name@example.com",
          "",
        ];

        invalidEmails.forEach((email) => {
          expect(isValidEmail(email)).toBe(false);
        });
      });
    });

    describe("isValidPhone", () => {
      it("应该识别有效的中国手机号", () => {
        const validPhones = [
          "13812345678",
          "15987654321",
          "18765432109",
          "19123456789",
        ];

        validPhones.forEach((phone) => {
          expect(isValidPhone(phone)).toBe(true);
        });
      });

      it("应该识别无效手机号", () => {
        const invalidPhones = [
          "12812345678", // 不是有效的开头
          "138123456789", // 太长
          "1381234567", // 太短
          "138-1234-5678", // 包含分隔符
          "abc12345678", // 包含字母
          "",
        ];

        invalidPhones.forEach((phone) => {
          expect(isValidPhone(phone)).toBe(false);
        });
      });
    });

    describe("isStrongPassword", () => {
      it("应该识别强密码", () => {
        const strongPasswords = [
          "Aa123456!",
          "MyP@ssw0rd",
          "C0mpl3x!P@ss",
          "S3cur3P@ssw0rd!",
        ];

        strongPasswords.forEach((password) => {
          expect(isStrongPassword(password)).toBe(true);
        });
      });

      it("应该识别弱密码", () => {
        const weakPasswords = [
          "12345678", // 只有数字
          "abcdefgh", // 只有小写字母
          "ABCDEFGH", // 只有大写字母
          "!@#$%^&*", // 只有特殊字符
          "Aa123456", // 缺少特殊字符
          "Aa1!", // 太短
          "",
        ];

        weakPasswords.forEach((password) => {
          expect(isStrongPassword(password)).toBe(false);
        });
      });
    });
  });

  // 格式化函数测试
  describe("格式化函数", () => {
    describe("formatPhoneNumber", () => {
      it("应该正确格式化手机号", () => {
        expect(formatPhoneNumber("13812345678")).toBe("138-1234-5678");
        expect(formatPhoneNumber("15987654321")).toBe("159-8765-4321");
      });

      it("应该清除非数字字符后格式化", () => {
        expect(formatPhoneNumber("138-1234-5678")).toBe("138-1234-5678");
        expect(formatPhoneNumber("138 1234 5678")).toBe("138-1234-5678");
        expect(formatPhoneNumber("(138)1234-5678")).toBe("138-1234-5678");
      });

      it("长度不正确时应该抛出错误", () => {
        expect(() => formatPhoneNumber("123456")).toThrow(
          "Invalid phone number length"
        );
        expect(() => formatPhoneNumber("123456789012")).toThrow();
      });
    });

    describe("truncateText", () => {
      it("应该截断长文本", () => {
        expect(truncateText("这是一个很长的文本", 5)).toBe("这是一个很...");
        expect(truncateText("Hello World", 5)).toBe("Hello...");
      });

      it("短文本应该保持不变", () => {
        expect(truncateText("短文本", 10)).toBe("短文本");
        expect(truncateText("Hello", 10)).toBe("Hello");
      });

      it("应该处理边界情况", () => {
        expect(truncateText("Hello", 5)).toBe("Hello");
        expect(truncateText("Hello", 0)).toBe("...");
        expect(truncateText("", 5)).toBe("");
      });
    });

    describe("slugify", () => {
      it("应该将文本转换为URL友好的slug", () => {
        expect(slugify("Hello World")).toBe("hello-world");
        expect(slugify("React Testing Learning")).toBe(
          "react-testing-learning"
        );
      });

      it("应该处理特殊字符", () => {
        expect(slugify("Hello, World!")).toBe("hello-world");
        expect(slugify("Test@Example.com")).toBe("testexamplecom");
      });

      it("应该处理多个空格和连字符", () => {
        expect(slugify("Hello   World")).toBe("hello-world");
        expect(slugify("Hello---World")).toBe("hello-world");
        expect(slugify("  Hello World  ")).toBe("hello-world");
      });

      it("应该处理中文", () => {
        expect(slugify("你好 世界")).toBe("你好-世界");
      });
    });
  });

  // 文本统计测试
  describe("文本统计", () => {
    describe("wordCount", () => {
      it("应该正确计算单词数", () => {
        expect(wordCount("Hello world")).toBe(2);
        expect(wordCount("React testing is important")).toBe(4);
      });

      it("应该处理多个空格", () => {
        expect(wordCount("Hello    world")).toBe(2);
        expect(wordCount("  Hello  world  ")).toBe(2);
      });

      it("应该处理空字符串", () => {
        expect(wordCount("")).toBe(0);
        expect(wordCount("   ")).toBe(0);
      });

      it("应该处理单个单词", () => {
        expect(wordCount("Hello")).toBe(1);
        expect(wordCount("  Hello  ")).toBe(1);
      });
    });

    describe("characterCount", () => {
      it("默认应该包含空格", () => {
        expect(characterCount("Hello world")).toBe(11);
        expect(characterCount("  Hello  ")).toBe(9);
      });

      it("可以选择不包含空格", () => {
        expect(characterCount("Hello world", false)).toBe(10);
        expect(characterCount("  Hello  ", false)).toBe(5);
      });

      it("应该处理空字符串", () => {
        expect(characterCount("")).toBe(0);
        expect(characterCount("", false)).toBe(0);
      });
    });
  });

  // 模板函数测试
  describe("template", () => {
    it("应该正确替换模板变量", () => {
      const template1 = "Hello {{name}}, welcome to {{place}}!";
      const data1 = { name: "John", place: "React Testing" };
      expect(template(template1, data1)).toBe(
        "Hello John, welcome to React Testing!"
      );
    });

    it("应该处理缺少的变量", () => {
      const template1 = "Hello {{name}}, age is {{age}}";
      const data1 = { name: "John" };
      expect(template(template1, data1)).toBe("Hello John, age is {{age}}");
    });

    it("应该处理空数据", () => {
      const template1 = "Hello {{name}}";
      expect(template(template1, {})).toBe("Hello {{name}}");
    });

    it("应该处理数字和布尔值", () => {
      const template1 = "Count: {{count}}, Active: {{active}}";
      const data1 = { count: 42, active: true };
      expect(template(template1, data1)).toBe("Count: 42, Active: true");
    });

    it("应该处理没有模板变量的字符串", () => {
      expect(template("Hello world", { name: "John" })).toBe("Hello world");
    });
  });

  // 边界情况和错误处理
  describe("边界情况测试", () => {
    it("应该处理 null 和 undefined（如果函数支持）", () => {
      // 注意：我们的函数期望字符串输入，所以这些测试会检查类型安全性
      // 在实际项目中，你可能想要添加类型检查或处理这些情况
      // 这些测试展示了如何测试意外输入
      // expect(() => capitalize(null)).toThrow();
      // expect(() => capitalize(undefined)).toThrow();
    });

    it("应该处理极长的字符串", () => {
      const longString = "a".repeat(10000);
      expect(reverseString(longString)).toBe("a".repeat(10000));
      expect(capitalize(longString)).toBe("A" + "a".repeat(9999));
    });
  });

  // 性能测试示例
  describe("性能测试", () => {
    it("处理长字符串时性能应该合理", () => {
      const longString = "Hello world ".repeat(1000);

      const start = performance.now();
      wordCount(longString);
      const end = performance.now();

      expect(end - start).toBeLessThan(100); // 应该在100ms内完成
    });
  });
});
