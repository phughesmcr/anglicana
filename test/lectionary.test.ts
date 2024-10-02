import { assertEquals, assertThrows } from "@std/assert";

import {
  getChurchYear,
  getFirstSundayOfAdvent,
  getSundayLectionaryLetter,
  getWeekdayLectionaryNumber,
}../src/temporal.tsoral.js";

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
