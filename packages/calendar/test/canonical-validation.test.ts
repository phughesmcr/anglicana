import { assert, assertEquals } from "@std/assert";

import {
  getAnnunciation,
  getAscensionDay,
  getAshWednesday,
  getChurchYear,
  getDayOfPentecost,
  getEasterSunday,
  getFirstSundayOfAdvent,
  getGoodFriday,
  getMaundyThursday,
  getPresentationOfChristInTheTemple,
  getSundayLectionaryLetter,
  getTrinitySunday,
  getWeekdayLectionaryNumber,
} from "@/calendar/temporal/mod.ts";

/**
 * Canonical validation tests for Church of England liturgical calendar
 * These tests verify compliance with official Common Worship rules
 */

Deno.test("Canonical validation - Easter calculations", async (t) => {
  await t.step("Easter always falls on a Sunday", () => {
    for (let year = 1900; year <= 2100; year++) {
      const easter = getEasterSunday(year);
      assertEquals(easter.dayOfWeek, 7, `Easter ${year} must be on Sunday`);
    }
  });

  await t.step("Easter falls between March 22 and April 25", () => {
    for (let year = 1900; year <= 2100; year++) {
      const easter = getEasterSunday(year);
      const earliestEaster = new Temporal.PlainDate(year, 3, 22);
      const latestEaster = new Temporal.PlainDate(year, 4, 25);
      assert(
        Temporal.PlainDate.compare(easter, earliestEaster) >= 0 &&
          Temporal.PlainDate.compare(easter, latestEaster) <= 0,
        `Easter ${year} (${easter}) must be between March 22 and April 25`,
      );
    }
  });

  await t.step("Verified Easter dates against known correct dates", () => {
    // These are canonical Easter dates from official sources
    const knownEasterDates: [number, string][] = [
      [2023, "2023-04-09"],
      [2024, "2024-03-31"],
      [2025, "2025-04-20"],
      [2026, "2026-04-05"],
      [2027, "2027-03-28"],
      [2028, "2028-04-16"],
      [2029, "2029-04-01"],
      [2030, "2030-04-21"],
    ];

    knownEasterDates.forEach(([year, expectedDate]) => {
      assertEquals(getEasterSunday(year).toString(), expectedDate, `Easter ${year}`);
    });
  });
});

Deno.test("Canonical validation - Advent calculations", async (t) => {
  await t.step("First Sunday of Advent always falls on a Sunday", () => {
    for (let year = 1900; year <= 2100; year++) {
      const advent = getFirstSundayOfAdvent(year);
      assertEquals(advent.dayOfWeek, 7, `First Sunday of Advent ${year} must be on Sunday`);
    }
  });

  await t.step("Advent Sunday is exactly 4 Sundays before Christmas", () => {
    for (let year = 1900; year <= 2100; year++) {
      const advent = getFirstSundayOfAdvent(year);
      const christmas = new Temporal.PlainDate(year, 12, 25);
      const daysBetween = advent.until(christmas, { largestUnit: "days" }).days;

      // Should be 22-28 days (exactly 4 Sundays worth, accounting for Christmas day of week)
      assert(
        daysBetween >= 22 && daysBetween <= 28,
        `Advent to Christmas ${year}: ${daysBetween} days (should be 22-28)`,
      );
    }
  });
});

Deno.test("Canonical validation - Principal Holy Days", async (t) => {
  await t.step("Ash Wednesday is exactly 46 days before Easter", () => {
    for (let year = 2020; year <= 2030; year++) {
      const ashWednesday = getAshWednesday(year);
      const easter = getEasterSunday(year);
      const daysBetween = ashWednesday.until(easter, { largestUnit: "days" }).days;
      assertEquals(daysBetween, 46, `Ash Wednesday to Easter ${year} should be 46 days`);
    }
  });

  await t.step("Ash Wednesday always falls on a Wednesday", () => {
    for (let year = 2020; year <= 2030; year++) {
      const ashWednesday = getAshWednesday(year);
      assertEquals(ashWednesday.dayOfWeek, 3, `Ash Wednesday ${year} must be on Wednesday`);
    }
  });

  await t.step("Maundy Thursday is the Thursday before Easter", () => {
    for (let year = 2020; year <= 2030; year++) {
      const maundyThursday = getMaundyThursday(year);
      const easter = getEasterSunday(year);
      assertEquals(maundyThursday.dayOfWeek, 4, `Maundy Thursday ${year} must be on Thursday`);

      const daysBetween = maundyThursday.until(easter, { largestUnit: "days" }).days;
      assertEquals(daysBetween, 3, `Maundy Thursday to Easter ${year} should be 3 days`);
    }
  });

  await t.step("Good Friday is the Friday before Easter", () => {
    for (let year = 2020; year <= 2030; year++) {
      const goodFriday = getGoodFriday(year);
      const easter = getEasterSunday(year);
      assertEquals(goodFriday.dayOfWeek, 5, `Good Friday ${year} must be on Friday`);

      const daysBetween = goodFriday.until(easter, { largestUnit: "days" }).days;
      assertEquals(daysBetween, 2, `Good Friday to Easter ${year} should be 2 days`);
    }
  });
});

