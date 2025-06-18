/**
 * @module
 * @description Various functions to get Church of England calendar dates and times using the Temporal API.
 * @author P. Hughes <github@phugh.es> (www.phugh.es)
 * @version "2024-02-07"
 * @license MIT
 * @see {@link https://www.churchofengland.org/prayer-and-worship/worship-texts-and-resources/common-worship/churchs-year/rules}
 * @requires Temporal @see {@link https://github.com/tc39/proposal-temporal/blob/main/README.md#polyfills}
 */

import { commonWorshipFixedCalendar } from "./common_worship/fixed_calendar.ts";

//#region Types

/** Type for calendar events */
export type CalendarEvent = {
  observed: (Temporal.PlainDate | null)[];
  type: "F" | "L" | "C" | "P";
  group: number | null;
  id: number;
  title: string;
};

/** Interface for moveable dates */
export interface MoveableDates {
  /** Date of Epiphany */
  epiphany: Temporal.PlainDate;
  /** Date of the Baptism of Christ */
  theBaptismOfChrist: Temporal.PlainDate;
  /** Date of Ash Wednesday */
  ashWednesday: Temporal.PlainDate;
  /** Date of Maundy Thursday */
  maundyThursday: Temporal.PlainDate;
  /** Date of Good Friday */
  goodFriday: Temporal.PlainDate;
  /** Date of Easter Sunday */
  easter: Temporal.PlainDate;
  /** Date of Ascension Day */
  ascensionDay: Temporal.PlainDate;
  /** Date of Pentecost */
  dayOfPentecost: Temporal.PlainDate;
  /** Date of Trinity Sunday */
  trinitySunday: Temporal.PlainDate;
}

/** Interface for Easter calculation options */
export interface EasterOptions {
  /** Use Gregorian calendar */
  gregorian?: boolean;
  /** Use Julian calendar */
  julian?: boolean;
}

/** Type for church seasons */
export type ChurchSeason =
  | "advent"
  | "christmas"
  | "epiphany"
  | "ordinaryTime"
  | "lent"
  | "eastertide"
  | "holyWeek"
  | "triduum"
  | "pentecost"
  | "creationtide";

/** Type for church seasons with start and end dates */
export type ChurchSeasons = { season: ChurchSeason; start: Temporal.PlainDate; end: Temporal.PlainDate }[];

/** Interface for principal feasts */
export interface PrincipalFeasts {
  /** Date of Christmas */
  christmas: Temporal.PlainDate;
  /** Date of Epiphany */
  epiphany: Temporal.PlainDate;
  /** Date of the Presentation of Christ */
  presentation: Temporal.PlainDate;
  /** Date of the Annunciation */
  annunciation: Temporal.PlainDate;
  /** Date of Ascension */
  ascension: Temporal.PlainDate;
  /** Date of Pentecost */
  pentecost: Temporal.PlainDate;
  /** Date of Trinity Sunday */
  trinitySunday: Temporal.PlainDate;
  /** Date of All Saints' Day */
  allSaintsDay: Temporal.PlainDate;
}

/** Interface for principal holy days */
export interface PrincipalHolyDays {
  /** Date of Ash Wednesday */
  ashWednesday: Temporal.PlainDate;
  /** Date of Maundy Thursday */
  maundyThursday: Temporal.PlainDate;
  /** Date of Good Friday */
  goodFriday: Temporal.PlainDate;
}

/** Interface for additional Eastertide days */
export interface EastertideAdditionalDays {
  /** Dates of Holy Week */
  holyWeek: Temporal.PlainDate[];
  /** Dates of Rogation Days */
  rogationDays: Temporal.PlainDate[];
  /** Dates of the Novena */
  novena: Temporal.PlainDate[];
}

//#endregion Types

//#region Utils

/**
 * Validate a year input
 * @param year YYYY
 * @returns the validated year
 * @throws RangeError if the year is invalid
 * @throws TypeError if the year is not a number
 */
