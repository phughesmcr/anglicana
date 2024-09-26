import { assertEquals, assertThrows } from "jsr:@std/assert";

import {
  getAscensionDay,
  getAshWednesday,
  getChristmasDay,
  getChristTheKing,
  getChurchYear,
  getClosestSunday,
  getCorpusChristi,
  getDayOfPentecost,
  getEasterSunday,
  getEpiphany,
  getFirstSundayOfAdvent,
  getFixedDates,
  getGoodFriday,
  getJulianEaster,
  getMaundyThursday,
  getMoveableDates,
  getNextSunday,
  getOrthodoxEaster,
  getPreviousSunday,
  getSeasonsOfYear,
  getSundayLectionaryLetter,
  getSundaysOfYear,
  getTheBaptismOfChrist,
  getTrinitySunday,
  getWeekdayLectionaryNumber,
  getWesternEaster,
  isSunday,
} from "../src/temporal.js";

const assertTrue = (condition: boolean, message?: string) => {
  assertEquals(condition, true, message);
};

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
    assertThrows(() => isSunday("invalid-date"), RangeError);
    assertThrows(() => isSunday(""), RangeError);
  });

  /* await t.step("throws error for invalid date object", () => {
    assertThrows(() => isSunday("2023-13-01"), RangeError);
    assertThrows(() => isSunday(new Temporal.PlainDate(2023, 13, 1)), RangeError);
    assertThrows(() => isSunday({ year: 2023, month: 13, day: 1 }), RangeError);
  }); */
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

Deno.test("getChristmasDay function", async (t) => {
  await t.step("returns correct date for a regular year", () => {
    const christmas2023 = getChristmasDay(2023);
    assertEquals(christmas2023.toString(), "2023-12-25");
    assertEquals(christmas2023.dayOfWeek, 1); // Monday
  });

  await t.step("returns correct date for a leap year", () => {
    const christmas2024 = getChristmasDay(2024);
    assertEquals(christmas2024.toString(), "2024-12-25");
    assertEquals(christmas2024.dayOfWeek, 3); // Wednesday
  });

  await t.step("handles year 1", () => {
    const christmas1 = getChristmasDay(1);
    assertEquals(christmas1.toString(), "0001-12-25");
  });

  await t.step("handles year 9999", () => {
    const christmas9999 = getChristmasDay(9999);
    assertEquals(christmas9999.toString(), "9999-12-25");
  });

  await t.step("handles negative years (BCE)", () => {
    const christmasBCE1 = getChristmasDay(-1);
    assertEquals(christmasBCE1.toString(), "-000001-12-25");
  });

  await t.step("returns a Temporal.PlainDate object", () => {
    const christmas = getChristmasDay(2025);
    assertEquals(christmas instanceof Temporal.PlainDate, true);
  });

  await t.step("throws for non-integer years", () => {
    assertThrows(() => getChristmasDay(2023.5), RangeError);
  });

  await t.step("throws for non-numeric input", () => {
    assertThrows(() => getChristmasDay("2023" as any), TypeError);
  });

  await t.step("throws for years out of range", () => {
    assertThrows(() => getChristmasDay(-271821), RangeError);
    assertThrows(() => getChristmasDay(275760), RangeError);
  });
});

Deno.test("getFirstSundayOfAdvent function", async (t) => {
  await t.step("returns correct date for regular years", () => {
    assertEquals(getFirstSundayOfAdvent(2023).toString(), "2023-12-03");
    assertEquals(getFirstSundayOfAdvent(2024).toString(), "2024-12-01");
    assertEquals(getFirstSundayOfAdvent(2025).toString(), "2025-11-30");
  });

  await t.step("handles earliest possible Advent Sunday (November 27)", () => {
    assertEquals(getFirstSundayOfAdvent(2022).toString(), "2022-11-27");
    assertEquals(getFirstSundayOfAdvent(2033).toString(), "2033-11-27");
  });

  await t.step("handles latest possible Advent Sunday (December 3)", () => {
    assertEquals(getFirstSundayOfAdvent(2023).toString(), "2023-12-03");
    assertEquals(getFirstSundayOfAdvent(2028).toString(), "2028-12-03");
  });

  await t.step("correctly calculates for leap years", () => {
    assertEquals(getFirstSundayOfAdvent(2024).toString(), "2024-12-01");
    assertEquals(getFirstSundayOfAdvent(2028).toString(), "2028-12-03");
  });

  await t.step("handles year boundaries correctly", () => {
    assertEquals(getFirstSundayOfAdvent(1999).toString(), "1999-11-28");
    assertEquals(getFirstSundayOfAdvent(2000).toString(), "2000-12-03");
    assertEquals(getFirstSundayOfAdvent(2099).toString(), "2099-11-29");
    assertEquals(getFirstSundayOfAdvent(2100).toString(), "2100-11-28");
  });

  await t.step("returns a date in the correct year", () => {
    const result = getFirstSundayOfAdvent(2025);
    assertEquals(result.year, 2025);
  });

  await t.step("always returns a Sunday", () => {
    for (let year = 2020; year <= 2030; year++) {
      const result = getFirstSundayOfAdvent(year);
      assertEquals(result.dayOfWeek, 7, `First Sunday of Advent in ${year} should be a Sunday`);
    }
  });

  await t.step("is consistent with Christmas date", () => {
    for (let year = 2020; year <= 2030; year++) {
      const advent = getFirstSundayOfAdvent(year);
      const christmas = new Temporal.PlainDate(year, 12, 25);
      const weeksBetween = advent.until(christmas, { largestUnit: "weeks" }).weeks;
      assertTrue(
        weeksBetween >= 3 && weeksBetween <= 4,
        `There should be 3-4 weeks between Advent and Christmas in ${year}`,
      );
    }
  });

  await t.step("throws for non-integer years", () => {
    assertThrows(() => getFirstSundayOfAdvent(2023.5), RangeError);
  });

  await t.step("throws for non-numeric input", () => {
    assertThrows(() => getFirstSundayOfAdvent("2023" as any), TypeError);
  });

  await t.step("handles very early years", () => {
    assertEquals(getFirstSundayOfAdvent(1).toString(), "0001-11-29");
  });

  await t.step("handles far future years", () => {
    assertEquals(getFirstSundayOfAdvent(9999).toString(), "9999-11-28");
  });
});

Deno.test("getChurchYear function", async (t) => {
  await t.step("Regular cases", async (t) => {
    await t.step("Returns correct year for dates within a church year", () => {
      assertEquals(getChurchYear("2023-12-25"), 2024); // Christmas
      assertEquals(getChurchYear("2024-01-06"), 2024); // Epiphany
      assertEquals(getChurchYear("2024-04-01"), 2024); // During Easter
      assertEquals(getChurchYear("2024-06-09"), 2024); // Pentecost
      assertEquals(getChurchYear("2024-11-24"), 2024); // Christ the King Sunday
    });

    await t.step("Handles multiple consecutive years", () => {
      assertEquals(getChurchYear("2023-12-25"), 2024);
      assertEquals(getChurchYear("2024-12-25"), 2025);
      assertEquals(getChurchYear("2025-12-25"), 2026);
    });
  });

  await t.step("Edge cases", async (t) => {
    await t.step("Correctly handles transition at First Sunday of Advent", () => {
      const years = [2023, 2024, 2025, 2026, 2027];
      for (const year of years) {
        const advent = getFirstSundayOfAdvent(year);
        assertEquals(getChurchYear(advent.subtract({ days: 1 })), year);
        assertEquals(getChurchYear(advent), year + 1);
        assertEquals(getChurchYear(advent.add({ days: 1 })), year + 1);
      }
    });

    await t.step("Handles leap years correctly", () => {
      assertEquals(getChurchYear("2024-02-29"), 2024);
      assertEquals(getChurchYear("2024-03-01"), 2024);
    });

    await t.step("Correct for last and first day of calendar year", () => {
      assertEquals(getChurchYear("2023-12-31"), 2024);
      assertEquals(getChurchYear("2024-01-01"), 2024);
    });
  });

  await t.step("Input format tests", async (t) => {
    await t.step("Accepts string input", () => {
      assertEquals(getChurchYear("2023-12-25"), 2024);
    });

    await t.step("Accepts Temporal.PlainDate input", () => {
      const date = new Temporal.PlainDate(2023, 12, 25);
      assertEquals(getChurchYear(date), 2024);
    });

    await t.step("Accepts object input", () => {
      assertEquals(getChurchYear({ year: 2023, month: 12, day: 25 }), 2024);
    });
  });

  await t.step("getChurchYear returns correct year for date before Advent", () => {
    const dateBeforeAdvent = new Temporal.PlainDate(2024, 11, 1);
    assertEquals(getChurchYear(dateBeforeAdvent), 2024);
    const dateOfAdvent = new Temporal.PlainDate(2024, 12, 1);
    assertEquals(getChurchYear(dateOfAdvent), 2025);
    const dateAfterAdvent = new Temporal.PlainDate(2025, 1, 1);
    assertEquals(getChurchYear(dateAfterAdvent), 2025);
  });

  await t.step("getChurchYear tests using temporal functions", () => {
    const years = [2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030, 2031];
    for (const year of years) {
      const firstAdventDate = getFirstSundayOfAdvent(year);
      assertEquals(getChurchYear(firstAdventDate), year + 1, "Should return next year on first day of advent");
      assertEquals(
        getChurchYear(firstAdventDate.subtract({ days: 1 })),
        year,
        "Should return current year day before advent",
      );
      assertEquals(
        getChurchYear(firstAdventDate.add({ days: 1 })),
        year + 1,
        "Should return next year day after advent",
      );
    }
  });

  await t.step("Error cases", async (t) => {
    await t.step("Throws for invalid date string", () => {
      assertThrows(() => getChurchYear("invalid-date"), RangeError);
    });

    await t.step("Throws for invalid date object", () => {
      assertThrows(() => getChurchYear({ year: 2023, month: 13, day: 1 }), RangeError);
    });
  });
});

