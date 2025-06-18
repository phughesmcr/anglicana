import { validateDate, validateYear } from "$src/temporal.ts";
import { assertEquals, assertThrows } from "@std/assert";

Deno.test("validateYear function", async (t) => {
  await t.step("Standard cases", async (t) => {
    await t.step("returns the input for valid years", () => {
      assertEquals(validateYear(2023), 2023);
      assertEquals(validateYear(1583), 1583);
      assertEquals(validateYear(9999), 9999);
    });
  });

  await t.step("Edge cases", async (t) => {
    await t.step("handles minimum valid year", () => {
      assertEquals(validateYear(1583), 1583);
    });

    await t.step("handles maximum valid year", () => {
      assertEquals(validateYear(9999), 9999);
    });
  });

  await t.step("Input validation", async (t) => {
    await t.step("throws TypeError for non-number input", () => {
      assertThrows(() => validateYear("2023" as unknown as number), TypeError, "Input must be a number");
      assertThrows(() => validateYear(null as unknown as number), TypeError, "Input must be a number");
      assertThrows(() => validateYear(undefined as unknown as number), TypeError, "Input must be a number");
    });

    await t.step("throws RangeError for non-integer input", () => {
      assertThrows(() => validateYear(2023.5), RangeError, "Year must be an integer");
    });

    await t.step("throws RangeError for years before 1583", () => {
      assertThrows(() => validateYear(1581), RangeError, "Year must be >= 1583");
      assertThrows(() => validateYear(0), RangeError, "Year must be >= 1583");
      assertThrows(() => validateYear(-1), RangeError, "Year must be >= 1583");
    });

    await t.step("throws RangeError for years outside Temporal API range", () => {
      assertThrows(() => validateYear(-271821), RangeError, "Year is out of Temporal API range");
      assertThrows(() => validateYear(275760), RangeError, "Year is out of Temporal API range");
    });
  });
});

Deno.test("validateDate function", async (t) => {
  await t.step("String input", async (t) => {
    await t.step("returns the input for valid date strings", () => {
      assertEquals(validateDate("2023-05-15"), "2023-05-15");
      assertEquals(validateDate("1583-10-15"), "1583-10-15");
      assertEquals(validateDate("9999-12-31"), "9999-12-31");
    });

    await t.step("throws for invalid date strings", () => {
      assertThrows(() => validateDate("2023-13-01"), RangeError, "Invalid date string");
      assertThrows(() => validateDate("2023-02-30"), RangeError, "Invalid date string");
      assertThrows(() => validateDate("invalid-date"), RangeError, "Invalid date string");
    });
  });

  await t.step("Number input", async (t) => {
    await t.step("returns the input for valid years", () => {
      assertEquals(validateDate(2023), 2023);
      assertEquals(validateDate(1583), 1583);
      assertEquals(validateDate(9999), 9999);
    });

    await t.step("throws for invalid years", () => {
      assertThrows(() => validateDate(1581), RangeError, "Year must be >= 1583");
      assertThrows(() => validateDate(275760), RangeError, "Year is out of Temporal API range");
    });
  });

  await t.step("Temporal.PlainDate input", async (t) => {
    await t.step("returns the input for valid Temporal.PlainDate objects", () => {
      const date = new Temporal.PlainDate(2023, 5, 15);
      assertEquals(validateDate(date), date);
    });
  });

  await t.step("PlainDateLike object input", async (t) => {
    await t.step("returns the input for valid PlainDateLike objects", () => {
      const date = { year: 2023, month: 5, day: 15 };
      assertEquals(validateDate(date), date);
    });

    await t.step("throws for invalid PlainDateLike objects", () => {
      assertThrows(() => validateDate({ year: 2023, month: 13, day: 1 }), RangeError, "Invalid date");
      assertThrows(() => validateDate({ year: 2023, month: 2, day: 30 }), RangeError, "Invalid date");
      assertThrows(() => validateDate({ year: 1581, month: 1, day: 1 }), RangeError, "Year must be >= 1583");
    });

    await t.step("throws for incomplete PlainDateLike objects", () => {
      assertThrows(() => validateDate({ year: 2023, month: 5 }), RangeError, "Invalid date");
      assertThrows(() => validateDate({ month: 5, day: 15 }), RangeError, "Invalid date");
    });
  });

  await t.step("Edge cases", async (t) => {
    await t.step("handles minimum valid year", () => {
      assertEquals(validateDate("1583-10-15"), "1583-10-15");
      assertEquals(validateDate(1583), 1583);
      assertEquals(validateDate({ year: 1583, month: 10, day: 15 }), { year: 1583, month: 10, day: 15 });
    });

    await t.step("handles maximum valid year", () => {
      assertEquals(validateDate("9999-12-31"), "9999-12-31");
      assertEquals(validateDate(9999), 9999);
      assertEquals(validateDate({ year: 9999, month: 12, day: 31 }), { year: 9999, month: 12, day: 31 });
      assertThrows(() => validateDate({ year: 10000, month: 12, day: 31 }), RangeError, "Invalid date");
    });

    await t.step("handles leap years", () => {
      assertEquals(validateDate("2024-02-29"), "2024-02-29");
      assertEquals(validateDate({ year: 2024, month: 2, day: 29 }), { year: 2024, month: 2, day: 29 });
    });
  });

  await t.step("Input validation", async (t) => {
    await t.step("throws TypeError for invalid input types", () => {
      assertThrows(() => validateDate(null as unknown as string), RangeError, "Invalid date");
      assertThrows(() => validateDate(undefined as unknown as string), RangeError, "Invalid date");
      assertThrows(() => validateDate([] as unknown as string), RangeError, "Invalid date");
      assertThrows(() => validateDate({} as unknown as string), RangeError, "Invalid date");
    });
  });
});
