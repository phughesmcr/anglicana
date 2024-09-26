/**
 * @module
 * @description Various functions to get Church of England calendar dates and times using the Temporal API.
 * @author P. Hughes <github@phugh.es> (www.phugh.es)
 * @version "2024-02-07"
 * @license MIT
 * @see {@link https://www.churchofengland.org/prayer-and-worship/worship-texts-and-resources/common-worship/churchs-year/rules}
 *
 * @requires Temporal @see {@link https://tc39.es/proposal-temporal/}
 * For Temporal polyfill @see {@link https://github.com/tc39/proposal-temporal/blob/main/README.md#polyfills}
 */

import { events } from "./common_worship_fixed_calendar.json" with { type: "json" };

//#region Types

/**
 * @typedef {"F" | "C" | "L" | "P"} EventType
 * "F" = Festival
 * "C" = Commemoration
 * "L" = Lesser Festival
 * "P" = Principle Feast or Holy Day
 */

/**
 * @typedef {"A" | "C" | "I" | "O" | "L" | "E" | "H" | "T" | "P" | "G"} EventSeason
 * "A" = Advent
 * "C" = Christmas
 * "I" = Epiphany
 * "O" = Ordinary Time
 * "L" = Lent
 * "E" = Eastertide
 * "H" = Holy Week
 * "T" = Triduum
 * "P" = Pentecost
 * "G" = Creationtide
 */

/**
 * @typedef {Object} EventGroup
 * @prop {number} id
 * @prop {string} title
 * @prop {number[]} events
 */

/**
 * @typedef {Object} ObservedDate
 * @prop {number} isoDay
 * @prop {number} isoYear
 * @prop {object} [alt]
 * @prop {number} alt.isoDay
 * @prop {number} alt.isoMonth
 */

/**
 * @typedef {Object} Event
 * @prop {number | null} group (group id)
 * @prop {number} id
 * @prop {ObservedDate} observed
 * @prop {string} title
 * @prop {EventType} type
 */

/**
 * @typedef {Object} MoveableDates
 * @prop {Temporal.PlainDate} epiphany
 * @prop {Temporal.PlainDate} theBaptismOfChrist
 * @prop {Temporal.PlainDate} ashWednesday
 * @prop {Temporal.PlainDate} maundyThursday
 * @prop {Temporal.PlainDate} goodFriday
 * @prop {Temporal.PlainDate} easter
 * @prop {Temporal.PlainDate} ascensionDay
 * @prop {Temporal.PlainDate} dayOfPentecost
 * @prop {Temporal.PlainDate} trinitySunday
 */

/**
 * @typedef {Object} EasterOptions
 * @prop {boolean} [gregorian=false] whether to use the Gregorian calendar
 * @prop {boolean} [julian=false] whether to use the Julian calendar
 */

/**
 * @typedef {"advent" | "christmas" | "epiphany" | "ordinaryTime" | "lent" | "eastertide" | "holyWeek" | "triduum" | "pentecost" | "creationtide"} ChurchSeason
 * @typedef {{ season: ChurchSeason, start: Temporal.PlainDate, end: Temporal.PlainDate }[]} ChurchSeasons
 */

/**
 * @typedef {Object} PrincipalFeasts
 * @prop {Temporal.PlainDate} christmas
 * @prop {Temporal.PlainDate} epiphany
 * @prop {Temporal.PlainDate} presentation
 * @prop {Temporal.PlainDate} annunciation
 * @prop {Temporal.PlainDate} ascension
 * @prop {Temporal.PlainDate} pentecost
 * @prop {Temporal.PlainDate} trinitySunday
 * @prop {Temporal.PlainDate} allSaintsDay
 */

/**
 * @typedef {Object} PrincipalHolyDays
 * @prop {Temporal.PlainDate} ashWednesday
 * @prop {Temporal.PlainDate} maundyThursday
 * @prop {Temporal.PlainDate} goodFriday
 */

/**
 * @typedef {Object} EastertideAdditionalDays
 * @prop {Temporal.PlainDate[]} holyWeek
 * @prop {Temporal.PlainDate[]} rogationDays
 * @prop {Temporal.PlainDate[]} novena
 */

//#endregion Types

//#region Advent

/**
 * Get Christmas Day for a given calendar year
 * @param {number} calendarYear the calendar year as a number in the format YYYY (e.g., 2024)
 * @returns {Temporal.PlainDate} the date of Christmas Day
 */
