import { assertEquals, assertThrows } from "@std/assert";

import {
  getClosestSunday,
  getFirstSundayOfAdvent,
  getNextSunday,
  getPreviousSunday,
  getSundaysOfChurchYear,
  isSunday,
} from "$src/temporal.ts";

Deno.test("isSunday function", async (t) => {
  await t.step("returns true for a known Sunday", () => {
    assertEquals(isSunday("2023-04-09"), true);
  });

  await t.step("returns false for a known non-Sunday", () => {
    assertEquals(isSunday("2023-04-10"), false);
  });

  await t.step("correctly identifies Sundays on January 1st", () => {
    assertEquals(isSunday("2023-01-01"), true);
    assertEquals(isSunday("2024-01-01"), false);
  });

  await t.step("correctly identifies Sundays on December 31st", () => {
    assertEquals(isSunday("2023-12-31"), true);
    assertEquals(isSunday("2024-12-31"), false);
  });

  await t.step("correctly handles leap year February 29th", () => {
    assertEquals(isSunday("2024-02-29"), false);
  });

  await t.step("works with different input formats", () => {
    assertEquals(isSunday("2023-04-09"), true);
    assertEquals(isSunday(new Temporal.PlainDate(2023, 4, 9)), true);
    assertEquals(isSunday({ year: 2023, month: 4, day: 9 }), true);
  });

  await t.step("throws error for invalid date string", () => {
    assertThrows(() => isSunday("invalid-date"));
    assertThrows(() => isSunday(""));
  });

  await t.step("throws error for invalid date object", () => {
    assertThrows(() => isSunday("2023-13-01"));
    assertThrows(() => isSunday(new Temporal.PlainDate(2023, 13, 1)));
    assertThrows(() => isSunday({ year: 2023, month: 13, day: 1 }));
  });
});

Deno.test("getNextSunday function", async (t) => {
  await t.step("returns the next Sunday for a weekday", () => {
    assertEquals(getNextSunday("2023-04-10").toString(), "2023-04-16");
    assertEquals(getNextSunday("2023-04-11").toString(), "2023-04-16");
    assertEquals(getNextSunday("2023-04-12").toString(), "2023-04-16");
    assertEquals(getNextSunday("2023-04-13").toString(), "2023-04-16");
    assertEquals(getNextSunday("2023-04-14").toString(), "2023-04-16");
    assertEquals(getNextSunday("2023-04-15").toString(), "2023-04-16");
  });

  await t.step("returns the next Sunday when the current day is Sunday", () => {
    assertEquals(getNextSunday("2023-04-09").toString(), "2023-04-16");
  });

  await t.step("correctly handles month end", () => {
    assertEquals(getNextSunday("2023-04-29").toString(), "2023-04-30");
    assertEquals(getNextSunday("2023-04-30").toString(), "2023-05-07");
  });

  await t.step("correctly handles year end", () => {
    assertEquals(getNextSunday("2023-12-30").toString(), "2023-12-31");
    assertEquals(getNextSunday("2023-12-31").toString(), "2024-01-07");
  });

  await t.step("correctly handles leap year", () => {
    assertEquals(getNextSunday("2024-02-28").toString(), "2024-03-03");
    assertEquals(getNextSunday("2024-02-29").toString(), "2024-03-03");
  });

  await t.step("works with different input formats", () => {
    assertEquals(getNextSunday("2023-04-10").toString(), "2023-04-16");
    assertEquals(getNextSunday(new Temporal.PlainDate(2023, 4, 10)).toString(), "2023-04-16");
    assertEquals(getNextSunday({ year: 2023, month: 4, day: 10 }).toString(), "2023-04-16");
  });

  await t.step("throws error for invalid date string", () => {
    assertThrows(() => getNextSunday("invalid-date"), RangeError);
    assertThrows(() => getNextSunday(""), RangeError);
  });

  await t.step("throws error for invalid date object", () => {
    assertThrows(() => getNextSunday("2023-13-01"), RangeError);
    assertThrows(() => getNextSunday(new Temporal.PlainDate(2023, 13, 1)), RangeError);
    assertThrows(() => getNextSunday({ year: 2023, month: 13, day: 1 }), RangeError);
  });
});

