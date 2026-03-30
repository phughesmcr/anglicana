/**
 * Saturday Evening Prayer — which Holy Communion / Daily Prayer collect rubric applies.
 * @see {@link https://www.churchofengland.org/prayer-and-worship/worship-texts-and-resources/common-worship/churchs-year/rules} (Rules ¶ General — Saturdays)
 * @module
 */

import { determineLiturgicalYear } from "../calendar/bounds.ts";
import { generateLiturgicalCalendar } from "../calendar/generation.ts";
import type { CalendarOptions } from "../calendar/types.ts";
import type { DateInput, EasterOptions } from "../types.ts";
import { getEasterSunday } from "./easter.ts";
import { validateDate } from "./validation.ts";

/** Result of resolving the Saturday Evening Prayer collect rule. */
export type SaturdayEveningPrayerCollectContext =
  | { kind: "not_saturday"; date: Temporal.PlainDate }
  | { kind: "ensuing_sunday"; ensuingSunday: Temporal.PlainDate }
  | { kind: "same_day"; reason: "principal_feast" | "principal_holy_day" | "festival" }
  | { kind: "easter_eve" }
  | { kind: "christmas_eve" };

function isEasterEve(d: Temporal.PlainDate, easterOptions: EasterOptions): boolean {
  const holySaturday = getEasterSunday(d.year, easterOptions).subtract({ days: 1 });
  return Temporal.PlainDate.compare(d, holySaturday) === 0;
}

/**
 * Resolve whether Evening Prayer on a Saturday uses the Collect of the ensuing Sunday or of the day itself.
 * @param date Any calendar date (typically a Saturday).
 * @param options Optional `liturgicalYear` override and {@link CalendarOptions} passed through to calendar generation.
 */
export function getSaturdayEveningPrayerCollectContext(
  date: DateInput,
  options: { liturgicalYear?: number } & CalendarOptions = {},
): SaturdayEveningPrayerCollectContext {
  const plain = validateDate(date);
  if (plain.dayOfWeek !== 6) {
    return { kind: "not_saturday", date: plain };
  }

  const easterOptions = options.easterOptions ?? {};
  if (plain.month === 12 && plain.day === 24) {
    return { kind: "christmas_eve" };
  }
  if (isEasterEve(plain, easterOptions)) {
    return { kind: "easter_eve" };
  }

  const { liturgicalYear: liturgicalYearOverride, ...calendarOptions } = options;
  const liturgicalYear = liturgicalYearOverride ?? determineLiturgicalYear(plain);
  const calendar = generateLiturgicalCalendar(liturgicalYear, {
    ...calendarOptions,
    easterOptions,
  });
  const onDay = calendar.filter((e) => Temporal.PlainDate.compare(e.date, plain) === 0);

  for (const e of onDay) {
    if (e.type === "principal_feast") return { kind: "same_day", reason: "principal_feast" };
    if (e.type === "principal_holy_day") return { kind: "same_day", reason: "principal_holy_day" };
    if (e.type === "festival") return { kind: "same_day", reason: "festival" };
  }

  return { kind: "ensuing_sunday", ensuingSunday: plain.add({ days: 1 }) };
}