Deno.test("getWeekdayLectionaryNumber function", async (t) => {
  await t.step("Regular cases", async (t) => {
    await t.step("Returns correct number for consecutive years", () => {
      assertEquals(getWeekdayLectionaryNumber("2023-01-01"), 2);
      assertEquals(getWeekdayLectionaryNumber("2024-01-01"), 1);
      assertEquals(getWeekdayLectionaryNumber("2025-01-01"), 2);
    });

    await t.step("Returns correct number for different seasons within a church year", () => {
      assertEquals(getWeekdayLectionaryNumber("2023-12-25"), 2); // Christmas
      assertEquals(getWeekdayLectionaryNumber("2024-01-06"), 1); // Epiphany
      assertEquals(getWeekdayLectionaryNumber("2024-04-01"), 1); // During Easter
      assertEquals(getWeekdayLectionaryNumber("2024-06-09"), 1); // Pentecost
      assertEquals(getWeekdayLectionaryNumber("2024-11-24"), 1); // Christ the King Sunday
    });
  });

  await t.step("Edge cases", async (t) => {
    await t.step("Handles transition at First Sunday of Advent correctly", () => {
      const years = [2023, 2024, 2025, 2026, 2027];
      for (const year of years) {
        const advent = getFirstSundayOfAdvent(year);
        assertEquals(getWeekdayLectionaryNumber(advent.subtract({ days: 1 })), year % 2 + 1);
        assertEquals(getWeekdayLectionaryNumber(advent), (year + 1) % 2 + 1);
        assertEquals(getWeekdayLectionaryNumber(advent.add({ days: 1 })), (year + 1) % 2 + 1);
      }
    });

    await t.step("Handles leap years correctly", () => {
      assertEquals(getWeekdayLectionaryNumber("2024-02-29"), 1);
      assertEquals(getWeekdayLectionaryNumber("2024-03-01"), 1);
    });

    await t.step("Handles earliest possible Advent Sunday (November 27)", () => {
      assertEquals(getWeekdayLectionaryNumber("2022-11-27"), 1);
      assertEquals(getWeekdayLectionaryNumber("2022-11-26"), 2);
    });

    await t.step("Handles latest possible Advent Sunday (December 3)", () => {
      assertEquals(getWeekdayLectionaryNumber("2023-12-03"), 1);
      assertEquals(getWeekdayLectionaryNumber("2023-12-02"), 2);
    });
  });

  await t.step("Input format tests", async (t) => {
    await t.step("Accepts string input", () => {
      assertEquals(getWeekdayLectionaryNumber("2023-12-25"), 2);
    });

    await t.step("Accepts Temporal.PlainDate input", () => {
      const date = new Temporal.PlainDate(2023, 12, 25);
      assertEquals(getWeekdayLectionaryNumber(date), 2);
    });

    await t.step("Accepts object input", () => {
      assertEquals(getWeekdayLectionaryNumber({ year: 2023, month: 12, day: 25 }), 2);
    });
  });

  await t.step("Error cases", async (t) => {
    await t.step("Throws for invalid date string", () => {
      assertThrows(() => getWeekdayLectionaryNumber("invalid-date"), RangeError);
    });

    await t.step("Throws for invalid date object", () => {
      assertThrows(() => getWeekdayLectionaryNumber({ year: 2023, month: 13, day: 1 }), RangeError);
    });
  });
});

Deno.test("getSundayLectionaryLetter function", async (t) => {
  await t.step("Regular cases", async (t) => {
    await t.step("Returns correct letter for consecutive years", () => {
      assertEquals(getSundayLectionaryLetter("2023-01-01"), "A");
      assertEquals(getSundayLectionaryLetter("2024-01-01"), "B");
      assertEquals(getSundayLectionaryLetter("2025-01-01"), "C");
      assertEquals(getSundayLectionaryLetter("2026-01-01"), "A");
    });

    await t.step("Returns correct letter for different seasons within a church year", () => {
      assertEquals(getSundayLectionaryLetter("2023-12-25"), "A"); // Christmas
      assertEquals(getSundayLectionaryLetter("2024-01-06"), "A"); // Epiphany
      assertEquals(getSundayLectionaryLetter("2024-04-01"), "A"); // During Easter
      assertEquals(getSundayLectionaryLetter("2024-06-09"), "A"); // Pentecost
      assertEquals(getSundayLectionaryLetter("2024-11-24"), "A"); // Christ the King Sunday
    });
  });

  await t.step("Edge cases", async (t) => {
    await t.step("Handles transition at First Sunday of Advent correctly", () => {
      const years = [2023, 2024, 2025, 2026, 2027];
      const expectedLetters = ["A", "B", "C", "A", "B"];
      for (let i = 0; i < years.length; i++) {
        const year = years[i];
        const advent = getFirstSundayOfAdvent(year);
        assertEquals(getSundayLectionaryLetter(advent.subtract({ days: 1 })), expectedLetters[i]);
        assertEquals(getSundayLectionaryLetter(advent), expectedLetters[(i + 1) % 3]);
        assertEquals(getSundayLectionaryLetter(advent.add({ days: 1 })), expectedLetters[(i + 1) % 3]);
      }
    });

    await t.step("Handles leap years correctly", () => {
      assertEquals(getSundayLectionaryLetter("2024-02-29"), "A");
      assertEquals(getSundayLectionaryLetter("2024-03-01"), "A");
    });

    await t.step("Handles earliest possible Advent Sunday (November 27)", () => {
      assertEquals(getSundayLectionaryLetter("2022-11-27"), "A");
      assertEquals(getSundayLectionaryLetter("2022-11-26"), "C");
    });

    await t.step("Handles latest possible Advent Sunday (December 3)", () => {
      assertEquals(getSundayLectionaryLetter("2023-12-03"), "B");
      assertEquals(getSundayLectionaryLetter("2023-12-02"), "A");
    });
  });

  await t.step("Input format tests", async (t) => {
    await t.step("Accepts string input", () => {
      assertEquals(getSundayLectionaryLetter("2023-12-25"), "A");
    });

    await t.step("Accepts Temporal.PlainDate input", () => {
      const date = new Temporal.PlainDate(2023, 12, 25);
      assertEquals(getSundayLectionaryLetter(date), "A");
    });

    await t.step("Accepts object input", () => {
      assertEquals(getSundayLectionaryLetter({ year: 2023, month: 12, day: 25 }), "A");
    });
  });

  await t.step("Error cases", async (t) => {
    await t.step("Throws for invalid date string", () => {
      assertThrows(() => getSundayLectionaryLetter("invalid-date"), RangeError);
    });

    await t.step("Throws for invalid date object", () => {
      assertThrows(() => getSundayLectionaryLetter({ year: 2023, month: 13, day: 1 }), RangeError);
    });
  });

  await t.step("Consistency checks", async (t) => {
    await t.step("Verifies the 3-year cycle (A, B, C)", () => {
      const startYear = 2023;
      const expectedCycle = ["A", "B", "C"];
      for (let i = 0; i < 9; i++) {
        const year = startYear + i;
        const letter = getSundayLectionaryLetter(`${year}-01-01`);
        assertEquals(letter, expectedCycle[i % 3], `Year ${year} should be ${expectedCycle[i % 3]}`);
      }
    });

    await t.step("Checks consistency across multiple years", () => {
      for (let year = 2020; year <= 2030; year++) {
        const churchYear = getChurchYear(`${year}-01-01`);
        const expectedLetter = ["C", "A", "B"][churchYear % 3];
        assertEquals(
          getSundayLectionaryLetter(`${year}-01-01`),
          expectedLetter,
          `Church year ${churchYear} (calendar year ${year}) should be ${expectedLetter}`,
        );
      }
    });
  });
});

Deno.test("getEasterSunday function", async (t) => {
  await t.step("Regular cases", async (t) => {
    await t.step("Returns correct Easter dates for multiple years", () => {
      assertEquals(getEasterSunday(2023).toString(), "2023-04-09");
      assertEquals(getEasterSunday(2024).toString(), "2024-03-31");
      assertEquals(getEasterSunday(2025).toString(), "2025-04-20");
    });

    await t.step("Handles leap years correctly", () => {
      assertEquals(getEasterSunday(2024).toString(), "2024-03-31");
      assertEquals(getEasterSunday(2028).toString(), "2028-04-16");
    });
  });

  await t.step("Edge cases", async (t) => {
    await t.step("Handles earliest possible Easter date (March 22)", () => {
      assertEquals(getEasterSunday(1818).toString(), "1818-03-22");
    });

    await t.step("Handles latest possible Easter date (April 25)", () => {
      assertEquals(getEasterSunday(1943).toString(), "1943-04-25");
    });

    await t.step("Calculates Easter for different calendar systems", () => {
      const westernEaster2023 = getEasterSunday(2023);
      const julianEaster2023 = getEasterSunday(2023, { julian: true });
      const orthodoxEaster2023 = getEasterSunday(2023, { gregorian: true, julian: true });

      assertEquals(westernEaster2023.toString(), "2023-04-09");
      assertEquals(julianEaster2023.toString(), "2023-04-03");
      assertEquals(orthodoxEaster2023.toString(), "2023-04-16");
    });

    await t.step("Handles year 1", () => {
      assertEquals(getEasterSunday(1).toString(), "0001-03-25");
    });

    await t.step("Handles far future years", () => {
      assertEquals(getEasterSunday(9999).toString(), "9999-04-11");
    });
  });

  await t.step("Error cases", async (t) => {
    await t.step("Throws for non-integer years", () => {
      assertThrows(() => getEasterSunday(2023.5), RangeError);
    });

    await t.step("Throws for non-numeric input", () => {
      assertThrows(() => getEasterSunday("2023" as any), TypeError);
    });

    await t.step("Throws for years out of range", () => {
      assertThrows(() => getEasterSunday(-1), RangeError);
      assertThrows(() => getEasterSunday(275760), RangeError);
    });
  });
});

Deno.test("getWesternEaster function", async (t) => {
  await t.step("Regular cases", async (t) => {
    await t.step("Returns correct Easter dates for multiple years", () => {
      assertEquals(getWesternEaster(2023).toString(), "2023-04-09");
      assertEquals(getWesternEaster(2024).toString(), "2024-03-31");
      assertEquals(getWesternEaster(2025).toString(), "2025-04-20");
      assertEquals(getWesternEaster(2026).toString(), "2026-04-05");
      assertEquals(getWesternEaster(2027).toString(), "2027-03-28");
    });

    await t.step("Handles leap years correctly", () => {
      assertEquals(getWesternEaster(2024).toString(), "2024-03-31");
      assertEquals(getWesternEaster(2028).toString(), "2028-04-16");
      assertEquals(getWesternEaster(2032).toString(), "2032-03-28");
    });
  });

  await t.step("Edge cases", async (t) => {
    await t.step("Handles earliest possible Easter date (March 22)", () => {
      assertEquals(getWesternEaster(1818).toString(), "1818-03-22");
    });

    await t.step("Handles latest possible Easter date (April 25)", () => {
      assertEquals(getWesternEaster(1943).toString(), "1943-04-25");
    });

    await t.step("Handles year boundaries correctly", () => {
      assertEquals(getWesternEaster(1999).toString(), "1999-04-04");
      assertEquals(getWesternEaster(2000).toString(), "2000-04-23");
      assertEquals(getWesternEaster(2099).toString(), "2099-04-12");
      assertEquals(getWesternEaster(2100).toString(), "2100-03-28");
    });

    await t.step("Handles year 1", () => {
      assertEquals(getWesternEaster(1).toString(), "0001-03-25");
    });

    await t.step("Handles far future years", () => {
      assertEquals(getWesternEaster(9999).toString(), "9999-04-11");
    });
  });

  await t.step("Error cases", async (t) => {
    await t.step("Throws for non-integer years", () => {
      assertThrows(() => getWesternEaster(2023.5), RangeError);
    });

    await t.step("Throws for non-numeric input", () => {
      assertThrows(() => getWesternEaster("2023" as any), TypeError);
    });

    await t.step("Throws for years out of range", () => {
      assertThrows(() => getWesternEaster(-1), RangeError);
      assertThrows(() => getWesternEaster(275760), RangeError);
    });
  });
});

