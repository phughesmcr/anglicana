import { getChristmasDay, getEpiphany } from "@/calendar/temporal/mod.ts";
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

  await t.step("throws TypeError for invalid input types", () => {
    assertThrows(() => getChristmasDay(true as unknown as Temporal.PlainDate), TypeError);
    assertThrows(() => getChristmasDay(null as unknown as Temporal.PlainDate), TypeError);
    assertThrows(() => getChristmasDay(undefined as unknown as Temporal.PlainDate), TypeError);
    assertThrows(() => getChristmasDay([] as unknown as Temporal.PlainDate), TypeError);
  });
});

Deno.test("getEpiphany function", async (t) => {
  const getTransferredEpiphany = (year: number) => {
    let date = new Temporal.PlainDate(year, 1, 2);
    const end = new Temporal.PlainDate(year, 1, 8);
    while (Temporal.PlainDate.compare(date, end) <= 0) {
      if (date.dayOfWeek === 7) {
        return date;
      }
      date = date.add({ days: 1 });
    }
    throw new Error("No Sunday between 2 and 8 January");
  };

  await t.step("returns correct date for Epiphany", () => {
    assertEquals(getEpiphany(2023).toString(), "2023-01-06");
    assertEquals(getEpiphany(2024).toString(), "2024-01-06");
    assertEquals(getEpiphany(2000).toString(), "2000-01-06");
  });

  await t.step("handles transferToSunday option correctly", () => {
    [2023, 2024, 2025, 2029].forEach((year) => {
      assertEquals(getEpiphany(year, true).toString(), getTransferredEpiphany(year).toString());
    });
  });

  await t.step("works for leap years", () => {
    assertEquals(getEpiphany(2020).toString(), "2020-01-06");
    assertEquals(getEpiphany(2020, true).toString(), getTransferredEpiphany(2020).toString());
  });

  await t.step("works for the earliest allowed year (1583)", () => {
    assertEquals(getEpiphany(1583).toString(), "1583-01-06");
    assertEquals(getEpiphany(1583, true).toString(), getTransferredEpiphany(1583).toString());
  });

  await t.step("works for the latest allowed year (9999)", () => {
    assertEquals(getEpiphany(9999).toString(), "9999-01-06");
    assertEquals(getEpiphany(9999, true).toString(), getTransferredEpiphany(9999).toString());
  });

  await t.step("handles year boundary correctly", () => {
    assertEquals(getEpiphany(2022).toString(), "2022-01-06");
    assertEquals(getEpiphany(2022, true).toString(), getTransferredEpiphany(2022).toString());
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

  await t.step("throws TypeError for invalid input types", () => {
    assertThrows(() => getEpiphany(true as unknown as Temporal.PlainDate), TypeError);
    assertThrows(() => getEpiphany(null as unknown as Temporal.PlainDate), TypeError);
    assertThrows(() => getEpiphany(undefined as unknown as Temporal.PlainDate), TypeError);
    assertThrows(() => getEpiphany([] as unknown as Temporal.PlainDate), TypeError);
  });
});
