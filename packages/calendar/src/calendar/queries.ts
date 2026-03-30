/**
 * @description Look up generated calendar events for a specific date
 * @author P. Hughes <github@phugh.es> (www.phugh.es)
 * @license MIT
 * @module
 */

import type { DateInput } from "../types.ts";
import { determineLiturgicalYear } from "./bounds.ts";
import { generateLiturgicalCalendar } from "./generation.ts";
import type { CalendarEvent, CalendarOptions } from "./types.ts";

function plainDateFromInput(date: DateInput): Temporal.PlainDate {
  return typeof date === "string"
    ? Temporal.PlainDate.from(date)
    : typeof date === "number"
    ? new Temporal.PlainDate(date, 1, 1)
    : date instanceof Temporal.PlainDate
    ? date
    : Temporal.PlainDate.from(date);
}

/**
 * Events from a pre-generated calendar that fall on `date`.
 * @param calendar Output of {@link generateLiturgicalCalendar} for the liturgical year that contains `date`.
 */
export function filterCalendarEventsForDate(
  calendar: readonly CalendarEvent[],
  date: DateInput,
): CalendarEvent[] {
  const targetDate = plainDateFromInput(date);
  return calendar.filter((event) => Temporal.PlainDate.compare(event.date, targetDate) === 0);
}

/**
 * Group calendar events by ISO calendar date (`Temporal.PlainDate.toString()`).
 * Per-day arrays preserve the order of events in `calendar` (generation output is chronological).
 */
export function groupCalendarEventsByDate(
  calendar: readonly CalendarEvent[],
): ReadonlyMap<string, CalendarEvent[]> {
  const map = new Map<string, CalendarEvent[]>();
  for (const event of calendar) {
    const key = event.date.toString();
    const list = map.get(key);
    if (list) list.push(event);
    else map.set(key, [event]);
  }
  return map;
}

/**
 * Same result as {@link getEventsForDate} for `date` without calling {@link generateLiturgicalCalendar}.
 * `calendar` must be the full year produced for the liturgical year that contains `date`.
 */
export function getEventsForDateFromCalendar(
  calendar: readonly CalendarEvent[],
  date: DateInput,
): CalendarEvent[] {
  return filterCalendarEventsForDate(calendar, date);
}

/**
 * Get all events for a specific date.
 *
 * **Performance:** Each call runs {@link generateLiturgicalCalendar} for the whole liturgical year. For many
 * dates (month views, exports), generate once and use {@link groupCalendarEventsByDate} or
 * {@link getEventsForDateFromCalendar} instead.
 *
 * @param calendarOptions Forwarded to {@link generateLiturgicalCalendar} (e.g. `canonicalMode`, secondary All Saints).
 */
export function getEventsForDate(
  date: DateInput,
  liturgicalYear?: number,
  calendarOptions?: CalendarOptions,
): CalendarEvent[] {
  const targetDate = plainDateFromInput(date);
  const year = liturgicalYear ?? determineLiturgicalYear(targetDate);
  const calendar = generateLiturgicalCalendar(year, calendarOptions ?? {});
  return filterCalendarEventsForDate(calendar, targetDate);
}
