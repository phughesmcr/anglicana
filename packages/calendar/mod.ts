/**
 * @description Complete Common Worship calendar generation for a liturgical year
 * @author P. Hughes <github@phugh.es> (www.phugh.es)
 * @license MIT
 * @module
 */

export { liturgicalYearFromChurchYear } from "@/calendar/calendar/bounds.ts";
export { generateLiturgicalCalendar } from "@/calendar/calendar/generation.ts";
export {
  filterCalendarEventsForDate,
  getEventsForDate,
  getEventsForDateFromCalendar,
  groupCalendarEventsByDate,
} from "@/calendar/calendar/queries.ts";
export { getTrinitySundaySeriesInfo } from "@/calendar/calendar/trinity_sundays.ts";
export type { TrinitySundaySeriesInfo } from "@/calendar/calendar/trinity_sundays.ts";
export type {
  CalendarEvent,
  CalendarOptions,
  EucharisticProperAs,
  LocalEventInput,
} from "@/calendar/calendar/types.ts";
export type { FixedEvent, FixedEventResult } from "@/calendar/data/mod.ts";
export type {
  DateInput,
  DateRange,
  EasterOptions,
  LiturgicalRank,
  SundayLectionaryLetter,
  WeekdayLectionaryNumber,
} from "@/calendar/types.ts";

export * from "@/calendar/temporal/mod.ts";
