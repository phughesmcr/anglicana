import { assertEquals, assertExists } from "@std/assert";

import { getAllDatesFromCalendar, getCommonWorshipCalendar } from "@/calendar/temporal/mod.ts";

Deno.test("getAllDatesFromCalendar function", async (t) => {
  await t.step("returns all dates sorted chronologically", () => {
    const calendar = getCommonWorshipCalendar(2024);
    const allDates = getAllDatesFromCalendar(calendar);

    // Should have dates
    assertExists(allDates);
    assertEquals(Array.isArray(allDates), true);
    assertEquals(allDates.length > 0, true);

    // Should be sorted chronologically
    for (let i = 1; i < allDates.length; i++) {
      const comparison = Temporal.PlainDate.compare(allDates[i - 1].date, allDates[i].date);
      assertEquals(comparison <= 0, true, `Dates should be sorted: ${allDates[i - 1].date} <= ${allDates[i].date}`);
    }
  });

  await t.step("removes duplicate dates", () => {
    const calendar = getCommonWorshipCalendar(2024);
    const allDates = getAllDatesFromCalendar(calendar);

    // Check for duplicates by converting to strings and comparing array lengths
    const dateStrings = allDates.map((item) => item.date.toString());
    const uniqueDateStrings = [...new Set(dateStrings)];

    assertEquals(dateStrings.length, uniqueDateStrings.length, "Should not contain duplicate dates");
  });

  await t.step("includes all major liturgical dates", () => {
    const calendar = getCommonWorshipCalendar(2024);
    const allDates = getAllDatesFromCalendar(calendar);
    const dateStrings = allDates.map((item) => item.date.toString());

    // Check for key liturgical dates
    assertEquals(dateStrings.includes("2023-12-25"), true, "Should include Christmas (from church year 2024)");
    assertEquals(dateStrings.includes("2024-01-06"), true, "Should include Epiphany");
    assertEquals(dateStrings.includes("2024-03-31"), true, "Should include Easter");
    assertEquals(dateStrings.includes("2024-02-14"), true, "Should include Ash Wednesday");
    assertEquals(dateStrings.includes("2024-05-09"), true, "Should include Ascension Day");
    assertEquals(dateStrings.includes("2024-05-19"), true, "Should include Pentecost");
    assertEquals(dateStrings.includes("2023-12-03"), true, "Should include First Sunday of Advent");
  });

  await t.step("includes all Sundays in the church year", () => {
    const calendar = getCommonWorshipCalendar(2024);
    const allDates = getAllDatesFromCalendar(calendar);

    // All Sundays should be included (includes duplicates from different collections)
    const sundays = allDates.filter((item) => item.date.dayOfWeek === 7);
    assertEquals(sundays.length >= 52, true, "Should include at least 52 Sundays");
    assertEquals(
      sundays.length >= calendar.sundays.length,
      true,
      "Should include at least as many as calendar.sundays",
    );
  });

  await t.step("includes fixed calendar dates", () => {
    const calendar = getCommonWorshipCalendar(2024);
    const allDates = getAllDatesFromCalendar(calendar);

    // Should include many fixed dates throughout the year
    assertEquals(allDates.length > 100, true, "Should include numerous fixed calendar dates");
  });

  await t.step("includes Eastertide additional days", () => {
    const calendar = getCommonWorshipCalendar(2024);
    const allDates = getAllDatesFromCalendar(calendar);
    const dateStrings = allDates.map((item) => item.date.toString());

    // Holy Week spans 7 days
    assertEquals(dateStrings.includes("2024-03-24"), true, "Should include Palm Sunday (start of Holy Week)");
    assertEquals(dateStrings.includes("2024-03-30"), true, "Should include Saturday of Holy Week");

    // Rogation Days (3 days before Ascension)
    assertEquals(dateStrings.includes("2024-05-06"), true, "Should include Rogation Day");
    assertEquals(dateStrings.includes("2024-05-07"), true, "Should include Rogation Day");
    assertEquals(dateStrings.includes("2024-05-08"), true, "Should include Rogation Day");
  });

  await t.step("includes Ember Days", () => {
    const calendar = getCommonWorshipCalendar(2024);
    const allDates = getAllDatesFromCalendar(calendar);

    // Should include 12 Ember Days (4 sets of 3 days each)
    const emberDays = calendar.emberDays;
    assertEquals(emberDays.length, 12, "Should have 12 Ember Days");

    // All Ember Days should be in the final array
    emberDays.forEach((emberDay) => {
      const isIncluded = allDates.some((item) => item.date.equals(emberDay));
      assertEquals(isIncluded, true, `Ember Day ${emberDay.toString()} should be included`);
    });
  });

  await t.step("includes moveable festivals", () => {
    const calendar = getCommonWorshipCalendar(2024);
    const allDates = getAllDatesFromCalendar(calendar);
    const dateStrings = allDates.map((item) => item.date.toString());

    assertEquals(dateStrings.includes("2024-05-30"), true, "Should include Corpus Christi");
    assertEquals(dateStrings.includes("2023-11-26"), true, "Should include Christ the King");
  });

  await t.step("spans the entire church year", () => {
    const calendar = getCommonWorshipCalendar(2024);
    const allDates = getAllDatesFromCalendar(calendar);

    const firstDate = allDates[0];
    const lastDate = allDates[allDates.length - 1];

    // Should start around Advent Sunday of previous year
    assertEquals(firstDate.date.year, 2023, "Should start in calendar year before church year");
    assertEquals(firstDate.date.month >= 11, true, "Should start in November or December");

    // Should end in the church year
    assertEquals(lastDate.date.year, 2024, "Should end in the church year");
    assertEquals(lastDate.date.month >= 11, true, "Should end in late November or December");
  });

  await t.step("handles different Easter calculation methods", () => {
    const westernCalendar = getCommonWorshipCalendar(2024, { gregorian: false, julian: false });
    const orthodoxCalendar = getCommonWorshipCalendar(2024, { gregorian: true, julian: true });

    const westernDates = getAllDatesFromCalendar(westernCalendar);
    const orthodoxDates = getAllDatesFromCalendar(orthodoxCalendar);

    const westernDateStrings = westernDates.map((item) => item.date.toString());
    const orthodoxDateStrings = orthodoxDates.map((item) => item.date.toString());

    // Different Easter dates should result in different sets of dates
    assertEquals(westernDateStrings.includes("2024-03-31"), true, "Western should include March 31 Easter");
    assertEquals(orthodoxDateStrings.includes("2024-05-05"), true, "Orthodox should include May 5 Easter");

    // Both should still be sorted
    for (let i = 1; i < westernDates.length; i++) {
      const comparison = Temporal.PlainDate.compare(westernDates[i - 1].date, westernDates[i].date);
      assertEquals(comparison <= 0, true, "Western dates should be sorted");
    }

    for (let i = 1; i < orthodoxDates.length; i++) {
      const comparison = Temporal.PlainDate.compare(orthodoxDates[i - 1].date, orthodoxDates[i].date);
      assertEquals(comparison <= 0, true, "Orthodox dates should be sorted");
    }
  });
});
