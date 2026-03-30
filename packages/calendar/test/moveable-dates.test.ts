import { assertEquals } from "@std/assert";

import { getMoveableDates } from "@/calendar/temporal/mod.ts";

Deno.test("getMoveableDates function", async (t) => {
  await t.step("returns all moveable dates for 2024", () => {
    const dates = getMoveableDates(2024);

    assertEquals(dates.epiphany.toString(), "2024-01-06");
    assertEquals(dates.theBaptismOfChrist.toString(), "2024-01-07"); // First Sunday after Epiphany
    assertEquals(dates.ashWednesday.toString(), "2024-02-14");
    assertEquals(dates.maundyThursday.toString(), "2024-03-28");
    assertEquals(dates.goodFriday.toString(), "2024-03-29");
    assertEquals(dates.easter.toString(), "2024-03-31");
    assertEquals(dates.ascensionDay.toString(), "2024-05-09");
    assertEquals(dates.dayOfPentecost.toString(), "2024-05-19");
    assertEquals(dates.trinitySunday.toString(), "2024-05-26");
  });

  await t.step("returns correct dates for 2023", () => {
    const dates = getMoveableDates(2023);

    assertEquals(dates.epiphany.toString(), "2023-01-06");
    assertEquals(dates.theBaptismOfChrist.toString(), "2023-01-08"); // First Sunday after Epiphany
    assertEquals(dates.ashWednesday.toString(), "2023-02-22");
    assertEquals(dates.maundyThursday.toString(), "2023-04-06");
    assertEquals(dates.goodFriday.toString(), "2023-04-07");
    assertEquals(dates.easter.toString(), "2023-04-09");
    assertEquals(dates.ascensionDay.toString(), "2023-05-18");
    assertEquals(dates.dayOfPentecost.toString(), "2023-05-28");
    assertEquals(dates.trinitySunday.toString(), "2023-06-04");
  });

  await t.step("handles different Easter options", () => {
    const westernDates = getMoveableDates(2024, { gregorian: false, julian: false });
    const orthodoxDates = getMoveableDates(2024, { gregorian: true, julian: true });

    // Western Easter 2024: March 31
    assertEquals(westernDates.easter.toString(), "2024-03-31");
    assertEquals(westernDates.ascensionDay.toString(), "2024-05-09");

    // Orthodox Easter 2024: May 5 (different from Western)
    assertEquals(orthodoxDates.easter.toString(), "2024-05-05");
    assertEquals(orthodoxDates.ascensionDay.toString(), "2024-06-13");

    // Fixed dates should be the same regardless of Easter calculation
    assertEquals(westernDates.epiphany.toString(), orthodoxDates.epiphany.toString());
  });

  await t.step("validates year input", () => {
    // Should not throw for valid years
    getMoveableDates(2024);
    getMoveableDates(1583);
    getMoveableDates(9999);
  });
});
