/**
 * @description Easter Sunday calculations (Western, Julian, Orthodox) and Palm Sunday.
 * @module
 */

import type { DateInput, EasterOptions } from "../types.ts";
import { getCalendarYear } from "./validation.ts";

/**
 * Heiner Lichtenberg's method of calculating Easter Day
 * @param year the year as a number in the format YYYY (e.g., 2024)
 * @param [easterOptions]
 * @note For Western Easter, set `gregorian` to `false` and `julian` to `false`. [Default]
 * @note For Eastern Orthodox Easter, set `gregorian` to `true` and `julian` to `true`.
 * @see {@link https://github.com/commenthol/date-easter/blob/0aee77a999d19b40c711a1769b26d2a7bbe326ae/src/index.js#L33}
 * @see {@link https://de.wikipedia.org/wiki/Gau%C3%9Fche_Osterformel}
 * @see {@link getWesternEaster}
 * @see {@link getJulianEaster}
 * @see {@link getOrthodoxEaster}
 */
export function getEasterSunday(date: DateInput, easterOptions: EasterOptions = {}): Temporal.PlainDate {
  const liturgicalYear = getCalendarYear(date);
  const { gregorian = false, julian = false } = easterOptions;
  const k = Math.floor(liturgicalYear / 100);
  let m = 15 + Math.floor((3 * k + 3) / 4) - Math.floor((8 * k + 13) / 25);
  let s = 2 - Math.floor((3 * k + 3) / 4);
  if (julian) {
    m = 15;
    s = 0;
  }
  const a = liturgicalYear % 19;
  const d = (19 * a + m) % 30;
  const r = Math.floor((d + a / 11) / 29);
  const og = 21 + d - r;
  const sz = 7 - Math.floor(liturgicalYear + liturgicalYear / 4 + s) % 7;
  const oe = 7 - (og - sz) % 7;
  let os = og + oe;
  if (gregorian) {
    os = os + Math.floor(liturgicalYear / 100) - Math.floor(liturgicalYear / 400) - 2;
  }
  //                        1   2   3   4   5   6   7   8
  const daysPerMonth = [0, 31, 28, 31, 30, 31, 30, 31, 31];
  let day = os;
  let month;
  for (month = 3; month < 8; month++) {
    if (day <= daysPerMonth[month]) {
      break;
    }
    day -= daysPerMonth[month];
  }
  return new Temporal.PlainDate(liturgicalYear, month, day);
}

/**
 * Get the date of Western Easter Sunday for a given calendar year
 * @param date YYYY-MM-DD or YYYY (calendar year - presumed to be January 1st)
 * @returns the date of Easter Sunday in the western church
 */
export function getWesternEaster(date: DateInput): Temporal.PlainDate {
  return getEasterSunday(date);
}

/**
 * Get the date of Easter Sunday using the Julian Calendar for a given calendar year
 * @param date YYYY-MM-DD or YYYY (calendar year - presumed to be January 1st)
 * @returns the date of Easter Sunday in the Julian calendar
 */
export function getJulianEaster(date: DateInput): Temporal.PlainDate {
  return getEasterSunday(
    date,
    {
      gregorian: false,
      julian: true,
    },
  );
}

/**
 * Get the Orthodox date of Easter Sunday for a given calendar year
 * @param date YYYY-MM-DD or YYYY (calendar year - presumed to be January 1st)
 * @returns the date of Easter Sunday
 */
export function getOrthodoxEaster(date: DateInput): Temporal.PlainDate {
  return getEasterSunday(
    date,
    {
      gregorian: true,
      julian: true,
    },
  );
}

/**
 * Calculate Palm Sunday (the Sunday before Easter)
 * @param date YYYY-MM-DD or YYYY (calendar year - presumed to be January 1st)
 * @param [easterOptions]
 * @returns the date of Palm Sunday
 */
export function getPalmSunday(date: DateInput, easterOptions: EasterOptions = {}): Temporal.PlainDate {
  const easter = getEasterSunday(date, easterOptions);
  return easter.subtract({ weeks: 1 });
}