export const getChristmasDay = (calendarYear) => new Temporal.PlainDate(calendarYear, 12, 25);

/**
 * Calculate the date of Advent Sunday for a given calendar year
 * @note The First Sunday of Advent is 4 Sundays before Christmas Day
 * @param {number} calendarYear the calendar year as a number in the format YYYY (e.g., 2024)
 * @returns {Temporal.PlainDate} the date of the First Sunday of Advent
 */
export const getFirstSundayOfAdvent = (calendarYear) => {
  const christmas = getChristmasDay(calendarYear);
  const sundaysBeforeChristmas = christmas.dayOfWeek === 7 ? 4 : 3;
  return christmas.subtract({
    days: (christmas.dayOfWeek + 7) % 7, // days until the previous Sunday
    weeks: sundaysBeforeChristmas,
  });
};

/**
 * Calculate which church year a given date is in
 * @note The church year begins on the First Sunday of Advent, not New Year's Day.
 * @param {string | Temporal.PlainDate | Temporal.PlainDateLike} date YYYY-MM-DD
 * @returns {number} the church year as a number in the format YYYY
 */
export const getChurchYear = (date) => {
  const today = Temporal.PlainDate.from(date);
  const thisAdvent = getFirstSundayOfAdvent(today.year);
  return Temporal.PlainDate.compare(today, thisAdvent) >= 0 ? today.year + 1 : today.year;
};

//#endregion Advent

//#region Sundays

/**
 * Check if a date is a Sunday
 * @param {string | Temporal.PlainDate | Temporal.PlainDateLike} date YYYY-MM-DD
 * @returns {boolean} `true` if the date is a Sunday, `false` otherwise
 */
export const isSunday = (date) => Temporal.PlainDate.from(date).dayOfWeek === 7;

/**
 * Get the date of the next Sunday after a given date
 * @param {string | Temporal.PlainDate | Temporal.PlainDateLike} date YYYY-MM-DD
 * @returns {Temporal.PlainDate} the date of the next Sunday
 */
export const getNextSunday = (date) => {
  const today = Temporal.PlainDate.from(date);
  if (today.dayOfWeek === 7) return today.add({ weeks: 1 });
  return today.add({ days: 7 - today.dayOfWeek });
};

/**
 * Get the date of the previous Sunday before a given date
 * @param {string | Temporal.PlainDate | Temporal.PlainDateLike} date YYYY-MM-DD
 * @returns {Temporal.PlainDate} the date of the previous Sunday
 */
export const getPreviousSunday = (date) => {
  const today = Temporal.PlainDate.from(date);
  if (today.dayOfWeek === 7) return today.subtract({ weeks: 1 });
  return today.subtract({ days: today.dayOfWeek });
};

/**
 * Get the date of the closest Sunday to the date provided
 * @note Will return the date provided if it is a Sunday.
 * @note A Wednesday will return the previous Sunday, as it is 4 days before the next Sunday.
 * @param {string | Temporal.PlainDate | Temporal.PlainDateLike} date YYYY-MM-DD
 * @returns {Temporal.PlainDate} the date of the closest Sunday
 *
 * @TODO Are "days" the correct unit for this?
 */
export const getClosestSunday = (date) => {
  const today = Temporal.PlainDate.from(date);
  if (today.dayOfWeek === 7) return today;
  const nextSunday = getNextSunday(today);
  const previousSunday = getPreviousSunday(today);
  const nextDiff = today.until(nextSunday, { largestUnit: "days" });
  const prevDiff = today.until(previousSunday, { largestUnit: "days" });
  return Math.abs(nextDiff.days) < Math.abs(prevDiff.days) ? nextSunday : previousSunday;
};

/**
 * Get all the Sundays in a given church year
 * @param {string | number | Temporal.PlainDate | Temporal.PlainDateLike} date YYYY-MM-DD or YYYY
 * @returns {Array} An array of Temporal.PlainDate objects
 */
export const getSundaysOfYear = (date) => {
  const churchYear = getChurchYear(date);
  const firstSunday = getFirstSundayOfAdvent(churchYear - 1);
  const lastSunday = getFirstSundayOfAdvent(churchYear).subtract({ days: 7 });
  const sundays = [];
  let currentSunday = firstSunday;
  while (Temporal.PlainDate.compare(currentSunday, lastSunday) <= 0) {
    sundays.push(currentSunday);
    currentSunday = currentSunday.add({ weeks: 1 });
  }
  return sundays;
};

