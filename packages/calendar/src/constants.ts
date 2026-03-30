/** ISO 8601 weekday: Monday = 1, …, Sunday = 7 (`Temporal.PlainDate.dayOfWeek`). */
export const TEMPORAL_ISO_SUNDAY = 7;

/** Earliest calendar year accepted by date validation (post-Gregorian reform). */
export const MIN_CALENDAR_YEAR = 1583;

/** Latest calendar year accepted by date validation. */
export const MAX_CALENDAR_YEAR = 9999;

/** Days before Easter Sunday: Ash Wednesday. */
export const DAYS_BEFORE_EASTER_ASH_WEDNESDAY = 46;

/** Days before Easter Sunday: Maundy Thursday. */
export const DAYS_BEFORE_EASTER_MAUNDY_THURSDAY = 3;

/** Days before Easter Sunday: Good Friday. */
export const DAYS_BEFORE_EASTER_GOOD_FRIDAY = 2;

/** Days after Easter Sunday: Ascension Day. */
export const DAYS_AFTER_EASTER_ASCENSION = 39;

/** Days after Easter Sunday: Day of Pentecost. */
export const DAYS_AFTER_EASTER_PENTECOST = 49;

/** Days after Trinity Sunday: Corpus Christi. */
export const DAYS_AFTER_TRINITY_CORPUS_CHRISTI = 4;

/** Common Worship Sunday lectionary cycle (Year A / B / C), indexed by `churchYear % 3`. */
export const SUNDAY_LECTIONARY_LETTERS = ["C", "A", "B"] as const;

/** Supported event source types in the Common Worship calendar. */
export const LITURGICAL_EVENT_TYPES = {
  FIXED: "fixed",
  MOVEABLE: "moveable",
} as const;

/** Liturgical colors used across seasons and observances. */
export const LITURGICAL_COLORS = {
  WHITE: "white",
  RED: "red",
  PURPLE: "purple",
  GREEN: "green",
  ROSE: "rose",
  GOLD: "gold",
  BLACK: "black",
} as const;

/** Named liturgical seasons in the Church of England calendar. */
export const LITURGICAL_SEASONS = {
  ADVENT: "advent",
  CHRISTMAS: "christmas",
  EPIPHANY: "epiphany",
  LENT: "lent",
  EASTER: "easter",
  ORDINARY_TIME: "ordinary_time",
  PRE_ADVENT: "pre_advent",
} as const;

/** Numeric precedence ordering for resolving liturgical conflicts. */
export const LITURGICAL_RANK = {
  principal_feast: 0,
  principal_holy_day: 0,
  festival: 1,
  lesser_festival: 2,
  commemoration: 3,
  sunday: 4,
  sunday_series: 4,
  special_observance: 5,
  special_observance_series: 5,
  weekday: 6,
} as const;

/** Convenience list of liturgical rank names. */
export const LITURGICAL_RANK_NAMES = Object.keys(LITURGICAL_RANK) as Array<
  keyof typeof LITURGICAL_RANK
>;
