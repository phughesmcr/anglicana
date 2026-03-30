import type { LITURGICAL_COLORS, LITURGICAL_EVENT_TYPES, LITURGICAL_SEASONS } from "./constants.ts";

// ===== BASIC TYPES =====

/** Fixed vs moveable event categorization. */
export type LiturgicalEventType = (typeof LITURGICAL_EVENT_TYPES)[keyof typeof LITURGICAL_EVENT_TYPES];
/** Liturgical color values. */
export type LiturgicalColor = (typeof LITURGICAL_COLORS)[keyof typeof LITURGICAL_COLORS];
/** Liturgical precedence tiers used for conflict resolution. */
export type LiturgicalRank =
  | "principal_feast"
  | "principal_holy_day"
  | "festival"
  | "lesser_festival"
  | "commemoration"
  | "sunday"
  | "sunday_series"
  | "special_observance"
  | "special_observance_series"
  | "weekday";
/** Named season identifiers. */
export type Season = (typeof LITURGICAL_SEASONS)[keyof typeof LITURGICAL_SEASONS];

/** Weekday lectionary cycle number (1 or 2). */
export type WeekdayLectionaryNumber = 1 | 2;
/** Sunday lectionary cycle letter (A, B, C). */
export type SundayLectionaryLetter = "A" | "B" | "C";

/** Supported date input shapes. */
export type DateInput = string | number | Temporal.PlainDate | Temporal.PlainDateLike;

/** Inclusive date range. */
export type DateRange = {
  start: Temporal.PlainDate;
  end: Temporal.PlainDate;
};

/** Interface for Easter calculation options */
export interface EasterOptions {
  /** Use Gregorian calendar */
  gregorian?: boolean;
  /** Use Julian calendar */
  julian?: boolean;
}

/** Options for moveable date calculation helpers. */
export type MoveableDateOptions = EasterOptions & {
  /** Transfer Epiphany to Sunday */
  transferEpiphanyToSunday?: boolean;
};
