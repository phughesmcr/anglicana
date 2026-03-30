import {
  calendarEventSourceKey,
  FIXED_ALL_SAINTS,
  FIXED_ALL_SOULS,
  FIXED_ANNUNCIATION,
  FIXED_BLESSED_VIRGIN_MARY,
  FIXED_EPIPHANY,
  FIXED_GEORGE_ENGLAND,
  FIXED_HOLY_INNOCENTS,
  FIXED_JOSEPH_OF_NAZARETH,
  FIXED_MARK_EVANGELIST,
  FIXED_PRESENTATION,
  FIXED_RICHARD_HOOKER,
  MOVEABLE_BAPTISM_OF_CHRIST,
  MOVEABLE_CHRIST_THE_KING,
  MOVEABLE_CORPUS_CHRISTI,
  MOVEABLE_EASTER_DAY,
  MOVEABLE_FIRST_SUNDAY_OF_ADVENT,
  MOVEABLE_FOURTH_SUNDAY_OF_ADVENT,
  MOVEABLE_SECOND_SUNDAY_OF_ADVENT,
  MOVEABLE_SUNDAYS_AFTER_TRINITY,
  MOVEABLE_THIRD_SUNDAY_OF_ADVENT,
  PRIORITY_EVENT_KEYS,
  TRANSFER_EXEMPT_FESTIVAL_KEYS,
} from "@/calendar/calendar/identity.ts";
import { EVENTS, MOVEABLE_EVENTS } from "@/calendar/data/mod.ts";
import { assertEquals } from "@std/assert";

function fixedName(id: number): string {
  const row = EVENTS.find((e) => e.id === id);
  if (!row) throw new Error(`fixed_calendar.json: missing id ${id}`);
  return row.name;
}

function moveableName(id: number): string {
  const row = MOVEABLE_EVENTS.find((e) => e.id === id);
  if (!row) throw new Error(`moveable_calendar.json: missing id ${id}`);
  return row.name;
}

Deno.test("calendar_identity constants match fixed_calendar.json", () => {
  assertEquals(fixedName(FIXED_EPIPHANY), "The Epiphany");
  assertEquals(fixedName(FIXED_PRESENTATION), "The Presentation of Christ in the Temple (Candlemas)");
  assertEquals(fixedName(FIXED_BLESSED_VIRGIN_MARY), "The Blessed Virgin Mary");
  assertEquals(fixedName(FIXED_ALL_SAINTS), "All Saints’ Day");
  assertEquals(fixedName(FIXED_JOSEPH_OF_NAZARETH), "Joseph of Nazareth");
  assertEquals(
    fixedName(FIXED_ANNUNCIATION),
    "The Annunciation of Our Lord to the Blessed Virgin Mary",
  );
  assertEquals(fixedName(FIXED_GEORGE_ENGLAND), "George, Martyr, Patron of England, c.304");
  assertEquals(fixedName(FIXED_MARK_EVANGELIST), "Mark the Evangelist");
  assertEquals(
    fixedName(FIXED_ALL_SOULS),
    "Commemoration of the Faithful Departed (All Souls’ Day)",
  );
  assertEquals(
    fixedName(FIXED_RICHARD_HOOKER),
    "Richard Hooker, Priest, Anglican Apologist, Teacher of the Faith, 1600",
  );
  assertEquals(fixedName(FIXED_HOLY_INNOCENTS), "The Holy Innocents");
});

Deno.test("calendar_identity constants match moveable_calendar.json", () => {
  assertEquals(moveableName(MOVEABLE_EASTER_DAY), "Easter Day");
  assertEquals(moveableName(MOVEABLE_FIRST_SUNDAY_OF_ADVENT), "First Sunday of Advent");
  assertEquals(moveableName(MOVEABLE_SECOND_SUNDAY_OF_ADVENT), "Second Sunday of Advent");
  assertEquals(moveableName(MOVEABLE_THIRD_SUNDAY_OF_ADVENT), "Third Sunday of Advent");
  assertEquals(moveableName(MOVEABLE_FOURTH_SUNDAY_OF_ADVENT), "Fourth Sunday of Advent");
  assertEquals(moveableName(MOVEABLE_BAPTISM_OF_CHRIST), "The Baptism of Christ");
  assertEquals(moveableName(MOVEABLE_CHRIST_THE_KING), "Christ the King");
  assertEquals(
    moveableName(MOVEABLE_CORPUS_CHRISTI),
    "Day of Thanksgiving for Holy Communion (Corpus Christi)",
  );
  assertEquals(moveableName(MOVEABLE_SUNDAYS_AFTER_TRINITY), "Sundays after Trinity");
});

Deno.test("calendarEventSourceKey and transfer sets", () => {
  assertEquals(
    calendarEventSourceKey({ eventType: "fixed", id: FIXED_ANNUNCIATION }),
    `fixed:${FIXED_ANNUNCIATION}`,
  );
  assertEquals(
    TRANSFER_EXEMPT_FESTIVAL_KEYS.has(
      calendarEventSourceKey({ eventType: "moveable", id: MOVEABLE_BAPTISM_OF_CHRIST }),
    ),
    true,
  );
  assertEquals(
    TRANSFER_EXEMPT_FESTIVAL_KEYS.has(
      calendarEventSourceKey({ eventType: "moveable", id: MOVEABLE_CHRIST_THE_KING }),
    ),
    true,
  );
  assertEquals(
    PRIORITY_EVENT_KEYS.has(calendarEventSourceKey({ eventType: "fixed", id: FIXED_ANNUNCIATION })),
    true,
  );
  assertEquals(
    PRIORITY_EVENT_KEYS.has(
      calendarEventSourceKey({ eventType: "moveable", id: MOVEABLE_CORPUS_CHRISTI }),
    ),
    true,
  );
});
