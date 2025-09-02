/**
 * 字符串工具函数 - 用于演示各种测试场景
 */

// 基础字符串操作
export const capitalize = (str: string): string => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const reverseString = (str: string): string => {
  return str.split("").reverse().join("");
};

export const isPalindrome = (str: string): boolean => {
  const cleaned = str.toLowerCase().replace(/[^a-z0-9]/g, "");
  return cleaned === reverseString(cleaned);
};

// 验证函数
export const isValidEmail = (email: string): boolean => {
  // 改进的邮箱验证：支持更多字符但排除明显错误格式
  if (!email || email.length === 0) return false;
  if (email.includes("..") || email.includes(" ")) return false;
  if (email.startsWith("@") || email.endsWith("@")) return false;
  if (email.startsWith(".") || email.endsWith(".")) return false;

  const parts = email.split("@");
  if (parts.length !== 2) return false;

  const [localPart, domainPart] = parts;
  if (localPart.length === 0 || domainPart.length === 0) return false;

  // 域名必须包含至少一个点，且有有效的顶级域名
  const domainRegex =
    /^[a-zA-Z0-9]([a-zA-Z0-9.-]*[a-zA-Z0-9])?\.([a-zA-Z]{2,})+$/;
  return domainRegex.test(domainPart);
};

export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^1[3-9]\d{9}$/;
  return phoneRegex.test(phone);
};

export const isStrongPassword = (password: string): boolean => {
  // 至少8位，包含大写字母、小写字母、数字和特殊字符
  const strongPasswordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return strongPasswordRegex.test(password);
};

// 格式化函数
export const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.length !== 11) {
    throw new Error("Invalid phone number length");
  }
  return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(7)}`;
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
};

export const slugify = (text: string): string => {
  return (
    text
      .toLowerCase()
      .trim()
      // 保留中文、英文字母、数字、空格和连字符，移除其他特殊字符
      .replace(/[^\u4e00-\u9fa5\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "")
  );
};

// 文本统计
export const wordCount = (text: string): number => {
  if (!text.trim()) return 0;
  return text.trim().split(/\s+/).length;
};

export const characterCount = (
  text: string,
  includeSpaces: boolean = true
): number => {
  return includeSpaces ? text.length : text.replace(/\s/g, "").length;
};

// 模板函数
export const template = (str: string, data: Record<string, any>): string => {
  return str.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    return data[key] !== undefined ? String(data[key]) : match;
  });
};
