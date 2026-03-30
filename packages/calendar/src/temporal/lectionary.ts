/**
 * @description Common Worship lectionary cycle helpers.
 * @module
 */

import type { DateInput, SundayLectionaryLetter, WeekdayLectionaryNumber } from "../types.ts";
import { getChurchYear } from "./advent.ts";

/**
 * Calculates the Common Worship weekday lectionary number for a given date
 * @param date YYYY-MM-DD
 * @returns 1 or 2 (The weekday lectionary runs on a 2 year cycle)
 * @see {@link https://www.churchofengland.org/prayer-and-worship/worship-texts-and-resources/common-worship/churchs-year/lectionary}
 */
export function getWeekdayLectionaryNumber(date: DateInput): WeekdayLectionaryNumber {
  const churchYear = getChurchYear(date);
  return ((churchYear + 1) % 2) + 1 as WeekdayLectionaryNumber;
}

/**
 * Calculates the Common Worship Sunday lectionary letter for a given date
 * @param date YYYY-MM-DD (or church year YYYY)
 * @returns the lectionary letter for the Sunday lectionary
 * @see {@link https://www.churchofengland.org/prayer-and-worship/worship-texts-and-resources/common-worship/churchs-year/lectionary}
 */
export function getSundayLectionaryLetter(date: DateInput): SundayLectionaryLetter {
  const year = getChurchYear(date) % 3;
  return ["C", "A", "B"][year] as SundayLectionaryLetter;
}
