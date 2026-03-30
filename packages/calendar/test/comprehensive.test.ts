import { assert, assertEquals, assertExists } from "@std/assert";

import {
  generateLiturgicalCalendar,
  getAscensionDay,
  getChristTheKing,
  getCorpusChristi,
  getDayOfPentecost,
  getEasterSunday,
  getEventsForDate,
  getFirstSundayOfAdvent,
  getGoodFriday,
  getHolyWeek,
  getLiturgicalYearRange,
  getMaundyThursday,
  getNovena,
  getPalmSunday,
  getRogationDays,
  getTheBaptismOfChrist,
  getTrinitySunday,
} from "../mod.ts";

/**
 * Comprehensive tests for production-readiness
 * Covers missing function tests, edge cases, and integration scenarios
 */

// =============================================================================
// MISSING FUNCTION TESTS
// =============================================================================

Deno.test("getLiturgicalYearRange function", async (t) => {
  await t.step("returns correct date range for church year", () => {
    const range2025 = getLiturgicalYearRange(2025);

    // Church year 2025 starts on Advent Sunday 2024
    assertEquals(range2025.start.toString(), "2024-12-01");
    // Ends the day before Advent Sunday 2025
    assertEquals(range2025.end.toString(), "2025-11-29");
  });

  await t.step("start is always a Sunday", () => {
    for (let year = 2020; year <= 2030; year++) {
      const range = getLiturgicalYearRange(year);
      assertEquals(range.start.dayOfWeek, 7, `Start of ${year} should be Sunday`);
    }
  });

  await t.step("end is always a Saturday", () => {
    for (let year = 2020; year <= 2030; year++) {
      const range = getLiturgicalYearRange(year);
      assertEquals(range.end.dayOfWeek, 6, `End of ${year} should be Saturday`);
    }
  });

  await t.step("range spans approximately 52-53 weeks", () => {
    for (let year = 2020; year <= 2030; year++) {
      const range = getLiturgicalYearRange(year);
      const days = range.start.until(range.end, { largestUnit: "days" }).days + 1;
      assert(days >= 364 && days <= 371, `Year ${year} should span 364-371 days, got ${days}`);
    }
  });
});

Deno.test("getHolyWeek function", async (t) => {
  await t.step("returns 7 days", () => {
    const holyWeek = getHolyWeek(2025);
    assertEquals(holyWeek.length, 7);
  });

  await t.step("starts on Palm Sunday", () => {
    const holyWeek = getHolyWeek(2025);
    const palmSunday = getPalmSunday(2025);
    assertEquals(holyWeek[0].toString(), palmSunday.toString());
    assertEquals(holyWeek[0].dayOfWeek, 7, "Should start on Sunday");
  });

  await t.step("ends on Holy Saturday (day before Easter)", () => {
    const holyWeek = getHolyWeek(2025);
    const easter = getEasterSunday(2025);
    const holySaturday = easter.subtract({ days: 1 });
    assertEquals(holyWeek[6].toString(), holySaturday.toString());
    assertEquals(holyWeek[6].dayOfWeek, 6, "Should end on Saturday");
  });

  await t.step("includes Maundy Thursday and Good Friday", () => {
    const holyWeek = getHolyWeek(2025);
    const maundyThursday = getMaundyThursday(2025);
    const goodFriday = getGoodFriday(2025);

    assert(holyWeek.some((d) => d.toString() === maundyThursday.toString()));
    assert(holyWeek.some((d) => d.toString() === goodFriday.toString()));
  });

  await t.step("days are consecutive", () => {
    const holyWeek = getHolyWeek(2025);
    for (let i = 1; i < holyWeek.length; i++) {
      const diff = holyWeek[i - 1].until(holyWeek[i], { largestUnit: "days" }).days;
      assertEquals(diff, 1, "Days should be consecutive");
    }
  });
});

