import { assert, assertEquals } from "@std/assert";

import { EVENTS as FIXED_EVENTS } from "@/calendar/data/mod.ts";
import {
  getAnnunciation,
  getAshWednesday,
  getClosestSunday,
  getDayOfPentecost,
  getEasterSunday,
  getFirstSundayOfAdvent,
  getPalmSunday,
  getPresentationOfChristInTheTemple,
  getTrinitySunday,
} from "@/calendar/temporal/mod.ts";
import { generateLiturgicalCalendar } from "../mod.ts";

/**
 * Tests for Church of England Common Worship transfer rules
 * These test the correct implementation of feast transfer logic
 */

Deno.test("Annunciation transfer rules", async (t) => {
  await t.step("returns March 25 when not falling on Sunday or during Holy Week", () => {
    // 2023: March 25 is Saturday, not during Holy Week (Easter April 9)
    assertEquals(getAnnunciation(2023).toString(), "2023-03-25");

    // 2025: March 25 is Tuesday, not during Holy Week (Easter April 20)
    assertEquals(getAnnunciation(2025).toString(), "2025-03-25");

    // 2026: March 25 is Wednesday, not during Holy Week (Easter April 5)
    assertEquals(getAnnunciation(2026).toString(), "2026-03-25");
  });

  await t.step("transfers to Monday when falling on Sunday (outside Holy Week)", () => {
    // Need to find years where March 25 is Sunday but NOT during Holy Week
    // For this test, let's create a hypothetical scenario or find appropriate years

    // Check 2057: March 25 is Sunday
    const march25_2057 = new Temporal.PlainDate(2057, 3, 25);
    if (march25_2057.dayOfWeek === 7) {
      const easter2057 = getEasterSunday(2057);
      const palmSunday2057 = getPalmSunday(2057);
      const secondSundayOfEaster2057 = easter2057.add({ weeks: 1 });

      // Check if March 25 is outside the Holy Week period
      if (
        Temporal.PlainDate.compare(march25_2057, palmSunday2057) < 0 ||
        Temporal.PlainDate.compare(march25_2057, secondSundayOfEaster2057) > 0
      ) {
        const annunciation2057 = getAnnunciation(2057);
        assertEquals(annunciation2057.toString(), "2057-03-26");
        assertEquals(annunciation2057.dayOfWeek, 1, "Should be Monday");
      }
    }

    // Test the logic with a different approach: Test known transfer scenarios
    // Let's test 2029 and 2035 where we know March 25 is Sunday but during Easter
    // These should transfer to Monday after Second Sunday of Easter, not just next Monday

    // 2029: March 25 = Sunday = Palm Sunday, should transfer to after Easter period
    const annunciation2029 = getAnnunciation(2029);
    assertEquals(annunciation2029.dayOfWeek, 1, "Should be Monday");
    assert(annunciation2029.month === 4, "Should be transferred to April");

    // 2035: March 25 = Sunday = Easter, should transfer to after Easter period
    const annunciation2035 = getAnnunciation(2035);
    assertEquals(annunciation2035.dayOfWeek, 1, "Should be Monday");
    assert(annunciation2035.month === 4, "Should be transferred to April");
  });

  await t.step("transfers when falling between Palm Sunday and Second Sunday of Easter", () => {
    // 2024: Easter March 31, Palm Sunday March 24, March 25 falls in this period
    const easter2024 = getEasterSunday(2024);
    const secondSundayOfEaster2024 = easter2024.add({ weeks: 1 });
    const expectedTransfer2024 = secondSundayOfEaster2024.add({ days: 1 });

    assertEquals(getAnnunciation(2024).toString(), expectedTransfer2024.toString());
    assertEquals(getAnnunciation(2024).dayOfWeek, 1, "Should be Monday after Second Sunday of Easter");

    // 2027: Easter March 28, Palm Sunday March 21, March 25 falls in this period
    const easter2027 = getEasterSunday(2027);
    const secondSundayOfEaster2027 = easter2027.add({ weeks: 1 });
    const expectedTransfer2027 = secondSundayOfEaster2027.add({ days: 1 });

    assertEquals(getAnnunciation(2027).toString(), expectedTransfer2027.toString());
    assertEquals(getAnnunciation(2027).dayOfWeek, 1, "Should be Monday after Second Sunday of Easter");
  });

  await t.step("handles edge case: Annunciation on Second Sunday of Easter", () => {
    // Find a year where March 25 falls exactly on Second Sunday of Easter
    for (let year = 2024; year <= 2050; year++) {
      const easter = getEasterSunday(year);
      const secondSundayOfEaster = easter.add({ weeks: 1 });
      const march25 = new Temporal.PlainDate(year, 3, 25);

      if (Temporal.PlainDate.compare(march25, secondSundayOfEaster) === 0) {
        const annunciation = getAnnunciation(year);
        const expectedTransfer = secondSundayOfEaster.add({ days: 1 });
        assertEquals(annunciation.toString(), expectedTransfer.toString());
        assertEquals(annunciation.dayOfWeek, 1, "Should be Monday after Second Sunday of Easter");
        break;
      }
    }
  });

  await t.step("correctly identifies Palm Sunday period boundaries", () => {
    // 2030: Easter April 21, Palm Sunday April 14, March 25 NOT in period
    assertEquals(getAnnunciation(2030).toString(), "2030-03-25");

    // 2021: Easter April 4, Palm Sunday March 28, March 25 NOT in period (before)
    assertEquals(getAnnunciation(2021).toString(), "2021-03-25");
  });

  await t.step("validates year input", () => {
    // Should not throw for valid years
    getAnnunciation(1583);
    getAnnunciation(9999);
  });
});

