import { getSundayLectionaryLetter, getWeekdayLectionaryNumber } from "$src/temporal.ts";
import { assertEquals, assertThrows } from "@std/assert";

Deno.test("getSundayLectionaryLetter function", async (t) => {
  await t.step("returns correct lectionary letter for each church year", () => {
    const testCases = [
      { year: 2000, expected: "B" },
      { year: 2001, expected: "C" },
      { year: 2002, expected: "A" },
      { year: 2003, expected: "B" },
      { year: 2004, expected: "C" },
      // ... add more years as needed
      { year: 2023, expected: "A" },
      { year: 2024, expected: "B" },
      { year: 2025, expected: "C" },
      { year: 2026, expected: "A" },
      { year: 2027, expected: "B" },
      { year: 2028, expected: "C" },
      { year: 2029, expected: "A" },
    ];

    testCases.forEach(({ year, expected }) => {
      assertEquals(getSundayLectionaryLetter(year), expected);
    });
  });

  await t.step("handles dates before and after Advent Sunday correctly", () => {
    assertEquals(getSundayLectionaryLetter("2023-11-26"), "A");
    assertEquals(getSundayLectionaryLetter("2023-12-03"), "B");
    assertEquals(getSundayLectionaryLetter("2023-12-31"), "B");
    assertEquals(getSundayLectionaryLetter("2024-01-01"), "B");
    assertEquals(getSundayLectionaryLetter("2024-11-30"), "B");
    assertEquals(getSundayLectionaryLetter("2024-12-01"), "C");
  });

  await t.step("works with different input formats", () => {
    assertEquals(getSundayLectionaryLetter(2023), "A");
    assertEquals(getSundayLectionaryLetter("2023-06-15"), "A");
    assertEquals(getSundayLectionaryLetter(new Temporal.PlainDate(2023, 6, 15)), "A");
    assertEquals(getSundayLectionaryLetter({ year: 2023, month: 6, day: 15 }), "A");
  });

  await t.step("handles earliest and latest possible Advent Sundays", () => {
    assertEquals(getSundayLectionaryLetter("2022-11-26"), "C");
    assertEquals(getSundayLectionaryLetter("2022-11-27"), "A");
    assertEquals(getSundayLectionaryLetter("2023-12-02"), "A");
    assertEquals(getSundayLectionaryLetter("2023-12-03"), "B");
  });

  await t.step("handles leap years correctly", () => {
    assertEquals(getSundayLectionaryLetter("2024-02-29"), "B");
  });

  await t.step("throws error for invalid inputs", () => {
    assertThrows(() => getSundayLectionaryLetter("invalid-date"), RangeError);
    assertThrows(() => getSundayLectionaryLetter(""), RangeError);
    assertThrows(() => getSundayLectionaryLetter(10000), RangeError);
  });
});

Deno.test("getWeekdayLectionaryNumber function", async (t) => {
  await t.step("returns correct lectionary number for each church year", () => {
    const testCases = [
      { date: "2000-12-30", expected: 1 },
      { date: "2001-12-30", expected: 2 },
      { date: "2002-12-30", expected: 1 },
      { date: "2003-12-30", expected: 2 },
      { date: "2004-12-30", expected: 1 },
      { date: "2023-12-30", expected: 2 },
      { date: "2024-12-30", expected: 1 },
      { date: "2025-12-30", expected: 2 },
      { date: "2026-12-30", expected: 1 },
      { date: "2027-12-30", expected: 2 },
      { date: "2028-12-30", expected: 1 },
      { date: "2029-12-30", expected: 2 },
    ];

    testCases.forEach(({ date, expected }) => {
      assertEquals(getWeekdayLectionaryNumber(date), expected);
    });
  });

  await t.step("handles dates before and after Advent Sunday correctly", () => {
    assertEquals(getWeekdayLectionaryNumber("2023-11-26"), 1);
    assertEquals(getWeekdayLectionaryNumber("2023-12-03"), 2);
    assertEquals(getWeekdayLectionaryNumber("2023-12-31"), 2);
    assertEquals(getWeekdayLectionaryNumber("2024-01-01"), 2);
    assertEquals(getWeekdayLectionaryNumber("2024-11-30"), 2);
    assertEquals(getWeekdayLectionaryNumber("2024-12-01"), 1);
  });

  await t.step("works with different input formats", () => {
    assertEquals(getWeekdayLectionaryNumber("2023-06-15"), 1);
    assertEquals(getWeekdayLectionaryNumber(new Temporal.PlainDate(2023, 6, 15)), 1);
    assertEquals(getWeekdayLectionaryNumber({ year: 2023, month: 6, day: 15 }), 1);
  });

  await t.step("handles earliest and latest possible Advent Sundays", () => {
    assertEquals(getWeekdayLectionaryNumber("2022-11-26"), 2);
    assertEquals(getWeekdayLectionaryNumber("2022-11-27"), 1);
    assertEquals(getWeekdayLectionaryNumber("2023-12-02"), 1);
    assertEquals(getWeekdayLectionaryNumber("2023-12-03"), 2);
  });

  await t.step("handles leap years correctly", () => {
    assertEquals(getWeekdayLectionaryNumber("2024-02-29"), 2);
  });

  await t.step("throws error for invalid inputs", () => {
    assertThrows(() => getWeekdayLectionaryNumber("invalid-date"), RangeError);
    assertThrows(() => getWeekdayLectionaryNumber(""), RangeError);
    assertThrows(() => getWeekdayLectionaryNumber({ year: 2023, month: 13, day: 1 }), RangeError);
    assertThrows(() => getWeekdayLectionaryNumber({ year: 2023, month: 1, day: 32 }), RangeError);
  });
});
