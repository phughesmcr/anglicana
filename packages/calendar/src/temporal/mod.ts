/**
 * @description Various functions to get Church of England calendar dates and times using the Temporal API.
 * @author P. Hughes <github@phugh.es> (www.phugh.es)
 * @license MIT
 * @see {@link https://www.churchofengland.org/prayer-and-worship/worship-texts-and-resources/common-worship/churchs-year/rules}
 * @requires Temporal @see {@link https://github.com/tc39/proposal-temporal/blob/main/README.md#polyfills}
 * @module
 */

export { getChurchYear, getFirstSundayOfAdvent, getLiturgicalYear, getLiturgicalYearRange } from "./advent.ts";
export { findFirstSundayInRange, isPlainDateInInclusiveRange } from "./date_utils.ts";
export {
  getAllDatesFromCalendar,
  getCommonWorshipCalendar,
  getMoveableDates,
  getPrincipalFeasts,
} from "./calendar_aggregate.ts";
export type {
  CalendarDateEntry,
  CommonWorshipCalendar,
  EastertideObservances,
  MoveableDates,
  MoveableFestivals,
  PrincipalFeasts,
  PrincipalHolyDays,
} from "./calendar_aggregate.ts";
export { getEasterSunday, getJulianEaster, getOrthodoxEaster, getPalmSunday, getWesternEaster } from "./easter.ts";
export { getHolyWeek, getNovena, getRogationDays } from "./eastertide.ts";
export { getSundayLectionaryLetter, getWeekdayLectionaryNumber } from "./lectionary.ts";
export { getChristTheKing, getCorpusChristi, getTheBaptismOfChrist } from "./moveable_festivals.ts";
export {
  getAllSaintsDay,
  getAnnunciation,
  getAscensionDay,
  getChristmasDay,
  getDayOfPentecost,
  getEpiphany,
  getPresentationOfChristInTheTemple,
  getTrinitySunday,
} from "./principal_feasts.ts";
export { getAshWednesday, getGoodFriday, getMaundyThursday } from "./principal_holy_days.ts";
export {
  getSaturdayEveningPrayerCollectContext,
  type SaturdayEveningPrayerCollectContext,
} from "./saturday_evening_collect.ts";
export { getClosestSunday, getNextSunday, getPreviousSunday, getSundaysOfChurchYear, isSunday } from "./sundays.ts";
export { validateDate, validateYear } from "./validation.ts";
