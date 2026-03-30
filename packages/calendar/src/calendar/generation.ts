/**
 * @description Orchestrates full liturgical calendar generation for a year
 * @author P. Hughes <github@phugh.es> (www.phugh.es)
 * @license MIT
 * @module
 */

import { getEasterSunday, getPalmSunday } from "../temporal/easter.ts";
import { isPlainDateInInclusiveRange } from "../temporal/date_utils.ts";
import { validateYear } from "../temporal/validation.ts";
import { getLiturgicalYearBounds } from "./bounds.ts";
import { generateFixedEvents } from "./fixed_events.ts";
import { FIXED_GEORGE_ENGLAND, FIXED_MARK_EVANGELIST } from "./identity.ts";
import { generateLocalEvents } from "./local_events.ts";
import { generateMoveableEvents } from "./moveable_events.ts";
import { applyTransferRules } from "./transfers.ts";
import { getTrinitySundaySeriesInfo } from "./trinity_sundays.ts";
import type { CalendarEvent, CalendarOptions } from "./types.ts";

function annotateTrinityEucharisticPropers(
  events: CalendarEvent[],
  liturgicalYear: number,
  easterOptions: CalendarOptions["easterOptions"],
): CalendarEvent[] {
  const info = getTrinitySundaySeriesInfo(liturgicalYear, easterOptions ?? {});
  if (
    !info.appliesTwentySecondTwentyThirdProperSwap ||
    !info.twentySecondSundayAfterTrinity ||
    !info.twentyThirdSundayAfterTrinity
  ) {
    return events;
  }
  const d22 = info.twentySecondSundayAfterTrinity.toString();
  const d23 = info.twentyThirdSundayAfterTrinity.toString();
  return events.map((e) => {
    if (e.type !== "sunday") return e;
    const key = e.date.toString();
    if (key === d22 && e.name === "Twenty-Second Sunday after Trinity") {
      return { ...e, eucharisticProperAs: "third_sunday_before_lent" as const };
    }
    if (
      key === d23 &&
      (e.name === "Last Sunday after Trinity" || e.name === "Twenty-Third Sunday after Trinity")
    ) {
      return { ...e, eucharisticProperAs: "last_sunday_after_trinity" as const };
    }
    return e;
  });
}

function applyBcpGeorgeMarkHarmonisation(
  events: CalendarEvent[],
  easterOptions: NonNullable<CalendarOptions["easterOptions"]>,
  enabled: boolean,
): CalendarEvent[] {
  if (!enabled) return events;

  return events.map((event) => {
    if (event.eventType !== "fixed" || event.id !== FIXED_MARK_EVANGELIST) {
      return event;
    }
    const orig = event.originalDate ?? new Temporal.PlainDate(event.date.year, 4, 25);
    const y = orig.year;
    const palmSunday = getPalmSunday(y, easterOptions);
    const secondSundayOfEaster = getEasterSunday(y, easterOptions).add({ weeks: 1 });
    const origGeorge = new Temporal.PlainDate(y, 4, 23);
    if (
      !isPlainDateInInclusiveRange(orig, palmSunday, secondSundayOfEaster) ||
      !isPlainDateInInclusiveRange(origGeorge, palmSunday, secondSundayOfEaster)
    ) {
      return event;
    }
    const georgeEvent = events.find(
      (e) =>
        e.eventType === "fixed" &&
        e.id === FIXED_GEORGE_ENGLAND &&
        (e.originalDate ?? new Temporal.PlainDate(e.date.year, 4, 23)).year === y,
    );
    if (!georgeEvent) return event;
    const target = georgeEvent.date.add({ days: 1 });
    if (Temporal.PlainDate.compare(event.date, target) === 0) return event;
    return { ...event, date: target };
  });
}

/**
 * Generate a complete Common Worship calendar for a given liturgical year
 * @param liturgicalYear The liturgical year (starting on Advent Sunday)
 * @param options Optional configuration. Default `canonicalMode: "canonical"` uses strict calendar dates for optional
 *   Sunday and September transfers; use `"pastoral"` for typical parish defaults, or override with `transfer*` flags.
 *   Additional options: `includeAllSaintsSecondaryOnNovember1`, `bcpGeorgeMarkTransferHarmonisation` — see {@link CalendarOptions}.
 * @returns Array of calendar events from Advent to Advent, sorted chronologically
 * @see {@link https://www.churchofengland.org/prayer-and-worship/worship-texts-and-resources/common-worship/churchs-year/rules}
 */
