import type { LiturgicalRank } from "../types.ts";
import Events from "./fixed_calendar.json" with { type: "json" };
import Groups from "./groups.json" with { type: "json" };
import MoveableEvents from "./moveable_calendar.json" with { type: "json" };

/**
 * Represents an individual event in the Common Worship calendar.
 */
export type FixedEvent = {
  /** The unique identifier for the event */
  id: number;
  /** The name or title of the event */
  name: string;
  /** The type of the event (Festival, Commemoration, etc.) */
  type: LiturgicalRank;
  /** The date on which this event is observed */
  date: [MM: number, DD: number];
  /** The alternative date on which this event is observed */
  alt?: [MM: number, DD: number];
  /** The ID of the group this event belongs to, if any */
  group?: number;
  /** The rules for the event */
  rules?: {
    rule: "may_transfer" | "must_transfer" | "cannot_transfer";
    conditions?: string[];
    transferTo?: string;
  }[];
  /** Whether this observance is optional rather than universally required. */
  optional?: boolean;
};

/** Fixed calendar event normalized to a specific year. */
export type FixedEventResult = Pick<FixedEvent, "id" | "name" | "type" | "group" | "rules"> & {
  /** Whether this event is fixed */
  fixed: true;
  /** The date of the event */
  date: Temporal.PlainDate;
  /** The alternative date of the event */
  alt?: Temporal.PlainDate;
  /** Whether this observance is optional rather than universally required. */
  optional?: boolean;
};

/** Raw fixed calendar events from data. */
export const EVENTS = Events as FixedEvent[];

/** Build fixed events for a given calendar year. */
export function getFixedEvents(year: number): FixedEventResult[] {
  return EVENTS.map((event) => {
    return {
      ...event,
      date: new Temporal.PlainDate(year, event.date[0], event.date[1]),
      alt: event.alt ? new Temporal.PlainDate(year, event.alt[0], event.alt[1]) : undefined,
      fixed: true,
    } satisfies FixedEventResult;
  }).sort((a, b) => {
    return Temporal.PlainDate.compare(a.date, b.date);
  });
}

/**
 * Represents a group of related events in the Common Worship calendar.
 */
export type EventGroup = {
  /** The ID of the group */
  id: number;
  /** The name or title of the group */
  title: string;
  /** The events belonging to this group */
  events: number[];
};

/** Raw event groups from data. */
export const EVENT_GROUPS = Groups as EventGroup[];

/** Resolve the group definition for a fixed event, if present. */
export function getGroupFromEvent(event: FixedEvent): EventGroup | undefined {
  return EVENT_GROUPS.find((group) => event.group === group.id);
}

/** Definition for a moveable Common Worship event. */
export type MoveableEvent = {
  id: number;
  name: string;
  type: LiturgicalRank | "sunday_series" | "special_observance_series";
  relative_to: string;
  offset_days: number;
  rules: {
    rule: "may_transfer" | "must_transfer" | "cannot_transfer" | "bishops_direction";
    conditions?: string[];
    transferTo?: string;
  }[];
  description?: string;
  optional?: boolean;
};

/** Raw moveable events from data. */
export const MOVEABLE_EVENTS = MoveableEvents as MoveableEvent[];