export function validateYear(year: number): number {
  if (typeof year !== "number") {
    throw new TypeError("Invalid date: Input must be a number");
  }
  if (!Number.isInteger(year)) {
    throw new RangeError("Invalid date: Year must be an integer");
  }
  // Temporal.PlainDate only supports years between -271820 and 275759
  if (year < -271820 || year > 275759) {
    throw new RangeError("Invalid date: Year is out of Temporal API range");
  }
  // To avoid weirdness with the Julian calendar
  if (year < 1583 || year > 9999) {
    throw new RangeError("Invalid date: Year must be >= 1583 and <= 9999");
  }
  return year;
}

/**
 * Validate a date input
 * @param date YYYY-MM-DD or YYYY
 * @returns the validated date
 * @throws RangeError if the date is invalid
 */
export function validateDate<T extends string | number | Temporal.PlainDate | Temporal.PlainDateLike>(date: T): T {
  if (typeof date === "string") {
    try {
      Temporal.PlainDate.from(date);
    } catch (_err) {
      throw new RangeError(`Invalid date string: ${date}`);
    }
  } else if (typeof date === "number") {
    validateYear(date);
  } else if (date instanceof Temporal.PlainDate) {
    return date;
  } else if (typeof date === "object" && date !== null) {
    const { year, month, day } = date;
    if (year === undefined || month === undefined || day === undefined) {
      throw new RangeError("Invalid date: PlainDateLike object: year, month, and day are required");
    }
    validateYear(year);
    if (month < 1 || month > 12) {
      throw new RangeError(`Invalid date: month ${month} is not between 1 and 12`);
    }
    if (day < 1 || day > 31) {
      throw new RangeError(`Invalid date: day ${day} is not between 1 and 31`);
    }
    if (month === 2 && day > 29) {
      throw new RangeError(`Invalid date: February ${day} is not between 1 and 29`);
    }
    if ((month === 4 || month === 6 || month === 9 || month === 11) && day > 30) {
      throw new RangeError(`Invalid date: ${month} has 30 days`);
    }
    if (
      (month === 1 || month === 3 || month === 5 || month === 7 || month === 8 || month === 10 || month === 12) &&
      day > 31
    ) {
      throw new RangeError(`Invalid date: ${month} has 31 days`);
    }
    try {
      Temporal.PlainDate.from(date);
    } catch (_err) {
      throw new RangeError(`Invalid date: ${JSON.stringify(date)}`);
    }
  } else {
    throw new RangeError("Invalid date: input type invalid");
  }
  return date;
}

//#endregion Utils

//#region Advent and Church Year

/**
 * Calculate the date of Advent Sunday for a given calendar year
 * @note The First Sunday of Advent is 3 days after the last Thursday in November
 * @param calendarYear The calendar year as a number in the format YYYY (e.g., 2024)
 * @returns The date of the First Sunday of Advent
 */
export function getFirstSundayOfAdvent(calendarYear: number): Temporal.PlainDate {
  const year = validateYear(calendarYear);
  let date = Temporal.PlainDate.from({ year, month: 11, day: 27 });
  while (date.dayOfWeek !== 7) {
    date = date.add({ days: 1 });
  }
  return date;
}

/**
 * Calculate which church year a given date is in
 * @note The church year begins on the First Sunday of Advent, not New Year's Day.
 * @note When provided only a year, the date is presumed to be January 1st of that year.
 * @param date YYYY-MM-DD or YYYY (calendar year)
 * @returns the church year as a number in the format YYYY
 */
export function getChurchYear(date: string | number | Temporal.PlainDate | Temporal.PlainDateLike): number {
  if (typeof date === "number") {
    date = new Temporal.PlainDate(validateYear(date), 1, 1);
  }
  const plainDate = Temporal.PlainDate.from(validateDate(date));
  const adventSunday = getFirstSundayOfAdvent(plainDate.year);
  if (Temporal.PlainDate.compare(plainDate, adventSunday) >= 0) {
    // If date is on or after Advent Sunday, church year is year + 1
    return plainDate.year + 1;
  } else {
    return plainDate.year;
  }
}

//#endregion Advent

//#region Sundays

/**
 * Check if a date is a Sunday
 * @param date YYYY-MM-DD
 * @returns `true` if the date is a Sunday, `false` otherwise
 */