//#endregion Sundays

//#region Lectionary

/**
 * Calculates the Common Worship weekday lectionary number for a given date
 * @param {string | Temporal.PlainDate | Temporal.PlainDateLike} date YYYY-MM-DD
 * @returns {1|2} 1 or 2 (The weekday lectionary runs on a 2 year cycle)
 * @see {@link https://www.churchofengland.org/prayer-and-worship/worship-texts-and-resources/common-worship/churchs-year/lectionary}
 */
export const getWeekdayLectionaryNumber = (date) => {
  const plainDate = Temporal.PlainDate.from(date);
  const calendarYear = plainDate.year;
  const firstAdvent = getFirstSundayOfAdvent(calendarYear);
  // If the date is on or after First Sunday of Advent, use the next year
  const yearToUse = Temporal.PlainDate.compare(plainDate, firstAdvent) >= 0 ? calendarYear + 1 : calendarYear;
  return (yearToUse % 2) + 1;
};

/**
 * Calculates the Common Worship Sunday lectionary letter for a given date
 * @param {string | Temporal.PlainDate | Temporal.PlainDateLike} date YYYY-MM-DD
 * @returns {"A"|"B"|"C"} the lectionary letter for the Sunday lectionary
 * @see {@link https://www.churchofengland.org/prayer-and-worship/worship-texts-and-resources/common-worship/churchs-year/lectionary}
 */
export const getSundayLectionaryLetter = (date) => ["C", "A", "B"][getChurchYear(date) % 3];

//#endregion Lectionary

//#region Principal Feasts

/**
 * Returns January 6th in a given church year.
 * @param {string | number | Temporal.PlainDate | Temporal.PlainDateLike} date YYYY-MM-DD or YYYY
 * @param {boolean} [transferToSunday=false] whether to transfer Epiphany to the following Sunday if it is not already a Sunday
 * @returns {Temporal.PlainDate} the date of Epiphany
 */
export const getEpiphany = (date, transferToSunday = false) => {
  const epiphany = Temporal.PlainDate.from({ year: getChurchYear(date), month: 1, day: 6 });
  if (transferToSunday && epiphany.dayOfWeek !== 7) {
    return epiphany.add({ days: 7 - epiphany.dayOfWeek });
  }
  return epiphany;
};

/**
 * Calculate the date of The Presentation of Christ in the Temple for a given church year
 * @param {string | number | Temporal.PlainDate | Temporal.PlainDateLike} date YYYY-MM-DD or YYYY
 * @returns {Temporal.PlainDate} the date of The Presentation of Christ in the Temple
 */
export const getPresentationOfChristInTheTemple = (date) => {
  const year = typeof date === 'number' ? date : Temporal.PlainDate.from(date).year;
  const epiphany = getEpiphany(year);
  return epiphany.subtract({ days: 40 });
};

/**
 * Calculate the date of the Annunciation for a given church year
 * @note The Annunciation is the day between Palm Sunday and Easter Sunday
 * @param {string | number | Temporal.PlainDate | Temporal.PlainDateLike} date YYYY-MM-DD or YYYY
 * @param {EasterOptions} [easterOptions]
 * @returns {Temporal.PlainDate} the date of the Annunciation
 */
export const getAnnunciation = (year, easterOptions = {}) => {
  const annunciation = Temporal.PlainDate.from({ year, month: 3, day: 25 });
  const easter = getEasterSunday(year, easterOptions);
  const palmSunday = getPalmSunday(year, easterOptions);
  if (Temporal.PlainDate.compare(annunciation, palmSunday) >= 0 &&
      Temporal.PlainDate.compare(annunciation, easter.add({ weeks: 1 })) <= 0) {
    return easter.add({ weeks: 1, days: 1 });
  }
  return annunciation;
};