Deno.test("getRogationDays function", async (t) => {
  await t.step("returns 3 days", () => {
    const rogationDays = getRogationDays(2025);
    assertEquals(rogationDays.length, 3);
  });

  await t.step("falls on Monday, Tuesday, Wednesday before Ascension", () => {
    const rogationDays = getRogationDays(2025);
    const ascension = getAscensionDay(2025);

    // Rogation days are Mon, Tue, Wed before Ascension Thursday
    assertEquals(rogationDays[0].dayOfWeek, 1, "First should be Monday");
    assertEquals(rogationDays[1].dayOfWeek, 2, "Second should be Tuesday");
    assertEquals(rogationDays[2].dayOfWeek, 3, "Third should be Wednesday");

    // Wednesday should be day before Ascension
    const dayBeforeAscension = ascension.subtract({ days: 1 });
    assertEquals(rogationDays[2].toString(), dayBeforeAscension.toString());
  });

  await t.step("days are consecutive", () => {
    const rogationDays = getRogationDays(2025);
    for (let i = 1; i < rogationDays.length; i++) {
      const diff = rogationDays[i - 1].until(rogationDays[i], { largestUnit: "days" }).days;
      assertEquals(diff, 1, "Days should be consecutive");
    }
  });
});

Deno.test("getNovena function", async (t) => {
  await t.step("returns 9 days", () => {
    const novena = getNovena(2025);
    assertEquals(novena.length, 9);
  });

  await t.step("starts day after Ascension", () => {
    const novena = getNovena(2025);
    const ascension = getAscensionDay(2025);
    const dayAfterAscension = ascension.add({ days: 1 });
    assertEquals(novena[0].toString(), dayAfterAscension.toString());
  });

  await t.step("ends day before Pentecost", () => {
    const novena = getNovena(2025);
    const pentecost = getDayOfPentecost(2025);
    const dayBeforePentecost = pentecost.subtract({ days: 1 });
    assertEquals(novena[8].toString(), dayBeforePentecost.toString());
  });

  await t.step("days are consecutive", () => {
    const novena = getNovena(2025);
    for (let i = 1; i < novena.length; i++) {
      const diff = novena[i - 1].until(novena[i], { largestUnit: "days" }).days;
      assertEquals(diff, 1, "Days should be consecutive");
    }
  });
});

Deno.test("getChristTheKing function", async (t) => {
  await t.step("falls on Sunday before Advent", () => {
    for (let year = 2020; year <= 2030; year++) {
      const christTheKing = getChristTheKing(year);
      assertEquals(christTheKing.dayOfWeek, 7, `Christ the King ${year} should be Sunday`);
    }
  });

  await t.step("is exactly one week before First Sunday of Advent", () => {
    for (let year = 2020; year <= 2030; year++) {
      const christTheKing = getChristTheKing(year);
      const advent = getFirstSundayOfAdvent(year);
      const diff = christTheKing.until(advent, { largestUnit: "weeks" }).weeks;
      assertEquals(diff, 1, `Christ the King should be 1 week before Advent in ${year}`);
    }
  });

  await t.step("returns correct dates for known years", () => {
    assertEquals(getChristTheKing(2025).toString(), "2025-11-23");
    assertEquals(getChristTheKing(2024).toString(), "2024-11-24");
    assertEquals(getChristTheKing(2026).toString(), "2026-11-22");
  });
});

Deno.test("getEventsForDate function", async (t) => {
  await t.step("returns events for Christmas Day", () => {
    // Christmas 2025 is in liturgical year 2025 (Advent 2025 to Advent 2026)
    const events = getEventsForDate("2025-12-25", 2025);
    assert(events.length > 0, "Should have events on Christmas");
    assert(events.some((e) => e.name === "Christmas Day"));
  });

  await t.step("returns events for Easter Sunday", () => {
    // Easter 2026 is in liturgical year 2025 (Advent 2025 to Advent 2026)
    const easter = getEasterSunday(2026);
    const events = getEventsForDate(easter, 2025);
    assert(events.length > 0, "Should have events on Easter");
    assert(events.some((e) => e.name === "Easter Day"));
  });

  await t.step("returns empty array for date outside liturgical year", () => {
    // Date before liturgical year 2025 starts (Nov 30, 2025)
    const events = getEventsForDate("2025-11-01", 2025);
    assertEquals(events.length, 0);
  });

  await t.step("handles multiple events on same date", () => {
    // Find a date with multiple events
    const calendar = generateLiturgicalCalendar(2025);
    const dateMap = new Map<string, number>();
    calendar.forEach((e) => {
      const key = e.date.toString();
      dateMap.set(key, (dateMap.get(key) || 0) + 1);
    });

    // Find a date with multiple events
    for (const [dateStr, count] of dateMap) {
      if (count > 1) {
        const events = getEventsForDate(dateStr, 2025);
        assertEquals(events.length, count);
        break;
      }
    }
  });
});

