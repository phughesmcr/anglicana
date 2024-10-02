import { assertEquals } from "@std/assert";

import { getChristmasDay, getChurchYear, getFirstSundayOfAdvent } from "..../src/temporal.ts

const assertTrue = (condition: boolean, message?: string) => {
  assertEquals(condition, true, message);
};

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

  /* await t.step("throws for non-integer years", () => {
    assertThrows(() => getChristmasDay(2023.5), RangeError);
  });

  await t.step("throws for non-numeric input", () => {
    assertThrows(() => getChristmasDay("2023" as any), TypeError);
  });

  await t.step("throws for years out of range", () => {
    assertThrows(() => getChristmasDay(-271821), RangeError);
    assertThrows(() => getChristmasDay(275760), RangeError);
  }); */
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

  /* await t.step("throws for non-integer years", () => {
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
  }); */
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

  /* await t.step("Error cases", async (t) => {
    await t.step("Throws for invalid date string", () => {
      assertThrows(() => getChurchYear("invalid-date"), RangeError);
    });

    await t.step("Throws for invalid date object", () => {
      assertThrows(() => getChurchYear({ year: 2023, month: 13, day: 1 }), RangeError);
    });
  }); */
});
