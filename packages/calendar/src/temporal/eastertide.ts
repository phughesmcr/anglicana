/**
 * @description Holy Week, Rogation Days, and Ascension–Pentecost novena.
 * @module
 */

import type { DateInput, EasterOptions } from "../types.ts";
import { getPalmSunday } from "./easter.ts";
import { getAscensionDay } from "./principal_feasts.ts";

/**
 * Calculate the dates of Holy Week for a given church year
 * @param date YYYY-MM-DD or YYYY (calendar year - presumed to be January 1st)
 * @param [easterOptions]
 * @returns An array of Temporal.PlainDate objects
 */
export function getHolyWeek(date: DateInput, easterOptions: EasterOptions = {}): Temporal.PlainDate[] {
  const palmSunday = getPalmSunday(date, easterOptions);
  return Array.from({ length: 7 }, (_, i) => palmSunday.add({ days: i }));
}

/**
 * Calculate the Rogation Days for a given date
 * @note Rogation Days are the three days before Ascension Day, when prayer is offered for God's blessing on the fruits of the earth and on human labour.
 * @param date YYYY-MM-DD or YYYY (calendar year - presumed to be January 1st)
 * @param [easterOptions]
 * @returns {Array} An array of Temporal.PlainDate objects
 */
export function getRogationDays(date: DateInput, easterOptions: EasterOptions = {}): Temporal.PlainDate[] {
  const ascension = getAscensionDay(date, easterOptions);
  return [3, 2, 1].map((days) => ascension.subtract({ days }));
}

/**
 * Calculate the date of the Novena to the Holy Spirit for a given church year
 * @note The Novena to the Holy Spirit is nine days beginning on the day after Ascension Day.
 * @param date YYYY-MM-DD or YYYY (calendar year - presumed to be January 1st)
 * @param [easterOptions]
 * @returns the date of the Novena to the Holy Spirit
 */
export function getNovena(date: DateInput, easterOptions: EasterOptions = {}): Temporal.PlainDate[] {
  const start = getAscensionDay(date, easterOptions).add({ days: 1 });
  return Array.from({ length: 9 }, (_, i) => start.add({ days: i }));
}