Deno.test("getPreviousSunday function", async (t) => {
  await t.step("returns the previous Sunday for weekdays", () => {
    assertEquals(getPreviousSunday("2023-04-10").toString(), "2023-04-09");
    assertEquals(getPreviousSunday("2023-04-11").toString(), "2023-04-09");
    assertEquals(getPreviousSunday("2023-04-12").toString(), "2023-04-09");
    assertEquals(getPreviousSunday("2023-04-13").toString(), "2023-04-09");
    assertEquals(getPreviousSunday("2023-04-14").toString(), "2023-04-09");
    assertEquals(getPreviousSunday("2023-04-15").toString(), "2023-04-09");
  });

  await t.step("returns the previous Sunday when the current day is Sunday", () => {
    assertEquals(getPreviousSunday("2023-04-09").toString(), "2023-04-02");
  });

  await t.step("correctly handles month start", () => {
    assertEquals(getPreviousSunday("2023-05-01").toString(), "2023-04-30");
    assertEquals(getPreviousSunday("2023-05-02").toString(), "2023-04-30");
  });

  await t.step("correctly handles month end", () => {
    assertEquals(getPreviousSunday("2023-04-30").toString(), "2023-04-23");
    assertEquals(getPreviousSunday("2023-05-01").toString(), "2023-04-30");
  });

  await t.step("correctly handles year start", () => {
    assertEquals(getPreviousSunday("2023-01-01").toString(), "2022-12-25");
    assertEquals(getPreviousSunday("2023-01-02").toString(), "2023-01-01");
  });

  await t.step("correctly handles year end", () => {
    assertEquals(getPreviousSunday("2023-12-31").toString(), "2023-12-24");
    assertEquals(getPreviousSunday("2024-01-01").toString(), "2023-12-31");
  });

  await t.step("correctly handles leap year", () => {
    assertEquals(getPreviousSunday("2024-02-29").toString(), "2024-02-25");
    assertEquals(getPreviousSunday("2024-03-01").toString(), "2024-02-25");
  });

  await t.step("works with different input formats", () => {
    assertEquals(getPreviousSunday("2023-04-10").toString(), "2023-04-09");
    assertEquals(getPreviousSunday(new Temporal.PlainDate(2023, 4, 10)).toString(), "2023-04-09");
    assertEquals(getPreviousSunday({ year: 2023, month: 4, day: 10 }).toString(), "2023-04-09");
  });

  await t.step("throws error for invalid date string", () => {
    assertThrows(() => getPreviousSunday("invalid-date"), RangeError);
    assertThrows(() => getPreviousSunday(""), RangeError);
  });

  await t.step("throws error for invalid date object", () => {
    assertThrows(() => getPreviousSunday("2023-13-01"), RangeError);
    assertThrows(() => getPreviousSunday(new Temporal.PlainDate(2023, 13, 1)), RangeError);
    assertThrows(() => getPreviousSunday({ year: 2023, month: 13, day: 1 }), RangeError);
  });
});

Deno.test("getClosestSunday function", async (t) => {
  await t.step("returns the same date for a Sunday", () => {
    assertEquals(getClosestSunday("2023-04-09").toString(), "2023-04-09");
  });

  await t.step("returns the correct Sunday for weekdays", () => {
    assertEquals(getClosestSunday("2023-04-10").toString(), "2023-04-09");
    assertEquals(getClosestSunday("2023-04-11").toString(), "2023-04-09");
    assertEquals(getClosestSunday("2023-04-12").toString(), "2023-04-09");
    assertEquals(getClosestSunday("2023-04-13").toString(), "2023-04-16");
    assertEquals(getClosestSunday("2023-04-14").toString(), "2023-04-16");
    assertEquals(getClosestSunday("2023-04-15").toString(), "2023-04-16");
  });

  await t.step("handles dates at the start of a month", () => {
    assertEquals(getClosestSunday("2023-05-01").toString(), "2023-04-30");
    assertEquals(getClosestSunday("2023-05-02").toString(), "2023-04-30");
    assertEquals(getClosestSunday("2023-05-03").toString(), "2023-04-30");
    assertEquals(getClosestSunday("2023-05-04").toString(), "2023-05-07");
  });

  await t.step("handles dates at the end of a month", () => {
    assertEquals(getClosestSunday("2023-04-29").toString(), "2023-04-30");
    assertEquals(getClosestSunday("2023-04-30").toString(), "2023-04-30");
    assertEquals(getClosestSunday("2023-05-01").toString(), "2023-04-30");
  });

  await t.step("handles dates at the start of a year", () => {
    assertEquals(getClosestSunday("2023-01-01").toString(), "2023-01-01");
    assertEquals(getClosestSunday("2023-01-02").toString(), "2023-01-01");
    assertEquals(getClosestSunday("2023-01-03").toString(), "2023-01-01");
    assertEquals(getClosestSunday("2023-01-04").toString(), "2023-01-01");
    assertEquals(getClosestSunday("2023-01-05").toString(), "2023-01-08");
    assertEquals(getClosestSunday("2023-01-06").toString(), "2023-01-08");
  });

  await t.step("handles dates at the end of a year", () => {
    assertEquals(getClosestSunday("2023-12-30").toString(), "2023-12-31");
    assertEquals(getClosestSunday("2023-12-31").toString(), "2023-12-31");
    assertEquals(getClosestSunday("2024-01-01").toString(), "2023-12-31");
  });

  await t.step("handles leap year correctly", () => {
    assertEquals(getClosestSunday("2024-02-28").toString(), "2024-02-25");
    assertEquals(getClosestSunday("2024-02-29").toString(), "2024-03-03");
    assertEquals(getClosestSunday("2024-03-01").toString(), "2024-03-03");
  });

  await t.step("handles dates exactly between two Sundays", () => {
    assertEquals(getClosestSunday("2023-04-12").toString(), "2023-04-09");
    assertEquals(getClosestSunday("2023-04-13").toString(), "2023-04-16");
  });

  await t.step("works with different input formats", () => {
    assertEquals(getClosestSunday("2023-04-10").toString(), "2023-04-09");
    assertEquals(getClosestSunday(new Temporal.PlainDate(2023, 4, 10)).toString(), "2023-04-09");
    assertEquals(getClosestSunday({ year: 2023, month: 4, day: 10 }).toString(), "2023-04-09");
  });

  await t.step("throws error for invalid date string", () => {
    assertThrows(() => getClosestSunday("invalid-date"), RangeError);
    assertThrows(() => getClosestSunday(""), RangeError);
  });

  await t.step("throws error for invalid date object", () => {
    assertThrows(() => getClosestSunday("2023-13-01"), RangeError);
    assertThrows(() => getClosestSunday(new Temporal.PlainDate(2023, 13, 1)), RangeError);
    assertThrows(() => getClosestSunday({ year: 2023, month: 13, day: 1 }), RangeError);
  });
});