export function isSunday(date: string | Temporal.PlainDate | Temporal.PlainDateLike): boolean {
  return Temporal.PlainDate.from(validateDate(date)).dayOfWeek === 7;
}

/**
 * Get the date of the next Sunday after a given date
 * @param date YYYY-MM-DD
 * @returns the date of the next Sunday
 */
export function getNextSunday(date: string | Temporal.PlainDate | Temporal.PlainDateLike): Temporal.PlainDate {
  const today = Temporal.PlainDate.from(validateDate(date));
  if (today.dayOfWeek === 7) return today.add({ weeks: 1 });
  return today.add({ days: 7 - today.dayOfWeek });
}

/**
 * Get the date of the previous Sunday before a given date
 * @param date YYYY-MM-DD
 * @returns the date of the previous Sunday
 */
export function getPreviousSunday(date: string | Temporal.PlainDate | Temporal.PlainDateLike): Temporal.PlainDate {
  const today = Temporal.PlainDate.from(validateDate(date));
  if (today.dayOfWeek === 7) return today.subtract({ weeks: 1 });
  return today.subtract({ days: today.dayOfWeek });
}

/**
 * Get the date of the closest Sunday to the date provided
 * @note Will return the date provided if it is a Sunday.
 * @note A Wednesday will return the previous Sunday, as it is 4 days before the next Sunday.
 * @param date YYYY-MM-DD
 * @returns The date of the closest Sunday
 *
 * @TODO Are "days" the correct unit for this?
 */
