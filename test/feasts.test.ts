import { getChristmasDay } from "$src/temporal.ts";
import { assertEquals, assertThrows } from "@std/assert";

Deno.test("getChristmasDay function", async (t) => {
  await t.step("returns correct date for Christmas Day", () => {
    assertEquals(getChristmasDay(2023).toString(), "2023-12-25");
    assertEquals(getChristmasDay(2024).toString(), "2024-12-25");
    assertEquals(getChristmasDay(2000).toString(), "2000-12-25");
  });

  await t.step("handles leap years correctly", () => {
    assertEquals(getChristmasDay(2020).toString(), "2020-12-25");
    assertEquals(getChristmasDay(2000).toString(), "2000-12-25");
    assertEquals(getChristmasDay(2100).toString(), "2100-12-25");
  });

  await t.step("works for the earliest allowed year (1583)", () => {
    assertEquals(getChristmasDay(1583).toString(), "1583-12-25");
  });

  await t.step("works for the latest allowed year (9999)", () => {
    assertEquals(getChristmasDay(9999).toString(), "9999-12-25");
  });

  await t.step("throws RangeError for years before 1583", () => {
    assertThrows(() => getChristmasDay(1581), RangeError);
    assertThrows(() => getChristmasDay(0), RangeError);
    assertThrows(() => getChristmasDay(-1), RangeError);
  });

  await t.step("throws RangeError for years after 9999", () => {
    assertThrows(() => getChristmasDay(10000), RangeError);
  });

  await t.step("throws RangeError for non-integer inputs", () => {
    assertThrows(() => getChristmasDay(2023.5), RangeError);
    assertThrows(() => getChristmasDay(NaN), RangeError);
    assertThrows(() => getChristmasDay(Infinity), RangeError);
  });

  await t.step("throws TypeError for non-number inputs", () => {
    // @ts-expect-error: Testing invalid input
    assertThrows(() => getChristmasDay("2023"), TypeError);
    // @ts-expect-error: Testing invalid input
    assertThrows(() => getChristmasDay(true), TypeError);
    // @ts-expect-error: Testing invalid input
    assertThrows(() => getChristmasDay(null), TypeError);
    // @ts-expect-error: Testing invalid input
    assertThrows(() => getChristmasDay(undefined), TypeError);
    // @ts-expect-error: Testing invalid input
    assertThrows(() => getChristmasDay({}), TypeError);
  });
});

import { getEpiphany } from "$src/temporal.ts";

Deno.test("getEpiphany function", async (t) => {
  await t.step("returns correct date for Epiphany", () => {
    assertEquals(getEpiphany(2023).toString(), "2023-01-06");
    assertEquals(getEpiphany(2024).toString(), "2024-01-06");
    assertEquals(getEpiphany(2000).toString(), "2000-01-06");
  });

  await t.step("handles transferToSunday option correctly", () => {
    // 2023: Epiphany is on Friday
    assertEquals(getEpiphany(2023, true).toString(), "2023-01-08");
    // 2024: Epiphany is on Saturday
    assertEquals(getEpiphany(2024, true).toString(), "2024-01-07");
    // 2025: Epiphany is on Monday
    assertEquals(getEpiphany(2025, true).toString(), "2025-01-12");
    // 2029: Epiphany is on Saturday, so transfer to Sunday
    assertEquals(getEpiphany(2029, true).toString(), "2029-01-07");
  });

  await t.step("works for leap years", () => {
    assertEquals(getEpiphany(2020).toString(), "2020-01-06");
    assertEquals(getEpiphany(2020, true).toString(), "2020-01-12");
  });

  await t.step("works for the earliest allowed year (1583)", () => {
    assertEquals(getEpiphany(1583).toString(), "1583-01-06");
    assertEquals(getEpiphany(1583, true).toString(), "1583-01-09");
  });

  await t.step("works for the latest allowed year (9999)", () => {
    assertEquals(getEpiphany(9999).toString(), "9999-01-06");
    assertEquals(getEpiphany(9999, true).toString(), "9999-01-10");
  });

  await t.step("handles year boundary correctly", () => {
    assertEquals(getEpiphany(2022).toString(), "2022-01-06");
    assertEquals(getEpiphany(2022, true).toString(), "2022-01-09");
  });

  await t.step("throws RangeError for years before 1", () => {
    assertThrows(() => getEpiphany(0), RangeError);
    assertThrows(() => getEpiphany(-1), RangeError);
  });

  await t.step("throws RangeError for years after 9999", () => {
    assertThrows(() => getEpiphany(10000), RangeError);
  });

  await t.step("throws RangeError for non-integer inputs", () => {
    assertThrows(() => getEpiphany(2023.5), RangeError);
    assertThrows(() => getEpiphany(NaN), RangeError);
    assertThrows(() => getEpiphany(Infinity), RangeError);
  });

  await t.step("throws TypeError for non-number inputs", () => {
    // @ts-expect-error: Testing invalid input
    assertThrows(() => getEpiphany("2023"), TypeError);
    // @ts-expect-error: Testing invalid input
    assertThrows(() => getEpiphany(true), TypeError);
    // @ts-expect-error: Testing invalid input
    assertThrows(() => getEpiphany(null), TypeError);
    // @ts-expect-error: Testing invalid input
    assertThrows(() => getEpiphany(undefined), TypeError);
    // @ts-expect-error: Testing invalid input
    assertThrows(() => getEpiphany({}), TypeError);
  });
});