Deno.test("getSundaysOfChurchYear function", async (t) => {
  await t.step("returns the correct number of Sundays for a church year", () => {
    const sundays2023 = getSundaysOfChurchYear(2023);
    assertEquals(sundays2023.length, 53);
  });

  await t.step("first Sunday is the First Sunday of Advent of the previous calendar year", () => {
    const sundays2023 = getSundaysOfChurchYear(2023);
    const firstSundayOfAdvent2022 = getFirstSundayOfAdvent(2022);
    assertEquals(sundays2023[0].toString(), firstSundayOfAdvent2022.toString());
  });

  await t.step("last Sunday is the Sunday before the First Sunday of Advent of the given year", () => {
    const sundays2023 = getSundaysOfChurchYear(2023);
    const firstSundayOfAdvent2023 = getFirstSundayOfAdvent(2023);
    const lastSunday = sundays2023[sundays2023.length - 1];
    assertEquals(lastSunday.toString(), firstSundayOfAdvent2023.subtract({ days: 7 }).toString());
  });

  await t.step("all returned dates are Sundays", () => {
    const sundays2023 = getSundaysOfChurchYear(2023);
    sundays2023.forEach((sunday) => {
      assertEquals(sunday.dayOfWeek, 7, `${sunday.toString()} is not a Sunday`);
    });
  });

  await t.step("works correctly for a leap year", () => {
    const sundays2024 = getSundaysOfChurchYear(2024);
    assertEquals(sundays2024.length, 52);
    const leapYearSunday = sundays2024.find((sunday) => sunday.toString() === "2024-02-25");
    assertEquals(leapYearSunday !== undefined, true, "Leap year Sunday (2024-02-25) not found");
  });

  await t.step("handles earliest possible First Sunday of Advent", () => {
    // 2022 has the earliest possible First Sunday of Advent (November 27)
    const sundays2023 = getSundaysOfChurchYear(2023);
    assertEquals(sundays2023[0].toString(), "2022-11-27");
    assertEquals(sundays2023[sundays2023.length - 1].toString(), "2023-11-26");
  });

  await t.step("handles latest possible First Sunday of Advent", () => {
    // 2024 has the latest possible First Sunday of Advent (December 3)
    const sundays2023 = getSundaysOfChurchYear(2024);
    assertEquals(sundays2023[0].toString(), "2023-12-03");
    assertEquals(sundays2023[sundays2023.length - 1].toString(), "2024-11-24");
  });

  await t.step("works with date string input", () => {
    const sundays = getSundaysOfChurchYear("2023-06-15");
    assertEquals(sundays.length, 53);
    assertEquals(sundays[0].toString(), "2022-11-27");
    assertEquals(sundays[sundays.length - 1].toString(), "2023-11-26");
  });
});