export function getClosestSunday(date: string | Temporal.PlainDate | Temporal.PlainDateLike): Temporal.PlainDate {
  const today = Temporal.PlainDate.from(validateDate(date));
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
export function getSundaysOfChurchYear(
  date: string | number | Temporal.PlainDate | Temporal.PlainDateLike,
): Temporal.PlainDate[] {
  const churchYear = getChurchYear(date);
  const firstSunday = getFirstSundayOfAdvent(churchYear - 1);
  const lastSunday = getFirstSundayOfAdvent(churchYear).subtract({ weeks: 1 });
  const sundays = [];
  let currentSunday = firstSunday;
  while (Temporal.PlainDate.compare(currentSunday, lastSunday) <= 0) {
    sundays.push(currentSunday);
    currentSunday = currentSunday.add({ weeks: 1 });
  }
  return sundays;
}

//#endregion Sundays

//#region Lectionary

/**
 * Calculates the Common Worship weekday lectionary number for a given date
 * @param date YYYY-MM-DD
 * @returns 1 or 2 (The weekday lectionary runs on a 2 year cycle)
 * @see {@link https://www.churchofengland.org/prayer-and-worship/worship-texts-and-resources/common-worship/churchs-year/lectionary}
 */
export function getWeekdayLectionaryNumber(
  date: string | Temporal.PlainDate | Temporal.PlainDateLike,
): 1 | 2 {
  const plainDate = Temporal.PlainDate.from(validateDate(date));
  const churchYear = getChurchYear(plainDate);
  return ((churchYear + 1) % 2) + 1 as 1 | 2;
}

/**
 * Calculates the Common Worship Sunday lectionary letter for a given date
 * @param date YYYY-MM-DD (or church year YYYY)
 * @returns the lectionary letter for the Sunday lectionary
 * @see {@link https://www.churchofengland.org/prayer-and-worship/worship-texts-and-resources/common-worship/churchs-year/lectionary}
 */
export function getSundayLectionaryLetter(
  date: string | number | Temporal.PlainDate | Temporal.PlainDateLike,
): "A" | "B" | "C" {
  return ["C", "A", "B"][getChurchYear(date) % 3] as "A" | "B" | "C";
}

//#endregion Lectionary

//#region Principal Feasts

/**
 * Get Christmas Day for a given calendar year
 * @param calendarYear the calendar year as a number in the format YYYY (e.g., 2024)
 * @returns the date of Christmas Day
 */
export function getChristmasDay(calendarYear: number): Temporal.PlainDate {
  return new Temporal.PlainDate(validateYear(calendarYear), 12, 25);
}

/**
 * Returns January 6th in a given year.
 * @param year YYYY
 * @param transferToSunday whether to transfer Epiphany to the following Sunday if it is not already a Sunday
 * @returns The date of Epiphany
 */
export function getEpiphany(year: number, transferToSunday = false): Temporal.PlainDate {
  validateYear(year);
  const epiphany = Temporal.PlainDate.from({ year, month: 1, day: 6 });
  if (transferToSunday && epiphany.dayOfWeek !== 7) {
    return getNextSunday(epiphany); // epiphany.add({ days: 7 - epiphany.dayOfWeek });
  }
  return epiphany;
}

/**
 * Returns the date of Candlemas (The Presentation of Christ in the Temple) for a given year
 * @note Candlemas is the 2nd February or the Sunday falling between 28 January and 3 February
 * @param year YYYY
 * @param transferToSunday whether to use the alternative Sunday falling between 28 January and 3 February
 * @returns The date of Candlemas
 */
export function getPresentationOfChristInTheTemple(year: number, transferToSunday = false): Temporal.PlainDate {
  if (transferToSunday) {
    // find sunday between 28 January and 3 February
    const firstSundayInFebruary = Temporal.PlainDate.from({ year, month: 2, day: 1 });
    const lastSundayInJanuary = getPreviousSunday(firstSundayInFebruary);
    return lastSundayInJanuary;
  }
  return Temporal.PlainDate.from({ year, month: 2, day: 2 });
}

/**
 * Calculate the date of the Annunciation for a given year
 * @note the Annunciation, falling on a Sunday, is transferred
 *       to the Monday following or, falling between Palm Sunday and the Second Sunday
 *       of Easter inclusive, is transferred to the Monday after the Second Sunday of Easter
 * @param year YYYY
 * @param [easterOptions]
 * @returns The date of the Annunciation
 *
 * @TODO needs updating to follow the above note
 */
export function getAnnunciation(year: number, easterOptions: EasterOptions = {}): Temporal.PlainDate {
  const annunciation = Temporal.PlainDate.from({ year: year, month: 3, day: 25 });
  const easter = getEasterSunday(year, easterOptions);
  const palmSunday = getPalmSunday(year, easterOptions);
  if (
    Temporal.PlainDate.compare(annunciation, palmSunday) >= 0 &&
    Temporal.PlainDate.compare(annunciation, easter.add({ weeks: 1 })) <= 0
  ) {
    return easter.add({ weeks: 1, days: 1 });
  }
  return annunciation;
}

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
export function getEasterSunday(year: number, easterOptions: EasterOptions = {}): Temporal.PlainDate {
  validateYear(year);
  const { gregorian = false, julian = false } = easterOptions;
  const k = Math.floor(year / 100);
  let m = 15 + Math.floor((3 * k + 3) / 4) - Math.floor((8 * k + 13) / 25);
  let s = 2 - Math.floor((3 * k + 3) / 4);
  if (julian) {
    m = 15;
    s = 0;
  }
  const a = year % 19;
  const d = (19 * a + m) % 30;
  const r = Math.floor((d + a / 11) / 29);
  const og = 21 + d - r;
  const sz = 7 - Math.floor(year + year / 4 + s) % 7;
  const oe = 7 - (og - sz) % 7;
  let os = og + oe;
  if (gregorian) {
    os = os + Math.floor(year / 100) - Math.floor(year / 400) - 2;
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
  return new Temporal.PlainDate(year, month, day);
}

/**
 * Get the date of Western Easter Sunday for a given calendar year
 * @param year YYYY
 * @returns the date of Easter Sunday in the western church
 */
export function getWesternEaster(year: number): Temporal.PlainDate {
  validateYear(year);
  return getEasterSunday(year);
}

/**
 * Get the date of Easter Sunday using the Julian Calendar for a given calendar year
 * @param year YYYY
 * @returns the date of Easter Sunday in the Julian calendar
 */
export function getJulianEaster(year: number): Temporal.PlainDate {
  validateYear(year);
  return getEasterSunday(
    year,
    {
      gregorian: false,
      julian: true,
    },
  );
}

/**
 * Get the Orthodox date of Easter Sunday for a given calendar year
 * @param year YYYY
 * @returns the date of Easter Sunday
 */
export function getOrthodoxEaster(year: number): Temporal.PlainDate {
  validateYear(year);
  return getEasterSunday(
    year,
    {
      gregorian: true,
      julian: true,
    },
  );
}

/**
 * Calculate the date of the feast of the Ascension for a given year. Defaults to Western Easter.
 * @note Ascension is 40 days after Easter Sunday
 * @param year YYYY
 * @param [easterOptions]
 * @returns the western date of the Ascension
 */
export function getAscensionDay(year: number, easterOptions: EasterOptions = {}): Temporal.PlainDate {
  return getEasterSunday(year, easterOptions).add({ days: 40 });
}

/**
 * Calculate the date of the Day of Pentecost (Whit Sunday) for a given church year. Defaults to Western Easter.
 * @note Pentecost is the 50th day after Easter Sunday
 * @param year YYYY
 * @param [easterOptions]
 * @returns the date of Pentecost
 */
export function getDayOfPentecost(year: number, easterOptions: EasterOptions = {}): Temporal.PlainDate {
  return getEasterSunday(year, easterOptions).add({ days: 49 });
}

/**
 * Calculate the date of Trinity Sunday for a given church year
 * @note Trinity Sunday is the Sunday after Pentecost
 * @param year YYYY
 * @param [easterOptions]
 * @returns the date of Trinity Sunday
 */
export function getTrinitySunday(year: number, easterOptions: EasterOptions = {}): Temporal.PlainDate {
  return getDayOfPentecost(year, easterOptions).add({ days: 7 });
}

/**
 * Calculate the date of All Saints' Day for a given church year
 * @note All Saints’ Day is celebrated on either 1 November or the Sunday falling between
 *       30 October and 5 November; if the latter there may be a secondary celebration
 *       on 1 November
 * @param year YYYY
 * @param [easterOptions]
 * @returns the date of All Saints' Day
 */
export function getAllSaintsDay(year: number, transferToSunday = false): Temporal.PlainDate {
  const allSaints = Temporal.PlainDate.from({ year, month: 11, day: 1 });
  if (transferToSunday && allSaints.dayOfWeek !== 7) {
    return allSaints.add({ days: 7 - allSaints.dayOfWeek });
  }
  return allSaints;
}

/**
 * Get the principal feasts for a given date
 * @param year YYYY
 * @param [easterOptions]
 * @returns {PrincipalFeasts} An object containing the principal feasts
 */
/* export function getPrincipalFeasts(year: number, easterOptions: EasterOptions = {}): PrincipalFeasts {
  return {
    "christmas": getChristmasDay(year),
    "epiphany": getEpiphany(year),
    "presentation": getPresentationOfChristInTheTemple(year),
    "annunciation": getAnnunciation(year, easterOptions),
    "easter": getEasterSunday(year, easterOptions),
    "ascension": getAscensionDay(year, easterOptions),
    "pentecost": getDayOfPentecost(year, easterOptions),
    "trinitySunday": getTrinitySunday(year, easterOptions),
    "allSaintsDay": getAllSaintsDay(year, easterOptions),
  };
} */

//#endregion Principal Feasts

//#region Principal Holy Days

/**
 * Calculate the date of Ash Wednesday for a given church year. Defaults to Western Easter.
 * @note Ash Wednesday is 46 days before Easter Sunday
 * @param year YYYY
 * @param [easterOptions]
 * @returns the western date of Ash Wednesday
 */
export function getAshWednesday(year: number, easterOptions: EasterOptions = {}): Temporal.PlainDate {
  return getEasterSunday(year, easterOptions).subtract({ days: 46 });
}

/**
 * Calculate the date of Maundy Thursday for a given church year. Defaults to Western Easter.
 * @note Maundy Thursday is the Thursday before Easter Sunday
 * @param year YYYY
 * @param [easterOptions]
 * @returns the western date of Maundy Thursday
 */
export function getMaundyThursday(year: number, easterOptions: EasterOptions = {}): Temporal.PlainDate {
  return getEasterSunday(year, easterOptions).subtract({ days: 3 });
}

/**
 * Calculate the date of Good Friday for a given church year. Defaults to Western Easter.
 * @note Good Friday is the Friday before Easter Sunday
 * @param year YYYY
 * @param [easterOptions]
 * @returns the western date of Good Friday
 */
export function getGoodFriday(year: number, easterOptions: EasterOptions = {}): Temporal.PlainDate {
  return getEasterSunday(year, easterOptions).subtract({ days: 2 });
}

/**
 * Get the principal holy days for a given date
 * @param year YYYY
 * @param [easterOptions]
 * @returns {PrincipalHolyDays} An object containing the principal holy days
 */
export function getPrincipalHolyDays(year: number, easterOptions: EasterOptions = {}): PrincipalHolyDays {
  return {
    "ashWednesday": getAshWednesday(year, easterOptions),
    "maundyThursday": getMaundyThursday(year, easterOptions),
    "goodFriday": getGoodFriday(year, easterOptions),
  };
}

//#endregion Principal Holy Days

//#region Eastertide Additional Days

/**
 * Calculate Palm Sunday (the Sunday before Easter)
 * @param year YYYY
 * @param [easterOptions]
 * @returns the date of Palm Sunday
 */
export function getPalmSunday(year: number, easterOptions: EasterOptions = {}): Temporal.PlainDate {
  const easter = getEasterSunday(year, easterOptions);
  return easter.subtract({ weeks: 1 });
}

/**
 * Calculate the dates of Holy Week for a given church year
 * @param year YYYY
 * @param [easterOptions]
 * @returns An array of Temporal.PlainDate objects
 */
export function getHolyWeek(year: number, easterOptions: EasterOptions = {}): Temporal.PlainDate[] {
  const palmSunday = getPalmSunday(year, easterOptions);
  return Array.from({ length: 7 }, (_, i) => palmSunday.add({ days: i }));
}

/**
 * Calculate the Rogation Days for a given date
 * @note Rogation Days are the three days before Ascension Day, when prayer is offered for God's blessing on the fruits of the earth and on human labour.
 * @param year YYYY
 * @param [easterOptions]
 * @returns {Array} An array of Temporal.PlainDate objects
 */
export function getRogationDays(year: number, easterOptions: EasterOptions = {}): Temporal.PlainDate[] {
  const ascension = getAscensionDay(year, easterOptions);
  return [3, 2, 1].map((days) => ascension.subtract({ days }));
}

/**
 * Calculate the date of the Novena to the Holy Spirit for a given church year
 * @note The Novena to the Holy Spirit is nine days beginning on the day after Ascension Day.
 * @param year YYYY
 * @param [easterOptions]
 * @returns the date of the Novena to the Holy Spirit
 */
export function getNovena(year: number, easterOptions: EasterOptions = {}): Temporal.PlainDate[] {
  const start = getAscensionDay(year, easterOptions).subtract({ days: 9 });
  return Array.from({ length: 9 }, (_, i) => start.add({ days: i }));
}

/**
 * Get the Eastertide additional days for a given date
 * @param year YYYY
 * @param [easterOptions]
 * @returns {EastertideAdditionalDays} An object containing the Eastertide additional days
 */
export function getEastertide(year: number, easterOptions: EasterOptions = {}): EastertideAdditionalDays {
  return {
    "holyWeek": getHolyWeek(year, easterOptions),
    "rogationDays": getRogationDays(year, easterOptions),
    "novena": getNovena(year, easterOptions),
  };
}

//#endregion Eastertide Additional Days

//#region Moveable Festivals

/**
 * Calculate the date of The Baptism of Christ for a given church year
 * @note Epiphany may be observed on January 6, or on the Sunday between January 2 and 8.
 *       If Epiphany is observed on a Sunday on January 6 or before, the Baptism of Christ is observed on the following Sunday.
 *       If the Epiphany is observed on January 7 or 8, the Baptism of Christ is observed on the following Monday, on January 8 or 9.
 * @param year YYYY
 * @returns the date of The Baptism of Christ
 */
export function getTheBaptismOfChrist(year: number): Temporal.PlainDate {
  const epiphany = getEpiphany(year);
  if (epiphany.dayOfWeek === 7) {
    return epiphany.add({ days: 7 });
  }
  const sundayAfterEpiphany = epiphany.add({ days: 7 - epiphany.dayOfWeek });
  return epiphany.day <= 6 ? sundayAfterEpiphany : sundayAfterEpiphany.add({ days: 1 });
}

/**
 * Calculate the date of Corpus Christi for a given church year
 * @note Corpus Christi is 4 days after Trinity Sunday
 * @param year YYYY
 * @param [easterOptions]
 * @returns the date of Corpus Christi
 */
export function getCorpusChristi(year: number, easterOptions: EasterOptions = {}): Temporal.PlainDate {
  return getTrinitySunday(year, easterOptions).add({ days: 4 });
}

/**
 * Calculate the date of Christ the King for a given church year
 * @note Christ the King is the last Sunday of Advent
 * @param year YYYY
 * @returns the date of Christ the King
 */
export function getChristTheKing(year: number): Temporal.PlainDate {
  return getFirstSundayOfAdvent(year).subtract({ weeks: 1 });
}

/**
 * Calculate the Ember Days for a given date
 * @param year YYYY
 * @param [easterOptions]
 * @returns {Array} An array of Temporal.PlainDate objects
 */
export function getEmberDays(year: number, easterOptions: EasterOptions = {}): Temporal.PlainDate[] {
  const lent = getAshWednesday(year, easterOptions);
  const pentecost = getDayOfPentecost(year, easterOptions);
  const holyCross = new Temporal.PlainDate(year, 9, 14);
  const stLucy = new Temporal.PlainDate(year, 12, 13);
  return [lent, pentecost, holyCross, stLucy].flatMap((date) => [0, 2, 3].map((offset) => date.add({ days: offset })));
}

/**
 * Returns the moveable dates for a given church year
 * @param year YYYY
 * @param [easterOptions]
 * @returns {MoveableDates} An object containing the moveable dates
 */
/* export function getMoveableDates(year: number, easterOptions: EasterOptions = {}): MoveableDates {
  const dates = {
    easter: getEasterSunday(year, easterOptions),
    ashWednesday: getAshWednesday(year, easterOptions),
    epiphany: getEpiphany(year),
    baptismOfChrist: getTheBaptismOfChrist(year),
    maundyThursday: getMaundyThursday(year, easterOptions),
    goodFriday: getGoodFriday(year, easterOptions),
    ascensionDay: getAscensionDay(year, easterOptions),
    pentecost: getDayOfPentecost(year, easterOptions),
    trinity: getTrinitySunday(year, easterOptions),
    corpusChristi: getCorpusChristi(year, easterOptions),
    christTheKing: getChristTheKing(year),
    advent1: getFirstSundayOfAdvent(year),
    annunciation: getAnnunciation(year, easterOptions),
    palmSunday: getPalmSunday(year, easterOptions),
  };

  // Calculate other dates
  dates.advent4 = Temporal.PlainDate.from({ year, month: 12, day: 25 }).subtract({ days: 1 });
  dates.christmas = Temporal.PlainDate.from({ year, month: 12, day: 25 });
  dates.candlemas = Temporal.PlainDate.from({ year, month: 2, day: 2 });
  dates.easterEve = dates.easter.subtract({ days: 1 });
  dates.allSaints = Temporal.PlainDate.from({ year, month: 11, day: 1 });

  // Calculate seasons
  dates.lentStart = dates.ashWednesday;
  dates.easterSeason = { start: dates.easter, end: dates.pentecost.subtract({ days: 1 }) };
  dates.ascensionSeason = { start: dates.ascensionDay, end: dates.pentecost.subtract({ days: 1 }) };
  dates.ordinaryTimeBeforeLent = {
    start: dates.epiphany.add({ days: 1 }),
    end: dates.ashWednesday.subtract({ days: 1 }),
  };
  dates.ordinaryTimeAfterTrinity = { start: dates.trinity, end: dates.advent1.subtract({ days: 1 }) };

  // Calculate Ember Days and Rogation Days
  dates.emberDays = getEmberDays(year);
  dates.rogationDays = getRogationDays(year, easterOptions);

  return dates;
}
 */

/**
 * Get all the fixed calendar dates for a given date
 * @param year YYYY
 * @returns {Array} An array of CalendarEvent objects
 */
export function getFixedDates(year: number): CalendarEvent[] {
  return commonWorshipFixedCalendar.events.map((event) => {
    const { observed } = event;
    const date = Temporal.PlainDate.from({
      day: observed.isoDay,
      month: observed.isoMonth,
      year,
    });
    const alt = observed.alt
      ? Temporal.PlainDate.from({
        day: observed.alt.isoDay,
        month: observed.alt.isoMonth,
        year,
      })
      : null;
    return {
      ...event,
      observed: [date, alt].filter(Boolean),
    };
  });
}

/**
 * Get the liturgical season for a given date
 * @param {string | Temporal.PlainDate | Temporal.PlainDateLike} date YYYY-MM-DD
 * @param {object} [options]
 * @param [options.easterOptions] Easter options
 * @param {object} [options.customSeasons] Custom seasons to include
 * @param [options.customSeasons.start] The start of the church year
 * @param [options.customSeasons.end] The end of the church year
 * @returns {ChurchSeason} The liturgical season
 */
/* export function getLiturgicalSeason(date: string | Temporal.PlainDate | Temporal.PlainDateLike, options = {}) {
  const plainDate = Temporal.PlainDate.from(validateDate(date));
  const seasons = getSeasonsOfYear(plainDate, options);
  for (const season of seasons) {
    if (plainDate >= season.start && plainDate <= season.end) {
      return { season: season.name, start: season.start, end: season.end };
    }
  }
  return { season: "Unknown", start: null, end: null };
} */

/**
 * Calculate the seasons of the church year
 * @param year YYYY
 * @param {object} [options]
 * @param [options.easterOptions] Easter options
 * @param {object} [options.customSeasons] Custom seasons to include
 * @param [options.customSeasons.start] The start of the church year
 * @param [options.customSeasons.end] The end of the church year
 * @returns {ChurchSeasons} An object containing the seasons and their date ranges
 */
/* export function getSeasonsOfYear(date: string | Temporal.PlainDate | Temporal.PlainDateLike, options = {}) {
  const {
    easterOptions = {},
    customSeasons = [],
  } = options;

  const plainDate = Temporal.PlainDate.from(validateDate(date));
  const year = plainDate.year;

  const moveableDates = getMoveableDates(year, easterOptions);

  const seasons = [
    { name: "Advent", start: moveableDates.advent1, end: moveableDates.christmas.subtract({ days: 1 }) },
    { name: "Christmas", start: moveableDates.christmas, end: moveableDates.epiphany.subtract({ days: 1 }) },
    { name: "Epiphany", start: moveableDates.epiphany, end: moveableDates.candlemas.subtract({ days: 1 }) },
    {
      name: "Ordinary Time (before Lent)",
      start: moveableDates.candlemas,
      end: moveableDates.ashWednesday.subtract({ days: 1 }),
    },
    { name: "Lent", start: moveableDates.ashWednesday, end: moveableDates.palmSunday.subtract({ days: 1 }) },
    { name: "Holy Week", start: moveableDates.palmSunday, end: moveableDates.easterEve },
    { name: "Eastertide", start: moveableDates.easter, end: moveableDates.pentecost.subtract({ days: 1 }) },
    { name: "Pentecost", start: moveableDates.pentecost, end: moveableDates.trinity.subtract({ days: 1 }) },
    {
      name: "Ordinary Time (after Trinity)",
      start: moveableDates.trinity,
      end: moveableDates.allSaints.subtract({ days: 1 }),
    },
    { name: "Kingdomtide", start: moveableDates.allSaints, end: moveableDates.advent1.subtract({ days: 1 }) },
    { name: "Epiphanytide", start: moveableDates.epiphany, end: moveableDates.candlemas.subtract({ days: 1 }) },
    { name: "Passiontide", start: moveableDates.passion, end: moveableDates.easterEve },
    { name: "Ascensiontide", start: moveableDates.ascensionDay, end: moveableDates.pentecost.subtract({ days: 1 }) },
    ...customSeasons,
  ];

  return [...seasons, ...subSeasons].sort((a, b) => Temporal.PlainDate.compare(a.start, b.start));
}
 */