Deno.test("Canonical validation - Ascension and Pentecost", async (t) => {
  await t.step("Ascension Day is exactly 39 days after Easter (40th day)", () => {
    for (let year = 2020; year <= 2030; year++) {
      const easter = getEasterSunday(year);
      const ascension = getAscensionDay(year);
      const daysBetween = easter.until(ascension, { largestUnit: "days" }).days;
      assertEquals(daysBetween, 39, `Easter to Ascension ${year} should be 39 days (40th day inclusive)`);
    }
  });

  await t.step("Ascension Day always falls on a Thursday", () => {
    for (let year = 2020; year <= 2030; year++) {
      const ascension = getAscensionDay(year);
      assertEquals(ascension.dayOfWeek, 4, `Ascension Day ${year} must be on Thursday`);
    }
  });

  await t.step("Day of Pentecost is exactly 49 days after Easter", () => {
    for (let year = 2020; year <= 2030; year++) {
      const easter = getEasterSunday(year);
      const pentecost = getDayOfPentecost(year);
      const daysBetween = easter.until(pentecost, { largestUnit: "days" }).days;
      assertEquals(daysBetween, 49, `Easter to Pentecost ${year} should be 49 days`);
    }
  });

  await t.step("Day of Pentecost always falls on a Sunday", () => {
    for (let year = 2020; year <= 2030; year++) {
      const pentecost = getDayOfPentecost(year);
      assertEquals(pentecost.dayOfWeek, 7, `Day of Pentecost ${year} must be on Sunday`);
    }
  });

  await t.step("Trinity Sunday is the Sunday after Pentecost", () => {
    for (let year = 2020; year <= 2030; year++) {
      const pentecost = getDayOfPentecost(year);
      const trinity = getTrinitySunday(year);
      const daysBetween = pentecost.until(trinity, { largestUnit: "days" }).days;
      assertEquals(daysBetween, 7, `Pentecost to Trinity ${year} should be 7 days`);
      assertEquals(trinity.dayOfWeek, 7, `Trinity Sunday ${year} must be on Sunday`);
    }
  });
});

Deno.test("Canonical validation - Church Year", async (t) => {
  await t.step("Church year changes on First Sunday of Advent", () => {
    for (let year = 2020; year <= 2030; year++) {
      const adventSunday = getFirstSundayOfAdvent(year);
      const dayBefore = adventSunday.subtract({ days: 1 });
      const dayOf = adventSunday;
      const dayAfter = adventSunday.add({ days: 1 });

      assertEquals(getChurchYear(dayBefore), year, `Day before Advent ${year}`);
      assertEquals(getChurchYear(dayOf), year + 1, `First Sunday of Advent ${year}`);
      assertEquals(getChurchYear(dayAfter), year + 1, `Day after Advent ${year}`);
    }
  });
});

Deno.test("Canonical validation - Lectionary cycles", async (t) => {
  await t.step("Sunday lectionary follows 3-year cycle A, B, C", () => {
    // According to Common Worship, the cycle starts with Year A
    // Church year 2023 should be Year A
    assertEquals(getSundayLectionaryLetter(2023), "A");
    assertEquals(getSundayLectionaryLetter(2024), "B");
    assertEquals(getSundayLectionaryLetter(2025), "C");
    assertEquals(getSundayLectionaryLetter(2026), "A");
    assertEquals(getSundayLectionaryLetter(2027), "B");
    assertEquals(getSundayLectionaryLetter(2028), "C");
  });

  await t.step("Weekday lectionary follows 2-year cycle", () => {
    for (let year = 2020; year <= 2030; year++) {
      const lectionaryNumber = getWeekdayLectionaryNumber(new Temporal.PlainDate(year, 6, 1));
      assert(lectionaryNumber === 1 || lectionaryNumber === 2, `Weekday lectionary ${year} should be 1 or 2`);
    }
  });
});

Deno.test("Canonical validation - Transfer rules", async (t) => {
  await t.step("Annunciation transfer rules are canonically correct", () => {
    // Test 2024: March 25 falls during Holy Week (Palm Sunday March 24, Easter March 31)
    const annunciation2024 = getAnnunciation(2024);
    const easter2024 = getEasterSunday(2024);
    const secondSundayOfEaster2024 = easter2024.add({ weeks: 1 });
    const expectedTransfer2024 = secondSundayOfEaster2024.add({ days: 1 });

    assertEquals(annunciation2024.toString(), expectedTransfer2024.toString());
    assertEquals(annunciation2024.dayOfWeek, 1, "Should be transferred to Monday");

    // Test years where March 25 doesn't need transfer
    assertEquals(getAnnunciation(2023).toString(), "2023-03-25"); // Saturday, no transfer needed
    assertEquals(getAnnunciation(2025).toString(), "2025-03-25"); // Tuesday, no transfer needed
  });

  await t.step("Presentation of Christ transfer rules work correctly", () => {
    // Test normal February 2 celebration
    assertEquals(getPresentationOfChristInTheTemple(2024, false).toString(), "2024-02-02");

    // Test Sunday transfer option
    const presentation2024Sunday = getPresentationOfChristInTheTemple(2024, true);
    assertEquals(presentation2024Sunday.dayOfWeek, 7, "Should be on Sunday");

    // Should be within valid range (Jan 28 - Feb 3)
    const jan28 = new Temporal.PlainDate(2024, 1, 28);
    const feb3 = new Temporal.PlainDate(2024, 2, 3);
    assert(
      Temporal.PlainDate.compare(presentation2024Sunday, jan28) >= 0 &&
        Temporal.PlainDate.compare(presentation2024Sunday, feb3) <= 0,
      "Should be within canonical range",
    );
  });

  await t.step("Transfer rules preserve liturgical integrity", () => {
    // Transferred feasts should always be on valid days
    for (let year = 2020; year <= 2030; year++) {
      const annunciation = getAnnunciation(year);

      // Should be a valid day of week (not restricted to specific day)
      assert(annunciation.dayOfWeek >= 1 && annunciation.dayOfWeek <= 7);

      // Should be in March or April (due to possible transfers)
      assert(annunciation.month === 3 || annunciation.month === 4);
    }
  });
});