/**
 * Heiner Lichtenberg's method of calculating Easter Day
 * @param {number} calendarYear the year as a number in the format YYYY (e.g., 2024)
 * @param {EasterOptions} [easterOptions]
 * @note For Western Easter, set `spec.gregorian` to `false` and `spec.julian` to `false`. [Default]
 * @note For Eastern Orthodox Easter, set `spec.gregorian` to `true` and `spec.julian` to `true`.
 * @see {@link https://github.com/commenthol/date-easter/blob/0aee77a999d19b40c711a1769b26d2a7bbe326ae/src/index.js#L33}
 * @see {@link https://de.wikipedia.org/wiki/Gau%C3%9Fche_Osterformel}
 * @see {@link getWesternEaster}
 * @see {@link getJulianEaster}
 * @see {@link getOrthodoxEaster}
 */
export const getEasterSunday = (calendarYear, easterOptions = {}) => {
  const { gregorian = false, julian = false } = easterOptions;
  const year = getChurchYear(
    Temporal.PlainDate.from({ year: calendarYear, month: 1, day: 1 }),
  );
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
};

/**
 * Get the date of Western Easter Sunday for a given calendar year
 * @param {number} calendarYear
 * @returns {Temporal.PlainDate}
 */
export const getWesternEaster = (calendarYear) => getEasterSunday(calendarYear);

/**
 * Get the date of Easter Sunday using the Julian Calendar for a given calendar year
 * @param {number} calendarYear
 * @returns {Temporal.PlainDate}
 */
export const getJulianEaster = (calendarYear) =>
  getEasterSunday(
    calendarYear,
    {
      gregorian: false,
      julian: true,
    },
  );

/**
 * Get the Orthodox date of Easter Sunday for a given calendar year
 * @param {number} calendarYear
 * @returns {Temporal.PlainDate} the date of Easter Sunday
 */
export const getOrthodoxEaster = (calendarYear) =>
  getEasterSunday(
    calendarYear,
    {
      gregorian: true,
      julian: true,
    },
  );

/**
 * Calculate the date of the feast of the Ascension for a given church year. Defaults to Western Easter.
 * @note Ascension is 40 days after Easter Sunday
 * @param {string | number | Temporal.PlainDate | Temporal.PlainDateLike} date YYYY-MM-DD or YYYY
 * @param {EasterOptions} [easterOptions]
 * @returns {Temporal.PlainDate} the western date of the Ascension
 */
export const getAscensionDay = (date, easterOptions = {}) =>
  getEasterSunday(getChurchYear(date), easterOptions).add({ days: 40 });

/**
 * Calculate the date of the Day of Pentecost (Whit Sunday) for a given church year. Defaults to Western Easter.
 * @note Pentecost is the 50th day after Easter Sunday
 * @param {string | number | Temporal.PlainDate | Temporal.PlainDateLike} date YYYY-MM-DD or YYYY
 * @param {EasterOptions} [easterOptions]
 * @returns {Temporal.PlainDate} the date of Pentecost
 */
export const getDayOfPentecost = (date, easterOptions = {}) => {
  return getEasterSunday(getChurchYear(date), easterOptions).add({ days: 49 });
};

/**
 * Calculate the date of Trinity Sunday for a given church year
 * @note Trinity Sunday is the Sunday after Pentecost
 * @param {string | number | Temporal.PlainDate | Temporal.PlainDateLike} date YYYY-MM-DD or YYYY
 * @param {EasterOptions} [easterOptions]
 * @returns {Temporal.PlainDate} the date of Trinity Sunday
 */
export const getTrinitySunday = (date, easterOptions = {}) => getDayOfPentecost(date, easterOptions).add({ days: 7 });

/**
 * Calculate the date of All Saints' Day for a given church year
 * @note All Saints' Day is the first Sunday after Pentecost
 * @param {string | number | Temporal.PlainDate | Temporal.PlainDateLike} date YYYY-MM-DD or YYYY
 * @param {EasterOptions} [easterOptions]
 * @returns {Temporal.PlainDate} the date of All Saints' Day
 */
export const getAllSaintsDay = (date, easterOptions = {}) => getDayOfPentecost(date, easterOptions).add({ days: 7 });

/**
 * Get the principal feasts for a given date
 * @param {string | number | Temporal.PlainDate | Temporal.PlainDateLike} date YYYY-MM-DD or YYYY
 * @param {EasterOptions} [easterOptions]
 * @returns {PrincipalFeasts} An object containing the principal feasts
 */
