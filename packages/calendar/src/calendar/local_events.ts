/**
 * @description User-supplied local celebrations within a liturgical year
 * @author P. Hughes <github@phugh.es> (www.phugh.es)
 * @license MIT
 * @module
 */

import { validateDate } from "../temporal/mod.ts";
import type { CalendarEvent, LocalEventInput } from "./types.ts";

/** Local events use eventType "fixed" and ids from 900000; avoid reusing JSON fixed ids if attaching must_transfer rules. */
export function generateLocalEvents(
  localEvents: LocalEventInput[],
  adventStart: Temporal.PlainDate,
  adventEnd: Temporal.PlainDate,
): CalendarEvent[] {
  let localId = 900000;
  return localEvents
    .map((event) => {
      const date = validateDate(event.date);
      return {
        id: event.id ?? localId++,
        name: event.name,
        type: event.type,
        date,
        eventType: "fixed",
        rules: event.rules,
        description: event.description,
        localType: event.localType,
      } satisfies CalendarEvent;
    })
    .filter((event) =>
      Temporal.PlainDate.compare(event.date, adventStart) >= 0 &&
      Temporal.PlainDate.compare(event.date, adventEnd) < 0
    );
}
