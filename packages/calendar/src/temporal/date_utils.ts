/**
 * @description Small Temporal.PlainDate helpers shared across temporal and calendar code.
 * @module
 */

import { TEMPORAL_ISO_SUNDAY } from "../constants.ts";

/** True if `date` is on or after `start` and on or before `end`. */
export function isPlainDateInInclusiveRange(
  date: Temporal.PlainDate,
  start: Temporal.PlainDate,
  end: Temporal.PlainDate,
): boolean {
  return Temporal.PlainDate.compare(date, start) >= 0 && Temporal.PlainDate.compare(date, end) <= 0;
}

/** First Sunday in [start, end] inclusive, or null if none. */
export function findFirstSundayInRange(
  start: Temporal.PlainDate,
  end: Temporal.PlainDate,
): Temporal.PlainDate | null {
  let d = start;
  while (Temporal.PlainDate.compare(d, end) <= 0) {
    if (d.dayOfWeek === TEMPORAL_ISO_SUNDAY) return d;
    d = d.add({ days: 1 });
  }
  return null;
}
