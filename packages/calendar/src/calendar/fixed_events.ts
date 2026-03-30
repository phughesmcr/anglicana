/**
 * @description Fixed-date events for a liturgical year
 * @author P. Hughes <github@phugh.es> (www.phugh.es)
 * @license MIT
 * @module
 */

import { EVENTS as FIXED_EVENTS } from "../data/mod.ts";
import { getAllSaintsDay, getEpiphany, getPresentationOfChristInTheTemple } from "../temporal/mod.ts";
import { FIXED_ALL_SAINTS, FIXED_BLESSED_VIRGIN_MARY, FIXED_EPIPHANY, FIXED_PRESENTATION } from "./identity.ts";
import type { CalendarEvent } from "./types.ts";

/**
 * Generate fixed calendar events for the liturgical year
 */
export function generateFixedEvents(
  liturgicalYear: number,
  adventStart: Temporal.PlainDate,
  adventEnd: Temporal.PlainDate,
  transferEpiphanyToSunday: boolean,
  transferPresentationToSunday: boolean,
  transferAllSaintsToSunday: boolean,
  transferBlessedVirginMaryToSeptember: boolean,
  includeCommemorationsAndLesserFestivals: boolean,
  /** When All Saints is transferred to Sunday, also emit 1 November as an optional secondary observance. */
  includeAllSaintsSecondaryOnNovember1 = false,
): CalendarEvent[] {
  const events: CalendarEvent[] = [];

  const calendarYears = [liturgicalYear, liturgicalYear + 1];

  for (const calendarYear of calendarYears) {
    for (const fixedEvent of FIXED_EVENTS) {
      if (
        !includeCommemorationsAndLesserFestivals &&
        (fixedEvent.type === "commemoration" || fixedEvent.type === "lesser_festival")
      ) {
        continue;
      }

      const eventDate = new Temporal.PlainDate(calendarYear, fixedEvent.date[0], fixedEvent.date[1]);

      if (
        Temporal.PlainDate.compare(eventDate, adventStart) >= 0 &&
        Temporal.PlainDate.compare(eventDate, adventEnd) < 0
      ) {
        let finalDate = eventDate;

        if (fixedEvent.id === FIXED_EPIPHANY && transferEpiphanyToSunday) {
          finalDate = getEpiphany(calendarYear, true);
        }
        if (fixedEvent.id === FIXED_PRESENTATION && transferPresentationToSunday) {
          finalDate = getPresentationOfChristInTheTemple(calendarYear, true);
        }
        if (fixedEvent.id === FIXED_ALL_SAINTS && transferAllSaintsToSunday) {
          finalDate = getAllSaintsDay(calendarYear, true);
        }
        if (
          fixedEvent.id === FIXED_BLESSED_VIRGIN_MARY &&
          transferBlessedVirginMaryToSeptember &&
          fixedEvent.alt
        ) {
          finalDate = new Temporal.PlainDate(calendarYear, fixedEvent.alt[0], fixedEvent.alt[1]);
        }

        events.push({
          id: fixedEvent.id,
          name: fixedEvent.name,
          type: fixedEvent.type,
          date: finalDate,
          eventType: "fixed",
          rules: fixedEvent.rules,
          originalDate: eventDate !== finalDate ? eventDate : undefined,
        });

        if (
          fixedEvent.id === FIXED_ALL_SAINTS &&
          transferAllSaintsToSunday &&
          includeAllSaintsSecondaryOnNovember1 &&
          Temporal.PlainDate.compare(finalDate, eventDate) !== 0
        ) {
          events.push({
            id: fixedEvent.id,
            name: fixedEvent.name,
            type: fixedEvent.type,
            date: eventDate,
            eventType: "fixed",
            observance: "secondary",
            originalDate: eventDate,
          });
        }
      }
    }
  }

  return events;
}
