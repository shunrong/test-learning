/**
 * 日期工具函数测试 - 演示日期处理和时间相关测试
 */

import {
  formatDate,
  getRelativeTime,
  addDays,
  addMonths,
  addYears,
  isSameDay,
  isWeekend,
  isLeapYear,
  getDaysInMonth,
  getWeekNumber,
  parseDate,
  getTimezone,
} from "../dateUtils";

describe("dateUtils", () => {
  // 创建固定的测试日期，避免时区和时间变化影响测试
  const testDate = new Date("2023-06-15T10:30:00.000Z"); // 2023年6月15日，星期四
  const testDate2 = new Date("2023-12-25T15:45:30.000Z"); // 2023年12月25日，星期一

  describe("formatDate", () => {
    it("应该使用默认格式 YYYY-MM-DD", () => {
      expect(formatDate(testDate)).toBe("2023-06-15");
      expect(formatDate(testDate2)).toBe("2023-12-25");
    });

    it("应该支持自定义格式", () => {
      expect(formatDate(testDate, "YYYY/MM/DD")).toBe("2023/06/15");
      expect(formatDate(testDate, "DD-MM-YYYY")).toBe("15-06-2023");
      expect(formatDate(testDate, "MM/DD/YYYY")).toBe("06/15/2023");
    });

    it("应该支持包含时间的格式", () => {
      expect(formatDate(testDate, "YYYY-MM-DD HH:mm:ss")).toBe(
        "2023-06-15 10:30:00"
      );
      expect(formatDate(testDate, "DD/MM/YYYY HH:mm")).toBe("15/06/2023 10:30");
    });

    it("应该正确处理月份边界", () => {
      const january = new Date("2023-01-01T00:00:00.000Z");
      const december = new Date("2023-12-31T23:59:59.000Z");

      expect(formatDate(january)).toBe("2023-01-01");
      expect(formatDate(december)).toBe("2023-12-31");
    });

    it("应该正确填充零", () => {
      const earlyDate = new Date("2023-01-05T01:05:05.000Z");
      expect(formatDate(earlyDate, "YYYY-MM-DD HH:mm:ss")).toBe(
        "2023-01-05 01:05:05"
      );
    });
  });

  describe("getRelativeTime", () => {
    const now = new Date("2023-06-15T12:00:00.000Z");

    it('应该返回"刚刚"对于很近的时间', () => {
      const recent = new Date("2023-06-15T11:59:30.000Z"); // 30秒前
      expect(getRelativeTime(recent, now)).toBe("刚刚");
    });

    it("应该返回分钟", () => {
      const fiveMinutesAgo = new Date("2023-06-15T11:55:00.000Z");
      const thirtyMinutesAgo = new Date("2023-06-15T11:30:00.000Z");

      expect(getRelativeTime(fiveMinutesAgo, now)).toBe("5分钟前");
      expect(getRelativeTime(thirtyMinutesAgo, now)).toBe("30分钟前");
    });

    it("应该返回小时", () => {
      const twoHoursAgo = new Date("2023-06-15T10:00:00.000Z");
      const twelveHoursAgo = new Date("2023-06-15T00:00:00.000Z");

      expect(getRelativeTime(twoHoursAgo, now)).toBe("2小时前");
      expect(getRelativeTime(twelveHoursAgo, now)).toBe("12小时前");
    });

    it("应该返回天数", () => {
      const yesterday = new Date("2023-06-14T12:00:00.000Z");
      const twoDaysAgo = new Date("2023-06-13T12:00:00.000Z");

      expect(getRelativeTime(yesterday, now)).toBe("1天前");
      expect(getRelativeTime(twoDaysAgo, now)).toBe("2天前");
    });

    it("应该返回月份", () => {
      const oneMonthAgo = new Date("2023-05-15T12:00:00.000Z");
      const sixMonthsAgo = new Date("2022-12-15T12:00:00.000Z");

      expect(getRelativeTime(oneMonthAgo, now)).toBe("1个月前");
      expect(getRelativeTime(sixMonthsAgo, now)).toBe("6个月前");
    });

    it("应该返回年份", () => {
      const oneYearAgo = new Date("2022-06-15T12:00:00.000Z");
      const twoYearsAgo = new Date("2021-06-15T12:00:00.000Z");

      expect(getRelativeTime(oneYearAgo, now)).toBe("1年前");
      expect(getRelativeTime(twoYearsAgo, now)).toBe("2年前");
    });

    it("使用当前时间作为默认基准", () => {
      // 这个测试比较困难，因为它依赖于实际的当前时间
      // 在实际项目中，我们可能会 mock Date.now() 或传入固定的 now 参数
      const veryOldDate = new Date("2020-01-01T00:00:00.000Z");
      const result = getRelativeTime(veryOldDate);
      expect(result).toMatch(/年前$/); // 应该以"年前"结尾
    });
  });

  describe("日期计算函数", () => {
    describe("addDays", () => {
      it("应该正确添加天数", () => {
        const result = addDays(testDate, 5);
        expect(formatDate(result)).toBe("2023-06-20");
      });

      it("应该处理负数（减去天数）", () => {
        const result = addDays(testDate, -10);
        expect(formatDate(result)).toBe("2023-06-05");
      });

      it("应该正确处理月份边界", () => {
        const endOfMonth = new Date("2023-06-30T12:00:00.000Z");
        const result = addDays(endOfMonth, 1);
        expect(formatDate(result)).toBe("2023-07-01");
      });

      it("应该正确处理年份边界", () => {
        const endOfYear = new Date("2023-12-31T12:00:00.000Z");
        const result = addDays(endOfYear, 1);
        expect(formatDate(result)).toBe("2024-01-01");
      });

      it("不应该修改原始日期", () => {
        const original = new Date("2023-06-15T12:00:00.000Z");
        const originalTime = original.getTime();
        addDays(original, 5);
        expect(original.getTime()).toBe(originalTime);
      });
    });

    describe("addMonths", () => {
      it("应该正确添加月份", () => {
        const result = addMonths(testDate, 2);
        expect(formatDate(result)).toBe("2023-08-15");
      });

      it("应该处理年份边界", () => {
        const result = addMonths(testDate, 8);
        expect(formatDate(result)).toBe("2024-02-15");
      });

      it("应该处理负数", () => {
        const result = addMonths(testDate, -3);
        expect(formatDate(result)).toBe("2023-03-15");
      });
    });

    describe("addYears", () => {
      it("应该正确添加年份", () => {
        const result = addYears(testDate, 2);
        expect(formatDate(result)).toBe("2025-06-15");
      });

      it("应该处理负数", () => {
        const result = addYears(testDate, -1);
        expect(formatDate(result)).toBe("2022-06-15");
      });

      it("应该处理闰年", () => {
        const leapYearDate = new Date("2024-02-29T12:00:00.000Z");
        const result = addYears(leapYearDate, 1);
        // 2025年不是闰年，所以会变成2月28日
        expect(formatDate(result)).toBe("2025-02-28");
      });
    });
  });

  describe("日期比较函数", () => {
    describe("isSameDay", () => {
      it("相同日期应该返回 true", () => {
        const date1 = new Date("2023-06-15T10:00:00.000Z");
        const date2 = new Date("2023-06-15T20:00:00.000Z");
        expect(isSameDay(date1, date2)).toBe(true);
      });

      it("不同日期应该返回 false", () => {
        const date1 = new Date("2023-06-15T23:59:59.000Z");
        const date2 = new Date("2023-06-16T00:00:00.000Z");
        expect(isSameDay(date1, date2)).toBe(false);
      });

      it("不同年份应该返回 false", () => {
        const date1 = new Date("2023-06-15T12:00:00.000Z");
        const date2 = new Date("2024-06-15T12:00:00.000Z");
        expect(isSameDay(date1, date2)).toBe(false);
      });
    });

    describe("isWeekend", () => {
      it("星期六应该返回 true", () => {
        const saturday = new Date("2023-06-17T12:00:00.000Z"); // 星期六
        expect(isWeekend(saturday)).toBe(true);
      });

      it("星期日应该返回 true", () => {
        const sunday = new Date("2023-06-18T12:00:00.000Z"); // 星期日
        expect(isWeekend(sunday)).toBe(true);
      });

      it("工作日应该返回 false", () => {
        const monday = new Date("2023-06-19T12:00:00.000Z"); // 星期一
        const friday = new Date("2023-06-16T12:00:00.000Z"); // 星期五
        expect(isWeekend(monday)).toBe(false);
        expect(isWeekend(friday)).toBe(false);
      });
    });

    describe("isLeapYear", () => {
      it("应该识别闰年", () => {
        expect(isLeapYear(2000)).toBe(true); // 能被400整除
        expect(isLeapYear(2004)).toBe(true); // 能被4整除，不能被100整除
        expect(isLeapYear(2020)).toBe(true);
        expect(isLeapYear(2024)).toBe(true);
      });

      it("应该识别平年", () => {
        expect(isLeapYear(1900)).toBe(false); // 能被100整除，但不能被400整除
        expect(isLeapYear(2001)).toBe(false); // 不能被4整除
        expect(isLeapYear(2021)).toBe(false);
        expect(isLeapYear(2023)).toBe(false);
      });
    });
  });

  describe("日期信息获取函数", () => {
    describe("getDaysInMonth", () => {
      it("应该返回正确的天数", () => {
        expect(getDaysInMonth(2023, 1)).toBe(31); // 一月
        expect(getDaysInMonth(2023, 2)).toBe(28); // 二月（平年）
        expect(getDaysInMonth(2024, 2)).toBe(29); // 二月（闰年）
        expect(getDaysInMonth(2023, 4)).toBe(30); // 四月
      });

      it("应该处理十二月", () => {
        expect(getDaysInMonth(2023, 12)).toBe(31);
      });
    });

    describe("getWeekNumber", () => {
      it("应该返回正确的周数", () => {
        const jan1 = new Date("2023-01-01T12:00:00.000Z");
        const jan8 = new Date("2023-01-08T12:00:00.000Z");

        expect(getWeekNumber(jan1)).toBe(1);
        expect(getWeekNumber(jan8)).toBe(2);
      });

      it("应该处理年末", () => {
        const dec31 = new Date("2023-12-31T12:00:00.000Z");
        expect(getWeekNumber(dec31)).toBeGreaterThan(50);
      });
    });

    describe("parseDate", () => {
      it("应该解析有效的日期字符串", () => {
        const result = parseDate("2023-06-15");
        expect(result).toBeInstanceOf(Date);
        expect(formatDate(result!)).toBe("2023-06-15");
      });

      it("应该解析 ISO 字符串", () => {
        const result = parseDate("2023-06-15T10:30:00.000Z");
        expect(result).toBeInstanceOf(Date);
        expect(result!.getUTCHours()).toBe(10);
      });

      it("无效字符串应该返回 null", () => {
        expect(parseDate("invalid-date")).toBe(null);
        expect(parseDate("2023-13-32")).toBe(null);
        expect(parseDate("")).toBe(null);
      });
    });

    describe("getTimezone", () => {
      it("应该返回时区字符串", () => {
        const timezone = getTimezone();
        expect(typeof timezone).toBe("string");
        expect(timezone.length).toBeGreaterThan(0);
        // 注意：实际的时区取决于运行环境，这里只检查基本格式
      });
    });
  });

  // Mock 测试示例 - 演示如何 mock Date
  describe("时间 Mock 测试", () => {
    let originalDate: typeof Date;

    beforeEach(() => {
      originalDate = global.Date;
    });

    afterEach(() => {
      global.Date = originalDate;
    });

    it("应该能够 mock 当前时间", () => {
      // Mock Date.now() 返回固定时间
      const mockDate = new Date("2023-06-15T12:00:00.000Z");
      jest.spyOn(global, "Date").mockImplementation(() => mockDate as any);

      // 现在 new Date() 总是返回我们 mock 的时间
      expect(new Date().getTime()).toBe(mockDate.getTime());
    });

    it("应该测试依赖当前时间的函数", () => {
      // 这里可以测试 getRelativeTime 的默认行为
      const fixedNow = new Date("2023-06-15T12:00:00.000Z");
      const pastDate = new Date("2023-06-15T11:00:00.000Z");

      jest.spyOn(global, "Date").mockImplementation(() => fixedNow as any);

      const result = getRelativeTime(pastDate);
      expect(result).toBe("1小时前");
    });
  });

  // 时区测试
  describe("时区处理", () => {
    it("应该考虑 UTC 时间", () => {
      // 使用 UTC 方法确保测试不受本地时区影响
      const utcDate = new Date(Date.UTC(2023, 5, 15, 12, 0, 0)); // 月份从0开始
      expect(formatDate(utcDate)).toBe("2023-06-15");
    });
  });

  // 性能测试
  describe("性能测试", () => {
    it("日期操作应该快速执行", () => {
      const start = performance.now();

      for (let i = 0; i < 1000; i++) {
        formatDate(testDate);
        addDays(testDate, i);
        isWeekend(testDate);
      }

      const end = performance.now();
      expect(end - start).toBeLessThan(100); // 1000次操作应该在100ms内完成
    });
  });
});
