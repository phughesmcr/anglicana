/**
 * @description Sunday-related date utilities.
 * @module
 */

import type { DateInput } from "../types.ts";
import { getLiturgicalYearRange } from "./advent.ts";
import { validateDate } from "./validation.ts";

/**
 * Check if a date is a Sunday
 * @param date YYYY-MM-DD
 * @returns `true` if the date is a Sunday, `false` otherwise
 */
export function isSunday(date: DateInput): boolean {
  return validateDate(date).dayOfWeek === 7;
}

/**
 * Get the date of the next Sunday after a given date
 * @param date YYYY-MM-DD
 * @returns the date of the next Sunday
 */
export function getNextSunday(date: DateInput): Temporal.PlainDate {
  const today = validateDate(date);
  if (today.dayOfWeek === 7) return today.add({ weeks: 1 });
  return today.add({ days: 7 - today.dayOfWeek });
}

/**
 * Get the date of the previous Sunday before a given date
 * @param date YYYY-MM-DD
 * @returns the date of the previous Sunday
 */
export function getPreviousSunday(date: DateInput): Temporal.PlainDate {
  const today = validateDate(date);
  if (today.dayOfWeek === 7) return today.subtract({ weeks: 1 });
  return today.subtract({ days: today.dayOfWeek });
}

/**
 * Get the date of the closest Sunday to the date provided
 * @note Will return the date provided if it is a Sunday.
 * @note A Wednesday will return the previous Sunday, as it is 4 days before the next Sunday.
 * @param date YYYY-MM-DD
 * @returns The date of the closest Sunday
 */
export function getClosestSunday(date: DateInput): Temporal.PlainDate {
  const today = validateDate(date);
  if (today.dayOfWeek === 7) return today;
  const nextSunday = today.add({ days: (7 - today.dayOfWeek) % 7 });
  const prevSunday = today.subtract({ days: today.dayOfWeek });
  const nextDiff = today.until(nextSunday, { largestUnit: "days" });
  const prevDiff = today.until(prevSunday, { largestUnit: "days" });
  return Math.abs(nextDiff.days) <= Math.abs(prevDiff.days) ? nextSunday : prevSunday;
}

/**
 * Get all the Sundays in a given date or church year
 * @param date YYYY-MM-DD or YYYY (church year)
 * @returns An array of Temporal.PlainDate objects
 */
export function getSundaysOfChurchYear(date: DateInput): Temporal.PlainDate[] {
  const { start, end } = getLiturgicalYearRange(date);
  const sundays = [];
  let currentSunday = start;
  while (Temporal.PlainDate.compare(currentSunday, end) <= 0) {
    sundays.push(currentSunday);
    currentSunday = currentSunday.add({ weeks: 1 });
  }
  return sundays;
}
