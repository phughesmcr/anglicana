/**
 * @description Common Worship lectionary cycle helpers.
 * @module
 */

import { SUNDAY_LECTIONARY_LETTERS } from "../constants.ts";
import type { DateInput, SundayLectionaryLetter, WeekdayLectionaryNumber } from "../types.ts";
import { getChurchYear } from "./advent.ts";

/**
 * Calculates the Common Worship weekday lectionary number for a given date
 * @param date YYYY-MM-DD
 * @returns 1 or 2 (The weekday lectionary runs on a 2 year cycle)
 * @see {@link https://www.churchofengland.org/prayer-and-worship/worship-texts-and-resources/common-worship/churchs-year/lectionary}
 */
export function getWeekdayLectionaryNumber(date: DateInput): WeekdayLectionaryNumber {
  return ((getChurchYear(date) + 1) % 2) + 1 as WeekdayLectionaryNumber;
}

/**
 * Calculates the Common Worship Sunday lectionary letter for a given date
 * @param date YYYY-MM-DD (or church year YYYY)
 * @returns the lectionary letter for the Sunday lectionary
 * @see {@link https://www.churchofengland.org/prayer-and-worship/worship-texts-and-resources/common-worship/churchs-year/lectionary}
 */
export function getSundayLectionaryLetter(date: DateInput): SundayLectionaryLetter {
  return SUNDAY_LECTIONARY_LETTERS[getChurchYear(date) % 3] as SundayLectionaryLetter;
}
