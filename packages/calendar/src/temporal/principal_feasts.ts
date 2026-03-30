/**
 * @description Principal feasts (Christmas, Epiphany, Easter season milestones, All Saints, etc.).
 * @module
 */

import type { DateInput, EasterOptions } from "../types.ts";
import { getEasterSunday, getPalmSunday } from "./easter.ts";
import { getCalendarYear } from "./validation.ts";

/** Returns the first Sunday in [start, end] (inclusive), or null if none exists. */
function findFirstSundayInRange(start: Temporal.PlainDate, end: Temporal.PlainDate): Temporal.PlainDate | null {
  let d = start;
  while (Temporal.PlainDate.compare(d, end) <= 0) {
    if (d.dayOfWeek === 7) return d;
    d = d.add({ days: 1 });
  }
  return null;
}

/**
 * Get Christmas Day for a liturgical year
 * @param date YYYY-MM-DD or YYYY (calendar year - presumed to be January 1st)
 * @returns the date of Christmas Day
 */
export function getChristmasDay(date: DateInput): Temporal.PlainDate {
  return new Temporal.PlainDate(getCalendarYear(date), 12, 25);
}

/**
 * Returns January 6th in a given year.
 * @param date YYYY-MM-DD or YYYY (calendar year - presumed to be January 1st)
 * @param transferToSunday whether to transfer Epiphany to the following Sunday if it is not already a Sunday
 * @returns The date of Epiphany
 */
export function getEpiphany(date: DateInput, transferToSunday = false): Temporal.PlainDate {
  const calendarYear = getCalendarYear(date);
  const epiphany = Temporal.PlainDate.from({ year: calendarYear, month: 1, day: 6 });
  if (transferToSunday && epiphany.dayOfWeek !== 7) {
    const sunday = findFirstSundayInRange(
      new Temporal.PlainDate(calendarYear, 1, 2),
      new Temporal.PlainDate(calendarYear, 1, 8),
    );
    if (sunday) return sunday;
  }
  return epiphany;
}

/**
 * Returns the date of Candlemas (The Presentation of Christ in the Temple) for a given year
 * @note Candlemas is celebrated on 2nd February or on the Sunday falling between 28 January and 3 February (inclusive)
 * @param date YYYY-MM-DD or YYYY (calendar year - presumed to be January 1st)
 * @param transferToSunday whether to use the alternative Sunday falling between 28 January and 3 February
 * @returns The date of Candlemas
 */
export function getPresentationOfChristInTheTemple(date: DateInput, transferToSunday = false): Temporal.PlainDate {
  const calendarYear = getCalendarYear(date);
  if (transferToSunday) {
    const sunday = findFirstSundayInRange(
      new Temporal.PlainDate(calendarYear, 1, 28),
      new Temporal.PlainDate(calendarYear, 2, 3),
    );
    if (sunday) return sunday;
    return new Temporal.PlainDate(calendarYear, 2, 2);
  }
  return Temporal.PlainDate.from({ year: calendarYear, month: 2, day: 2 });
}

/**
 * Calculate the date of the Annunciation for a given year
 * @note The Annunciation, falling on a Sunday, is transferred to the Monday following.
 *       Falling between Palm Sunday and the Second Sunday of Easter inclusive,
 *       it is transferred to the Monday after the Second Sunday of Easter.
 * @param date YYYY-MM-DD or YYYY (calendar year - presumed to be January 1st)
 * @param [easterOptions]
 * @returns The date of the Annunciation
 */
export function getAnnunciation(date: DateInput, easterOptions: EasterOptions = {}): Temporal.PlainDate {
  const calendarYear = getCalendarYear(date);
  const annunciation = Temporal.PlainDate.from({ year: calendarYear, month: 3, day: 25 });
  const easter = getEasterSunday(calendarYear, easterOptions);
  const palmSunday = getPalmSunday(calendarYear, easterOptions);
  const secondSundayOfEaster = easter.add({ weeks: 1 });

  // Check if Annunciation falls between Palm Sunday and Second Sunday of Easter (inclusive)
  if (
    Temporal.PlainDate.compare(annunciation, palmSunday) >= 0 &&
    Temporal.PlainDate.compare(annunciation, secondSundayOfEaster) <= 0
  ) {
    // Transfer to Monday after Second Sunday of Easter
    return secondSundayOfEaster.add({ days: 1 });
  }

  // Check if Annunciation falls on a Sunday
  if (annunciation.dayOfWeek === 7) {
    // Transfer to the following Monday
    return annunciation.add({ days: 1 });
  }

  // Return on the normal date (March 25)
  return annunciation;
}

/**
 * Calculate the date of the feast of the Ascension for a given year. Defaults to Western Easter.
 * @note Ascension is the 40th day of Easter (39 days after Easter Sunday) and always falls on a Thursday
 * @param date YYYY-MM-DD or YYYY (calendar year - presumed to be January 1st)
 * @param [easterOptions]
 * @returns the western date of the Ascension
 */
export function getAscensionDay(date: DateInput, easterOptions: EasterOptions = {}): Temporal.PlainDate {
  return getEasterSunday(date, easterOptions).add({ days: 39 });
}

/**
 * Calculate the date of the Day of Pentecost (Whit Sunday) for a given church year. Defaults to Western Easter.
 * @note Pentecost is the 50th day after Easter Sunday
 * @param date YYYY-MM-DD or YYYY (calendar year - presumed to be January 1st)
 * @param [easterOptions]
 * @returns the date of Pentecost
 */
export function getDayOfPentecost(date: DateInput, easterOptions: EasterOptions = {}): Temporal.PlainDate {
  return getEasterSunday(date, easterOptions).add({ days: 49 });
}

/**
 * Calculate the date of Trinity Sunday for a given church year
 * @note Trinity Sunday is the Sunday after Pentecost
 * @param date YYYY-MM-DD or YYYY (calendar year - presumed to be January 1st)
 * @param [easterOptions]
 * @returns the date of Trinity Sunday
 */
export function getTrinitySunday(date: DateInput, easterOptions: EasterOptions = {}): Temporal.PlainDate {
  return getDayOfPentecost(date, easterOptions).add({ days: 7 });
}

/**
 * Calculate the date of All Saints' Day for a given church year
 * @note All Saints' Day is celebrated on either 1 November or the Sunday falling between
 *       30 October and 5 November; if the latter there may be a secondary celebration
 *       on 1 November
 * @param date YYYY-MM-DD or YYYY (calendar year - presumed to be January 1st)
 * @param transferToSunday whether to use the Sunday falling between 30 October and 5 November
 * @returns the date of All Saints' Day
 */
export function getAllSaintsDay(date: DateInput, transferToSunday = false): Temporal.PlainDate {
  const calendarYear = getCalendarYear(date);
  const allSaints = Temporal.PlainDate.from({ year: calendarYear, month: 11, day: 1 });
  if (transferToSunday) {
    const sunday = findFirstSundayInRange(
      Temporal.PlainDate.from({ year: calendarYear, month: 10, day: 30 }),
      Temporal.PlainDate.from({ year: calendarYear, month: 11, day: 5 }),
    );
    if (sunday) return sunday;
  }
  return allSaints;
}
