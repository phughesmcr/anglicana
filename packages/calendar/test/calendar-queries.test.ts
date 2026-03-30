/**
 * @description Tests for calendar query helpers and parity with getEventsForDate
 * @module
 */

import { assertEquals } from "@std/assert";
import {
  filterCalendarEventsForDate,
  generateLiturgicalCalendar,
  getEasterSunday,
  getEventsForDate,
  getEventsForDateFromCalendar,
  groupCalendarEventsByDate,
  liturgicalYearFromChurchYear,
} from "../mod.ts";

Deno.test("getEventsForDateFromCalendar matches getEventsForDate", async (t) => {
  const cases: { date: string; year: number; options?: Parameters<typeof getEventsForDate>[2] }[] = [
    { date: "2025-12-25", year: 2025 },
    { date: "2026-01-04", year: 2025, options: { canonicalMode: "canonical" } },
    { date: "2026-01-04", year: 2025, options: { canonicalMode: "pastoral" } },
    { date: "2025-11-01", year: 2025 },
  ];

  for (const { date, year, options } of cases) {
    await t.step(date + (options ? ` (${options.canonicalMode})` : ""), () => {
      const calendar = generateLiturgicalCalendar(year, options ?? {});
      const a = getEventsForDate(date, year, options);
      const b = getEventsForDateFromCalendar(calendar, date);
      assertEquals(b, a);
    });
  }

  await t.step("Easter Sunday PlainDate", () => {
    const year = 2025;
    const easter = getEasterSunday(2026);
    const calendar = generateLiturgicalCalendar(year);
    assertEquals(getEventsForDateFromCalendar(calendar, easter), getEventsForDate(easter, year));
  });
});

Deno.test("groupCalendarEventsByDate agrees with filterCalendarEventsForDate for every event date", () => {
  const year = 2025;
  const calendar = generateLiturgicalCalendar(year, { canonicalMode: "pastoral" });
  const byDate = groupCalendarEventsByDate(calendar);

  for (const event of calendar) {
    const key = event.date.toString();
    const grouped = byDate.get(key) ?? [];
    const filtered = filterCalendarEventsForDate(calendar, event.date);
    assertEquals(grouped.length, filtered.length);
    assertEquals(grouped, filtered);
  }
});

Deno.test("liturgicalYearFromChurchYear", () => {
  assertEquals(liturgicalYearFromChurchYear(2026), 2025);
  assertEquals(liturgicalYearFromChurchYear(2000), 1999);
});