Deno.test("getJulianEaster function", async (t) => {
  await t.step("Regular cases", async (t) => {
    await t.step("Returns correct Julian Easter dates for multiple years", () => {
      assertEquals(getJulianEaster(2023).toString(), "2023-04-16");
      assertEquals(getJulianEaster(2024).toString(), "2024-05-05");
      assertEquals(getJulianEaster(2025).toString(), "2025-04-20");
      assertEquals(getJulianEaster(2026).toString(), "2026-04-12");
      assertEquals(getJulianEaster(2027).toString(), "2027-05-02");
    });

    await t.step("Handles leap years correctly", () => {
      assertEquals(getJulianEaster(2024).toString(), "2024-05-05");
      assertEquals(getJulianEaster(2028).toString(), "2028-05-01");
      assertEquals(getJulianEaster(2032).toString(), "2032-04-25");
    });
  });

  await t.step("Edge cases", async (t) => {
    await t.step("Handles earliest possible Julian Easter date (April 3)", () => {
      // Note: This date may vary depending on the specific implementation
      assertEquals(getJulianEaster(1805).toString(), "1805-04-03");
    });

    await t.step("Handles latest possible Julian Easter date (May 8)", () => {
      // Note: This date may vary depending on the specific implementation
      assertEquals(getJulianEaster(1848).toString(), "1848-05-08");
    });

    await t.step("Calculates Julian Easter across century boundaries", () => {
      assertEquals(getJulianEaster(1900).toString(), "1900-04-22");
      assertEquals(getJulianEaster(2000).toString(), "2000-04-30");
      assertEquals(getJulianEaster(2100).toString(), "2100-05-07");
    });

    await t.step("Handles year 1", () => {
      assertEquals(getJulianEaster(1).toString(), "0001-04-09");
    });

    await t.step("Handles far future years", () => {
      assertEquals(getJulianEaster(9999).toString(), "9999-04-25");
    });
  });

  await t.step("Comparison with Western Easter", async (t) => {
    await t.step("Julian Easter is always on or after Western Easter", () => {
      for (let year = 2020; year <= 2030; year++) {
        const julianEaster = getJulianEaster(year);
        const westernEaster = getWesternEaster(year);
        assertTrue(
          julianEaster >= westernEaster,
          `Julian Easter (${julianEaster}) should be on or after Western Easter (${westernEaster}) in ${year}`,
        );
      }
    });

    await t.step("Difference between Julian and Western Easter varies", () => {
      const differences = new Set();
      for (let year = 2020; year <= 2050; year++) {
        const julianEaster = getJulianEaster(year);
        const westernEaster = getWesternEaster(year);
        const difference = julianEaster.since(westernEaster, { largestUnit: "day" }).days;
        differences.add(difference);
      }
      assertTrue(differences.size > 1, "There should be varying differences between Julian and Western Easter dates");
    });
  });

  await t.step("Error cases", async (t) => {
    await t.step("Throws for non-integer years", () => {
      assertThrows(() => getJulianEaster(2023.5), RangeError);
    });

    await t.step("Throws for non-numeric input", () => {
      assertThrows(() => getJulianEaster("2023" as any), TypeError);
    });

    await t.step("Throws for years out of range", () => {
      assertThrows(() => getJulianEaster(-1), RangeError);
      assertThrows(() => getJulianEaster(275760), RangeError);
    });
  });
});

Deno.test("getOrthodoxEaster function", async (t) => {
  await t.step("Regular cases", async (t) => {
    await t.step("Returns correct Orthodox Easter dates for multiple years", () => {
      assertEquals(getOrthodoxEaster(2023).toString(), "2023-04-16");
      assertEquals(getOrthodoxEaster(2024).toString(), "2024-05-05");
      assertEquals(getOrthodoxEaster(2025).toString(), "2025-04-20");
      assertEquals(getOrthodoxEaster(2026).toString(), "2026-04-12");
      assertEquals(getOrthodoxEaster(2027).toString(), "2027-05-02");
    });

    await t.step("Handles leap years correctly", () => {
      assertEquals(getOrthodoxEaster(2024).toString(), "2024-05-05");
      assertEquals(getOrthodoxEaster(2028).toString(), "2028-04-16");
      assertEquals(getOrthodoxEaster(2032).toString(), "2032-05-02");
    });
  });

  await t.step("Edge cases", async (t) => {
    await t.step("Handles earliest possible Orthodox Easter date (April 4)", () => {
      assertEquals(getOrthodoxEaster(2010).toString(), "2010-04-04");
    });

    await t.step("Handles latest possible Orthodox Easter date (May 8)", () => {
      assertEquals(getOrthodoxEaster(1983).toString(), "1983-05-08");
    });

    await t.step("Calculates Orthodox Easter across century boundaries", () => {
      assertEquals(getOrthodoxEaster(1900).toString(), "1900-04-22");
      assertEquals(getOrthodoxEaster(2000).toString(), "2000-04-30");
      assertEquals(getOrthodoxEaster(2100).toString(), "2100-05-02");
    });

    await t.step("Handles year 1", () => {
      assertEquals(getOrthodoxEaster(1).toString(), "0001-04-09");
    });

    await t.step("Handles far future years", () => {
      assertEquals(getOrthodoxEaster(9999).toString(), "9999-04-11");
    });
  });

  await t.step("Comparison with Western Easter", async (t) => {
    await t.step("Orthodox Easter is always on or after Western Easter", () => {
      for (let year = 2020; year <= 2030; year++) {
        const orthodoxEaster = getOrthodoxEaster(year);
        const westernEaster = getWesternEaster(year);
        assertTrue(
          orthodoxEaster >= westernEaster,
          `Orthodox Easter (${orthodoxEaster}) should be on or after Western Easter (${westernEaster}) in ${year}`,
        );
      }
    });

    await t.step("Difference between Orthodox and Western Easter varies", () => {
      const differences = new Set();
      for (let year = 2020; year <= 2050; year++) {
        const orthodoxEaster = getOrthodoxEaster(year);
        const westernEaster = getWesternEaster(year);
        const difference = orthodoxEaster.since(westernEaster, { largestUnit: "day" }).days;
        differences.add(difference);
      }
      assertTrue(differences.size > 1, "There should be varying differences between Orthodox and Western Easter dates");
    });
  });

  await t.step("Consistency checks", async (t) => {
    await t.step("Orthodox Easter is always on a Sunday", () => {
      for (let year = 2020; year <= 2030; year++) {
        const orthodoxEaster = getOrthodoxEaster(year);
        assertEquals(orthodoxEaster.dayOfWeek, 7, `Orthodox Easter should always be on a Sunday (year ${year})`);
      }
    });

    await t.step("Orthodox Easter is always between April 4 and May 8", () => {
      for (let year = 1900; year <= 2100; year++) {
        const orthodoxEaster = getOrthodoxEaster(year);
        assertTrue(
          (orthodoxEaster.month === 4 && orthodoxEaster.day >= 4) ||
            (orthodoxEaster.month === 5 && orthodoxEaster.day <= 8),
          `Orthodox Easter should be between April 4 and May 8 (year ${year})`,
        );
      }
    });
  });

  await t.step("Error cases", async (t) => {
    await t.step("Throws for non-integer years", () => {
      assertThrows(() => getOrthodoxEaster(2023.5), RangeError);
    });

    await t.step("Throws for non-numeric input", () => {
      assertThrows(() => getOrthodoxEaster("2023" as any), TypeError);
    });

    await t.step("Throws for years out of range", () => {
      assertThrows(() => getOrthodoxEaster(-1), RangeError);
      assertThrows(() => getOrthodoxEaster(275760), RangeError);
    });
  });
});

Deno.test("getEpiphany function", async (t) => {
  await t.step("Regular cases", async (t) => {
    await t.step("Returns correct date for multiple years", () => {
      assertEquals(getEpiphany(2023).toString(), "2023-01-06");
      assertEquals(getEpiphany(2024).toString(), "2024-01-06");
      assertEquals(getEpiphany(2025).toString(), "2025-01-06");
    });

    await t.step("Accepts string input", () => {
      assertEquals(getEpiphany("2023-12-25").toString(), "2024-01-06");
      assertEquals(getEpiphany("2024-01-01").toString(), "2024-01-06");
    });

    await t.step("Accepts Temporal.PlainDate input", () => {
      const date = new Temporal.PlainDate(2023, 12, 25);
      assertEquals(getEpiphany(date).toString(), "2024-01-06");
    });

    await t.step("Accepts object input", () => {
      assertEquals(getEpiphany({ year: 2023, month: 12, day: 25 }).toString(), "2024-01-06");
    });
  });

  await t.step("Edge cases", async (t) => {
    await t.step("Handles leap years correctly", () => {
      assertEquals(getEpiphany(2024).toString(), "2024-01-06");
      assertEquals(getEpiphany(2028).toString(), "2028-01-06");
    });

    await t.step("Handles year boundaries correctly", () => {
      assertEquals(getEpiphany("2023-12-31").toString(), "2024-01-06");
      assertEquals(getEpiphany("2024-01-01").toString(), "2024-01-06");
    });

    await t.step("Handles very early years", () => {
      assertEquals(getEpiphany(1).toString(), "0001-01-06");
    });

    await t.step("Handles far future years", () => {
      assertEquals(getEpiphany(9999).toString(), "9999-01-06");
    });

    await t.step("Handles negative years (BCE)", () => {
      assertEquals(getEpiphany(-1).toString(), "-000001-01-06");
    });
  });

  await t.step("Consistency checks", async (t) => {
    await t.step("Epiphany is always on January 6th", () => {
      for (let year = 2020; year <= 2030; year++) {
        const epiphany = getEpiphany(year);
        assertEquals(epiphany.month, 1, `Month should be January for year ${year}`);
        assertEquals(epiphany.day, 6, `Day should be 6th for year ${year}`);
      }
    });

    await t.step("Epiphany is in the correct church year", () => {
      assertEquals(getEpiphany("2023-12-25").year, 2024);
      assertEquals(getEpiphany("2024-01-01").year, 2024);
      assertEquals(getEpiphany("2024-01-07").year, 2024);
    });
  });

  await t.step("Error cases", async (t) => {
    await t.step("Throws for invalid date string", () => {
      assertThrows(() => getEpiphany("invalid-date"), RangeError);
    });

    await t.step("Throws for invalid date object", () => {
      assertThrows(() => getEpiphany({ year: 2023, month: 13, day: 1 }), RangeError);
    });

    await t.step("Throws for non-integer years", () => {
      assertThrows(() => getEpiphany(2023.5), RangeError);
    });

    await t.step("Throws for years out of range", () => {
      assertThrows(() => getEpiphany(-271821), RangeError);
      assertThrows(() => getEpiphany(275760), RangeError);
    });
  });
});