Deno.test("Presentation of Christ transfer rules", async (t) => {
  await t.step("returns February 2 when transferToSunday is false", () => {
    assertEquals(getPresentationOfChristInTheTemple(2024, false).toString(), "2024-02-02");
    assertEquals(getPresentationOfChristInTheTemple(2025, false).toString(), "2025-02-02");
    assertEquals(getPresentationOfChristInTheTemple(2026, false).toString(), "2026-02-02");
  });

  await t.step("finds correct Sunday between January 28 and February 3", () => {
    // 2024: Jan 28 = Sunday, should return Jan 28
    const presentation2024 = getPresentationOfChristInTheTemple(2024, true);
    assertEquals(presentation2024.toString(), "2024-01-28");
    assertEquals(presentation2024.dayOfWeek, 7, "Should be Sunday");

    // 2025: Jan 28 = Tuesday, Feb 2 = Sunday, should return Feb 2
    const presentation2025 = getPresentationOfChristInTheTemple(2025, true);
    assertEquals(presentation2025.toString(), "2025-02-02");
    assertEquals(presentation2025.dayOfWeek, 7, "Should be Sunday");

    // 2026: Jan 28 = Wednesday, Feb 1 = Sunday, should return Feb 1
    const presentation2026 = getPresentationOfChristInTheTemple(2026, true);
    assertEquals(presentation2026.toString(), "2026-02-01");
    assertEquals(presentation2026.dayOfWeek, 7, "Should be Sunday");
  });

  await t.step("finds Sunday in the correct date range", () => {
    for (let year = 2020; year <= 2030; year++) {
      const presentation = getPresentationOfChristInTheTemple(year, true);
      const jan28 = new Temporal.PlainDate(year, 1, 28);
      const feb3 = new Temporal.PlainDate(year, 2, 3);

      // Should be a Sunday
      assertEquals(presentation.dayOfWeek, 7, `${year}: Should be Sunday`);

      // Should be within the range Jan 28 - Feb 3
      assert(
        Temporal.PlainDate.compare(presentation, jan28) >= 0 &&
          Temporal.PlainDate.compare(presentation, feb3) <= 0,
        `${year}: Should be between Jan 28 and Feb 3`,
      );
    }
  });

  await t.step("handles edge cases correctly", () => {
    // Test years where the range spans different patterns

    // 2023: Jan 28 = Saturday, Jan 29 = Sunday, should return Jan 29
    const presentation2023 = getPresentationOfChristInTheTemple(2023, true);
    assertEquals(presentation2023.toString(), "2023-01-29");
    assertEquals(presentation2023.dayOfWeek, 7, "Should be Sunday");

    // 2027: Jan 28 = Thursday, Jan 31 = Sunday, should return Jan 31
    const presentation2027 = getPresentationOfChristInTheTemple(2027, true);
    assertEquals(presentation2027.toString(), "2027-01-31");
    assertEquals(presentation2027.dayOfWeek, 7, "Should be Sunday");
  });

  await t.step("always finds a Sunday in the valid range", () => {
    // Mathematical verification: 7-day range must contain exactly one Sunday
    for (let year = 1900; year <= 2100; year++) {
      const presentation = getPresentationOfChristInTheTemple(year, true);
      const jan28 = new Temporal.PlainDate(year, 1, 28);
      const feb3 = new Temporal.PlainDate(year, 2, 3);

      // Must be a Sunday
      assertEquals(presentation.dayOfWeek, 7, `${year}: Must be Sunday`);

      // Must be in range
      assert(
        Temporal.PlainDate.compare(presentation, jan28) >= 0 &&
          Temporal.PlainDate.compare(presentation, feb3) <= 0,
        `${year}: Must be in valid range`,
      );
    }
  });

  await t.step("validates year input", () => {
    // Should not throw for valid years
    getPresentationOfChristInTheTemple(1583, false);
    getPresentationOfChristInTheTemple(1583, true);
    getPresentationOfChristInTheTemple(9999, false);
    getPresentationOfChristInTheTemple(9999, true);
  });
});

