/**
 * @description Advent Sunday and liturgical / church year boundaries.
 * @module
 */

import type { DateInput, DateRange } from "../types.ts";
import { validateDate, validateYear } from "./validation.ts";

/**
 * Calculate the date of Advent Sunday for a given calendar year
 * @note The First Sunday of Advent is the 4th Sunday before Christmas Day (25 December)
 * @param calendarYear The calendar year as a number in the format YYYY (e.g., 2024)
 * @returns The date of the First Sunday of Advent
 */
export function getFirstSundayOfAdvent(calendarYear: number): Temporal.PlainDate {
  const year = validateYear(calendarYear);
  const christmas = new Temporal.PlainDate(year, 12, 25);
  // Calculate the 4th Sunday before Christmas
  // Pattern: days back = 21 + (Christmas day of week)
  // This accounts for the varying number of days between Christmas and the preceding Sunday
  const christmasDayOfWeek = christmas.dayOfWeek; // 1=Mon, 2=Tue, ..., 7=Sun
  const daysBack = 21 + christmasDayOfWeek;
  return christmas.subtract({ days: daysBack });
}

/**
 * Calculate which church year a given date is in
 * @note The church year begins on the First Sunday of Advent, not New Year's Day.
 * @note When provided only a year, the date is presumed to be January 1st of that year.
 * @param date YYYY-MM-DD or YYYY (calendar year - presumed to be January 1st)
 * @returns the church year as a number in the format YYYY
 */
export function getLiturgicalYear(date: DateInput): number {
  const plainDate = validateDate(date);
  const adventSunday = getFirstSundayOfAdvent(plainDate.year);
  if (Temporal.PlainDate.compare(plainDate, adventSunday) >= 0) {
    // If date is on or after Advent Sunday, church year is the same calendar year
    return plainDate.year;
  } else {
    return plainDate.year - 1;
  }
}

/**
 * Get the date range for a given liturgical year
 * @param date YYYY-MM-DD or YYYY (calendar year - presumed to be January 1st)
 * @returns the date range for the church year
 */
export function getLiturgicalYearRange(date: DateInput): DateRange {
  const plainYear = getLiturgicalYear(date); // date is validated here
  const adventSunday = getFirstSundayOfAdvent(plainYear);
  const nextYear = getFirstSundayOfAdvent(plainYear + 1);
  return {
    start: adventSunday,
    end: nextYear.subtract({ days: 1 }),
  };
}

/**
 * Calculate which church year a given date is in, using Common Worship naming
 * (church year is named after the following calendar year).
 */
export function getChurchYear(date: DateInput): number {
  return getLiturgicalYear(date) + 1;
}
