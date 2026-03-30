import { assertEquals, assertExists } from "@std/assert";

import { getCommonWorshipCalendar } from "@/calendar/temporal/mod.ts";

Deno.test("getCommonWorshipCalendar function", async (t) => {
  await t.step("returns complete calendar for church year 2024", () => {
    const calendar = getCommonWorshipCalendar(2024);

    assertEquals(calendar.churchYear, 2024);
    assertEquals(calendar.dateRange.start.toString(), "2023-12-03");
    assertEquals(calendar.dateRange.end.toString(), "2024-11-30");

    assertExists(calendar.principalFeasts);
    assertExists(calendar.principalHolyDays);
    assertExists(calendar.moveableDates);
    assertExists(calendar.fixedDates);
    assertExists(calendar.eastertide);
    assertExists(calendar.sundays);
    assertExists(calendar.moveableFestivals);
    assertExists(calendar.emberDays);

    assertEquals(calendar.principalFeasts.christmas.toString(), "2024-12-25");
    assertEquals(calendar.moveableDates.easter.toString(), "2024-03-31");
    assertEquals(calendar.moveableDates.ashWednesday.toString(), "2024-02-14");
    assertEquals(calendar.moveableFestivals.palmSunday.toString(), "2024-03-24");
  });

  await t.step("returns correct date range spanning church year", () => {
    const calendar = getCommonWorshipCalendar(2024);

    const startYear = calendar.dateRange.start.year;
    const endYear = calendar.dateRange.end.year;

    assertEquals(startYear, 2023);
    assertEquals(endYear, 2024);
    assertEquals(calendar.dateRange.start.dayOfWeek, 7);
  });

  await t.step("includes all required calendar components", () => {
    const calendar = getCommonWorshipCalendar(2024);

    assertEquals(typeof calendar.principalFeasts.christmas, "object");
    assertEquals(typeof calendar.principalFeasts.epiphany, "object");
    assertEquals(typeof calendar.principalFeasts.presentation, "object");
    assertEquals(typeof calendar.principalFeasts.annunciation, "object");
    assertEquals(typeof calendar.principalFeasts.ascension, "object");
    assertEquals(typeof calendar.principalFeasts.pentecost, "object");
    assertEquals(typeof calendar.principalFeasts.trinitySunday, "object");
    assertEquals(typeof calendar.principalFeasts.allSaintsDay, "object");

    assertEquals(typeof calendar.principalHolyDays.ashWednesday, "object");
    assertEquals(typeof calendar.principalHolyDays.maundyThursday, "object");
    assertEquals(typeof calendar.principalHolyDays.goodFriday, "object");

    assertEquals(Array.isArray(calendar.eastertide.holyWeek), true);
    assertEquals(Array.isArray(calendar.eastertide.rogationDays), true);
    assertEquals(Array.isArray(calendar.eastertide.novena), true);

    assertEquals(Array.isArray(calendar.sundays), true);
    assertEquals(Array.isArray(calendar.fixedDates), true);
    assertEquals(Array.isArray(calendar.emberDays), true);

    assertEquals(calendar.eastertide.holyWeek.length, 7);
    assertEquals(calendar.eastertide.rogationDays.length, 3);
    assertEquals(calendar.eastertide.novena.length, 9);
    assertEquals(calendar.emberDays.length, 12);
  });

  await t.step("handles different Easter calculation methods", () => {
    const westernCalendar = getCommonWorshipCalendar(2024, { gregorian: false, julian: false });
    const orthodoxCalendar = getCommonWorshipCalendar(2024, { gregorian: true, julian: true });

    assertEquals(westernCalendar.moveableDates.easter.toString(), "2024-03-31");
    assertEquals(orthodoxCalendar.moveableDates.easter.toString(), "2024-05-05");

    assertEquals(westernCalendar.principalFeasts.ascension.toString(), "2024-05-09");
    assertEquals(orthodoxCalendar.principalFeasts.ascension.toString(), "2024-06-13");
  });

  await t.step("validates year input", () => {
    getCommonWorshipCalendar(2024);
    getCommonWorshipCalendar(1584);
    getCommonWorshipCalendar(9999);
  });

  await t.step("returns correct number of Sundays in church year", () => {
    const calendar = getCommonWorshipCalendar(2024);

    assertEquals(calendar.sundays.length >= 52 && calendar.sundays.length <= 53, true);
    calendar.sundays.forEach((sunday) => {
      assertEquals(sunday.dayOfWeek, 7);
    });
  });

  await t.step("Christ the King falls at end of church year", () => {
    const calendar = getCommonWorshipCalendar(2024);

    assertEquals(calendar.moveableFestivals.christTheKing.toString(), "2023-11-26");

    const isBeforeAdventStart =
      Temporal.PlainDate.compare(calendar.moveableFestivals.christTheKing, calendar.dateRange.start) < 0;
    assertEquals(isBeforeAdventStart, true);
  });
});