export const getPrincipalFeasts = (date, easterOptions = {}) => {
  return {
    "christmas": getChristmas(date),
    "epiphany": getEpiphany(date),
    "presentation": getPresentationOfChristInTheTemple(date),
    "annunciation": getAnnunciation(date, easterOptions),
    "easter": getEasterSunday(date, easterOptions),
    "ascension": getAscensionDay(date, easterOptions),
    "pentecost": getDayOfPentecost(date, easterOptions),
    "trinitySunday": getTrinitySunday(date, easterOptions),
    "allSaintsDay": getAllSaintsDay(date, easterOptions)
  }
};

//#endregion Principal Feasts

//#region Principal Holy Days

/**
 * Calculate the date of Ash Wednesday for a given church year. Defaults to Western Easter.
 * @note Ash Wednesday is 46 days before Easter Sunday
 * @param {string | number | Temporal.PlainDate | Temporal.PlainDateLike} date YYYY-MM-DD or YYYY
 * @param {EasterOptions} [easterOptions]
 * @returns {Temporal.PlainDate} the western date of Ash Wednesday
 */
export const getAshWednesday = (date, easterOptions = {}) =>
  getEasterSunday(getChurchYear(date), easterOptions).subtract({ days: 46 });

/**
 * Calculate the date of Maundy Thursday for a given church year. Defaults to Western Easter.
 * @note Maundy Thursday is the Thursday before Easter Sunday
 * @param {string | number | Temporal.PlainDate | Temporal.PlainDateLike} date YYYY-MM-DD or YYYY
 * @param {EasterOptions} [easterOptions]
 * @returns {Temporal.PlainDate} the western date of Maundy Thursday
 */
export const getMaundyThursday = (date, easterOptions = {}) =>
  getEasterSunday(getChurchYear(date), easterOptions).subtract({ days: 3 });

/**
 * Calculate the date of Good Friday for a given church year. Defaults to Western Easter.
 * @note Good Friday is the Friday before Easter Sunday
 * @param {string | number | Temporal.PlainDate | Temporal.PlainDateLike} date YYYY-MM-DD or YYYY
 * @param {EasterOptions} [easterOptions]
 * @returns {Temporal.PlainDate} the western date of Good Friday
 */
export const getGoodFriday = (date, easterOptions = {}) =>
  getEasterSunday(getChurchYear(date), easterOptions).subtract({ days: 2 });

/**
 * Get the principal holy days for a given date
 * @param {string | number | Temporal.PlainDate | Temporal.PlainDateLike} date YYYY-MM-DD or YYYY
 * @param {EasterOptions} [easterOptions]
 * @returns {PrincipalHolyDays} An object containing the principal holy days
 */
export const getPrincipalHolyDays = (date, easterOptions = {}) => {
  return {
    "ashWednesday": getAshWednesday(date, easterOptions),
    "maundyThursday": getMaundyThursday(date, easterOptions),
    "goodFriday": getGoodFriday(date, easterOptions)
  }
};

//#endregion Principal Holy Days

//#region Eastertide Additional Days

/**
 * Calculate the dates of Holy Week for a given church year
 * @param {string | number | Temporal.PlainDate | Temporal.PlainDateLike} date YYYY-MM-DD or YYYY
 * @param {EasterOptions} [easterOptions]
 * @returns {Array} An array of Temporal.PlainDate objects
 */
export const getHolyWeek = (year, easterOptions = {}) => {
  const palmSunday = getPalmSunday(year, easterOptions);
  return Array.from({ length: 7 }, (_, i) => palmSunday.add({ days: i }));
};

/**
 * Calculate the Rogation Days for a given date
 * @note Rogation Days are the three days before Ascension Day, when prayer is offered for God's blessing on the fruits of the earth and on human labour.
 * @param {string | number | Temporal.PlainDate | Temporal.PlainDateLike} date YYYY-MM-DD or YYYY
 * @param {EasterOptions} [easterOptions]
 * @returns {Array} An array of Temporal.PlainDate objects
 */
export const getRogationDays = (year, easterOptions = {}) => {
  const ascension = getAscensionDay(year, easterOptions);
  return [3, 2, 1].map(days => ascension.subtract({ days }));
};

/**
 * Calculate the date of the Novena to the Holy Spirit for a given church year
 * @note The Novena to the Holy Spirit is nine days beginning on the day after Ascension Day.
 * @param {string | number | Temporal.PlainDate | Temporal.PlainDateLike} date YYYY-MM-DD or YYYY
 * @param {EasterOptions} [easterOptions]
 * @returns {Temporal.PlainDate} the date of the Novena to the Holy Spirit
 */
