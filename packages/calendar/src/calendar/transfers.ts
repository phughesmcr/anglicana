/**
 * @description Transfer rules and conflict resolution for generated calendar events
 * @author P. Hughes <github@phugh.es> (www.phugh.es)
 * @license MIT
 * @module
 */

import { LITURGICAL_RANK, TEMPORAL_ISO_SUNDAY } from "../constants.ts";
import {
  getAshWednesday,
  getClosestSunday,
  getDayOfPentecost,
  getEasterSunday,
  getFirstSundayOfAdvent,
  getPalmSunday,
  getTheBaptismOfChrist,
  isPlainDateInInclusiveRange,
} from "../temporal/mod.ts";
import type { EasterOptions } from "../types.ts";
import {
  calendarEventSourceKey,
  FIXED_ALL_SOULS,
  FIXED_ANNUNCIATION,
  FIXED_GEORGE_ENGLAND,
  FIXED_JOSEPH_OF_NAZARETH,
  FIXED_MARK_EVANGELIST,
  FIXED_RICHARD_HOOKER,
  PRIORITY_EVENT_KEYS,
  TRANSFER_EXEMPT_FESTIVAL_KEYS,
} from "./identity.ts";
import type { CalendarEvent } from "./types.ts";

/**
 * Apply transfer rules and resolve conflicts between events
 */