// =============================================================================
// MOVEABLE FESTIVAL TESTS
// =============================================================================

Deno.test("Moveable festivals calculated correctly", async (t) => {
  await t.step("Ascension is always on Thursday, 39 days after Easter", () => {
    for (let year = 2020; year <= 2030; year++) {
      const ascension = getAscensionDay(year);
      const easter = getEasterSunday(year);
      assertEquals(ascension.dayOfWeek, 4, `Ascension ${year} should be Thursday`);
      const diff = easter.until(ascension, { largestUnit: "days" }).days;
      assertEquals(diff, 39, `Ascension should be 39 days after Easter in ${year}`);
    }
  });

  await t.step("Pentecost is always on Sunday, 49 days after Easter", () => {
    for (let year = 2020; year <= 2030; year++) {
      const pentecost = getDayOfPentecost(year);
      const easter = getEasterSunday(year);
      assertEquals(pentecost.dayOfWeek, 7, `Pentecost ${year} should be Sunday`);
      const diff = easter.until(pentecost, { largestUnit: "days" }).days;
      assertEquals(diff, 49, `Pentecost should be 49 days after Easter in ${year}`);
    }
  });

  await t.step("Trinity Sunday is always on Sunday, week after Pentecost", () => {
    for (let year = 2020; year <= 2030; year++) {
      const trinity = getTrinitySunday(year);
      const pentecost = getDayOfPentecost(year);
      assertEquals(trinity.dayOfWeek, 7, `Trinity ${year} should be Sunday`);
      const diff = pentecost.until(trinity, { largestUnit: "weeks" }).weeks;
      assertEquals(diff, 1, `Trinity should be 1 week after Pentecost in ${year}`);
    }
  });

  await t.step("Corpus Christi is Thursday after Trinity Sunday", () => {
    for (let year = 2020; year <= 2030; year++) {
      const corpus = getCorpusChristi(year);
      const trinity = getTrinitySunday(year);
      assertEquals(corpus.dayOfWeek, 4, `Corpus Christi ${year} should be Thursday`);
      const diff = trinity.until(corpus, { largestUnit: "days" }).days;
      assertEquals(diff, 4, `Corpus Christi should be 4 days after Trinity in ${year}`);
    }
  });

  await t.step("Baptism of Christ is Sunday after Epiphany (or week after if transferred)", () => {
    const baptism2025 = getTheBaptismOfChrist(2025, false);
    assertEquals(baptism2025.dayOfWeek, 7, "Should be Sunday");
    // 2025: Epiphany is Monday Jan 6, so Baptism is Jan 12
    assertEquals(baptism2025.toString(), "2025-01-12");

    const baptism2025Transferred = getTheBaptismOfChrist(2025, true);
    assertEquals(baptism2025Transferred.dayOfWeek, 7, "Should be Sunday");
    // When Epiphany transferred to Sunday (Jan 5), Baptism is Jan 12
    assertEquals(baptism2025Transferred.toString(), "2025-01-12");
  });
});

// =============================================================================
// LOCAL EVENTS TESTS
// =============================================================================

