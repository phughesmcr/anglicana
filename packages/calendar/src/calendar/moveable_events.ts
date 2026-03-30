/**
 * @description Moveable (computed) calendar events for a liturgical year
 * @author P. Hughes <github@phugh.es> (www.phugh.es)
 * @license MIT
 * @module
 */

import { TEMPORAL_ISO_SUNDAY } from "../constants.ts";
import { MOVEABLE_EVENTS } from "../data/mod.ts";
import {
  findFirstSundayInRange,
  getAscensionDay,
  getChristmasDay,
  getClosestSunday,
  getEasterSunday,
  getEpiphany,
  getNextSunday,
  getTheBaptismOfChrist,
  getTrinitySunday,
} from "../temporal/mod.ts";
import type { EasterOptions } from "../types.ts";
import {
  MOVEABLE_BAPTISM_OF_CHRIST,
  MOVEABLE_EASTER_DAY,
  MOVEABLE_FIRST_SUNDAY_OF_ADVENT,
  MOVEABLE_FOURTH_SUNDAY_OF_ADVENT,
  MOVEABLE_SECOND_SUNDAY_OF_ADVENT,
  MOVEABLE_SUNDAYS_AFTER_TRINITY,
  MOVEABLE_THIRD_SUNDAY_OF_ADVENT,
} from "./identity.ts";
import type { CalendarEvent } from "./types.ts";

function generateSundaySeriesEvents(
  moveableEvent: typeof MOVEABLE_EVENTS[number],
  start: Temporal.PlainDate,
  end: Temporal.PlainDate,
  descriptor: string,
  adventStart: Temporal.PlainDate,
  adventEnd: Temporal.PlainDate,
  startOrdinalIndex = 0,
): CalendarEvent[] {
  const events: CalendarEvent[] = [];
  const ordinals = [
    "First",
    "Second",
    "Third",
    "Fourth",
    "Fifth",
    "Sixth",
    "Seventh",
    "Eighth",
    "Ninth",
    "Tenth",
    "Eleventh",
    "Twelfth",
    "Thirteenth",
    "Fourteenth",
    "Fifteenth",
    "Sixteenth",
    "Seventeenth",
    "Eighteenth",
    "Nineteenth",
    "Twentieth",
    "Twenty-First",
    "Twenty-Second",
    "Twenty-Third",
    "Twenty-Fourth",
    "Twenty-Fifth",
    "Twenty-Sixth",
    "Twenty-Seventh",
  ];

  const getOrdinal = (index: number) => ordinals[index - 1] ?? `${index}th`;

  let current = start;
  let index = startOrdinalIndex + 1;
  while (Temporal.PlainDate.compare(current, end) <= 0) {
    if (
      Temporal.PlainDate.compare(current, adventStart) >= 0 &&
      Temporal.PlainDate.compare(current, adventEnd) < 0
    ) {
      const isLastSundayAfterTrinity = descriptor === "after Trinity" &&
        Temporal.PlainDate.compare(current, end) === 0;
      const name = isLastSundayAfterTrinity ? "Last Sunday after Trinity" : `${getOrdinal(index)} Sunday ${descriptor}`;
      events.push({
        id: moveableEvent.id * 100 + index,
        name,
        type: "sunday",
        date: current,
        eventType: "moveable",
        rules: moveableEvent.rules,
        optional: moveableEvent.optional,
        description: moveableEvent.description,
        relativeTo: moveableEvent.relative_to,
        offsetDays: moveableEvent.offset_days,
      });
    }
    current = current.add({ weeks: 1 });
    index += 1;
  }
  return events;
}

function generateSpecialObservanceSeriesEvents(
  moveableEvent: typeof MOVEABLE_EVENTS[number],
  referenceDate: Temporal.PlainDate,
  offsetDays: number,
  adventStart: Temporal.PlainDate,
  adventEnd: Temporal.PlainDate,
): CalendarEvent[] {
  const events: CalendarEvent[] = [];

  if (moveableEvent.name.startsWith("Ember Days")) {
    const candidates: Array<{ suffix: string; date: Temporal.PlainDate }> = [
      { suffix: "Wednesday", date: referenceDate.subtract({ days: 4 }) },
      { suffix: "Friday", date: referenceDate.subtract({ days: 2 }) },
      { suffix: "Saturday", date: referenceDate.subtract({ days: 1 }) },
    ];

    for (const candidate of candidates) {
      if (
        Temporal.PlainDate.compare(candidate.date, adventStart) >= 0 &&
        Temporal.PlainDate.compare(candidate.date, adventEnd) < 0
      ) {
        events.push({
          id: moveableEvent.id * 100 + candidate.date.day,
          name: `${moveableEvent.name} (${candidate.suffix})`,
          type: "special_observance",
          date: candidate.date,
          eventType: "moveable",
          rules: moveableEvent.rules,
          optional: moveableEvent.optional,
          description: moveableEvent.description,
          relativeTo: moveableEvent.relative_to,
          offsetDays: moveableEvent.offset_days,
        });
      }
    }

    return events;
  }

  if (moveableEvent.name.startsWith("Nine Days of Prayer")) {
    const startDate = referenceDate.add({ days: offsetDays });
    for (let i = 0; i < 9; i += 1) {
      const date = startDate.add({ days: i });
      if (
        Temporal.PlainDate.compare(date, adventStart) >= 0 &&
        Temporal.PlainDate.compare(date, adventEnd) < 0
      ) {
        events.push({
          id: moveableEvent.id * 100 + (i + 1),
          name: `${moveableEvent.name} (Day ${i + 1})`,
          type: "special_observance",
          date,
          eventType: "moveable",
          rules: moveableEvent.rules,
          optional: moveableEvent.optional,
          description: moveableEvent.description,
          relativeTo: moveableEvent.relative_to,
          offsetDays: moveableEvent.offset_days,
        });
      }
    }
  }

  return events;
}

