import { assertEquals, assertThrows } from "@std/assert";

import { getChurchYear, getFirstSundayOfAdvent } from "$src/temporal.ts";

const assertTrue = (condition: boolean, message?: string) => {
  assertEquals(condition, true, message);
};

const adventSundays: [number, string][] = [
  [1999, "1999-11-28"],
  [2000, "2000-12-03"],
  [2022, "2022-11-27"], // earliest possible Advent Sunday
  [2023, "2023-12-03"], // latest possible Advent Sunday
  [2024, "2024-12-01"], // leap year
  [2025, "2025-11-30"],
  [2028, "2028-12-03"], // latest possible Advent Sunday & leap year
  [2033, "2033-11-27"], // earliest possible Advent Sunday
  [2099, "2099-11-29"],
  [2100, "2100-11-28"],
];

Deno.test("getFirstSundayOfAdvent function", async (t) => {
  await t.step("returns correct date for regular years", () => {
    adventSundays.forEach(([year, date]) => {
      assertEquals(getFirstSundayOfAdvent(year).toString(), date);
    });
  });

  await t.step("returns a date in the correct church year", () => {
    const result = getFirstSundayOfAdvent(2025);
    assertEquals(result.year, 2025);
  });

  await t.step("always returns a Sunday", () => {
    for (let year = 1900; year <= 2100; year++) {
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

  await t.step("throws for non-numeric input", () => {
    assertThrows(() => getFirstSundayOfAdvent("2023" as unknown as number), TypeError);
  });

  await t.step("throws for non-integer years", () => {
    assertThrows(() => getFirstSundayOfAdvent(2023.5), RangeError);
  });

  await t.step("throws for input out of Temporal.PlainDate range", () => {
    assertThrows(() => getFirstSundayOfAdvent(-271821), RangeError);
    assertThrows(() => getFirstSundayOfAdvent(275760), RangeError);
  });

  await t.step("throws for input before 1583", () => {
    assertThrows(() => getFirstSundayOfAdvent(1581), RangeError);
  });

  await t.step("handles very early years", () => {
    assertEquals(getFirstSundayOfAdvent(1583).toString(), "1583-11-27");
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

    await t.step("Handles Advent Sunday correctly", () => {
      adventSundays.forEach(([year, date]) => {
        // date input
        assertEquals(getChurchYear(date), year + 1);
        // year input
        const advent = getFirstSundayOfAdvent(year);
        assertEquals(getChurchYear(advent.subtract({ days: 1 })), year);
        assertEquals(getChurchYear(advent), year + 1);
        assertEquals(getChurchYear(advent.add({ days: 1 })), year + 1);
      });
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

    await t.step("throws for non-integer years", () => {
      assertThrows(() => getChurchYear(2023.5), RangeError);
    });

    await t.step("throws for invalid date string", () => {
      assertThrows(() => getChurchYear("invalid-date"), RangeError);
    });

    await t.step("throws for invalid date object", () => {
      assertThrows(() => getChurchYear({ year: 0, month: 99, day: 99 }), RangeError);
    });
  });
});
