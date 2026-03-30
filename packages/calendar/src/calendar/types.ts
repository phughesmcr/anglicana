/**
 * @description Types for Common Worship liturgical calendar generation
 * @author P. Hughes <github@phugh.es> (www.phugh.es)
 * @license MIT
 * @module
 */

import type { DateInput, EasterOptions, LiturgicalRank } from "../types.ts";

/**
 * When Common Worship’s 23-Sunday-after-Trinity case applies, which Holy Communion proper
 * (Collect and Post Communion) goes with that Sunday — see Rules to Order the Christian Year.
 * @see {@link https://www.churchofengland.org/prayer-and-worship/worship-texts-and-resources/common-worship/churchs-year/rules}
 */
export type EucharisticProperAs = "last_sunday_after_trinity" | "third_sunday_before_lent";

/**
 * Unified calendar event type that combines fixed and moveable events
 */
export interface CalendarEvent {
  /** Unique identifier for the event */
  id: number;
  /** Name of the event */
  name: string;
  /** Type/rank of the event */
  type: LiturgicalRank;
  /** The calculated date of the event */
  date: Temporal.PlainDate;
  /** Whether this is a fixed or moveable event */
  eventType: "fixed" | "moveable";
  /** Transfer rules for the event */
  rules?: {
    rule: "may_transfer" | "must_transfer" | "cannot_transfer" | "bishops_direction";
    conditions?: string[];
    transferTo?: string;
  }[];
  /** Optional description */
  description?: string;
  /** Original date before any transfers (for fixed events) */
  originalDate?: Temporal.PlainDate;
  /** Reference information for moveable events */
  relativeTo?: string;
  /** Offset days for moveable events */
  offsetDays?: number;
  /** Local celebration classification */
  localType?: "patronal" | "dedication" | "harvest";
  /** Whether this observance is optional rather than universally required. */
  optional?: boolean;
  /** Principal vs optional secondary observance of the same feast (e.g. All Saints on 1 November when also kept on Sunday) */
  observance?: "principal" | "secondary";
  /**
   * Holy Communion proper substitution for this Sunday when the 22nd/23rd-after-Trinity rule applies.
   */
  eucharisticProperAs?: EucharisticProperAs;
}

/** Input shape for a locally-added calendar event. */
export interface LocalEventInput {
  /** Optional unique identifier */
  id?: number;
  /** Name of the event */
  name: string;
  /** Type/rank of the event */
  type: LiturgicalRank;
  /** Date of the local celebration */
  date: DateInput;
  /** Local celebration classification */
  localType?: "patronal" | "dedication" | "harvest";
  /** Transfer rules for the event */
  rules?: CalendarEvent["rules"];
  /** Optional description */
  description?: string;
}

/**
 * Options for calendar generation
 */
export interface CalendarOptions {
  /** Easter calculation options */
  easterOptions?: EasterOptions;
  /**
   * `"canonical"` (default): strict calendar dates for optional transfers — Epiphany 6 January, Presentation 2 February,
   * All Saints 1 November, BVM 15 August — unless you set the individual `transfer*` flags. Required transfers (e.g. Annunciation) still apply.
   * `"pastoral"`: Common Worship parish defaults — optional Sunday transfers and BVM to 8 September on, plus other discretionary transfers.
   */
  canonicalMode?: "canonical" | "pastoral";
  /** Whether to transfer Epiphany to the Sunday between 2 and 8 January (Common Worship may-transfer) */
  transferEpiphanyToSunday?: boolean;
  /** Whether to transfer Candlemas (Presentation) to Sunday */
  transferPresentationToSunday?: boolean;
  /** Whether to transfer All Saints' Day to Sunday */
  transferAllSaintsToSunday?: boolean;
  /** Whether to transfer the Blessed Virgin Mary festival to 8 September */
  transferBlessedVirginMaryToSeptember?: boolean;
  /** Whether to transfer festivals on ordinary Sundays to Monday */
  transferFestivalsOnOrdinarySundays?: boolean;
  /** Whether to transfer blocked lesser festivals to the next available day */
  transferLesserFestivalsWhenBlocked?: boolean;
  /** Whether to transfer local principal feasts to the nearest Sunday */
  transferLocalPrincipalToNearestSunday?: boolean;
  /** Whether to include commemorations */
  includeCommemorationsAndLesserFestivals?: boolean;
  /** Additional local celebrations */
  localEvents?: LocalEventInput[];
  /**
   * When All Saints is transferred to the Sunday between 30 October and 5 November, also emit a secondary
   * principal feast on 1 November (Common Worship permits this).
   */
  includeAllSaintsSecondaryOnNovember1?: boolean;
  /**
   * Apply the Rules’ BCP harmonisation for St George and St Mark when both are transferred after Easter:
   * St Mark is kept on the day immediately following St George’s transferred date so it aligns with
   * Common Worship practice (second available day).
   * @see {@link https://www.churchofengland.org/prayer-and-worship/worship-texts-and-resources/common-worship/churchs-year/rules}
   */
  bcpGeorgeMarkTransferHarmonisation?: boolean;
}
