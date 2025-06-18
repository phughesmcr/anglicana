import CalendarData from "./common_worship_fixed_calendar.json" with { type: "json" };

//#region Types

/**
 * Represents the types of events in the Common Worship calendar.
 * @property {string} F - Festival
 * @property {string} C - Commemoration
 * @property {string} L - Lesser Festival
 * @property {string} P - Principle Feast or Holy Day
 */
export type EventType = "F" | "C" | "L" | "P";

/**
 * Represents the liturgical seasons in the Common Worship calendar.
 * @property {string} A - Advent
 * @property {string} C - Christmas
 * @property {string} I - Epiphany
 * @property {string} O - Ordinary Time
 * @property {string} L - Lent
 * @property {string} E - Eastertide
 * @property {string} H - Holy Week
 * @property {string} T - Triduum
 * @property {string} P - Pentecost
 * @property {string} G - Creationtide
 */
export type EventSeason = "A" | "C" | "I" | "O" | "L" | "E" | "H" | "T" | "P" | "G";

/**
 * Represents the observed date of an event in the Common Worship calendar.
 * @property {number} isoDay - The day of the month (1-31)
 * @property {number} isoMonth - The month of the year (1-12)
 * @property {Object|null} alt - Alternative date, if applicable
 * @property {number} alt.isoDay - The alternative day of the month (1-31)
 * @property {number} alt.isoMonth - The alternative month of the year (1-12)
 */
export type ObservedDate = {
  isoDay: number;
  isoMonth: number;
  alt: {
    isoDay: number;
    isoMonth: number;
  } | null;
};

/**
 * Represents an individual event in the Common Worship calendar.
 * @property {number|null} group - The ID of the group this event belongs to, if any
 * @property {number} id - Unique identifier for the event
 * @property {ObservedDate} observed - The date on which this event is observed
 * @property {string} title - The name or title of the event
 * @property {EventType} type - The type of the event (Festival, Commemoration, etc.)
 */
export type Event = {
  group: number | null;
  id: number;
  observed: ObservedDate;
  title: string;
  type: EventType;
};

/**
 * Represents a group of related events in the Common Worship calendar.
 * @property {number} id - Unique identifier for the group
 * @property {string} title - The name or title of the group
 * @property {number[]} events - Array of event IDs belonging to this group
 */
export type EventGroup = {
  id: number;
  title: string;
  events: number[];
};

/** The parsed Common Worship Fixed Calendar data. */
export type ParsedCalendar = {
  version: string;
  __comments__: {
    description: string;
    source: string;
    warning: string;
  };
  types: Record<EventType, string>;
  seasons: Record<EventSeason, string>;
  groups: EventGroup[];
  events: Event[];
};

//#endregion Types

/** The parsed Common Worship Fixed Calendar data. */
export const commonWorshipFixedCalendar = CalendarData as ParsedCalendar;
