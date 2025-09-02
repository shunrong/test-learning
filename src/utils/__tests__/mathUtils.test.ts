/**
 * 数学工具函数测试 - 演示基础单元测试
 */

import {
  add,
  subtract,
  multiply,
  divide,
  factorial,
  isPrime,
  fibonacci,
  sum,
  average,
  findMax,
  findMin,
} from "../mathUtils";

describe("mathUtils", () => {
  // 基础数学运算测试
  describe("基础数学运算", () => {
    describe("add", () => {
      it("应该正确计算两个正数的和", () => {
        expect(add(2, 3)).toBe(5);
        expect(add(10, 20)).toBe(30);
      });

      it("应该正确处理负数", () => {
        expect(add(-2, 3)).toBe(1);
        expect(add(-5, -10)).toBe(-15);
      });

      it("应该正确处理零", () => {
        expect(add(0, 5)).toBe(5);
        expect(add(0, 0)).toBe(0);
      });

      it("应该正确处理小数", () => {
        expect(add(0.1, 0.2)).toBeCloseTo(0.3);
        expect(add(1.5, 2.5)).toBe(4);
      });
    });

    describe("subtract", () => {
      it("应该正确计算减法", () => {
        expect(subtract(5, 3)).toBe(2);
        expect(subtract(10, 20)).toBe(-10);
      });
    });

    describe("multiply", () => {
      it("应该正确计算乘法", () => {
        expect(multiply(3, 4)).toBe(12);
        expect(multiply(-2, 5)).toBe(-10);
        expect(multiply(0, 100)).toBe(0);
      });
    });

    describe("divide", () => {
      it("应该正确计算除法", () => {
        expect(divide(10, 2)).toBe(5);
        expect(divide(15, 3)).toBe(5);
      });

      it("应该正确处理小数除法", () => {
        expect(divide(7, 2)).toBe(3.5);
        expect(divide(1, 3)).toBeCloseTo(0.333, 3);
      });

      it("除以零时应该抛出错误", () => {
        expect(() => divide(10, 0)).toThrow("Division by zero is not allowed");
        expect(() => divide(-5, 0)).toThrow();
      });

      it("零除以任何数应该返回零", () => {
        expect(divide(0, 5)).toBe(0);
        expect(divide(0, -10)).toBe(0);
      });
    });
  });

  // 复杂函数测试
  describe("复杂数学函数", () => {
    describe("factorial", () => {
      it("应该正确计算阶乘", () => {
        expect(factorial(0)).toBe(1);
        expect(factorial(1)).toBe(1);
        expect(factorial(3)).toBe(6);
        expect(factorial(5)).toBe(120);
      });

      it("负数应该抛出错误", () => {
        expect(() => factorial(-1)).toThrow(
          "Factorial is not defined for negative numbers"
        );
        expect(() => factorial(-5)).toThrow();
      });

      // 性能测试示例
      it("计算较大数值时性能应该合理", () => {
        const start = performance.now();
        factorial(10);
        const end = performance.now();
        expect(end - start).toBeLessThan(100); // 应该在100ms内完成
      });
    });

    describe("isPrime", () => {
      it("应该正确识别质数", () => {
        expect(isPrime(2)).toBe(true);
        expect(isPrime(3)).toBe(true);
        expect(isPrime(5)).toBe(true);
        expect(isPrime(7)).toBe(true);
        expect(isPrime(11)).toBe(true);
        expect(isPrime(13)).toBe(true);
      });

      it("应该正确识别非质数", () => {
        expect(isPrime(0)).toBe(false);
        expect(isPrime(1)).toBe(false);
        expect(isPrime(4)).toBe(false);
        expect(isPrime(6)).toBe(false);
        expect(isPrime(8)).toBe(false);
        expect(isPrime(9)).toBe(false);
        expect(isPrime(10)).toBe(false);
      });

      it("应该正确处理负数", () => {
        expect(isPrime(-1)).toBe(false);
        expect(isPrime(-5)).toBe(false);
      });

      // 边界值测试
      it("应该正确处理边界情况", () => {
        expect(isPrime(2)).toBe(true); // 最小质数
        expect(isPrime(97)).toBe(true); // 较大质数
        expect(isPrime(100)).toBe(false); // 较大合数
      });
    });

    describe("fibonacci", () => {
      it("应该正确计算斐波那契数列", () => {
        expect(fibonacci(0)).toBe(0);
        expect(fibonacci(1)).toBe(1);
        expect(fibonacci(2)).toBe(1);
        expect(fibonacci(3)).toBe(2);
        expect(fibonacci(4)).toBe(3);
        expect(fibonacci(5)).toBe(5);
        expect(fibonacci(6)).toBe(8);
      });

      it("负数应该抛出错误", () => {
        expect(() => fibonacci(-1)).toThrow(
          "Fibonacci is not defined for negative numbers"
        );
      });

      // 注意：这个递归实现对于大数值会很慢，实际项目中应该用迭代或记忆化
      it("应该能处理适中的数值", () => {
        expect(fibonacci(10)).toBe(55);
      });
    });
  });

  // 数组操作测试
  describe("数组操作函数", () => {
    describe("sum", () => {
      it("应该正确计算数组的和", () => {
        expect(sum([1, 2, 3, 4, 5])).toBe(15);
        expect(sum([10, -5, 3])).toBe(8);
      });

      it("空数组应该返回0", () => {
        expect(sum([])).toBe(0);
      });

      it("单个元素数组应该返回该元素", () => {
        expect(sum([42])).toBe(42);
      });

      it("应该正确处理小数", () => {
        expect(sum([0.1, 0.2, 0.3])).toBeCloseTo(0.6);
      });
    });

    describe("average", () => {
      it("应该正确计算平均值", () => {
        expect(average([1, 2, 3, 4, 5])).toBe(3);
        expect(average([10, 20])).toBe(15);
      });

      it("空数组应该抛出错误", () => {
        expect(() => average([])).toThrow(
          "Cannot calculate average of empty array"
        );
      });

      it("单个元素数组应该返回该元素", () => {
        expect(average([42])).toBe(42);
      });

      it("应该正确处理小数", () => {
        expect(average([1, 2])).toBe(1.5);
        expect(average([0.1, 0.2, 0.3])).toBeCloseTo(0.2);
      });
    });

    describe("findMax", () => {
      it("应该找到最大值", () => {
        expect(findMax([1, 5, 3, 9, 2])).toBe(9);
        expect(findMax([-1, -5, -3])).toBe(-1);
      });

      it("空数组应该抛出错误", () => {
        expect(() => findMax([])).toThrow("Cannot find max of empty array");
      });

      it("单个元素数组应该返回该元素", () => {
        expect(findMax([42])).toBe(42);
      });

      it("所有元素相同时应该返回该值", () => {
        expect(findMax([5, 5, 5])).toBe(5);
      });
    });

    describe("findMin", () => {
      it("应该找到最小值", () => {
        expect(findMin([1, 5, 3, 9, 2])).toBe(1);
        expect(findMin([-1, -5, -3])).toBe(-5);
      });

      it("空数组应该抛出错误", () => {
        expect(() => findMin([])).toThrow("Cannot find min of empty array");
      });

      it("单个元素数组应该返回该元素", () => {
        expect(findMin([42])).toBe(42);
      });
    });
  });

  // 测试套件级别的测试
  describe("集成测试", () => {
    it("多个函数组合使用", () => {
      const numbers = [1, 2, 3, 4, 5];
      const total = sum(numbers);
      const avg = average(numbers);
      const max = findMax(numbers);
      const min = findMin(numbers);

      expect(total).toBe(15);
      expect(avg).toBe(3);
      expect(max).toBe(5);
      expect(min).toBe(1);
    });

    it("验证数学关系", () => {
      const a = 6;
      const b = 3;

      // 验证 a * b = sum([a, a, a])
      expect(multiply(a, b)).toBe(sum(Array(b).fill(a)));

      // 验证 a / b * b = a（在没有余数的情况下）
      expect(multiply(divide(a, b), b)).toBe(a);
    });
  });

  // 属性测试示例（Property-based testing）
  describe("属性测试", () => {
    it("加法应该满足交换律", () => {
      // 生成随机测试数据
      for (let i = 0; i < 10; i++) {
        const a = Math.random() * 100;
        const b = Math.random() * 100;
        expect(add(a, b)).toBeCloseTo(add(b, a));
      }
    });

    it("乘法应该满足结合律", () => {
      for (let i = 0; i < 10; i++) {
        const a = Math.random() * 10;
        const b = Math.random() * 10;
        const c = Math.random() * 10;
        expect(multiply(multiply(a, b), c)).toBeCloseTo(
          multiply(a, multiply(b, c))
        );
      }
    });
  });
});