Deno.test("Local events integration", async (t) => {
  // Note: Liturgical year 2025 runs from Advent Sunday 2025 (Nov 30, 2025)
  // to just before Advent Sunday 2026. Local event dates must be within this range.

  await t.step("adds patronal feast to calendar", () => {
    // Use a date within liturgical year 2025 (after Nov 30, 2025)
    const calendar = generateLiturgicalCalendar(2025, {
      localEvents: [
        { name: "St Mary's Patronal Festival", type: "principal_feast", date: "2026-07-15", localType: "patronal" },
      ],
    });

    const patronal = calendar.find((e) => e.name === "St Mary's Patronal Festival");
    assertExists(patronal);
    assertEquals(patronal.date.toString(), "2026-07-15");
    assertEquals(patronal.localType, "patronal");
  });

  await t.step("adds dedication festival to calendar", () => {
    const calendar = generateLiturgicalCalendar(2025, {
      localEvents: [
        { name: "Dedication Festival", type: "festival", date: "2026-09-21", localType: "dedication" },
      ],
    });

    const dedication = calendar.find((e) => e.name === "Dedication Festival");
    assertExists(dedication);
    assertEquals(dedication.localType, "dedication");
  });

  await t.step("adds harvest thanksgiving to calendar", () => {
    const calendar = generateLiturgicalCalendar(2025, {
      localEvents: [
        { name: "Harvest Thanksgiving", type: "special_observance", date: "2026-10-05", localType: "harvest" },
      ],
    });

    const harvest = calendar.find((e) => e.name === "Harvest Thanksgiving");
    assertExists(harvest);
    assertEquals(harvest.localType, "harvest");
  });

  await t.step("transfers local principal feast to Sunday when option enabled", () => {
    // July 15, 2026 is Wednesday
    const calendar = generateLiturgicalCalendar(2025, {
      localEvents: [
        { name: "Patronal Festival", type: "principal_feast", date: "2026-07-15", localType: "patronal" },
      ],
      transferLocalPrincipalToNearestSunday: true,
    });

    const patronal = calendar.find((e) => e.name === "Patronal Festival");
    assertExists(patronal);
    assertEquals(patronal.date.dayOfWeek, 7, "Should be transferred to Sunday");
  });

  await t.step("local event outside liturgical year is excluded", () => {
    // Nov 1, 2025 is BEFORE Advent Sunday 2025 (Nov 30), so excluded from year 2025
    const calendar = generateLiturgicalCalendar(2025, {
      localEvents: [
        { name: "Test Event", type: "festival", date: "2025-11-01", localType: "patronal" },
      ],
    });

    const testEvent = calendar.find((e) => e.name === "Test Event");
    assertEquals(testEvent, undefined, "Event before Advent should be excluded");
  });
});

// =============================================================================
// MULTI-YEAR CALENDAR VALIDATION
// =============================================================================

Deno.test("Multi-year calendar validation", async (t) => {
  await t.step("generates valid calendar for years 2020-2035", () => {
    for (let year = 2020; year <= 2035; year++) {
      const calendar = generateLiturgicalCalendar(year);
      assert(calendar.length > 0, `Calendar ${year} should have events`);

      // Should have Christmas
      assert(calendar.some((e) => e.name === "Christmas Day"), `${year} should have Christmas`);

      // Should have Easter
      assert(calendar.some((e) => e.name === "Easter Day"), `${year} should have Easter`);

      // Should have Advent Sundays
      assert(calendar.some((e) => e.name === "First Sunday of Advent"), `${year} should have First Sunday of Advent`);
    }
  });

  await t.step("all events fall within liturgical year bounds", () => {
    for (let year = 2020; year <= 2030; year++) {
      const calendar = generateLiturgicalCalendar(year);
      // Liturgical year N runs from Advent Sunday of year N to day before Advent Sunday of year N+1
      const adventStart = getFirstSundayOfAdvent(year);
      const adventEnd = getFirstSundayOfAdvent(year + 1);

      calendar.forEach((event) => {
        assert(
          Temporal.PlainDate.compare(event.date, adventStart) >= 0,
          `${event.name} (${event.date}) should be on or after ${adventStart} in ${year}`,
        );
        assert(
          Temporal.PlainDate.compare(event.date, adventEnd) < 0,
          `${event.name} (${event.date}) should be before ${adventEnd} in ${year}`,
        );
      });
    }
  });

  await t.step("events have IDs", () => {
    // Note: Some IDs may be duplicated due to series events (e.g., Sundays after Trinity)
    // This test just verifies all events have an ID
    for (let year = 2020; year <= 2030; year++) {
      const calendar = generateLiturgicalCalendar(year);
      calendar.forEach((event) => {
        assertExists(event.id, `Event ${event.name} should have an ID in ${year}`);
      });
    }
  });

  await t.step("calendar is sorted by date", () => {
    // Note: Events on the same date may be in any order
    for (let year = 2020; year <= 2030; year++) {
      const calendar = generateLiturgicalCalendar(year);
      for (let i = 1; i < calendar.length; i++) {
        const prevDate = calendar[i - 1].date;
        const currDate = calendar[i].date;
        // Allow equal dates (multiple events on same day)
        assert(
          Temporal.PlainDate.compare(prevDate, currDate) <= 0,
          `Calendar ${year} should be sorted: ${prevDate} <= ${currDate} (events: ${calendar[i - 1].name}, ${
            calendar[i].name
          })`,
        );
      }
    }
  });
});

