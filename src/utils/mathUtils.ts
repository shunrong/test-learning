/**
 * 数学工具函数 - 用于演示单元测试
 */

// 基础数学运算
export const add = (a: number, b: number): number => a + b;

export const subtract = (a: number, b: number): number => a - b;

export const multiply = (a: number, b: number): number => a * b;

export const divide = (a: number, b: number): number => {
  if (b === 0) {
    throw new Error("Division by zero is not allowed");
  }
  return a / b;
};

// 更复杂的函数
export const factorial = (n: number): number => {
  if (n < 0) {
    throw new Error("Factorial is not defined for negative numbers");
  }
  if (n === 0 || n === 1) {
    return 1;
  }
  return n * factorial(n - 1);
};

export const isPrime = (num: number): boolean => {
  if (num < 2) return false;
  if (num === 2) return true;
  if (num % 2 === 0) return false;

  for (let i = 3; i <= Math.sqrt(num); i += 2) {
    if (num % i === 0) return false;
  }
  return true;
};

export const fibonacci = (n: number): number => {
  if (n < 0) {
    throw new Error("Fibonacci is not defined for negative numbers");
  }
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
};

// 数组操作
export const sum = (numbers: number[]): number => {
  if (numbers.length === 0) return 0;
  return numbers.reduce((acc, num) => acc + num, 0);
};

export const average = (numbers: number[]): number => {
  if (numbers.length === 0) {
    throw new Error("Cannot calculate average of empty array");
  }
  return sum(numbers) / numbers.length;
};

export const findMax = (numbers: number[]): number => {
  if (numbers.length === 0) {
    throw new Error("Cannot find max of empty array");
  }
  return Math.max(...numbers);
};

export const findMin = (numbers: number[]): number => {
  if (numbers.length === 0) {
    throw new Error("Cannot find min of empty array");
  }
  return Math.min(...numbers);
};
