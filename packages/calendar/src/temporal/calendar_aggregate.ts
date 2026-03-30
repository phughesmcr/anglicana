/**
 * @description Aggregated Common Worship calendar types and builders.
 * @module
 */

import type { FixedEventResult } from "../data/mod.ts";
import { getFixedEvents } from "../data/mod.ts";
import type { DateRange, EasterOptions } from "../types.ts";
import { getFirstSundayOfAdvent } from "./advent.ts";
import { getEasterSunday, getPalmSunday } from "./easter.ts";
import { getHolyWeek, getNovena, getRogationDays } from "./eastertide.ts";
import { getChristTheKing, getTheBaptismOfChrist } from "./moveable_festivals.ts";
import {
  getAllSaintsDay,
  getAnnunciation,
  getAscensionDay,
  getChristmasDay,
  getDayOfPentecost,
  getEpiphany,
  getPresentationOfChristInTheTemple,
  getTrinitySunday,
} from "./principal_feasts.ts";
import { getAshWednesday, getGoodFriday, getMaundyThursday } from "./principal_holy_days.ts";
import { getClosestSunday } from "./sundays.ts";
import { validateYear } from "./validation.ts";

/** Principal feasts for a given calendar year. */
export type PrincipalFeasts = {
  christmas: Temporal.PlainDate;
  epiphany: Temporal.PlainDate;
  presentation: Temporal.PlainDate;
  annunciation: Temporal.PlainDate;
  ascension: Temporal.PlainDate;
  pentecost: Temporal.PlainDate;
  trinitySunday: Temporal.PlainDate;
  allSaintsDay: Temporal.PlainDate;
};

/** Principal holy days for a given calendar year. */
export type PrincipalHolyDays = {
  ashWednesday: Temporal.PlainDate;
  maundyThursday: Temporal.PlainDate;
  goodFriday: Temporal.PlainDate;
};

/** Key moveable dates for a given calendar year. */
export type MoveableDates = {
  epiphany: Temporal.PlainDate;
  theBaptismOfChrist: Temporal.PlainDate;
  ashWednesday: Temporal.PlainDate;
  maundyThursday: Temporal.PlainDate;
  goodFriday: Temporal.PlainDate;
  easter: Temporal.PlainDate;
  ascensionDay: Temporal.PlainDate;
  dayOfPentecost: Temporal.PlainDate;
  trinitySunday: Temporal.PlainDate;
};

/** Moveable festivals for a given calendar year. */
export type MoveableFestivals = {
  palmSunday: Temporal.PlainDate;
  christTheKing: Temporal.PlainDate;
};

/** Observances within Eastertide. */
export type EastertideObservances = {
  holyWeek: Temporal.PlainDate[];
  rogationDays: Temporal.PlainDate[];
  novena: Temporal.PlainDate[];
};

/** Aggregated Common Worship calendar data for a church year. */
export type CommonWorshipCalendar = {
  churchYear: number;
  dateRange: DateRange;
  principalFeasts: PrincipalFeasts;
  principalHolyDays: PrincipalHolyDays;
  moveableDates: MoveableDates;
  fixedDates: FixedEventResult[];
  eastertide: EastertideObservances;
  sundays: Temporal.PlainDate[];
  moveableFestivals: MoveableFestivals;
  emberDays: Temporal.PlainDate[];
};

/** Date entry used when flattening calendar collections. */
export type CalendarDateEntry = {
  date: Temporal.PlainDate;
  name?: string;
};

/**
 * Get key moveable dates for a given calendar year.
 */
export function getMoveableDates(
  year: number,
  options: EasterOptions & { transferEpiphanyToSunday?: boolean } = {},
): MoveableDates {
  const validatedYear = validateYear(year);
  const transferEpiphanyToSunday = options.transferEpiphanyToSunday ?? false;
  const easter = getEasterSunday(validatedYear, options);
  return {
    epiphany: getEpiphany(validatedYear, transferEpiphanyToSunday),
    theBaptismOfChrist: getTheBaptismOfChrist(validatedYear, transferEpiphanyToSunday),
    ashWednesday: getAshWednesday(validatedYear, options),
    maundyThursday: getMaundyThursday(validatedYear, options),
    goodFriday: getGoodFriday(validatedYear, options),
    easter,
    ascensionDay: getAscensionDay(validatedYear, options),
    dayOfPentecost: getDayOfPentecost(validatedYear, options),
    trinitySunday: getTrinitySunday(validatedYear, options),
  };
}

/**
 * Get principal feasts for a given calendar year.
 */
