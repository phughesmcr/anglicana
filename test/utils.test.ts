import { validateDate, validateYear } from "@/temporal.ts";
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

    await t.step("throws RangeError for years outside valid range", () => {
      assertThrows(() => validateYear(-271821), RangeError, "Year must be >= 1583 and <= 9999");
      assertThrows(() => validateYear(275760), RangeError, "Year must be >= 1583 and <= 9999");
    });
  });
});

Deno.test("validateDate function", async (t) => {
  await t.step("String input", async (t) => {
    await t.step("returns a PlainDate for valid date strings", () => {
      assertEquals(validateDate("2023-05-15"), new Temporal.PlainDate(2023, 5, 15));
      assertEquals(validateDate("1583-10-15"), new Temporal.PlainDate(1583, 10, 15));
      assertEquals(validateDate("9999-12-31"), new Temporal.PlainDate(9999, 12, 31));
    });

    await t.step("throws for invalid date strings", () => {
      assertThrows(() => validateDate("2023-13-01"), RangeError, "Invalid date");
      assertThrows(() => validateDate("2023-02-30"), RangeError, "Invalid date");
      assertThrows(() => validateDate("invalid-date"), RangeError, "Invalid date");
    });
  });

  await t.step("Number input", async (t) => {
    await t.step("returns a PlainDate for valid years (January 1st)", () => {
      assertEquals(validateDate(2023), new Temporal.PlainDate(2023, 1, 1));
      assertEquals(validateDate(1583), new Temporal.PlainDate(1583, 1, 1));
      assertEquals(validateDate(9999), new Temporal.PlainDate(9999, 1, 1));
    });

    await t.step("throws for invalid years", () => {
      assertThrows(() => validateDate(1581), RangeError, "Year must be >= 1583");
      assertThrows(() => validateDate(275760), RangeError, "Year must be >= 1583 and <= 9999");
    });
  });

  await t.step("Temporal.PlainDate input", async (t) => {
    await t.step("returns the same PlainDate for valid Temporal.PlainDate objects", () => {
      const date = new Temporal.PlainDate(2023, 5, 15);
      assertEquals(validateDate(date), date);
    });
  });

  await t.step("PlainDateLike object input", async (t) => {
    await t.step("returns a PlainDate for valid PlainDateLike objects", () => {
      const inputDate = { year: 2023, month: 5, day: 15 };
      assertEquals(validateDate(inputDate), new Temporal.PlainDate(2023, 5, 15));
    });

    await t.step("throws for invalid PlainDateLike objects", () => {
      assertThrows(() => validateDate({ year: 2023, month: 13, day: 1 }), RangeError, "Invalid date");
      assertThrows(() => validateDate({ year: 2023, month: 2, day: 30 }), RangeError, "Invalid date");
      assertThrows(() => validateDate({ year: 1581, month: 1, day: 1 }), RangeError, "Invalid date");
    });

    await t.step("throws for incomplete PlainDateLike objects", () => {
      assertThrows(() => validateDate({ year: 2023, month: 5 }), TypeError, "Invalid date");
      assertThrows(() => validateDate({ month: 5, day: 15 }), TypeError, "Invalid date");
    });
  });

  await t.step("Edge cases", async (t) => {
    await t.step("handles minimum valid year", () => {
      assertEquals(validateDate("1583-10-15"), new Temporal.PlainDate(1583, 10, 15));
      assertEquals(validateDate(1583), new Temporal.PlainDate(1583, 1, 1));
      assertEquals(validateDate({ year: 1583, month: 10, day: 15 }), new Temporal.PlainDate(1583, 10, 15));
    });

    await t.step("handles maximum valid year", () => {
      assertEquals(validateDate("9999-12-31"), new Temporal.PlainDate(9999, 12, 31));
      assertEquals(validateDate(9999), new Temporal.PlainDate(9999, 1, 1));
      assertEquals(validateDate({ year: 9999, month: 12, day: 31 }), new Temporal.PlainDate(9999, 12, 31));
      assertThrows(() => validateDate({ year: 10000, month: 12, day: 31 }), RangeError, "Invalid date");
    });

          await t.step("handles leap years correctly", () => {
        // Test that February 29th is valid in leap years
        assertEquals(validateDate("2024-02-29"), new Temporal.PlainDate(2024, 2, 29));
        assertEquals(validateDate({ year: 2024, month: 2, day: 29 }), new Temporal.PlainDate(2024, 2, 29));
        
        // Test that February 29th is invalid in non-leap years
        assertThrows(() => validateDate("2023-02-29"), RangeError);
        assertThrows(() => validateDate({ year: 2023, month: 2, day: 29 }), RangeError);
      });
  });

  await t.step("Input validation", async (t) => {
    await t.step("throws TypeError for invalid input types", () => {
      assertThrows(() => validateDate(null as unknown as string), TypeError);
      assertThrows(() => validateDate(undefined as unknown as string), TypeError);
      assertThrows(() => validateDate([] as unknown as string), TypeError);
      assertThrows(() => validateDate({} as unknown as string), TypeError);
    });
  });
});