export const getNovena = (date, easterOptions = {}) => {
  const ascension = getAscensionDay(date, easterOptions);
  return ascension.subtract({ days: 9 });
};

/**
 * Get the Eastertide additional days for a given date
 * @param {string | number | Temporal.PlainDate | Temporal.PlainDateLike} date YYYY-MM-DD or YYYY
 * @param {EasterOptions} [easterOptions]
 * @returns {EastertideAdditionalDays} An object containing the Eastertide additional days
 */
export const getEastertide = (date, easterOptions = {}) => {
  return {
    "holyWeek": getHolyWeek(date, easterOptions),
    "rogationDays": getRogationDays(date, easterOptions),
    "novena": getNovena(date, easterOptions)
  }
};

//#endregion Eastertide Additional Days

//#region Moveable Festivals

/**
 * Calculate the date of The Baptism of Christ for a given church year
 * @note Epiphany may be observed on January 6, or on the Sunday between January 2 and 8.
 *       If Epiphany is observed on a Sunday on January 6 or before, the Baptism of Christ is observed on the following Sunday.
 *       If the Epiphany is observed on January 7 or 8, the Baptism of Christ is observed on the following Monday, on January 8 or 9.
 * @param {string | number | Temporal.PlainDate | Temporal.PlainDateLike} date YYYY-MM-DD or YYYY
 * @returns {Temporal.PlainDate} the date of The Baptism of Christ
 */
export const getTheBaptismOfChrist = (date) => {
  const epiphany = getEpiphany(date);
  if (epiphany.dayOfWeek === 7) {
    return epiphany.add({ days: 7 });
  }
  const sundayAfterEpiphany = epiphany.add({ days: 7 - epiphany.dayOfWeek });
  return epiphany.day <= 6 ? sundayAfterEpiphany : sundayAfterEpiphany.add({ days: 1 });
};

/**
 * Calculate the date of Corpus Christi for a given church year
 * @note Corpus Christi is 4 days after Trinity Sunday
 * @param {string | number | Temporal.PlainDate | Temporal.PlainDateLike} date YYYY-MM-DD or YYYY
 * @param {EasterOptions} [easterOptions]
 * @returns {Temporal.PlainDate} the date of Corpus Christi
 */
export const getCorpusChristi = (date, easterOptions = {}) => getTrinitySunday(date, easterOptions).add({ days: 4 });

/**
 * Calculate the date of Christ the King for a given church year
 * @note Christ the King is the last Sunday of Advent
 * @param {string | number | Temporal.PlainDate | Temporal.PlainDateLike} date YYYY-MM-DD or YYYY
 * @param {EasterOptions} [easterOptions]
 * @returns {Temporal.PlainDate} the date of Christ the King
 */
export const getChristTheKing = (date, easterOptions = {}) =>
  getFirstSundayOfAdvent(getChurchYear(date), easterOptions).subtract({ weeks: 1 });

/**
 * Calculate the Ember Days for a given date
 * @param {string | number | Temporal.PlainDate | Temporal.PlainDateLike} date YYYY-MM-DD or YYYY
 * @param {EasterOptions} [easterOptions]
 * @returns {Array} An array of Temporal.PlainDate objects
 */
export const getEmberDays = (year, easterOptions = {}) => {
  const lent = getAshWednesday(year, easterOptions);
  const pentecost = getDayOfPentecost(year, easterOptions);
  const holyCross = new Temporal.PlainDate(year, 9, 14);
  const stLucy = new Temporal.PlainDate(year, 12, 13);
  return [lent, pentecost, holyCross, stLucy].flatMap(date =>
    [0, 2, 3].map(offset => date.add({ days: offset }))
  );
};

/**
 * Returns the moveable dates for a given church year
 * @param {string | number | Temporal.PlainDate | Temporal.PlainDateLike} date YYYY-MM-DD or YYYY
 * @param {EasterOptions} [easterOptions]
 * @returns {MoveableDates} An object containing the moveable dates
 */
export const getMoveableDates = (date, easterOptions = {}) => {
  const year = typeof date === 'number' ? date : Temporal.PlainDate.from(date).year;

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
  dates.ordinaryTimeBeforeLent = { start: dates.epiphany.add({ days: 1 }), end: dates.ashWednesday.subtract({ days: 1 }) };
  dates.ordinaryTimeAfterTrinity = { start: dates.trinity, end: dates.advent1.subtract({ days: 1 }) };

  // Calculate Ember Days and Rogation Days
  dates.emberDays = getEmberDays(year);
  dates.rogationDays = getRogationDays(year, easterOptions);

  return dates;
};