Deno.test("getTheBaptismOfChrist function", async (t) => {
  await t.step("Regular cases", async (t) => {
    await t.step("Returns correct date for multiple years", () => {
      assertEquals(getTheBaptismOfChrist(2023).toString(), "2023-01-08");
      assertEquals(getTheBaptismOfChrist(2024).toString(), "2024-01-07");
      assertEquals(getTheBaptismOfChrist(2025).toString(), "2025-01-12");
    });

    await t.step("Accepts string input", () => {
      assertEquals(getTheBaptismOfChrist("2023-12-25").toString(), "2024-01-07");
    });

    await t.step("Accepts Temporal.PlainDate input", () => {
      const date = new Temporal.PlainDate(2023, 12, 25);
      assertEquals(getTheBaptismOfChrist(date).toString(), "2024-01-07");
    });

    await t.step("Accepts object input", () => {
      assertEquals(getTheBaptismOfChrist({ year: 2023, month: 12, day: 25 }).toString(), "2024-01-07");
    });
  });

  await t.step("Edge cases", async (t) => {
    await t.step("When Epiphany falls on a Sunday", () => {
      assertEquals(getTheBaptismOfChrist(2019).toString(), "2019-01-13");
    });

    await t.step("When Epiphany is on January 6 or before", () => {
      assertEquals(getTheBaptismOfChrist(2023).toString(), "2023-01-08");
    });

    await t.step("When Epiphany is on January 7 or 8", () => {
      assertEquals(getTheBaptismOfChrist(2024).toString(), "2024-01-07");
      assertEquals(getTheBaptismOfChrist(2025).toString(), "2025-01-12");
    });

    await t.step("Handles leap years correctly", () => {
      assertEquals(getTheBaptismOfChrist(2024).toString(), "2024-01-07");
      assertEquals(getTheBaptismOfChrist(2028).toString(), "2028-01-09");
    });

    await t.step("Handles year boundaries correctly", () => {
      assertEquals(getTheBaptismOfChrist("2023-12-31").toString(), "2024-01-07");
      assertEquals(getTheBaptismOfChrist("2024-01-01").toString(), "2024-01-07");
    });
  });

  await t.step("Consistency checks", async (t) => {
    await t.step("Baptism of Christ is always after Epiphany", () => {
      for (let year = 2020; year <= 2030; year++) {
        const baptism = getTheBaptismOfChrist(year);
        assertTrue(Temporal.PlainDate.compare(baptism, new Temporal.PlainDate(year, 1, 6)) > 0);
      }
    });

    await t.step("Baptism of Christ is always on a Sunday or Monday", () => {
      for (let year = 2020; year <= 2030; year++) {
        const baptism = getTheBaptismOfChrist(year);
        assertTrue([0, 1].includes(baptism.dayOfWeek));
      }
    });
  });

  await t.step("Error cases", async (t) => {
    await t.step("Throws for invalid date string", () => {
      assertThrows(() => getTheBaptismOfChrist("invalid-date"), RangeError);
    });

    await t.step("Throws for invalid date object", () => {
      assertThrows(() => getTheBaptismOfChrist({ year: 2023, month: 13, day: 1 }), RangeError);
    });

    await t.step("Throws for non-integer years", () => {
      assertThrows(() => getTheBaptismOfChrist(2023.5), RangeError);
    });

    await t.step("Throws for years out of range", () => {
      assertThrows(() => getTheBaptismOfChrist(-271821), RangeError);
      assertThrows(() => getTheBaptismOfChrist(275760), RangeError);
    });
  });
});

Deno.test("getAshWednesday function", async (t) => {
  await t.step("Regular cases", async (t) => {
    await t.step("Returns correct Ash Wednesday dates for multiple years", () => {
      assertEquals(getAshWednesday(2023).toString(), "2023-02-22");
      assertEquals(getAshWednesday(2024).toString(), "2024-02-14");
      assertEquals(getAshWednesday(2025).toString(), "2025-03-05");
    });

    await t.step("Handles leap years correctly", () => {
      assertEquals(getAshWednesday(2024).toString(), "2024-02-14");
      assertEquals(getAshWednesday(2028).toString(), "2028-02-16");
    });

    await t.step("Ash Wednesday is always 46 days before Easter", () => {
      for (let year = 2020; year <= 2030; year++) {
        const ashWednesday = getAshWednesday(year);
        const easter = getWesternEaster(year);
        assertEquals(ashWednesday.until(easter, { largestUnit: "day" }).days, 46);
      }
    });
  });

  await t.step("Edge cases", async (t) => {
    await t.step("Handles earliest possible Ash Wednesday date (February 4)", () => {
      // This occurs when Easter is on March 22
      const earliestEasterYear = 1818;
      assertEquals(getAshWednesday(earliestEasterYear).toString(), "1818-02-04");
    });

    await t.step("Handles latest possible Ash Wednesday date (March 10)", () => {
      // This occurs when Easter is on April 25
      const latestEasterYear = 1943;
      assertEquals(getAshWednesday(latestEasterYear).toString(), "1943-03-10");
    });
  });

  await t.step("Input format tests", async (t) => {
    await t.step("Accepts string input", () => {
      assertEquals(getAshWednesday("2023-01-01").toString(), "2023-02-22");
    });

    await t.step("Accepts Temporal.PlainDate input", () => {
      const date = new Temporal.PlainDate(2023, 1, 1);
      assertEquals(getAshWednesday(date).toString(), "2023-02-22");
    });

    await t.step("Accepts object input", () => {
      assertEquals(getAshWednesday({ year: 2023, month: 1, day: 1 }).toString(), "2023-02-22");
    });
  });

  await t.step("Error cases", async (t) => {
    await t.step("Throws for invalid date string", () => {
      assertThrows(() => getAshWednesday("invalid-date"), RangeError);
    });

    await t.step("Throws for invalid date object", () => {
      assertThrows(() => getAshWednesday({ year: 2023, month: 13, day: 1 }), RangeError);
    });

    await t.step("Throws for non-integer years", () => {
      assertThrows(() => getAshWednesday(2023.5), RangeError);
    });

    await t.step("Throws for years out of range", () => {
      assertThrows(() => getAshWednesday(-1), RangeError);
      assertThrows(() => getAshWednesday(275760), RangeError);
    });
  });
});

Deno.test("getMaundyThursday function", async (t) => {
  await t.step("Regular cases", async (t) => {
    await t.step("Returns correct Maundy Thursday dates for multiple years", () => {
      assertEquals(getMaundyThursday(2023).toString(), "2023-04-06");
      assertEquals(getMaundyThursday(2024).toString(), "2024-03-28");
      assertEquals(getMaundyThursday(2025).toString(), "2025-04-17");
    });

    await t.step("Handles leap years correctly", () => {
      assertEquals(getMaundyThursday(2024).toString(), "2024-03-28");
      assertEquals(getMaundyThursday(2028).toString(), "2028-04-13");
    });

    await t.step("Maundy Thursday is always 3 days before Easter", () => {
      for (let year = 2020; year <= 2030; year++) {
        const maundyThursday = getMaundyThursday(year);
        const easter = getWesternEaster(year);
        assertEquals(maundyThursday.until(easter, { largestUnit: "day" }).days, 3);
      }
    });
  });

  await t.step("Edge cases", async (t) => {
    await t.step("Handles earliest possible Maundy Thursday date (March 19)", () => {
      // This occurs when Easter is on March 22
      const earliestEasterYear = 1818;
      assertEquals(getMaundyThursday(earliestEasterYear).toString(), "1818-03-19");
    });

    await t.step("Handles latest possible Maundy Thursday date (April 22)", () => {
      // This occurs when Easter is on April 25
      const latestEasterYear = 1943;
      assertEquals(getMaundyThursday(latestEasterYear).toString(), "1943-04-22");
    });
  });

  await t.step("Input format tests", async (t) => {
    await t.step("Accepts string input", () => {
      assertEquals(getMaundyThursday("2023-01-01").toString(), "2023-04-06");
    });

    await t.step("Accepts Temporal.PlainDate input", () => {
      const date = new Temporal.PlainDate(2023, 1, 1);
      assertEquals(getMaundyThursday(date).toString(), "2023-04-06");
    });

    await t.step("Accepts object input", () => {
      assertEquals(getMaundyThursday({ year: 2023, month: 1, day: 1 }).toString(), "2023-04-06");
    });
  });

  await t.step("Error cases", async (t) => {
    await t.step("Throws for invalid date string", () => {
      assertThrows(() => getMaundyThursday("invalid-date"), RangeError);
    });

    await t.step("Throws for invalid date object", () => {
      assertThrows(() => getMaundyThursday({ year: 2023, month: 13, day: 1 }), RangeError);
    });

    await t.step("Throws for non-integer years", () => {
      assertThrows(() => getMaundyThursday(2023.5), RangeError);
    });

    await t.step("Throws for years out of range", () => {
      assertThrows(() => getMaundyThursday(-1), RangeError);
      assertThrows(() => getMaundyThursday(275760), RangeError);
    });
  });
});

Deno.test("getGoodFriday function", async (t) => {
  await t.step("Regular cases", async (t) => {
    await t.step("Returns correct Good Friday dates for multiple years", () => {
      assertEquals(getGoodFriday(2023).toString(), "2023-04-07");
      assertEquals(getGoodFriday(2024).toString(), "2024-03-29");
      assertEquals(getGoodFriday(2025).toString(), "2025-04-18");
    });

    await t.step("Handles leap years correctly", () => {
      assertEquals(getGoodFriday(2024).toString(), "2024-03-29");
      assertEquals(getGoodFriday(2028).toString(), "2028-04-14");
    });

    await t.step("Good Friday is always 2 days before Easter", () => {
      for (let year = 2020; year <= 2030; year++) {
        const goodFriday = getGoodFriday(year);
        const easter = getWesternEaster(year);
        assertEquals(goodFriday.until(easter, { largestUnit: "day" }).days, 2);
      }
    });
  });

  await t.step("Edge cases", async (t) => {
    await t.step("Handles earliest possible Good Friday date (March 20)", () => {
      // This occurs when Easter is on March 22
      const earliestEasterYear = 1818;
      assertEquals(getGoodFriday(earliestEasterYear).toString(), "1818-03-20");
    });

    await t.step("Handles latest possible Good Friday date (April 23)", () => {
      // This occurs when Easter is on April 25
      const latestEasterYear = 1943;
      assertEquals(getGoodFriday(latestEasterYear).toString(), "1943-04-23");
    });
  });

  await t.step("Input format tests", async (t) => {
    await t.step("Accepts string input", () => {
      assertEquals(getGoodFriday("2023-01-01").toString(), "2023-04-07");
    });

    await t.step("Accepts Temporal.PlainDate input", () => {
      const date = new Temporal.PlainDate(2023, 1, 1);
      assertEquals(getGoodFriday(date).toString(), "2023-04-07");
    });

    await t.step("Accepts object input", () => {
      assertEquals(getGoodFriday({ year: 2023, month: 1, day: 1 }).toString(), "2023-04-07");
    });
  });

  await t.step("Error cases", async (t) => {
    await t.step("Throws for invalid date string", () => {
      assertThrows(() => getGoodFriday("invalid-date"), RangeError);
    });

    await t.step("Throws for invalid date object", () => {
      assertThrows(() => getGoodFriday({ year: 2023, month: 13, day: 1 }), RangeError);
    });

    await t.step("Throws for non-integer years", () => {
      assertThrows(() => getGoodFriday(2023.5), RangeError);
    });

    await t.step("Throws for years out of range", () => {
      assertThrows(() => getGoodFriday(-1), RangeError);
      assertThrows(() => getGoodFriday(275760), RangeError);
    });
  });
});

