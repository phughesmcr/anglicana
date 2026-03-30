/**
 * @description Additional moveable festivals (Baptism of Christ, Corpus Christi, Christ the King).
 * @module
 */

import { DAYS_AFTER_TRINITY_CORPUS_CHRISTI, TEMPORAL_ISO_SUNDAY } from "../constants.ts";
import type { DateInput, EasterOptions } from "../types.ts";
import { getFirstSundayOfAdvent } from "./advent.ts";
import { getEpiphany, getTrinitySunday } from "./principal_feasts.ts";
import { getNextSunday } from "./sundays.ts";
import { getCalendarYear } from "./validation.ts";

/**
 * Calculate the date of The Baptism of Christ for a given church year
 * @note Standard: The Baptism of Christ is observed on the first Sunday after Epiphany
 * @note Transfer rule: If Epiphany is celebrated on Sunday 7 or 8 January (for pastoral reasons),
 *       the Baptism of Christ is transferred to Monday 8 or 9 January
 * @param date YYYY-MM-DD or YYYY
 * @param epiphanyOnSunday whether Epiphany is being celebrated on a Sunday (Jan 7-8) for pastoral reasons
 * @returns the date of The Baptism of Christ
 */
export function getTheBaptismOfChrist(date: DateInput, epiphanyOnSunday = false): Temporal.PlainDate {
  const calendarYear = getCalendarYear(date);
  const epiphany = getEpiphany(date, epiphanyOnSunday);

  if (epiphanyOnSunday && (epiphany.day === 7 || epiphany.day === 8)) {
    // Special transfer rule: when Epiphany is celebrated on Sunday 7 or 8 Jan,
    // Baptism of Christ transfers to Monday 8 or 9 Jan
    return epiphany.day === 7
      ? new Temporal.PlainDate(calendarYear, 1, 8) // Monday Jan 8
      : new Temporal.PlainDate(calendarYear, 1, 9); // Monday Jan 9
  }

  // Standard rule: First Sunday after Epiphany
  if (epiphany.dayOfWeek === TEMPORAL_ISO_SUNDAY) {
    // If Epiphany is already a Sunday, go to next Sunday
    return epiphany.add({ days: 7 });
  } else {
    // Find the next Sunday after Epiphany
    return getNextSunday(epiphany);
  }
}

/**
 * Calculate the date of Corpus Christi for a given church year
 * @note Corpus Christi is 4 days after Trinity Sunday
 * @param date YYYY-MM-DD or YYYY (calendar year - presumed to be January 1st)
 * @param [easterOptions]
 * @returns the date of Corpus Christi
 */
export function getCorpusChristi(date: DateInput, easterOptions: EasterOptions = {}): Temporal.PlainDate {
  return getTrinitySunday(date, easterOptions).add({ days: DAYS_AFTER_TRINITY_CORPUS_CHRISTI });
}

/**
 * Calculate the date of Christ the King for a given church year
 * @note Christ the King is the last Sunday of Advent
 * @param date YYYY-MM-DD or YYYY (calendar year - presumed to be December 1st)
 * @returns the date of Christ the King
 */
export function getChristTheKing(date: DateInput): Temporal.PlainDate {
  return getFirstSundayOfAdvent(getCalendarYear(date)).subtract({ weeks: 1 });
}