// =============================================================================
// EDGE CASES AND TRANSFER RULES
// =============================================================================

Deno.test("Holy Innocents Sunday edge case", async (t) => {
  await t.step("may remain on Sunday when Dec 28 is the First or Second Sunday of Christmas", () => {
    // Find years where Dec 28 is Sunday
    for (let year = 2020; year <= 2040; year++) {
      const dec28 = new Temporal.PlainDate(year, 12, 28);
      if (dec28.dayOfWeek === 7) {
        // Dec 28 in year N is in liturgical year N (Advent N starts late Nov/early Dec of year N)
        const churchYear = year;
        const calendar = generateLiturgicalCalendar(churchYear, {
          canonicalMode: "pastoral",
          includeCommemorationsAndLesserFestivals: true,
        });
        const holyInnocents = calendar.find((e) => e.name === "The Holy Innocents");

        if (holyInnocents) {
          assertEquals(
            holyInnocents.date.toString(),
            dec28.toString(),
            `Holy Innocents may be kept on Sunday in ${year}`,
          );
        }
      }
    }
  });
});

Deno.test("George and Mark transfer during Easter Week", async (t) => {
  await t.step("George (Apr 23) transfers when in Holy Week or Easter Week", () => {
    // Find years where April 23 falls during Holy Week or Easter Week
    for (let year = 2020; year <= 2040; year++) {
      const easter = getEasterSunday(year);
      const palmSunday = getPalmSunday(year);
      const secondSundayOfEaster = easter.add({ weeks: 1 });
      const apr23 = new Temporal.PlainDate(year, 4, 23);

      if (
        Temporal.PlainDate.compare(apr23, palmSunday) >= 0 &&
        Temporal.PlainDate.compare(apr23, secondSundayOfEaster) <= 0
      ) {
        const calendar = generateLiturgicalCalendar(year);
        const george = calendar.find((e) => e.name.includes("George") && e.type === "festival");

        if (george) {
          // Should be transferred to after Second Sunday of Easter
          assert(
            Temporal.PlainDate.compare(george.date, secondSundayOfEaster) > 0,
            `George should transfer past Easter Week in ${year}`,
          );
        }
      }
    }
  });
});

Deno.test("Commemorations omitted on Sundays", async (t) => {
  await t.step("commemorations do not appear on Sundays", () => {
    const calendar = generateLiturgicalCalendar(2025, {
      includeCommemorationsAndLesserFestivals: true,
    });

    const commemorationsOnSunday = calendar.filter(
      (e) => e.type === "commemoration" && e.date.dayOfWeek === 7,
    );

    assertEquals(
      commemorationsOnSunday.length,
      0,
      `Found ${commemorationsOnSunday.length} commemorations on Sundays: ${
        commemorationsOnSunday.map((e) => `${e.name} on ${e.date}`).join(", ")
      }`,
    );
  });
});

Deno.test("BVM transfer option", async (t) => {
  await t.step("BVM stays on Aug 15 in canonical mode (no optional September transfer)", () => {
    const calendar = generateLiturgicalCalendar(2025, {
      canonicalMode: "canonical",
      includeCommemorationsAndLesserFestivals: false,
    });

    const bvm = calendar.find((e) => e.name === "The Blessed Virgin Mary");
    if (bvm) {
      assertEquals(bvm.date.month, 8, "BVM should be in August in canonical mode");
      assertEquals(bvm.date.day, 15, "BVM should be on 15th in canonical mode");
    }
  });

  await t.step("BVM can transfer to Sep 8", () => {
    const calendar = generateLiturgicalCalendar(2025, {
      transferBlessedVirginMaryToSeptember: true,
    });

    const bvm = calendar.find((e) => e.name === "The Blessed Virgin Mary");
    if (bvm) {
      assertEquals(bvm.date.month, 9, "BVM should be in September when transferred");
      assertEquals(bvm.date.day, 8, "BVM should be on 8th when transferred");
    }
  });
});