export function generateLiturgicalCalendar(
  liturgicalYear: number,
  options: CalendarOptions = {},
): CalendarEvent[] {
  const validatedYear = validateYear(liturgicalYear);
  const canonicalMode = options.canonicalMode ?? "canonical";
  /** Pastoral: Common Worship parish defaults (optional Sunday + September transfers on). Canonical: strict calendar dates for those may-transfer rules (off unless overridden). */
  const canonicalDefaults = canonicalMode === "pastoral"
    ? {
      transferEpiphanyToSunday: true,
      transferPresentationToSunday: true,
      transferAllSaintsToSunday: true,
      transferBlessedVirginMaryToSeptember: true,
      transferFestivalsOnOrdinarySundays: true,
      transferLesserFestivalsWhenBlocked: true,
      transferLocalPrincipalToNearestSunday: true,
    }
    : {
      transferEpiphanyToSunday: false,
      transferPresentationToSunday: false,
      transferAllSaintsToSunday: false,
      transferBlessedVirginMaryToSeptember: false,
      transferFestivalsOnOrdinarySundays: false,
      transferLesserFestivalsWhenBlocked: false,
      transferLocalPrincipalToNearestSunday: false,
    };

  const easterOptions = options.easterOptions ?? {};
  const transferEpiphanyToSunday = options.transferEpiphanyToSunday ?? canonicalDefaults.transferEpiphanyToSunday;
  const transferPresentationToSunday = options.transferPresentationToSunday ??
    canonicalDefaults.transferPresentationToSunday;
  const transferAllSaintsToSunday = options.transferAllSaintsToSunday ?? canonicalDefaults.transferAllSaintsToSunday;
  const transferBlessedVirginMaryToSeptember = options.transferBlessedVirginMaryToSeptember ??
    canonicalDefaults.transferBlessedVirginMaryToSeptember;
  const transferFestivalsOnOrdinarySundays = options.transferFestivalsOnOrdinarySundays ??
    canonicalDefaults.transferFestivalsOnOrdinarySundays;
  const transferLesserFestivalsWhenBlocked = options.transferLesserFestivalsWhenBlocked ??
    canonicalDefaults.transferLesserFestivalsWhenBlocked;
  const transferLocalPrincipalToNearestSunday = options.transferLocalPrincipalToNearestSunday ??
    canonicalDefaults.transferLocalPrincipalToNearestSunday;
  const includeCommemorationsAndLesserFestivals = options.includeCommemorationsAndLesserFestivals ?? true;
  const localEvents = options.localEvents ?? [];
  const includeAllSaintsSecondaryOnNovember1 = options.includeAllSaintsSecondaryOnNovember1 ?? false;
  const bcpGeorgeMarkTransferHarmonisation = options.bcpGeorgeMarkTransferHarmonisation ?? false;

  const { start: adventStart, end: adventEnd } = getLiturgicalYearBounds(validatedYear);

  const events: CalendarEvent[] = [];

  events.push(
    ...generateFixedEvents(
      validatedYear,
      adventStart,
      adventEnd,
      transferEpiphanyToSunday,
      transferPresentationToSunday,
      transferAllSaintsToSunday,
      transferBlessedVirginMaryToSeptember,
      includeCommemorationsAndLesserFestivals,
      includeAllSaintsSecondaryOnNovember1,
    ),
  );

  events.push(
    ...generateMoveableEvents(
      validatedYear,
      adventStart,
      adventEnd,
      easterOptions,
      transferEpiphanyToSunday,
    ),
  );

  events.push(...generateLocalEvents(localEvents, adventStart, adventEnd));

  events.sort((a, b) => Temporal.PlainDate.compare(a.date, b.date));

  let result = applyTransferRules(
    events,
    easterOptions,
    adventStart,
    adventEnd,
    transferEpiphanyToSunday,
    transferFestivalsOnOrdinarySundays,
    transferLesserFestivalsWhenBlocked,
    transferLocalPrincipalToNearestSunday,
  );

  result = applyBcpGeorgeMarkHarmonisation(result, easterOptions, bcpGeorgeMarkTransferHarmonisation);
  result = annotateTrinityEucharisticPropers(result, validatedYear, easterOptions);

  result.sort((a, b) => Temporal.PlainDate.compare(a.date, b.date));

  return result;
}
