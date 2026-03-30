/**
 * @description Ash Wednesday, Maundy Thursday, Good Friday.
 * @module
 */

import {
  DAYS_BEFORE_EASTER_ASH_WEDNESDAY,
  DAYS_BEFORE_EASTER_GOOD_FRIDAY,
  DAYS_BEFORE_EASTER_MAUNDY_THURSDAY,
} from "../constants.ts";
import type { DateInput, EasterOptions } from "../types.ts";
import { getEasterSunday } from "./easter.ts";

/**
 * Calculate the date of Ash Wednesday for a given church year. Defaults to Western Easter.
 * @note Ash Wednesday is 46 days before Easter Sunday
 * @param date YYYY-MM-DD or YYYY (calendar year - presumed to be January 1st)
 * @param [easterOptions]
 * @returns the western date of Ash Wednesday
 */
export function getAshWednesday(date: DateInput, easterOptions: EasterOptions = {}): Temporal.PlainDate {
  return getEasterSunday(date, easterOptions).subtract({ days: DAYS_BEFORE_EASTER_ASH_WEDNESDAY });
}

/**
 * Calculate the date of Maundy Thursday for a given church year. Defaults to Western Easter.
 * @note Maundy Thursday is the Thursday before Easter Sunday
 * @param date YYYY-MM-DD or YYYY (calendar year - presumed to be January 1st)
 * @param [easterOptions]
 * @returns the western date of Maundy Thursday
 */
export function getMaundyThursday(date: DateInput, easterOptions: EasterOptions = {}): Temporal.PlainDate {
  return getEasterSunday(date, easterOptions).subtract({ days: DAYS_BEFORE_EASTER_MAUNDY_THURSDAY });
}

/**
 * Calculate the date of Good Friday for a given church year. Defaults to Western Easter.
 * @note Good Friday is the Friday before Easter Sunday
 * @param date YYYY-MM-DD or YYYY (calendar year - presumed to be January 1st)
 * @param [easterOptions]
 * @returns the western date of Good Friday
 */
export function getGoodFriday(date: DateInput, easterOptions: EasterOptions = {}): Temporal.PlainDate {
  return getEasterSunday(date, easterOptions).subtract({ days: DAYS_BEFORE_EASTER_GOOD_FRIDAY });
}