Deno.test("getAscensionDay function", async (t) => {
  await t.step("Regular cases", async (t) => {
    await t.step("Returns correct Ascension Day dates for multiple years", () => {
      assertEquals(getAscensionDay(2023).toString(), "2023-05-18");
      assertEquals(getAscensionDay(2024).toString(), "2024-05-09");
      assertEquals(getAscensionDay(2025).toString(), "2025-05-29");
    });

    await t.step("Handles leap years correctly", () => {
      assertEquals(getAscensionDay(2024).toString(), "2024-05-09");
      assertEquals(getAscensionDay(2028).toString(), "2028-05-04");
    });

    await t.step("Ascension Day is always 40 days after Easter", () => {
      for (let year = 2020; year <= 2030; year++) {
        const ascensionDay = getAscensionDay(year);
        const easter = getWesternEaster(year);
        assertEquals(easter.until(ascensionDay, { largestUnit: "day" }).days, 39);
      }
    });
  });

  await t.step("Edge cases", async (t) => {
    await t.step("Handles earliest possible Ascension Day date (April 30)", () => {
      // This occurs when Easter is on March 22
      const earliestEasterYear = 1818;
      assertEquals(getAscensionDay(earliestEasterYear).toString(), "1818-04-30");
    });

    await t.step("Handles latest possible Ascension Day date (June 3)", () => {
      // This occurs when Easter is on April 25
      const latestEasterYear = 1943;
      assertEquals(getAscensionDay(latestEasterYear).toString(), "1943-06-03");
    });
  });

  await t.step("Input format tests", async (t) => {
    await t.step("Accepts string input", () => {
      assertEquals(getAscensionDay("2023-01-01").toString(), "2023-05-18");
    });

    await t.step("Accepts Temporal.PlainDate input", () => {
      const date = new Temporal.PlainDate(2023, 1, 1);
      assertEquals(getAscensionDay(date).toString(), "2023-05-18");
    });

    await t.step("Accepts object input", () => {
      assertEquals(getAscensionDay({ year: 2023, month: 1, day: 1 }).toString(), "2023-05-18");
    });
  });

  await t.step("Error cases", async (t) => {
    await t.step("Throws for invalid date string", () => {
      assertThrows(() => getAscensionDay("invalid-date"), RangeError);
    });

    await t.step("Throws for invalid date object", () => {
      assertThrows(() => getAscensionDay({ year: 2023, month: 13, day: 1 }), RangeError);
    });

    await t.step("Throws for non-integer years", () => {
      assertThrows(() => getAscensionDay(2023.5), RangeError);
    });

    await t.step("Throws for years out of range", () => {
      assertThrows(() => getAscensionDay(-1), RangeError);
      assertThrows(() => getAscensionDay(275760), RangeError);
    });
  });
});

Deno.test("getDayOfPentecost function", async (t) => {
  await t.step("Regular cases", async (t) => {
    await t.step("Returns correct Pentecost dates for multiple years", () => {
      assertEquals(getDayOfPentecost(2023).toString(), "2023-05-28");
      assertEquals(getDayOfPentecost(2024).toString(), "2024-05-19");
      assertEquals(getDayOfPentecost(2025).toString(), "2025-06-08");
    });

    await t.step("Handles leap years correctly", () => {
      assertEquals(getDayOfPentecost(2024).toString(), "2024-05-19");
      assertEquals(getDayOfPentecost(2028).toString(), "2028-05-14");
    });

    await t.step("Pentecost is always 49 days after Easter", () => {
      for (let year = 2020; year <= 2030; year++) {
        const pentecost = getDayOfPentecost(year);
        const easter = getWesternEaster(year);
        assertEquals(easter.until(pentecost, { largestUnit: "day" }).days, 49);
      }
    });
  });

  await t.step("Edge cases", async (t) => {
    await t.step("Handles earliest possible Pentecost date (May 10)", () => {
      // This occurs when Easter is on March 22
      const earliestEasterYear = 1818;
      assertEquals(getDayOfPentecost(earliestEasterYear).toString(), "1818-05-10");
    });

    await t.step("Handles latest possible Pentecost date (June 13)", () => {
      // This occurs when Easter is on April 25
      const latestEasterYear = 1943;
      assertEquals(getDayOfPentecost(latestEasterYear).toString(), "1943-06-13");
    });
  });

  await t.step("Input format tests", async (t) => {
    await t.step("Accepts string input", () => {
      assertEquals(getDayOfPentecost("2023-01-01").toString(), "2023-05-28");
    });

    await t.step("Accepts Temporal.PlainDate input", () => {
      const date = new Temporal.PlainDate(2023, 1, 1);
      assertEquals(getDayOfPentecost(date).toString(), "2023-05-28");
    });

    await t.step("Accepts object input", () => {
      assertEquals(getDayOfPentecost({ year: 2023, month: 1, day: 1 }).toString(), "2023-05-28");
    });
  });

  await t.step("Error cases", async (t) => {
    await t.step("Throws for invalid date string", () => {
      assertThrows(() => getDayOfPentecost("invalid-date"), RangeError);
    });

    await t.step("Throws for invalid date object", () => {
      assertThrows(() => getDayOfPentecost({ year: 2023, month: 13, day: 1 }), RangeError);
    });

    await t.step("Throws for non-integer years", () => {
      assertThrows(() => getDayOfPentecost(2023.5), RangeError);
    });

    await t.step("Throws for years out of range", () => {
      assertThrows(() => getDayOfPentecost(-1), RangeError);
      assertThrows(() => getDayOfPentecost(275760), RangeError);
    });
  });
});

Deno.test("getTrinitySunday function", async (t) => {
  await t.step("Regular cases", async (t) => {
    await t.step("Returns correct Trinity Sunday dates for multiple years", () => {
      assertEquals(getTrinitySunday(2023).toString(), "2023-06-04");
      assertEquals(getTrinitySunday(2024).toString(), "2024-05-26");
      assertEquals(getTrinitySunday(2025).toString(), "2025-06-15");
    });

    await t.step("Handles leap years correctly", () => {
      assertEquals(getTrinitySunday(2024).toString(), "2024-05-26");
      assertEquals(getTrinitySunday(2028).toString(), "2028-05-21");
    });

    await t.step("Trinity Sunday is always 7 days after Pentecost", () => {
      for (let year = 2020; year <= 2030; year++) {
        const trinitySunday = getTrinitySunday(year);
        const pentecost = getDayOfPentecost(year);
        assertEquals(pentecost.until(trinitySunday, { largestUnit: "day" }).days, 7);
      }
    });
  });

  await t.step("Edge cases", async (t) => {
    await t.step("Handles earliest possible Trinity Sunday date (May 17)", () => {
      // This occurs when Easter is on March 22
      const earliestEasterYear = 1818;
      assertEquals(getTrinitySunday(earliestEasterYear).toString(), "1818-05-17");
    });

    await t.step("Handles latest possible Trinity Sunday date (June 20)", () => {
      // This occurs when Easter is on April 25
      const latestEasterYear = 1943;
      assertEquals(getTrinitySunday(latestEasterYear).toString(), "1943-06-20");
    });
  });

  await t.step("Input format tests", async (t) => {
    await t.step("Accepts string input", () => {
      assertEquals(getTrinitySunday("2023-01-01").toString(), "2023-06-04");
    });

    await t.step("Accepts Temporal.PlainDate input", () => {
      const date = new Temporal.PlainDate(2023, 1, 1);
      assertEquals(getTrinitySunday(date).toString(), "2023-06-04");
    });

    await t.step("Accepts object input", () => {
      assertEquals(getTrinitySunday({ year: 2023, month: 1, day: 1 }).toString(), "2023-06-04");
    });

    await t.step("Accepts number input (year)", () => {
      assertEquals(getTrinitySunday(2023).toString(), "2023-06-04");
    });
  });

  await t.step("Error cases", async (t) => {
    await t.step("Throws for invalid date string", () => {
      assertThrows(() => getTrinitySunday("invalid-date"), RangeError);
    });

    await t.step("Throws for invalid date object", () => {
      assertThrows(() => getTrinitySunday({ year: 2023, month: 13, day: 1 }), RangeError);
    });
  });
});

Deno.test("getCorpusChristi function", async (t) => {
  await t.step("Regular cases", async (t) => {
    await t.step("Returns correct Corpus Christi dates for multiple years", () => {
      assertEquals(getCorpusChristi(2023).toString(), "2023-06-08");
      assertEquals(getCorpusChristi(2024).toString(), "2024-05-30");
      assertEquals(getCorpusChristi(2025).toString(), "2025-06-19");
    });

    await t.step("Corpus Christi is always 4 days after Trinity Sunday", () => {
      for (let year = 2020; year <= 2030; year++) {
        const corpusChristi = getCorpusChristi(year);
        const trinitySunday = getTrinitySunday(year);
        assertEquals(trinitySunday.until(corpusChristi, { largestUnit: "day" }).days, 4);
      }
    });

    await t.step("Handles leap years correctly", () => {
      assertEquals(getCorpusChristi(2024).toString(), "2024-05-30");
      assertEquals(getCorpusChristi(2028).toString(), "2028-05-25");
    });
  });

  await t.step("Edge cases", async (t) => {
    await t.step("Handles earliest possible Corpus Christi date (May 21)", () => {
      // This occurs when Easter is on March 22
      const earliestEasterYear = 1818;
      assertEquals(getCorpusChristi(earliestEasterYear).toString(), "1818-05-21");
    });

    await t.step("Handles latest possible Corpus Christi date (June 24)", () => {
      // This occurs when Easter is on April 25
      const latestEasterYear = 1943;
      assertEquals(getCorpusChristi(latestEasterYear).toString(), "1943-06-24");
    });
  });

  await t.step("Input format tests", async (t) => {
    await t.step("Accepts string input", () => {
      assertEquals(getCorpusChristi("2023-01-01").toString(), "2023-06-08");
    });

    await t.step("Accepts Temporal.PlainDate input", () => {
      const date = new Temporal.PlainDate(2023, 1, 1);
      assertEquals(getCorpusChristi(date).toString(), "2023-06-08");
    });

    await t.step("Accepts object input", () => {
      assertEquals(getCorpusChristi({ year: 2023, month: 1, day: 1 }).toString(), "2023-06-08");
    });

    await t.step("Accepts number input (year)", () => {
      assertEquals(getCorpusChristi(2023).toString(), "2023-06-08");
    });
  });

  await t.step("Error cases", async (t) => {
    await t.step("Throws for invalid date string", () => {
      assertThrows(() => getCorpusChristi("invalid-date"), RangeError);
    });

    await t.step("Throws for invalid date object", () => {
      assertThrows(() => getCorpusChristi({ year: 2023, month: 13, day: 1 }), RangeError);
    });

    await t.step("Throws for years out of range", () => {
      assertThrows(() => getCorpusChristi(-271821), RangeError);
      assertThrows(() => getCorpusChristi(275760), RangeError);
    });
  });
});

