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