/**
 * Get all the fixed calendar dates for a given date
 * @param {string | number | Temporal.PlainDate | Temporal.PlainDateLike} date YYYY-MM-DD or YYYY
 * @returns {Array} An array of Temporal.PlainDate objects
 */
export const getFixedDates = (date) => {
  const year = typeof date === "number" ? date : Temporal.PlainDate.from(date).year;
  return events.map((event) => {
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
};

/**
 * Get the liturgical season for a given date
 * @param {string | Temporal.PlainDate | Temporal.PlainDateLike} date YYYY-MM-DD
 * @param {object} [options]
 * @param {EasterOptions} [options.easterOptions] Easter options
 * @param {object} [options.customSeasons] Custom seasons to include
 * @param {Temporal.PlainDate} [options.customSeasons.start] The start of the church year
 * @param {Temporal.PlainDate} [options.customSeasons.end] The end of the church year
 * @returns {ChurchSeason} The liturgical season
 */
export const getLiturgicalSeason = (date, options = {}) => {
  const plainDate = Temporal.PlainDate.from(date);
  const seasons = getSeasonsOfYear(plainDate, options);
  for (const season of seasons) {
    if (plainDate >= season.start && plainDate <= season.end) {
      return season.name;
    }
  }
  return 'Unknown';
};

/**
 * Calculate the seasons of the church year
 * @param {string | number | Temporal.PlainDate | Temporal.PlainDateLike} date YYYY-MM-DD or YYYY
 * @param {object} [options]
 * @param {EasterOptions} [options.easterOptions] Easter options
 * @param {object} [options.customSeasons] Custom seasons to include
 * @param {Temporal.PlainDate} [options.customSeasons.start] The start of the church year
 * @param {Temporal.PlainDate} [options.customSeasons.end] The end of the church year
 * @returns {ChurchSeasons} An object containing the seasons and their date ranges
 */
export const getSeasonsOfYear = (date, options = {}) => {
  const {
    easterOptions = {},
    customSeasons = []
  } = options;

  const plainDate = Temporal.PlainDate.from(date);
  const year = plainDate.year;

  const moveableDates = getMoveableDates(year, easterOptions);

  const seasons = [
    { name: 'Advent', start: moveableDates.advent1, end: moveableDates.christmas.subtract({ days: 1 }) },
    { name: 'Christmas', start: moveableDates.christmas, end: moveableDates.epiphany.subtract({ days: 1 }) },
    { name: 'Epiphany', start: moveableDates.epiphany, end: moveableDates.candlemas.subtract({ days: 1 }) },
    { name: 'Ordinary Time (before Lent)', start: moveableDates.candlemas, end: moveableDates.ashWednesday.subtract({ days: 1 }) },
    { name: 'Lent', start: moveableDates.ashWednesday, end: moveableDates.palmSunday.subtract({ days: 1 }) },
    { name: 'Holy Week', start: moveableDates.palmSunday, end: moveableDates.easterEve },
    { name: 'Eastertide', start: moveableDates.easter, end: moveableDates.pentecost.subtract({ days: 1 }) },
    { name: 'Pentecost', start: moveableDates.pentecost, end: moveableDates.trinity.subtract({ days: 1 }) },
    { name: 'Ordinary Time (after Trinity)', start: moveableDates.trinity, end: moveableDates.allSaints.subtract({ days: 1 }) },
    { name: 'Kingdomtide', start: moveableDates.allSaints, end: moveableDates.advent1.subtract({ days: 1 }) },
    { name: 'Epiphanytide', start: moveableDates.epiphany, end: moveableDates.candlemas.subtract({ days: 1 }) },
    { name: 'Passiontide', start: moveableDates.passion, end: moveableDates.easterEve },
    { name: 'Ascensiontide', start: moveableDates.ascensionDay, end: moveableDates.pentecost.subtract({ days: 1 }) },
    ...customSeasons
  ];

  return [...seasons, ...subSeasons].sort((a, b) =>
    Temporal.PlainDate.compare(a.start, b.start)
  );
};
