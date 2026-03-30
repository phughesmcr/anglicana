/**
 * @description Liturgical year range and resolution from a calendar date
 * @author P. Hughes <github@phugh.es> (www.phugh.es)
 * @license MIT
 * @module
 */

import { getFirstSundayOfAdvent, validateYear } from "../temporal/mod.ts";

/**
 * Maps a Common Worship **church year** label to the integer passed to `generateLiturgicalCalendar` and
 * `getLiturgicalYearBounds` (same as `getChurchYear(date) - 1` for any date in that church year).
 *
 * @example Church year `2026` (beginning Advent 2025) uses `generateLiturgicalCalendar(2025)`:
 * `liturgicalYearFromChurchYear(2026) === 2025`.
 */
export function liturgicalYearFromChurchYear(churchYear: number): number {
  validateYear(churchYear);
  return churchYear - 1;
}

/**
 * Determine the liturgical year for a given date
 */
export function determineLiturgicalYear(date: Temporal.PlainDate): number {
  const calendarYear = date.year;
  const adventSunday = getFirstSundayOfAdvent(calendarYear);
  if (Temporal.PlainDate.compare(date, adventSunday) >= 0) {
    return calendarYear;
  } else {
    return calendarYear - 1;
  }
}

/**
 * Get the range of a liturgical year with exclusive end (for internal boundary checks)
 */
export function getLiturgicalYearBounds(
  liturgicalYear: number,
): { start: Temporal.PlainDate; end: Temporal.PlainDate } {
  const validatedYear = validateYear(liturgicalYear);
  const start = getFirstSundayOfAdvent(validatedYear);
  const end = getFirstSundayOfAdvent(validatedYear + 1);
  return { start, end };
}