Deno.test("getChristTheKing function", async (t) => {
  await t.step("Regular cases", async (t) => {
    await t.step("Returns correct Christ the King Sunday dates for multiple years", () => {
      assertEquals(getChristTheKing(2023).toString(), "2023-11-26");
      assertEquals(getChristTheKing(2024).toString(), "2024-11-24");
      assertEquals(getChristTheKing(2025).toString(), "2025-11-23");
    });

    await t.step("Christ the King Sunday is always the Sunday before the First Sunday of Advent", () => {
      for (let year = 2020; year <= 2030; year++) {
        const christTheKing = getChristTheKing(year);
        const firstAdvent = getFirstSundayOfAdvent(year);
        assertEquals(christTheKing.until(firstAdvent, { largestUnit: "day" }).days, 7);
      }
    });

    await t.step("Handles leap years correctly", () => {
      assertEquals(getChristTheKing(2024).toString(), "2024-11-24");
      assertEquals(getChristTheKing(2028).toString(), "2028-11-26");
    });
  });

  await t.step("Edge cases", async (t) => {
    await t.step("Handles earliest possible Christ the King Sunday date (November 20)", () => {
      assertEquals(getChristTheKing(2021).toString(), "2021-11-21");
    });

    await t.step("Handles latest possible Christ the King Sunday date (November 26)", () => {
      assertEquals(getChristTheKing(2023).toString(), "2023-11-26");
    });
  });

  await t.step("Input format tests", async (t) => {
    await t.step("Accepts string input", () => {
      assertEquals(getChristTheKing("2023-01-01").toString(), "2023-11-26");
    });

    await t.step("Accepts Temporal.PlainDate input", () => {
      const date = new Temporal.PlainDate(2023, 1, 1);
      assertEquals(getChristTheKing(date).toString(), "2023-11-26");
    });

    await t.step("Accepts object input", () => {
      assertEquals(getChristTheKing({ year: 2023, month: 1, day: 1 }).toString(), "2023-11-26");
    });

    await t.step("Accepts number input (year)", () => {
      assertEquals(getChristTheKing(2023).toString(), "2023-11-26");
    });
  });

  await t.step("Consistency checks", async (t) => {
    await t.step("Christ the King Sunday is always on a Sunday", () => {
      for (let year = 2020; year <= 2030; year++) {
        const christTheKing = getChristTheKing(year);
        assertEquals(christTheKing.dayOfWeek, 7, `Christ the King Sunday should be on a Sunday in ${year}`);
      }
    });

    await t.step("Christ the King Sunday is always in November", () => {
      for (let year = 2020; year <= 2030; year++) {
        const christTheKing = getChristTheKing(year);
        assertEquals(christTheKing.month, 11, `Christ the King Sunday should be in November in ${year}`);
      }
    });
  });

  await t.step("Error cases", async (t) => {
    await t.step("Throws for invalid date string", () => {
      assertThrows(() => getChristTheKing("invalid-date"), RangeError);
    });

    await t.step("Throws for invalid date object", () => {
      assertThrows(() => getChristTheKing({ year: 2023, month: 13, day: 1 }), RangeError);
    });

    await t.step("Throws for non-integer years", () => {
      assertThrows(() => getChristTheKing(2023.5), RangeError);
    });

    await t.step("Throws for years out of range", () => {
      assertThrows(() => getChristTheKing(-271821), RangeError);
      assertThrows(() => getChristTheKing(275760), RangeError);
    });
  });
});

Deno.test("getMoveableDates function", async (t) => {
  await t.step("Regular cases", async (t) => {
    await t.step("Returns correct dates for multiple years", () => {
      const dates2023 = getMoveableDates(2023);
      assertEquals(dates2023.ashWednesday.toString(), "2023-02-22");
      assertEquals(dates2023.palmSunday.toString(), "2023-04-02");
      assertEquals(dates2023.maundyThursday.toString(), "2023-04-06");
      assertEquals(dates2023.goodFriday.toString(), "2023-04-07");
      assertEquals(dates2023.easterSunday.toString(), "2023-04-09");
      assertEquals(dates2023.ascensionDay.toString(), "2023-05-18");
      assertEquals(dates2023.pentecostSunday.toString(), "2023-05-28");
      assertEquals(dates2023.trinitySunday.toString(), "2023-06-04");

      const dates2024 = getMoveableDates(2024);
      assertEquals(dates2024.ashWednesday.toString(), "2024-02-14");
      assertEquals(dates2024.easterSunday.toString(), "2024-03-31");
    });

    await t.step("Handles leap years correctly", () => {
      const dates2024 = getMoveableDates(2024);
      assertEquals(dates2024.ashWednesday.toString(), "2024-02-14");
      assertEquals(dates2024.easterSunday.toString(), "2024-03-31");

      const dates2028 = getMoveableDates(2028);
      assertEquals(dates2028.ashWednesday.toString(), "2028-03-01");
      assertEquals(dates2028.easterSunday.toString(), "2028-04-16");
    });
  });

  await t.step("Edge cases", async (t) => {
    await t.step("Handles earliest possible Easter date (March 22)", () => {
      const dates1818 = getMoveableDates(1818);
      assertEquals(dates1818.ashWednesday.toString(), "1818-02-04");
      assertEquals(dates1818.easterSunday.toString(), "1818-03-22");
      assertEquals(dates1818.pentecostSunday.toString(), "1818-05-10");
    });

    await t.step("Handles latest possible Easter date (April 25)", () => {
      const dates1943 = getMoveableDates(1943);
      assertEquals(dates1943.ashWednesday.toString(), "1943-03-10");
      assertEquals(dates1943.easterSunday.toString(), "1943-04-25");
      assertEquals(dates1943.pentecostSunday.toString(), "1943-06-13");
    });
  });

  await t.step("Input format tests", async (t) => {
    await t.step("Accepts string input", () => {
      const dates = getMoveableDates("2023-01-01");
      assertEquals(dates.easterSunday.toString(), "2023-04-09");
    });

    await t.step("Accepts Temporal.PlainDate input", () => {
      const date = new Temporal.PlainDate(2023, 1, 1);
      const dates = getMoveableDates(date);
      assertEquals(dates.easterSunday.toString(), "2023-04-09");
    });

    await t.step("Accepts object input", () => {
      const dates = getMoveableDates({ year: 2023, month: 1, day: 1 });
      assertEquals(dates.easterSunday.toString(), "2023-04-09");
    });
  });

  await t.step("Consistency checks", async (t) => {
    await t.step("Correct intervals between dates", () => {
      const dates = getMoveableDates(2025);
      assertEquals(dates.ashWednesday.until(dates.easterSunday, { largestUnit: "day" }).days, 46);
      assertEquals(dates.palmSunday.until(dates.easterSunday, { largestUnit: "day" }).days, 7);
      assertEquals(dates.maundyThursday.until(dates.easterSunday, { largestUnit: "day" }).days, 3);
      assertEquals(dates.goodFriday.until(dates.easterSunday, { largestUnit: "day" }).days, 2);
      assertEquals(dates.easterSunday.until(dates.ascensionDay, { largestUnit: "day" }).days, 39);
      assertEquals(dates.easterSunday.until(dates.pentecostSunday, { largestUnit: "day" }).days, 49);
      assertEquals(dates.pentecostSunday.until(dates.trinitySunday, { largestUnit: "day" }).days, 7);
    });

    await t.step("All dates are in the same year", () => {
      const dates = getMoveableDates(2026);
      const year = dates.easterSunday.year;
      for (const date of Object.values(dates)) {
        assertEquals(date.year, year);
      }
    });
  });

  await t.step("Error cases", async (t) => {
    await t.step("Throws for invalid date string", () => {
      assertThrows(() => getMoveableDates("invalid-date"), RangeError);
    });

    await t.step("Throws for invalid date object", () => {
      assertThrows(() => getMoveableDates({ year: 2023, month: 13, day: 1 }), RangeError);
    });

    await t.step("Throws for non-integer years", () => {
      assertThrows(() => getMoveableDates(2023.5), RangeError);
    });

    await t.step("Throws for years out of range", () => {
      assertThrows(() => getMoveableDates(-1), RangeError);
      assertThrows(() => getMoveableDates(275760), RangeError);
    });
  });
});

Deno.test("getFixedDates function", async (t) => {
  await t.step("Regular cases", async (t) => {
    await t.step("Returns correct number of fixed dates for a year", () => {
      const dates2023 = getFixedDates(2023);
      assertEquals(dates2023.length > 0, true);
      // You may want to adjust this number based on your actual implementation
      assertEquals(dates2023.length, 365);
    });

    await t.step("Handles leap years correctly", () => {
      const dates2024 = getFixedDates(2024);
      assertEquals(dates2024.length, 366);
    });

    await t.step("All dates are in the correct year", () => {
      const year = 2025;
      const dates = getFixedDates(year);
      dates.forEach((event) => {
        event.observed.forEach((date) => {
          assertEquals(date.year, year);
        });
      });
    });
  });

  await t.step("Edge cases", async (t) => {
    await t.step("Handles year boundary correctly (December 31 to January 1)", () => {
      const dates2023 = getFixedDates(2023);
      const dec31 = dates2023.find((event) => event.observed.some((date) => date.month === 12 && date.day === 31));
      const dates2024 = getFixedDates(2024);
      const jan1 = dates2024.find((event) => event.observed.some((date) => date.month === 1 && date.day === 1));
      assertEquals(dec31 !== undefined, true);
      assertEquals(jan1 !== undefined, true);
    });

    await t.step("Correctly handles February 29 in leap years", () => {
      const dates2024 = getFixedDates(2024);
      const feb29 = dates2024.find((event) => event.observed.some((date) => date.month === 2 && date.day === 29));
      assertEquals(feb29 !== undefined, true);
    });

    await t.step("Does not include February 29 in non-leap years", () => {
      const dates2023 = getFixedDates(2023);
      const feb29 = dates2023.find((event) => event.observed.some((date) => date.month === 2 && date.day === 29));
      assertEquals(feb29, undefined);
    });
  });

  await t.step("Input format tests", async (t) => {
    await t.step("Accepts number input", () => {
      const dates = getFixedDates(2023);
      assertEquals(dates.length > 0, true);
    });

    await t.step("Accepts string input", () => {
      const dates = getFixedDates("2023-01-01");
      assertEquals(dates.length > 0, true);
    });

    await t.step("Accepts Temporal.PlainDate input", () => {
      const date = new Temporal.PlainDate(2023, 1, 1);
      const dates = getFixedDates(date);
      assertEquals(dates.length > 0, true);
    });

    await t.step("Accepts object input", () => {
      const dates = getFixedDates({ year: 2023, month: 1, day: 1 });
      assertEquals(dates.length > 0, true);
    });
  });

  await t.step("Specific date checks", async (t) => {
    await t.step("Includes Christmas Day", () => {
      const dates2023 = getFixedDates(2023);
      const christmas = dates2023.find((event) => event.observed.some((date) => date.month === 12 && date.day === 25));
      assertEquals(christmas !== undefined, true);
      assertEquals(christmas?.title, "Christmas Day");
    });

    await t.step("Includes All Saints' Day", () => {
      const dates2023 = getFixedDates(2023);
      const allSaints = dates2023.find((event) => event.observed.some((date) => date.month === 11 && date.day === 1));
      assertEquals(allSaints !== undefined, true);
      assertEquals(allSaints?.title, "All Saints' Day");
    });
  });

  await t.step("Error cases", async (t) => {
    await t.step("Throws for invalid date string", () => {
      assertThrows(() => getFixedDates("invalid-date"), RangeError);
    });

    await t.step("Throws for invalid date object", () => {
      assertThrows(() => getFixedDates({ year: 2023, month: 13, day: 1 }), RangeError);
    });

    await t.step("Throws for non-integer years", () => {
      assertThrows(() => getFixedDates(2023.5), RangeError);
    });

    await t.step("Throws for years out of range", () => {
      assertThrows(() => getFixedDates(-1), RangeError);
      assertThrows(() => getFixedDates(275760), RangeError);
    });
  });
});