export function applyTransferRules(
  events: CalendarEvent[],
  easterOptions: EasterOptions,
  adventStart: Temporal.PlainDate,
  adventEnd: Temporal.PlainDate,
  transferEpiphanyToSunday: boolean,
  transferFestivalsOnOrdinarySundays: boolean,
  transferLesserFestivalsWhenBlocked: boolean,
  transferLocalPrincipalToNearestSunday: boolean,
): CalendarEvent[] {
  const easterCache = new Map<number, {
    easter: Temporal.PlainDate;
    palmSunday: Temporal.PlainDate;
    secondSundayOfEaster: Temporal.PlainDate;
    ashWednesday: Temporal.PlainDate;
    pentecost: Temporal.PlainDate;
  }>();

  const getEasterContext = (year: number) => {
    const cached = easterCache.get(year);
    if (cached) return cached;
    const easter = getEasterSunday(year, easterOptions);
    const palmSunday = getPalmSunday(year, easterOptions);
    const secondSundayOfEaster = easter.add({ weeks: 1 });
    const ashWednesday = getAshWednesday(year, easterOptions);
    const pentecost = getDayOfPentecost(year, easterOptions);
    const context = { easter, palmSunday, secondSundayOfEaster, ashWednesday, pentecost };
    easterCache.set(year, context);
    return context;
  };

  const adventStartCache = new Map<number, Temporal.PlainDate>();
  const getCachedAdventStart = (year: number) => {
    const cached = adventStartCache.get(year);
    if (cached) return cached;
    const result = getFirstSundayOfAdvent(year);
    adventStartCache.set(year, result);
    return result;
  };

  const getSeason = (date: Temporal.PlainDate): "advent" | "lent" | "eastertide" | "other" => {
    const year = date.year;
    const adventStartOfYear = getCachedAdventStart(year);
    const christmasDay = new Temporal.PlainDate(year, 12, 25);
    const { ashWednesday, easter, pentecost } = getEasterContext(year);

    if (
      Temporal.PlainDate.compare(date, adventStartOfYear) >= 0 && Temporal.PlainDate.compare(date, christmasDay) < 0
    ) {
      return "advent";
    }
    if (Temporal.PlainDate.compare(date, ashWednesday) >= 0 && Temporal.PlainDate.compare(date, easter) < 0) {
      return "lent";
    }
    if (Temporal.PlainDate.compare(date, easter) >= 0 && Temporal.PlainDate.compare(date, pentecost) <= 0) {
      return "eastertide";
    }
    return "other";
  };

  const isEasterWeek = (date: Temporal.PlainDate) => {
    const { easter } = getEasterContext(date.year);
    return isPlainDateInInclusiveRange(date, easter, easter.add({ days: 6 }));
  };

  const isFirstOrSecondSundayOfChristmas = (date: Temporal.PlainDate) =>
    date.dayOfWeek === TEMPORAL_ISO_SUNDAY &&
    ((date.month === 12 && date.day >= 26) || (date.month === 1 && date.day <= 5));

  const localExceptionsCache = new Map<number, Set<string>>();
  const getLocalTransferExceptions = (year: number) => {
    const cached = localExceptionsCache.get(year);
    if (cached) return cached;
    const firstSundayOfAdvent = getCachedAdventStart(year);
    const baptismOfChrist = getTheBaptismOfChrist(year, transferEpiphanyToSunday);
    const easter = getEasterSunday(year, easterOptions);
    const firstSundayOfLent = easter.subtract({ weeks: 6 });
    const fifthSundayOfLent = easter.subtract({ weeks: 2 });
    const palmSunday = easter.subtract({ weeks: 1 });
    const result = new Set([
      firstSundayOfAdvent.toString(),
      baptismOfChrist.toString(),
      firstSundayOfLent.toString(),
      fifthSundayOfLent.toString(),
      palmSunday.toString(),
    ]);
    localExceptionsCache.set(year, result);
    return result;
  };

  const isBlockedLesserFestivalDate = (date: Temporal.PlainDate) => {
    const { palmSunday, secondSundayOfEaster } = getEasterContext(date.year);
    return isPlainDateInInclusiveRange(date, palmSunday, secondSundayOfEaster) ||
      date.dayOfWeek === TEMPORAL_ISO_SUNDAY;
  };

  const transferred = events.map((event) => {
    if (event.eventType !== "fixed" || !event.rules?.some((rule) => rule.rule === "must_transfer")) {
      return event;
    }

    const originalDate = event.originalDate ?? event.date;
    let updatedDate = event.date;
    const { palmSunday, secondSundayOfEaster } = getEasterContext(originalDate.year);

    switch (event.id) {
      case FIXED_JOSEPH_OF_NAZARETH:
      case FIXED_GEORGE_ENGLAND:
        if (isPlainDateInInclusiveRange(originalDate, palmSunday, secondSundayOfEaster)) {
          updatedDate = secondSundayOfEaster.add({ days: 1 });
        }
        break;
      case FIXED_ANNUNCIATION:
        if (isPlainDateInInclusiveRange(originalDate, palmSunday, secondSundayOfEaster)) {
          updatedDate = secondSundayOfEaster.add({ days: 1 });
        } else if (originalDate.dayOfWeek === TEMPORAL_ISO_SUNDAY) {
          updatedDate = originalDate.add({ days: 1 });
        }
        break;
      case FIXED_MARK_EVANGELIST: {
        if (isPlainDateInInclusiveRange(originalDate, palmSunday, secondSundayOfEaster)) {
          const georgeOriginal = new Temporal.PlainDate(originalDate.year, 4, 23);
          const georgeTransferred = isPlainDateInInclusiveRange(georgeOriginal, palmSunday, secondSundayOfEaster);
          updatedDate = secondSundayOfEaster.add({ days: georgeTransferred ? 2 : 1 });
        }
        break;
      }
      default:
        break;
    }

    if (Temporal.PlainDate.compare(updatedDate, event.date) !== 0) {
      return {
        ...event,
        date: updatedDate,
        originalDate,
      };
    }

    return event;
  });

  const getRankValue = (event: CalendarEvent) => LITURGICAL_RANK[event.type] ?? 99;
  const hasMayTransferRule = (event: CalendarEvent) =>
    event.rules?.some((rule) => rule.rule === "may_transfer") ?? false;
  const hasMustTransferRule = (event: CalendarEvent) =>
    event.rules?.some((rule) => rule.rule === "must_transfer") ?? false;
  const dateKey = (date: Temporal.PlainDate) => date.toString();
  const isFestival = (event: CalendarEvent) => event.type === "festival";
  const isPrincipal = (event: CalendarEvent) => event.type === "principal_feast" || event.type === "principal_holy_day";
  const eventSourceKey = (e: CalendarEvent) => calendarEventSourceKey(e);

  const sorted = [...transferred].sort((a, b) => {
    const dateCompare = Temporal.PlainDate.compare(a.date, b.date);
    if (dateCompare !== 0) return dateCompare;
    const rankCompare = getRankValue(a) - getRankValue(b);
    if (rankCompare !== 0) return rankCompare;
    if (PRIORITY_EVENT_KEYS.has(eventSourceKey(a)) && !PRIORITY_EVENT_KEYS.has(eventSourceKey(b))) return -1;
    if (PRIORITY_EVENT_KEYS.has(eventSourceKey(b)) && !PRIORITY_EVENT_KEYS.has(eventSourceKey(a))) return 1;
    return a.name.localeCompare(b.name);
  });

  const scheduled: CalendarEvent[] = [];
  const eventsByDate = new Map<string, CalendarEvent[]>();
  const allSoulsTransferDates = new Set<string>();

  for (const event of sorted) {
    const originalDate = event.originalDate ?? event.date;
    if (event.type === "commemoration" && isEasterWeek(originalDate)) {
      continue;
    }

    const localExceptions = getLocalTransferExceptions(originalDate.year);
    const localEventRequiresTransfer = (event.localType === "patronal" || event.localType === "dedication") &&
      localExceptions.has(originalDate.toString());

    if (event.id === FIXED_ALL_SOULS && originalDate.dayOfWeek === TEMPORAL_ISO_SUNDAY) {
      const nov3 = new Temporal.PlainDate(originalDate.year, 11, 3);
      if (
        Temporal.PlainDate.compare(nov3, adventStart) >= 0 &&
        Temporal.PlainDate.compare(nov3, adventEnd) < 0
      ) {
        const updatedEvent = {
          ...event,
          date: nov3,
          originalDate,
        };
        const key = dateKey(nov3);
        const list = eventsByDate.get(key) ?? [];
        list.push(updatedEvent);
        eventsByDate.set(key, list);
        scheduled.push(updatedEvent);
        allSoulsTransferDates.add(key);
      }
      continue;
    }

    if (event.id === FIXED_RICHARD_HOOKER) {
      const key = dateKey(originalDate);
      if (allSoulsTransferDates.has(key)) {
        continue;
      }
    }

    let targetDate = event.date;
    const season = getSeason(targetDate);
    const existing = eventsByDate.get(dateKey(targetDate)) ?? [];
    const hasPrincipalConflict = existing.some(isPrincipal);
    const hasFestivalConflict = existing.some(isFestival);
    const hasMajorConflict = existing.some((current) => isPrincipal(current) || isFestival(current));
    const localMustTransfer = (event.localType === "patronal" || event.localType === "dedication") &&
      (hasPrincipalConflict || localEventRequiresTransfer);

    if (
      event.type === "lesser_festival" &&
      (hasMajorConflict || isBlockedLesserFestivalDate(originalDate))
    ) {
      if (!transferLesserFestivalsWhenBlocked) {
        continue;
      }
      targetDate = targetDate.add({ days: 1 });
    }

    if (event.type === "commemoration") {
      const hasSundayConflict = targetDate.dayOfWeek === TEMPORAL_ISO_SUNDAY;
      if (hasPrincipalConflict || hasFestivalConflict || hasSundayConflict) {
        continue;
      }
    }

    if (event.type === "sunday" && hasPrincipalConflict) {
      continue;
    }

    if (
      transferLocalPrincipalToNearestSunday &&
      event.localType &&
      event.type === "principal_feast"
    ) {
      const nearestSunday = getClosestSunday(targetDate);
      const nearestSundayKey = dateKey(nearestSunday);
      const nearestConflicts = eventsByDate.get(nearestSundayKey) ?? [];
      const hasPrincipalOnNearest = nearestConflicts.some(isPrincipal);
      if (!localExceptions.has(nearestSundayKey) && !hasPrincipalOnNearest) {
        targetDate = nearestSunday;
      }
    }

    if (
      event.localType === "harvest" && targetDate.dayOfWeek === TEMPORAL_ISO_SUNDAY &&
      (hasPrincipalConflict || hasFestivalConflict)
    ) {
      let attempts = 0;
      while (attempts < 6) {
        targetDate = targetDate.add({ weeks: 1 });
        const conflicts = eventsByDate.get(dateKey(targetDate)) ?? [];
        if (!conflicts.some((current) => isPrincipal(current) || isFestival(current))) {
          break;
        }
        attempts += 1;
      }
    }
    const mustTransferFestivalOnSunday = isFestival(event) &&
      !TRANSFER_EXEMPT_FESTIVAL_KEYS.has(eventSourceKey(event)) &&
      targetDate.dayOfWeek === TEMPORAL_ISO_SUNDAY &&
      (season === "advent" || season === "lent" || season === "eastertide");
    const mustTransferFestivalInEasterWeek = isFestival(event) &&
      !TRANSFER_EXEMPT_FESTIVAL_KEYS.has(eventSourceKey(event)) &&
      isEasterWeek(targetDate);
    const mustTransferFestivalOnOrdinarySunday = transferFestivalsOnOrdinarySundays &&
      isFestival(event) &&
      !TRANSFER_EXEMPT_FESTIVAL_KEYS.has(eventSourceKey(event)) &&
      targetDate.dayOfWeek === TEMPORAL_ISO_SUNDAY &&
      !isFirstOrSecondSundayOfChristmas(targetDate) &&
      season === "other";
    const lesserFestivalMustTransfer = transferLesserFestivalsWhenBlocked &&
      event.type === "lesser_festival" &&
      (hasMajorConflict || isBlockedLesserFestivalDate(originalDate));
    const mustTransfer = hasMustTransferRule(event) ||
      (isFestival(event) && !TRANSFER_EXEMPT_FESTIVAL_KEYS.has(eventSourceKey(event)) && hasPrincipalConflict) ||
      mustTransferFestivalOnSunday ||
      mustTransferFestivalInEasterWeek ||
      mustTransferFestivalOnOrdinarySunday ||
      lesserFestivalMustTransfer ||
      localMustTransfer;
    const mayTransfer = hasMayTransferRule(event) ||
      (isFestival(event) && !TRANSFER_EXEMPT_FESTIVAL_KEYS.has(eventSourceKey(event)));

    if (mustTransfer || mayTransfer) {
      let attempts = 0;
      const maxAttempts = mustTransfer ? 14 : 7;
      while (attempts < maxAttempts) {
        const occupied = eventsByDate.get(dateKey(targetDate)) ?? [];
        const minRank = occupied.reduce(
          (rank, current) => Math.min(rank, getRankValue(current)),
          Number.POSITIVE_INFINITY,
        );
        const hasPriorityConflict = occupied.some((current) =>
          PRIORITY_EVENT_KEYS.has(eventSourceKey(current)) && eventSourceKey(current) !== eventSourceKey(event)
        );
        const dateSeason = getSeason(targetDate);
        const invalidSundayFestival = isFestival(event) &&
          !TRANSFER_EXEMPT_FESTIVAL_KEYS.has(eventSourceKey(event)) &&
          targetDate.dayOfWeek === TEMPORAL_ISO_SUNDAY &&
          !isFirstOrSecondSundayOfChristmas(targetDate) &&
          (dateSeason === "advent" || dateSeason === "lent" || dateSeason === "eastertide" ||
            (dateSeason === "other" && transferFestivalsOnOrdinarySundays));
        const invalidEasterWeekFestival = isFestival(event) &&
          !TRANSFER_EXEMPT_FESTIVAL_KEYS.has(eventSourceKey(event)) &&
          isEasterWeek(targetDate);
        const invalidLesserFestivalDate = event.type === "lesser_festival" && isBlockedLesserFestivalDate(targetDate);

        if (
          (minRank === Number.POSITIVE_INFINITY || getRankValue(event) <= minRank) &&
          !hasPriorityConflict &&
          !invalidSundayFestival &&
          !invalidEasterWeekFestival &&
          !invalidLesserFestivalDate
        ) {
          break;
        }
        targetDate = targetDate.add({ days: 1 });
        attempts += 1;
      }
    }

    if (
      Temporal.PlainDate.compare(targetDate, adventStart) < 0 ||
      Temporal.PlainDate.compare(targetDate, adventEnd) >= 0
    ) {
      continue;
    }

    const finalEvent = Temporal.PlainDate.compare(targetDate, event.date) === 0 ? event : {
      ...event,
      date: targetDate,
      originalDate: event.originalDate ?? event.date,
    };

    scheduled.push(finalEvent);
    const key = dateKey(targetDate);
    const list = eventsByDate.get(key) ?? [];
    list.push(finalEvent);
    eventsByDate.set(key, list);
  }

  return scheduled;
}