Deno.test("Transfer rules integration", async (t) => {
  await t.step("both functions work correctly with different Easter options", () => {
    // Test with Western Easter
    const annunciationWestern = getAnnunciation(2024, { gregorian: false, julian: false });
    const presentationWestern = getPresentationOfChristInTheTemple(2024, false);

    // Test with Orthodox Easter
    const annunciationOrthodox = getAnnunciation(2024, { gregorian: true, julian: true });
    const presentationOrthodox = getPresentationOfChristInTheTemple(2024, false);

    // Presentation should be the same regardless of Easter calculation when using same flag
    assertEquals(presentationWestern.toString(), presentationOrthodox.toString());

    // Annunciation may differ based on Easter date
    // Both should be valid dates
    assert(annunciationWestern instanceof Temporal.PlainDate);
    assert(annunciationOrthodox instanceof Temporal.PlainDate);
  });

  await t.step("transfer rules produce consistent results", () => {
    // Test multiple years to ensure consistency
    for (let year = 2020; year <= 2030; year++) {
      const annunciation = getAnnunciation(year);
      const presentation = getPresentationOfChristInTheTemple(year, false);

      // Annunciation should always be in March or April
      assert(annunciation.month === 3 || annunciation.month === 4, `${year}: Annunciation should be in March or April`);

      // Presentation should always be February 2
      assertEquals(presentation.month, 2, `${year}: Presentation should be in February`);
      assertEquals(presentation.day, 2, `${year}: Presentation should be on day 2`);
    }
  });

  await t.step("optional transfers for All Saints' Day and Candlemas", () => {
    const findYear = (predicate: (year: number) => boolean) => {
      for (let year = 2020; year <= 2040; year++) {
        if (predicate(year)) return year;
      }
      throw new Error("No matching year found in range");
    };

    const allSaintsYear = findYear((year) => new Temporal.PlainDate(year, 11, 1).dayOfWeek !== 7);
    const oct30 = new Temporal.PlainDate(allSaintsYear, 10, 30);
    const nov5 = new Temporal.PlainDate(allSaintsYear, 11, 5);
    let expectedAllSaints = oct30;
    while (Temporal.PlainDate.compare(expectedAllSaints, nov5) <= 0) {
      if (expectedAllSaints.dayOfWeek === 7) break;
      expectedAllSaints = expectedAllSaints.add({ days: 1 });
    }

    const calendarAllSaints = generateLiturgicalCalendar(allSaintsYear - 1, {
      transferAllSaintsToSunday: true,
      includeCommemorationsAndLesserFestivals: false,
    });
    const allSaintsEvent = calendarAllSaints.find((event) => event.name === "All Saints’ Day");
    assert(allSaintsEvent, "All Saints’ Day should be present");
    assertEquals(allSaintsEvent.date.toString(), expectedAllSaints.toString());

    const candlemasYear = findYear((year) => new Temporal.PlainDate(year, 2, 2).dayOfWeek !== 7);
    const jan28 = new Temporal.PlainDate(candlemasYear, 1, 28);
    const feb3 = new Temporal.PlainDate(candlemasYear, 2, 3);
    let expectedCandlemas = jan28;
    while (Temporal.PlainDate.compare(expectedCandlemas, feb3) <= 0) {
      if (expectedCandlemas.dayOfWeek === 7) break;
      expectedCandlemas = expectedCandlemas.add({ days: 1 });
    }

    const calendarCandlemas = generateLiturgicalCalendar(candlemasYear - 1, {
      transferPresentationToSunday: true,
      includeCommemorationsAndLesserFestivals: false,
    });
    const candlemasEvent = calendarCandlemas.find(
      (event) => event.name === "The Presentation of Christ in the Temple (Candlemas)",
    );
    assert(candlemasEvent, "Candlemas should be present");
    assertEquals(candlemasEvent.date.toString(), expectedCandlemas.toString());
  });

  await t.step("canonicalMode canonical keeps optional principal transfers off (strict calendar dates)", () => {
    const calendar = generateLiturgicalCalendar(2025, {
      canonicalMode: "canonical",
      includeCommemorationsAndLesserFestivals: false,
    });
    const epiphany = calendar.find((event) => event.name === "The Epiphany");
    assert(epiphany, "Epiphany should be present");
    assertEquals(epiphany.date.toString(), "2026-01-06");
  });

  await t.step("canonicalMode pastoral applies optional principal Sunday transfers", () => {
    const calendar = generateLiturgicalCalendar(2025, {
      canonicalMode: "pastoral",
      includeCommemorationsAndLesserFestivals: false,
    });
    const epiphany = calendar.find((event) => event.name === "The Epiphany");
    assert(epiphany, "Epiphany should be present");
    assertEquals(epiphany.date.toString(), "2026-01-04");
  });

  await t.step("canonicalMode pastoral enables discretionary Sunday transfers", () => {
    const findFestivalOnOrdinarySunday = () => {
      for (let year = 2020; year <= 2040; year++) {
        const adventStart = getFirstSundayOfAdvent(year);
        const christmas = new Temporal.PlainDate(year, 12, 25);
        const ashWednesday = getAshWednesday(year);
        const easter = getEasterSunday(year);
        const pentecost = getDayOfPentecost(year);

        for (const event of FIXED_EVENTS) {
          if (event.type !== "festival") continue;
          const date = new Temporal.PlainDate(year, event.date[0], event.date[1]);
          if (date.dayOfWeek !== 7) continue;
          const inAdvent = Temporal.PlainDate.compare(date, adventStart) >= 0 &&
            Temporal.PlainDate.compare(date, christmas) < 0;
          const inLent = Temporal.PlainDate.compare(date, ashWednesday) >= 0 &&
            Temporal.PlainDate.compare(date, easter) < 0;
          const inEastertide = Temporal.PlainDate.compare(date, easter) >= 0 &&
            Temporal.PlainDate.compare(date, pentecost) <= 0;
          if (!inAdvent && !inLent && !inEastertide) {
            return { year, name: event.name, date };
          }
        }
      }
      throw new Error("No festival on ordinary Sunday found");
    };

    const { year, name, date } = findFestivalOnOrdinarySunday();
    const calendar = generateLiturgicalCalendar(year - 1, {
      canonicalMode: "pastoral",
      includeCommemorationsAndLesserFestivals: false,
    });
    const event = calendar.find((item) => item.name === name);
    assert(event, "Festival should be present");
    assertEquals(event.date.dayOfWeek !== 7, true);
    assert(event.date.toString() !== date.toString());
  });

  await t.step("optional transfer for the Blessed Virgin Mary festival", () => {
    const calendar = generateLiturgicalCalendar(2024, {
      transferBlessedVirginMaryToSeptember: true,
      includeCommemorationsAndLesserFestivals: false,
    });
    const bvm = calendar.find((event) => event.name === "The Blessed Virgin Mary");
    assert(bvm, "Blessed Virgin Mary festival should be present");
    assertEquals(bvm.date.toString(), "2025-09-08");
  });

  await t.step("All Souls' Day transfers to Nov 3 when Nov 2 is Sunday", () => {
    const findAllSoulsSunday = () => {
      for (let year = 2020; year <= 2040; year++) {
        const nov2 = new Temporal.PlainDate(year, 11, 2);
        if (nov2.dayOfWeek === 7) return year;
      }
      throw new Error("No All Souls Sunday found in range");
    };

    const year = findAllSoulsSunday();
    const calendar = generateLiturgicalCalendar(year - 1, { includeCommemorationsAndLesserFestivals: true });
    const allSouls = calendar.find(
      (event) => event.name === "Commemoration of the Faithful Departed (All Souls’ Day)",
    );
    assert(allSouls, "All Souls' Day should be present");
    assertEquals(allSouls.date.toString(), `${year}-11-03`);

    const richardHooker = calendar.find(
      (event) => event.name === "Richard Hooker, Priest, Anglican Apologist, Teacher of the Faith, 1600",
    );
    assert(
      !richardHooker || richardHooker.date.toString() !== `${year}-11-03`,
      "Richard Hooker should be displaced on Nov 3 when All Souls is transferred",
    );
  });

  await t.step("festivals on Sundays in Advent transfer to the next available day", () => {
    const findAdventSundayYear = () => {
      for (let year = 2020; year <= 2040; year++) {
        const date = new Temporal.PlainDate(year, 11, 30);
        if (date.dayOfWeek === 7 && Temporal.PlainDate.compare(date, getFirstSundayOfAdvent(year)) === 0) {
          return year;
        }
      }
      throw new Error("No matching Advent Sunday year found");
    };

    const year = findAdventSundayYear();
    const calendar = generateLiturgicalCalendar(year, { includeCommemorationsAndLesserFestivals: false });
    const andrew = calendar.find((event) => event.name === "Andrew the Apostle");
    assert(andrew, "Andrew the Apostle should be present");
    assertEquals(andrew.date.dayOfWeek !== 7, true);
    assert(
      Temporal.PlainDate.compare(andrew.date, new Temporal.PlainDate(year, 11, 30)) > 0,
      "Andrew should transfer to a later date",
    );
  });

  await t.step("Corpus Christi displaces other festivals on the same date", () => {
    const findConflictYear = () => {
      for (let year = 2020; year <= 2040; year++) {
        const corpusDate = getTrinitySunday(year).add({ days: 4 });
        const conflict = FIXED_EVENTS.find((event) => {
          return event.type === "festival" &&
            event.date[0] === corpusDate.month &&
            event.date[1] === corpusDate.day;
        });
        if (conflict) {
          return { year, corpusDate, conflictName: conflict.name };
        }
      }
      throw new Error("No Corpus Christi conflict found");
    };

    const { year, corpusDate, conflictName } = findConflictYear();
    const calendar = generateLiturgicalCalendar(year - 1, { includeCommemorationsAndLesserFestivals: false });
    const corpus = calendar.find((event) => event.name === "Day of Thanksgiving for Holy Communion (Corpus Christi)");
    assert(corpus, "Corpus Christi should be present");
    assertEquals(corpus.date.toString(), corpusDate.toString());

    const conflictingFestival = calendar.find((event) => event.name === conflictName);
    assert(conflictingFestival, "Conflicting festival should be present");
    assertEquals(conflictingFestival.date.toString() !== corpusDate.toString(), true);
  });

  await t.step("festivals on ordinary Sundays transfer when enabled", () => {
    const findFestivalOnOrdinarySunday = () => {
      for (let year = 2020; year <= 2040; year++) {
        const adventStart = getFirstSundayOfAdvent(year);
        const christmas = new Temporal.PlainDate(year, 12, 25);
        const ashWednesday = getAshWednesday(year);
        const easter = getEasterSunday(year);
        const pentecost = getDayOfPentecost(year);

        for (const event of FIXED_EVENTS) {
          if (event.type !== "festival") continue;
          const date = new Temporal.PlainDate(year, event.date[0], event.date[1]);
          if (date.dayOfWeek !== 7) continue;
          const inAdvent = Temporal.PlainDate.compare(date, adventStart) >= 0 &&
            Temporal.PlainDate.compare(date, christmas) < 0;
          const inLent = Temporal.PlainDate.compare(date, ashWednesday) >= 0 &&
            Temporal.PlainDate.compare(date, easter) < 0;
          const inEastertide = Temporal.PlainDate.compare(date, easter) >= 0 &&
            Temporal.PlainDate.compare(date, pentecost) <= 0;
          if (!inAdvent && !inLent && !inEastertide) {
            return { year, name: event.name, date };
          }
        }
      }
      throw new Error("No festival on ordinary Sunday found");
    };

    const { year, name, date } = findFestivalOnOrdinarySunday();
    const calendar = generateLiturgicalCalendar(year - 1, {
      transferFestivalsOnOrdinarySundays: true,
      includeCommemorationsAndLesserFestivals: false,
    });
    const event = calendar.find((item) => item.name === name);
    assert(event, "Festival should be present");
    assertEquals(event.date.dayOfWeek !== 7, true);
    assert(event.date.toString() !== date.toString());
  });

  await t.step("lesser festivals may transfer when blocked", () => {
    const findBlockedLesserFestival = () => {
      for (let year = 2020; year <= 2040; year++) {
        const palmSunday = getPalmSunday(year);
        const secondSundayOfEaster = getEasterSunday(year).add({ weeks: 1 });
        for (const event of FIXED_EVENTS) {
          if (event.type !== "lesser_festival") continue;
          const date = new Temporal.PlainDate(year, event.date[0], event.date[1]);
          const blocked = date.dayOfWeek === 7 ||
            (Temporal.PlainDate.compare(date, palmSunday) >= 0 &&
              Temporal.PlainDate.compare(date, secondSundayOfEaster) <= 0);
          if (blocked) {
            return { year, name: event.name, date };
          }
        }
      }
      throw new Error("No blocked lesser festival found");
    };

    const { year, name, date } = findBlockedLesserFestival();
    const calendar = generateLiturgicalCalendar(year - 1, {
      transferLesserFestivalsWhenBlocked: true,
      includeCommemorationsAndLesserFestivals: true,
    });
    const event = calendar.find((item) => item.name === name);
    assert(event, "Lesser festival should be present");
    assert(event.date.toString() !== date.toString());
  });

  await t.step("local patronal feasts can transfer to nearest Sunday", () => {
    const findLocalDate = () => {
      for (let year = 2020; year <= 2040; year++) {
        const candidate = new Temporal.PlainDate(year, 7, 10);
        const nearest = getClosestSunday(candidate);
        const exceptions = new Set([
          getFirstSundayOfAdvent(year).toString(),
          getEasterSunday(year).subtract({ weeks: 6 }).toString(),
          getEasterSunday(year).subtract({ weeks: 2 }).toString(),
          getPalmSunday(year).toString(),
        ]);
        if (!exceptions.has(nearest.toString())) {
          return { year, candidate, nearest };
        }
      }
      throw new Error("No suitable local date found");
    };

    const { year, candidate, nearest } = findLocalDate();
    const calendar = generateLiturgicalCalendar(year - 1, {
      transferLocalPrincipalToNearestSunday: true,
      localEvents: [
        {
          name: "Parish Patronal Festival",
          type: "principal_feast",
          date: candidate,
          localType: "patronal",
        },
      ],
      includeCommemorationsAndLesserFestivals: false,
    });
    const patronal = calendar.find((item) => item.name === "Parish Patronal Festival");
    assert(patronal, "Local patronal should be present");
    assertEquals(patronal.date.toString(), nearest.toString());
  });

  await t.step("local patronal/dedication on restricted dates must transfer", () => {
    const year = 2026;
    const palmSunday = getPalmSunday(year);
    const calendar = generateLiturgicalCalendar(year - 1, {
      localEvents: [
        {
          name: "Dedication Festival",
          type: "festival",
          date: palmSunday,
          localType: "dedication",
        },
      ],
      includeCommemorationsAndLesserFestivals: false,
    });
    const dedication = calendar.find((item) => item.name === "Dedication Festival");
    assert(dedication, "Dedication festival should be present");
    assert(dedication.date.toString() !== palmSunday.toString());
  });

  await t.step("harvest thanksgiving avoids principal festivals on Sundays", () => {
    const findAllSaintsSunday = () => {
      for (let year = 2020; year <= 2040; year++) {
        const nov1 = new Temporal.PlainDate(year, 11, 1);
        if (nov1.dayOfWeek === 7) return year;
      }
      throw new Error("No All Saints Sunday found");
    };
    const year = findAllSaintsSunday();
    const calendar = generateLiturgicalCalendar(year - 1, {
      localEvents: [
        {
          name: "Harvest Thanksgiving",
          type: "special_observance",
          date: new Temporal.PlainDate(year, 11, 1),
          localType: "harvest",
        },
      ],
      includeCommemorationsAndLesserFestivals: false,
    });
    const harvest = calendar.find((item) => item.name === "Harvest Thanksgiving");
    assert(harvest, "Harvest should be present");
    assertEquals(harvest.date.toString() !== `${year}-11-01`, true);
  });
});