Deno.test("getSeasonsOfYear function", async (t) => {
  await t.step("Regular cases", async (t) => {
    await t.step("Returns correct seasons for a regular year", () => {
      const seasons = getSeasonsOfYear(2023);
      assertEquals(Object.keys(seasons).length, 6);
      assertEquals(seasons.Advent.start.toString(), "2022-11-27");
      assertEquals(seasons.Christmas.start.toString(), "2022-12-25");
      assertEquals(seasons.Epiphany.start.toString(), "2023-01-06");
      assertEquals(seasons.Lent.start.toString(), "2023-02-22");
      assertEquals(seasons.Easter.start.toString(), "2023-04-09");
      assertEquals(seasons.Pentecost.start.toString(), "2023-05-28");
    });

    await t.step("Handles different years correctly", () => {
      const seasons2024 = getSeasonsOfYear(2024);
      assertEquals(seasons2024.Advent.start.toString(), "2023-12-03");
      assertEquals(seasons2024.Easter.start.toString(), "2024-03-31");
    });

    await t.step("Seasons are contiguous", () => {
      const seasons = getSeasonsOfYear(2023);
      assertEquals(seasons.Advent.end.add({ days: 1 }).toString(), seasons.Christmas.start.toString());
      assertEquals(seasons.Christmas.end.add({ days: 1 }).toString(), seasons.Epiphany.start.toString());
      assertEquals(seasons.Epiphany.end.add({ days: 1 }).toString(), seasons.Lent.start.toString());
      assertEquals(seasons.Lent.end.add({ days: 1 }).toString(), seasons.Easter.start.toString());
      assertEquals(seasons.Easter.end.add({ days: 1 }).toString(), seasons.Pentecost.start.toString());
    });
  });

  await t.step("Edge cases", async (t) => {
    await t.step("Handles leap years correctly", () => {
      const seasons2024 = getSeasonsOfYear(2024);
      assertEquals(seasons2024.Lent.start.toString(), "2024-02-14");
    });

    await t.step("Correct handling of year boundaries", () => {
      const seasons2023 = getSeasonsOfYear(2023);
      const seasons2024 = getSeasonsOfYear(2024);
      assertEquals(seasons2023.Pentecost.end.add({ days: 1 }).toString(), seasons2024.Advent.start.toString());
    });

    await t.step("Handles earliest possible Easter (March 22)", () => {
      const seasons = getSeasonsOfYear(1818);
      assertEquals(seasons.Easter.start.toString(), "1818-03-22");
    });

    await t.step("Handles latest possible Easter (April 25)", () => {
      const seasons = getSeasonsOfYear(1943);
      assertEquals(seasons.Easter.start.toString(), "1943-04-25");
    });
  });

  await t.step("Input format tests", async (t) => {
    await t.step("Accepts string input", () => {
      const seasons = getSeasonsOfYear("2023-06-15");
      assertEquals(seasons.Advent.start.toString(), "2022-11-27");
    });

    await t.step("Accepts Temporal.PlainDate input", () => {
      const date = new Temporal.PlainDate(2023, 6, 15);
      const seasons = getSeasonsOfYear(date);
      assertEquals(seasons.Advent.start.toString(), "2022-11-27");
    });

    await t.step("Accepts object input", () => {
      const seasons = getSeasonsOfYear({ year: 2023, month: 6, day: 15 });
      assertEquals(seasons.Advent.start.toString(), "2022-11-27");
    });
  });

  await t.step("Easter calculation options", async (t) => {
    await t.step("Uses Western Easter by default", () => {
      const seasons = getSeasonsOfYear(2023);
      assertEquals(seasons.Easter.start.toString(), "2023-04-09");
    });

    await t.step("Handles Orthodox Easter option", () => {
      const seasons = getSeasonsOfYear(2023, { gregorian: true, julian: true });
      assertEquals(seasons.Easter.start.toString(), "2023-04-16");
    });
  });

  await t.step("Error cases", async (t) => {
    await t.step("Throws for invalid date string", () => {
      assertThrows(() => getSeasonsOfYear("invalid-date"), RangeError);
    });

    await t.step("Throws for invalid date object", () => {
      assertThrows(() => getSeasonsOfYear({ year: 2023, month: 13, day: 1 }), RangeError);
    });

    await t.step("Throws for non-integer years", () => {
      assertThrows(() => getSeasonsOfYear(2023.5), RangeError);
    });

    await t.step("Throws for years out of range", () => {
      assertThrows(() => getSeasonsOfYear(-1), RangeError);
      assertThrows(() => getSeasonsOfYear(275760), RangeError);
    });
  });
});

Deno.test("getSundaysOfYear function", async (t) => {
  await t.step("returns correct Sundays for a typical year", () => {
    const sundays = getSundaysOfYear(2023);
    assertEquals(sundays.length, 52);
    assertEquals(sundays[0].toString(), "2022-11-27"); // First Sunday of Advent 2022
    assertEquals(sundays[sundays.length - 1].toString(), "2023-11-19"); // Last Sunday before Advent 2023
  });

  await t.step("handles leap year correctly", () => {
    const sundays = getSundaysOfYear(2024);
    assertEquals(sundays.length, 52);
    assertEquals(sundays[0].toString(), "2023-12-03"); // First Sunday of Advent 2023
    assertEquals(sundays[sundays.length - 1].toString(), "2024-11-24"); // Last Sunday before Advent 2024

    // Check if February 29th is included
    const febSundays = sundays.filter((sunday) => sunday.month === 2);
    assertEquals(febSundays.length, 4);
    assertEquals(febSundays[3].toString(), "2024-02-25");
  });

  await t.step("correctly spans two calendar years", () => {
    const sundays = getSundaysOfYear(2023);
    const decemberSundays = sundays.filter((sunday) => sunday.year === 2022 && sunday.month === 12);
    const januarySundays = sundays.filter((sunday) => sunday.year === 2023 && sunday.month === 1);

    assertEquals(decemberSundays.length, 4);
    assertEquals(januarySundays.length, 5);
  });

  await t.step("works with different input formats", () => {
    const sundays1 = getSundaysOfYear("2023-06-15");
    const sundays2 = getSundaysOfYear(new Temporal.PlainDate(2023, 6, 15));
    const sundays3 = getSundaysOfYear({ year: 2023, month: 6, day: 15 });

    assertEquals(sundays1, sundays2);
    assertEquals(sundays1, sundays3);
  });

  await t.step("returns correct number of Sundays", () => {
    for (let year = 2020; year <= 2030; year++) {
      const sundays = getSundaysOfYear(year);
      assertEquals(sundays.length, 52);
    }
  });

  await t.step("all returned dates are Sundays", () => {
    const sundays = getSundaysOfYear(2023);
    sundays.forEach((sunday) => {
      assertEquals(sunday.dayOfWeek, 7);
    });
  });

  await t.step("first Sunday is First Sunday of Advent", () => {
    for (let year = 2020; year <= 2030; year++) {
      const sundays = getSundaysOfYear(year);
      const firstAdvent = getFirstSundayOfAdvent(year - 1);
      assertEquals(sundays[0].toString(), firstAdvent.toString());
    }
  });

  await t.step("throws error for invalid date string", () => {
    assertThrows(() => getSundaysOfYear("invalid-date"), RangeError);
    assertThrows(() => getSundaysOfYear(""), RangeError);
  });

  await t.step("throws error for invalid date object", () => {
    assertThrows(() => getSundaysOfYear("2023-13-01"), RangeError);
    assertThrows(() => getSundaysOfYear(new Temporal.PlainDate(2023, 13, 1)), RangeError);
    assertThrows(() => getSundaysOfYear({ year: 2023, month: 13, day: 1 }), RangeError);
  });
});