// =============================================================================
// EVENT CONFLICT RESOLUTION
// =============================================================================

Deno.test("Event conflict resolution", async (t) => {
  await t.step("principal feasts take precedence over lesser observances", () => {
    const calendar = generateLiturgicalCalendar(2025);

    // Find dates with multiple events
    const dateMap = new Map<string, typeof calendar>();
    calendar.forEach((e) => {
      const key = e.date.toString();
      if (!dateMap.has(key)) dateMap.set(key, []);
      dateMap.get(key)!.push(e);
    });

    // Check that principal feasts aren't displaced
    const principalFeasts = ["Christmas Day", "Easter Day", "The Epiphany"];
    principalFeasts.forEach((feastName) => {
      const feast = calendar.find((e) => e.name === feastName);
      if (feast) {
        const eventsOnDate = dateMap.get(feast.date.toString()) || [];
        // Principal feast should be present on its date
        assert(
          eventsOnDate.some((e) => e.name === feastName),
          `${feastName} should be on its date`,
        );
      }
    });
  });

  await t.step("Sundays are not displaced by lower-ranked events", () => {
    const calendar = generateLiturgicalCalendar(2025);

    // All Advent Sundays should be present
    const adventSundays = [
      "First Sunday of Advent",
      "Second Sunday of Advent",
      "Third Sunday of Advent",
      "Fourth Sunday of Advent",
    ];

    adventSundays.forEach((name) => {
      const sunday = calendar.find((e) => e.name === name);
      assertExists(sunday, `${name} should be in calendar`);
      assertEquals(sunday.date.dayOfWeek, 7, `${name} should be on Sunday`);
    });
  });
});

// =============================================================================
// INTEGRATION TESTS
// =============================================================================

Deno.test("Full calendar integration", async (t) => {
  await t.step("calendar contains expected minimum event count", () => {
    const calendar = generateLiturgicalCalendar(2025, {
      includeCommemorationsAndLesserFestivals: true,
    });

    // Should have a substantial number of events
    assert(calendar.length >= 200, `Expected 200+ events, got ${calendar.length}`);
  });

  await t.step("calendar without commemorations has fewer events", () => {
    const withCommem = generateLiturgicalCalendar(2025, {
      includeCommemorationsAndLesserFestivals: true,
    });
    const withoutCommem = generateLiturgicalCalendar(2025, {
      includeCommemorationsAndLesserFestivals: false,
    });

    assert(
      withoutCommem.length < withCommem.length,
      "Calendar without commemorations should have fewer events",
    );
  });

  await t.step("pastoral mode enables optional principal transfers versus canonical strict dates", () => {
    const canonical = generateLiturgicalCalendar(2025, {
      canonicalMode: "canonical",
      includeCommemorationsAndLesserFestivals: false,
    });
    const pastoral = generateLiturgicalCalendar(2025, {
      canonicalMode: "pastoral",
      includeCommemorationsAndLesserFestivals: false,
    });

    assert(canonical.length > 0);
    assert(pastoral.length > 0);

    const canonicalEpiphany = canonical.find((e) => e.name === "The Epiphany");
    const pastoralEpiphany = pastoral.find((e) => e.name === "The Epiphany");
    assertEquals(canonicalEpiphany?.date.toString(), "2026-01-06");
    assertEquals(pastoralEpiphany?.date.toString(), "2026-01-04");
  });

  await t.step("all event types are valid", () => {
    const calendar = generateLiturgicalCalendar(2025, {
      includeCommemorationsAndLesserFestivals: true,
    });

    const validTypes = [
      "principal_feast",
      "principal_holy_day",
      "festival",
      "lesser_festival",
      "commemoration",
      "sunday",
      "special_observance",
    ];

    calendar.forEach((event) => {
      assert(
        validTypes.includes(event.type),
        `Event "${event.name}" has invalid type "${event.type}"`,
      );
    });
  });

  await t.step("all events have required fields", () => {
    const calendar = generateLiturgicalCalendar(2025);

    calendar.forEach((event) => {
      assertExists(event.id, `Event should have id`);
      assertExists(event.name, `Event should have name`);
      assertExists(event.type, `Event should have type`);
      assertExists(event.date, `Event should have date`);
      assertExists(event.eventType, `Event should have eventType`);
    });
  });
});