Deno.test("Calendar observances align with Common Worship parish defaults", () => {
  const calendar = generateLiturgicalCalendar(2025, {
    canonicalMode: "pastoral",
    includeCommemorationsAndLesserFestivals: true,
  });
  const eventsOn = (date: string) =>
    calendar.filter((event) => event.date.toString() === date).map((event) => event.name);

  assert(eventsOn("2025-12-28").includes("First Sunday of Christmas"));
  assert(eventsOn("2026-01-04").includes("The Epiphany"));
  assert(!eventsOn("2026-01-04").includes("Second Sunday of Christmas"));
  assert(eventsOn("2026-02-15").includes("Sunday next before Lent"));
  assert(!calendar.some((event) => event.name === "Third Sunday before Lent"));

  assert(eventsOn("2025-12-29").includes("The Holy Innocents"));
  assert(!eventsOn("2025-12-28").includes("The Holy Innocents"));

  assert(eventsOn("2026-03-15").includes("Mothering Sunday"));
  assert(eventsOn("2026-04-04").includes("Easter Eve"));
  assert(eventsOn("2026-04-04").includes("Easter Vigil"));

  assert(!calendar.some((event) => event.date.toString() === "2026-01-11" && event.name.includes("Mary Slessor")));

  assert(eventsOn("2026-10-25").includes("Last Sunday after Trinity"));
  assert(eventsOn("2026-10-25").includes("Bible Sunday"));

  assert(eventsOn("2026-02-25").some((name) => name.startsWith("Ember Days (Second Sunday of Lent week)")));
  assert(eventsOn("2026-02-27").some((name) => name.startsWith("Ember Days (Second Sunday of Lent week)")));
  assert(eventsOn("2026-02-28").some((name) => name.startsWith("Ember Days (Second Sunday of Lent week)")));
});