/**
 * Generate moveable calendar events for the liturgical year
 */
export function generateMoveableEvents(
  _liturgicalYear: number,
  adventStart: Temporal.PlainDate,
  adventEnd: Temporal.PlainDate,
  easterOptions: EasterOptions,
  transferEpiphanyToSunday: boolean,
): CalendarEvent[] {
  const events: CalendarEvent[] = [];

  const adventYear = adventStart.year;
  const followingYear = adventYear + 1;

  const easter = getEasterSunday(followingYear, easterOptions);
  const epiphany = getEpiphany(followingYear, transferEpiphanyToSunday);
  const trinitySunday = getTrinitySunday(followingYear, easterOptions);
  const ascensionDay = getAscensionDay(followingYear, easterOptions);
  const christmas = getChristmasDay(adventYear);

  const advent3 = adventStart.add({ weeks: 2 });
  const lent2 = easter.subtract({ weeks: 5 });

  const firstSundayOfChristmas = findFirstSundayInRange(
    new Temporal.PlainDate(adventYear, 12, 26),
    new Temporal.PlainDate(followingYear, 1, 1),
  );
  let secondSundayOfChristmas = findFirstSundayInRange(
    new Temporal.PlainDate(followingYear, 1, 2),
    new Temporal.PlainDate(followingYear, 1, 5),
  );
  if (
    transferEpiphanyToSunday &&
    secondSundayOfChristmas &&
    Temporal.PlainDate.compare(secondSundayOfChristmas, epiphany) === 0
  ) {
    secondSundayOfChristmas = null;
  }
  const lastSundayOfOctober = (() => {
    const lastDay = new Temporal.PlainDate(followingYear, 10, 31);
    const daysToSubtract = lastDay.dayOfWeek === TEMPORAL_ISO_SUNDAY ? 0 : lastDay.dayOfWeek;
    return lastDay.subtract({ days: daysToSubtract });
  })();
  const remembranceSunday = getClosestSunday(new Temporal.PlainDate(followingYear, 11, 11));

  for (const moveableEvent of MOVEABLE_EVENTS) {
    if (
      moveableEvent.id === MOVEABLE_FIRST_SUNDAY_OF_ADVENT ||
      moveableEvent.id === MOVEABLE_SECOND_SUNDAY_OF_ADVENT ||
      moveableEvent.id === MOVEABLE_THIRD_SUNDAY_OF_ADVENT ||
      moveableEvent.id === MOVEABLE_FOURTH_SUNDAY_OF_ADVENT
    ) {
      const weekOffset = moveableEvent.id - MOVEABLE_FIRST_SUNDAY_OF_ADVENT;
      events.push({
        id: moveableEvent.id,
        name: moveableEvent.name,
        type: "sunday",
        date: adventStart.add({ weeks: weekOffset }),
        eventType: "moveable",
        rules: moveableEvent.rules,
        optional: moveableEvent.optional,
        description: moveableEvent.description,
        relativeTo: moveableEvent.relative_to,
        offsetDays: moveableEvent.offset_days,
      });
      continue;
    }

    let referenceDate: Temporal.PlainDate;

    switch (moveableEvent.relative_to) {
      case "easter":
        referenceDate = easter;
        break;
      case "advent":
        referenceDate = adventEnd;
        break;
      case "epiphany":
        referenceDate = epiphany;
        break;
      case "trinity_sunday":
        referenceDate = trinitySunday;
        break;
      case "ascension_day":
        referenceDate = ascensionDay;
        break;
      case "christmas":
        referenceDate = christmas;
        break;
      case "christmas_first_sunday":
        if (!firstSundayOfChristmas) {
          continue;
        }
        referenceDate = firstSundayOfChristmas;
        break;
      case "christmas_second_sunday":
        if (!secondSundayOfChristmas) {
          continue;
        }
        referenceDate = secondSundayOfChristmas;
        break;
      case "advent_3":
        referenceDate = advent3;
        break;
      case "lent_2":
        referenceDate = lent2;
        break;
      case "october_last_sunday":
        referenceDate = lastSundayOfOctober;
        break;
      case "november_11_nearest_sunday":
        referenceDate = remembranceSunday;
        break;
      case "june_29_nearest_sunday":
        referenceDate = getClosestSunday(new Temporal.PlainDate(followingYear, 6, 29));
        break;
      case "september_29_nearest_sunday":
        referenceDate = getClosestSunday(new Temporal.PlainDate(followingYear, 9, 29));
        break;
      case "epiphany_easter_cycle":
        {
          const secondSundayBeforeLent = easter.subtract({ weeks: 8 });
          let startSunday = epiphany.dayOfWeek === TEMPORAL_ISO_SUNDAY
            ? epiphany.add({ weeks: 1 })
            : getNextSunday(epiphany);
          const baptismOfChrist = getTheBaptismOfChrist(followingYear, transferEpiphanyToSunday);
          let startOrdinalIndex = 0;
          if (Temporal.PlainDate.compare(startSunday, baptismOfChrist) === 0) {
            startSunday = startSunday.add({ weeks: 1 });
            startOrdinalIndex = 1;
          }
          const endSunday = secondSundayBeforeLent.subtract({ weeks: 1 });
          const seriesEvents = generateSundaySeriesEvents(
            moveableEvent,
            startSunday,
            endSunday,
            "after Epiphany",
            adventStart,
            adventEnd,
            startOrdinalIndex,
          );
          events.push(...seriesEvents);
        }
        continue;
      case undefined:
        if (moveableEvent.id === MOVEABLE_EASTER_DAY) {
          referenceDate = easter;
        } else {
          console.warn(`Event ${moveableEvent.name} has no relative_to field`);
          continue;
        }
        break;
      default:
        console.warn(`Unknown relative_to reference: ${moveableEvent.relative_to}`);
        continue;
    }

    const offsetDays = moveableEvent.offset_days || 0;
    if (typeof offsetDays !== "number" || !Number.isInteger(offsetDays)) {
      console.warn(`Invalid offset_days for event ${moveableEvent.name}: ${offsetDays}`);
      continue;
    }

    if (moveableEvent.id === MOVEABLE_SUNDAYS_AFTER_TRINITY) {
      const startSunday = trinitySunday.add({ weeks: 1 });
      const endSunday = adventEnd.subtract({ weeks: 5 });
      const seriesEvents = generateSundaySeriesEvents(
        moveableEvent,
        startSunday,
        endSunday,
        "after Trinity",
        adventStart,
        adventEnd,
      );
      events.push(...seriesEvents);
      continue;
    }

    if (
      moveableEvent.name.startsWith("Ember Days") ||
      moveableEvent.name.startsWith("Nine Days of Prayer")
    ) {
      const seriesEvents = generateSpecialObservanceSeriesEvents(
        moveableEvent,
        referenceDate,
        offsetDays,
        adventStart,
        adventEnd,
      );
      events.push(...seriesEvents);
      continue;
    }

    const baseType = moveableEvent.type === "sunday_series"
      ? "sunday"
      : moveableEvent.type === "special_observance_series"
      ? "special_observance"
      : moveableEvent.type;

    if (moveableEvent.id === MOVEABLE_BAPTISM_OF_CHRIST) {
      const eventDate = getTheBaptismOfChrist(followingYear, transferEpiphanyToSunday);
      if (
        Temporal.PlainDate.compare(eventDate, adventStart) >= 0 &&
        Temporal.PlainDate.compare(eventDate, adventEnd) < 0
      ) {
        events.push({
          id: moveableEvent.id,
          name: moveableEvent.name,
          type: baseType,
          date: eventDate,
          eventType: "moveable",
          rules: moveableEvent.rules,
          optional: moveableEvent.optional,
          description: moveableEvent.description,
          relativeTo: moveableEvent.relative_to,
          offsetDays: moveableEvent.offset_days,
        });
      }
      continue;
    }

    const eventDate = referenceDate.add({ days: offsetDays });

    if (
      Temporal.PlainDate.compare(eventDate, adventStart) >= 0 &&
      Temporal.PlainDate.compare(eventDate, adventEnd) < 0
    ) {
      events.push({
        id: moveableEvent.id,
        name: moveableEvent.name,
        type: baseType,
        date: eventDate,
        eventType: "moveable",
        rules: moveableEvent.rules,
        optional: moveableEvent.optional,
        description: moveableEvent.description,
        relativeTo: moveableEvent.relative_to,
        offsetDays: moveableEvent.offset_days,
      });
    }
  }

  return events;
}
