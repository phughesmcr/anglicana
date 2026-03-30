/**
 * Stable numeric ids from Common Worship calendar JSON. Names may change; ids are the code discriminator.
 * @module
 */

/** `eventType` + `id` disambiguates overlapping id ranges between fixed and moveable data. */
export type CalendarEventSource = {
  eventType: "fixed" | "moveable";
  id: number;
};

/** Composite key for Sets/Maps: `"fixed:61"` / `"moveable:8"`. */
export function calendarEventSourceKey(event: CalendarEventSource): string {
  return `${event.eventType}:${event.id}`;
}

// --- fixed_calendar.json ---

/** The Epiphany. Must match fixed_calendar.json. */
export const FIXED_EPIPHANY = 5;
/** Candlemas. Must match fixed_calendar.json. */
export const FIXED_PRESENTATION = 35;
/** The Blessed Virgin Mary (Assumption). Must match fixed_calendar.json. */
export const FIXED_BLESSED_VIRGIN_MARY = 156;
/** All Saints' Day. Must match fixed_calendar.json. */
export const FIXED_ALL_SAINTS = 213;
/** Joseph of Nazareth. Must match fixed_calendar.json. */
export const FIXED_JOSEPH_OF_NAZARETH = 55;
/** The Annunciation. Must match fixed_calendar.json. */
export const FIXED_ANNUNCIATION = 61;
/** George, Patron of England. Must match fixed_calendar.json. */
export const FIXED_GEORGE_ENGLAND = 72;
/** Mark the Evangelist. Must match fixed_calendar.json. */
export const FIXED_MARK_EVANGELIST = 75;
/** All Souls' Day. Must match fixed_calendar.json. */
export const FIXED_ALL_SOULS = 214;
/** Richard Hooker. Must match fixed_calendar.json. */
export const FIXED_RICHARD_HOOKER = 215;
/** The Holy Innocents. Must match fixed_calendar.json. */
export const FIXED_HOLY_INNOCENTS = 262;

// --- moveable_calendar.json ---

/** Easter Day. Must match moveable_calendar.json. */
export const MOVEABLE_EASTER_DAY = 1;
/** First Sunday of Advent. Must match moveable_calendar.json. */
export const MOVEABLE_FIRST_SUNDAY_OF_ADVENT = 11;
/** Second Sunday of Advent. Must match moveable_calendar.json. */
export const MOVEABLE_SECOND_SUNDAY_OF_ADVENT = 12;
/** Third Sunday of Advent. Must match moveable_calendar.json. */
export const MOVEABLE_THIRD_SUNDAY_OF_ADVENT = 13;
/** Fourth Sunday of Advent. Must match moveable_calendar.json. */
export const MOVEABLE_FOURTH_SUNDAY_OF_ADVENT = 14;
/** The Baptism of Christ. Must match moveable_calendar.json. */
export const MOVEABLE_BAPTISM_OF_CHRIST = 8;
/** Christ the King. Must match moveable_calendar.json. */
export const MOVEABLE_CHRIST_THE_KING = 9;
/** Corpus Christi. Must match moveable_calendar.json. */
export const MOVEABLE_CORPUS_CHRISTI = 10;
/** Sundays after Trinity (series template row). Must match moveable_calendar.json. */
export const MOVEABLE_SUNDAYS_AFTER_TRINITY = 38;

/** Festivals exempt from Sunday / Easter-week transfer nudges in conflict resolution. */
export const TRANSFER_EXEMPT_FESTIVAL_KEYS = new Set<string>([
  calendarEventSourceKey({ eventType: "moveable", id: MOVEABLE_BAPTISM_OF_CHRIST }),
  calendarEventSourceKey({ eventType: "moveable", id: MOVEABLE_CHRIST_THE_KING }),
]);

/** Tie-break precedence when date and rank collide (`calendarEventSourceKey` values). */
export const PRIORITY_EVENT_KEYS = new Set<string>([
  calendarEventSourceKey({ eventType: "fixed", id: FIXED_ANNUNCIATION }),
  calendarEventSourceKey({ eventType: "moveable", id: MOVEABLE_CORPUS_CHRISTI }),
]);