export function getPrincipalFeasts(year: number, options: EasterOptions = {}): PrincipalFeasts {
  const validatedYear = validateYear(year);
  return {
    christmas: getChristmasDay(validatedYear),
    epiphany: getEpiphany(validatedYear, false),
    presentation: getPresentationOfChristInTheTemple(validatedYear, false),
    annunciation: getAnnunciation(validatedYear, options),
    ascension: getAscensionDay(validatedYear, options),
    pentecost: getDayOfPentecost(validatedYear, options),
    trinitySunday: getTrinitySunday(validatedYear, options),
    allSaintsDay: getAllSaintsDay(validatedYear, false),
  };
}

/**
 * Generate the Common Worship calendar summary for a church year.
 */
export function getCommonWorshipCalendar(year: number, options: EasterOptions = {}): CommonWorshipCalendar {
  const churchYear = validateYear(year);
  const start = getFirstSundayOfAdvent(churchYear - 1);
  const end = getFirstSundayOfAdvent(churchYear).subtract({ days: 1 });

  const principalFeasts = getPrincipalFeasts(churchYear, options);
  const principalHolyDays: PrincipalHolyDays = {
    ashWednesday: getAshWednesday(churchYear, options),
    maundyThursday: getMaundyThursday(churchYear, options),
    goodFriday: getGoodFriday(churchYear, options),
  };
  const moveableDates = getMoveableDates(churchYear, options);
  const eastertide: EastertideObservances = {
    holyWeek: getHolyWeek(churchYear, options),
    rogationDays: getRogationDays(churchYear, options),
    novena: getNovena(churchYear, options),
  };
  const moveableFestivals: MoveableFestivals = {
    palmSunday: getPalmSunday(churchYear, options),
    christTheKing: getChristTheKing(churchYear - 1),
  };

  const fixedDates = [...getFixedEvents(churchYear - 1), ...getFixedEvents(churchYear)].filter((event) =>
    Temporal.PlainDate.compare(event.date, start) >= 0 && Temporal.PlainDate.compare(event.date, end) <= 0
  );

  const sundays: Temporal.PlainDate[] = [];
  let current = start;
  while (Temporal.PlainDate.compare(current, end) <= 0) {
    sundays.push(current);
    current = current.add({ weeks: 1 });
  }

  const emberDays = (() => {
    const emberDates: Temporal.PlainDate[] = [];
    const addEmberDays = (referenceDate: Temporal.PlainDate) => {
      emberDates.push(
        referenceDate.subtract({ days: 4 }),
        referenceDate.subtract({ days: 2 }),
        referenceDate.subtract({ days: 1 }),
      );
    };
    const advent3 = start.add({ weeks: 2 });
    const lent2 = getEasterSunday(churchYear, options).subtract({ weeks: 5 });
    const june29Sunday = getClosestSunday(new Temporal.PlainDate(churchYear, 6, 29));
    const sept29Sunday = getClosestSunday(new Temporal.PlainDate(churchYear, 9, 29));
    addEmberDays(advent3);
    addEmberDays(lent2);
    addEmberDays(june29Sunday);
    addEmberDays(sept29Sunday);
    return emberDates.filter((date) =>
      Temporal.PlainDate.compare(date, start) >= 0 && Temporal.PlainDate.compare(date, end) <= 0
    );
  })();

  return {
    churchYear,
    dateRange: { start, end },
    principalFeasts,
    principalHolyDays,
    moveableDates,
    fixedDates,
    eastertide,
    sundays,
    moveableFestivals,
    emberDays,
  };
}

/**
 * Return all unique dates in the calendar sorted chronologically.
 */
export function getAllDatesFromCalendar(calendar: CommonWorshipCalendar): CalendarDateEntry[] {
  const entries: CalendarDateEntry[] = [];
  const addDate = (date: Temporal.PlainDate, name?: string) => entries.push({ date, name });

  Object.entries(calendar.principalFeasts).forEach(([name, date]) => addDate(date, name));
  Object.entries(calendar.principalHolyDays).forEach(([name, date]) => addDate(date, name));
  Object.entries(calendar.moveableDates).forEach(([name, date]) => addDate(date, name));
  Object.entries(calendar.moveableFestivals).forEach(([name, date]) => addDate(date, name));
  calendar.fixedDates.forEach((event) => addDate(event.date, event.name));
  calendar.sundays.forEach((date) => addDate(date, "Sunday"));
  calendar.emberDays.forEach((date) => addDate(date, "Ember Day"));
  calendar.eastertide.holyWeek.forEach((date) => addDate(date, "Holy Week"));
  calendar.eastertide.rogationDays.forEach((date) => addDate(date, "Rogation Day"));
  calendar.eastertide.novena.forEach((date) => addDate(date, "Novena"));

  const deduped = new Map<string, CalendarDateEntry>();
  for (const entry of entries) {
    const key = entry.date.toString();
    if (!deduped.has(key)) {
      deduped.set(key, entry);
    }
  }

  return [...deduped.values()].sort((a, b) => Temporal.PlainDate.compare(a.date, b.date));
}