/*
Deno.test("Principal dates for liturgical year 2022 are correct", () => {
  const year = 2022;
  const seasons = getSeasonsOfYear(new Temporal.PlainDate(year, 1, 1));
  console.log(seasons);

  assertEquals(seasons.Lent.start.toString(), "2022-03-02", "Ash Wednesday");
  assertEquals(getWesternEaster(year).subtract({ days: 7 }).toString(), "2022-04-10", "Palm Sunday");
  assertEquals(getWesternEaster(year).subtract({ days: 2 }).toString(), "2022-04-15", "Good Friday");
  assertEquals(getWesternEaster(year).toString(), "2022-04-17", "Easter Day");
  assertEquals(getWesternEaster(year).add({ days: 39 }).toString(), "2022-05-26", "Ascension Day");
  assertEquals(seasons.Pentecost.start.toString(), "2022-06-05", "Pentecost");
  assertEquals(seasons.Pentecost.start.add({ days: 7 }).toString(), "2022-06-12", "Trinity Sunday");
  assertEquals(seasons.Advent.start.toString(), "2022-11-27", "Advent Sunday");
  assertEquals(seasons.Christmas.start.toString(), "2022-12-25", "Christmas Day");
  assertEquals(seasons.Christmas.start.dayOfWeek, 7, "Christmas Day is a Sunday");
});

Deno.test("Principal dates for liturgical year 2023 are correct", () => {
  const year = 2023;
  const seasons = getSeasonsOfYear(new Temporal.PlainDate(year, 1, 1));

  assertEquals(seasons.Lent.start.toString(), "2023-02-22", "Ash Wednesday");
  assertEquals(getWesternEaster(year).subtract({ days: 7 }).toString(), "2023-04-02", "Palm Sunday");
  assertEquals(getWesternEaster(year).subtract({ days: 2 }).toString(), "2023-04-07", "Good Friday");
  assertEquals(getWesternEaster(year).toString(), "2023-04-09", "Easter Day");
  assertEquals(getWesternEaster(year).add({ days: 39 }).toString(), "2023-05-18", "Ascension Day");
  assertEquals(seasons.Pentecost.start.toString(), "2023-05-28", "Pentecost");
  assertEquals(seasons.Pentecost.start.add({ days: 7 }).toString(), "2023-06-04", "Trinity Sunday");
  assertEquals(getFirstSundayOfAdvent(year).toString(), "2023-12-03", "Advent Sunday");
  assertEquals(new Temporal.PlainDate(year, 12, 25).toString(), "2023-12-25", "Christmas Day");
  assertEquals(new Temporal.PlainDate(year, 12, 25).dayOfWeek, 1, "Christmas Day is a Monday");
});

Deno.test("Principal dates for liturgical year 2024 are correct", () => {
  const year = 2024;
  const seasons = getSeasonsOfYear(new Temporal.PlainDate(year, 1, 1));

  assertEquals(seasons.Lent.start.toString(), "2024-02-14", "Ash Wednesday");
  assertEquals(getWesternEaster(year).subtract({ days: 7 }).toString(), "2024-03-24", "Palm Sunday");
  assertEquals(getWesternEaster(year).subtract({ days: 2 }).toString(), "2024-03-29", "Good Friday");
  assertEquals(getWesternEaster(year).toString(), "2024-03-31", "Easter Day");
  assertEquals(getWesternEaster(year).add({ days: 39 }).toString(), "2024-05-09", "Ascension Day");
  assertEquals(seasons.Pentecost.start.toString(), "2024-05-19", "Pentecost");
  assertEquals(seasons.Pentecost.start.add({ days: 7 }).toString(), "2024-05-26", "Trinity Sunday");
  assertEquals(getFirstSundayOfAdvent(year).toString(), "2024-12-01", "Advent Sunday");
  assertEquals(new Temporal.PlainDate(year, 12, 25).toString(), "2024-12-25", "Christmas Day");
  assertEquals(new Temporal.PlainDate(year, 12, 25).dayOfWeek, 3, "Christmas Day is a Wednesday");
});

Deno.test("Principal dates for liturgical year 2025 are correct", () => {
  const year = 2025;
  const seasons = getSeasonsOfYear(new Temporal.PlainDate(year, 1, 1));

  assertEquals(seasons.Lent.start.toString(), "2025-03-05", "Ash Wednesday");
  assertEquals(getWesternEaster(year).subtract({ days: 7 }).toString(), "2025-04-13", "Palm Sunday");
  assertEquals(getWesternEaster(year).subtract({ days: 2 }).toString(), "2025-04-18", "Good Friday");
  assertEquals(getWesternEaster(year).toString(), "2025-04-20", "Easter Day");
  assertEquals(getWesternEaster(year).add({ days: 39 }).toString(), "2025-05-29", "Ascension Day");
  assertEquals(seasons.Pentecost.start.toString(), "2025-06-08", "Pentecost");
  assertEquals(seasons.Pentecost.start.add({ days: 7 }).toString(), "2025-06-15", "Trinity Sunday");
  assertEquals(getFirstSundayOfAdvent(year).toString(), "2025-11-30", "Advent Sunday");
  assertEquals(new Temporal.PlainDate(year, 12, 25).toString(), "2025-12-25", "Christmas Day");
  assertEquals(new Temporal.PlainDate(year, 12, 25).dayOfWeek, 4, "Christmas Day is a Thursday");
});

Deno.test("Principal dates for liturgical year 2026 are correct", () => {
  const year = 2026;
  const seasons = getSeasonsOfYear(new Temporal.PlainDate(year, 1, 1));

  assertEquals(seasons.Lent.start.toString(), "2026-02-18", "Ash Wednesday");
  assertEquals(getWesternEaster(year).subtract({ days: 7 }).toString(), "2026-03-29", "Palm Sunday");
  assertEquals(getWesternEaster(year).subtract({ days: 2 }).toString(), "2026-04-03", "Good Friday");
  assertEquals(getWesternEaster(year).toString(), "2026-04-05", "Easter Day");
  assertEquals(getWesternEaster(year).add({ days: 39 }).toString(), "2026-05-14", "Ascension Day");
  assertEquals(seasons.Pentecost.start.toString(), "2026-05-24", "Pentecost");
  assertEquals(seasons.Pentecost.start.add({ days: 7 }).toString(), "2026-05-31", "Trinity Sunday");
  assertEquals(getFirstSundayOfAdvent(year).toString(), "2026-11-29", "Advent Sunday");
  assertEquals(new Temporal.PlainDate(year, 12, 25).toString(), "2026-12-25", "Christmas Day");
  assertEquals(new Temporal.PlainDate(year, 12, 25).dayOfWeek, 5, "Christmas Day is a Friday");
});

Deno.test("Principal dates for liturgical year 2027 are correct", () => {
  const year = 2027;
  const seasons = getSeasonsOfYear(new Temporal.PlainDate(year, 1, 1));

  assertEquals(seasons.Lent.start.toString(), "2027-02-10", "Ash Wednesday");
  assertEquals(getWesternEaster(year).subtract({ days: 7 }).toString(), "2027-03-21", "Palm Sunday");
  assertEquals(getWesternEaster(year).subtract({ days: 2 }).toString(), "2027-03-26", "Good Friday");
  assertEquals(getWesternEaster(year).toString(), "2027-03-28", "Easter Day");
  assertEquals(getWesternEaster(year).add({ days: 39 }).toString(), "2027-05-06", "Ascension Day");
  assertEquals(seasons.Pentecost.start.toString(), "2027-05-16", "Pentecost");
  assertEquals(seasons.Pentecost.start.add({ days: 7 }).toString(), "2027-05-23", "Trinity Sunday");
  assertEquals(getFirstSundayOfAdvent(year).toString(), "2027-11-28", "Advent Sunday");
  assertEquals(new Temporal.PlainDate(year, 12, 25).toString(), "2027-12-25", "Christmas Day");
  assertEquals(new Temporal.PlainDate(year, 12, 25).dayOfWeek, 6, "Christmas Day is a Saturday");
});

Deno.test("Principal dates for liturgical year 2028 are correct", () => {
  const year = 2028;
  const seasons = getSeasonsOfYear(new Temporal.PlainDate(year, 1, 1));

  assertEquals(seasons.Lent.start.toString(), "2028-03-01", "Ash Wednesday");
  assertEquals(getWesternEaster(year).subtract({ days: 7 }).toString(), "2028-04-09", "Palm Sunday");
  assertEquals(getWesternEaster(year).subtract({ days: 2 }).toString(), "2028-04-14", "Good Friday");
  assertEquals(getWesternEaster(year).toString(), "2028-04-16", "Easter Day");
  assertEquals(getWesternEaster(year).add({ days: 39 }).toString(), "2028-05-25", "Ascension Day");
  assertEquals(seasons.Pentecost.start.toString(), "2028-06-04", "Pentecost");
  assertEquals(seasons.Pentecost.start.add({ days: 7 }).toString(), "2028-06-11", "Trinity Sunday");
  assertEquals(getFirstSundayOfAdvent(year).toString(), "2028-12-03", "Advent Sunday");
  assertEquals(new Temporal.PlainDate(year, 12, 25).toString(), "2028-12-25", "Christmas Day");
  assertEquals(new Temporal.PlainDate(year, 12, 25).dayOfWeek, 1, "Christmas Day is a Monday");
});

Deno.test("Principal dates for liturgical year 2029 are correct", () => {
  const year = 2029;
  const seasons = getSeasonsOfYear(new Temporal.PlainDate(year, 1, 1));

  assertEquals(seasons.Lent.start.toString(), "2029-02-14", "Ash Wednesday");
  assertEquals(getWesternEaster(year).subtract({ days: 7 }).toString(), "2029-03-25", "Palm Sunday");
  assertEquals(getWesternEaster(year).subtract({ days: 2 }).toString(), "2029-03-30", "Good Friday");
  assertEquals(getWesternEaster(year).toString(), "2029-04-01", "Easter Day");
  assertEquals(getWesternEaster(year).add({ days: 39 }).toString(), "2029-05-10", "Ascension Day");
  assertEquals(seasons.Pentecost.start.toString(), "2029-05-20", "Pentecost");
  assertEquals(seasons.Pentecost.start.add({ days: 7 }).toString(), "2029-05-27", "Trinity Sunday");
  assertEquals(getFirstSundayOfAdvent(year).toString(), "2029-12-02", "Advent Sunday");
  assertEquals(new Temporal.PlainDate(year, 12, 25).toString(), "2029-12-25", "Christmas Day");
  assertEquals(new Temporal.PlainDate(year, 12, 25).dayOfWeek, 2, "Christmas Day is a Tuesday");
});

Deno.test("Principal dates for liturgical year 2030 are correct", () => {
  const year = 2030;
  const seasons = getSeasonsOfYear(new Temporal.PlainDate(year, 1, 1));

  assertEquals(seasons.Lent.start.toString(), "2030-03-06", "Ash Wednesday");
  assertEquals(getWesternEaster(year).subtract({ days: 7 }).toString(), "2030-04-14", "Palm Sunday");
  assertEquals(getWesternEaster(year).subtract({ days: 2 }).toString(), "2030-04-19", "Good Friday");
  assertEquals(getWesternEaster(year).toString(), "2030-04-21", "Easter Day");
  assertEquals(getWesternEaster(year).add({ days: 39 }).toString(), "2030-05-30", "Ascension Day");
  assertEquals(seasons.Pentecost.start.toString(), "2030-06-09", "Pentecost");
  assertEquals(seasons.Pentecost.start.add({ days: 7 }).toString(), "2030-06-16", "Trinity Sunday");
  assertEquals(getFirstSundayOfAdvent(year).toString(), "2030-12-01", "Advent Sunday");
  assertEquals(new Temporal.PlainDate(year, 12, 25).toString(), "2030-12-25", "Christmas Day");
  assertEquals(new Temporal.PlainDate(year, 12, 25).dayOfWeek, 3, "Christmas Day is a Wednesday");
});

Deno.test("Principal dates for liturgical year 2031 are correct", () => {
  const year = 2031;
  const seasons = getSeasonsOfYear(new Temporal.PlainDate(year, 1, 1));

  assertEquals(seasons.Lent.start.toString(), "2031-02-26", "Ash Wednesday");
  assertEquals(getWesternEaster(year).subtract({ days: 7 }).toString(), "2031-04-06", "Palm Sunday");
  assertEquals(getWesternEaster(year).subtract({ days: 2 }).toString(), "2031-04-11", "Good Friday");
  assertEquals(getWesternEaster(year).toString(), "2031-04-13", "Easter Day");
  assertEquals(getWesternEaster(year).add({ days: 39 }).toString(), "2031-05-22", "Ascension Day");
  assertEquals(seasons.Pentecost.start.toString(), "2031-06-01", "Pentecost");
  assertEquals(seasons.Pentecost.start.add({ days: 7 }).toString(), "2031-06-08", "Trinity Sunday");
  assertEquals(getFirstSundayOfAdvent(year).toString(), "2031-11-30", "Advent Sunday");
  assertEquals(new Temporal.PlainDate(year, 12, 25).toString(), "2031-12-25", "Christmas Day");
  assertEquals(new Temporal.PlainDate(year, 12, 25).dayOfWeek, 4, "Christmas Day is a Thursday");
});
 */
