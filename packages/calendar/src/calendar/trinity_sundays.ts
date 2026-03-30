/**
 * Sundays after Trinity — count and eucharistic-proper swap (Common Worship Rules).
 * @see {@link https://www.churchofengland.org/prayer-and-worship/worship-texts-and-resources/common-worship/churchs-year/rules}
 * @module
 */

import { getTrinitySunday } from "../temporal/mod.ts";
import type { EasterOptions } from "../types.ts";
import { getLiturgicalYearBounds } from "./bounds.ts";

/** Inclusive count of Sundays from `firstSundayAfterTrinity` through `seriesEnd`, stepping weekly. */
function countSundaysInclusive(firstSundayAfterTrinity: Temporal.PlainDate, seriesEnd: Temporal.PlainDate): number {
  const days = firstSundayAfterTrinity.until(seriesEnd, { largestUnit: "days" }).days;
  return days < 0 ? 0 : Math.floor(days / 7) + 1;
}

/**
 * Dates and metadata for the series “Sundays after Trinity” as generated in
 * {@link ./moveable_events.ts} (`startSunday = trinitySunday + 1 week`, `endSunday = adventEnd − 5 weeks`).
 */
export interface TrinitySundaySeriesInfo {
  /** Number of Sundays after Trinity in the series (inclusive range). */
  sundayCount: number;
  /** True when the Rules require swapping 22nd/23rd Sunday Holy Communion propers. */
  appliesTwentySecondTwentyThirdProperSwap: boolean;
  /** Date of the 22nd Sunday after Trinity (only meaningful if `sundayCount >= 22`). */
  twentySecondSundayAfterTrinity: Temporal.PlainDate | null;
  /** Date of the 23rd Sunday after Trinity (only meaningful if `sundayCount >= 23`). */
  twentyThirdSundayAfterTrinity: Temporal.PlainDate | null;
}

/**
 * Compute Sundays-after-Trinity count for a liturgical year using the same bounds as moveable event generation.
 */
export function getTrinitySundaySeriesInfo(
  liturgicalYear: number,
  easterOptions: EasterOptions = {},
): TrinitySundaySeriesInfo {
  const { start: adventStart, end: adventEnd } = getLiturgicalYearBounds(liturgicalYear);
  const followingYear = adventStart.year + 1;
  const trinitySunday = getTrinitySunday(followingYear, easterOptions);
  const firstSundayAfterTrinity = trinitySunday.add({ weeks: 1 });
  const seriesEnd = adventEnd.subtract({ weeks: 5 });

  const sundayCount = countSundaysInclusive(firstSundayAfterTrinity, seriesEnd);
  const twentySecondSundayAfterTrinity = sundayCount >= 22 ? firstSundayAfterTrinity.add({ weeks: 21 }) : null;
  const twentyThirdSundayAfterTrinity = sundayCount >= 23 ? firstSundayAfterTrinity.add({ weeks: 22 }) : null;
  const appliesTwentySecondTwentyThirdProperSwap = sundayCount === 23;

  return {
    sundayCount,
    appliesTwentySecondTwentyThirdProperSwap,
    twentySecondSundayAfterTrinity,
    twentyThirdSundayAfterTrinity,
  };
}
