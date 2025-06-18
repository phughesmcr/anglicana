/* import { assertEquals, assertThrows } from "@std/assert";

import {
  getAscensionDay,
  getAshWednesday,
  getChristTheKing,
  getCorpusChristi,
  getDayOfPentecost,
  getEpiphany,
  getFirstSundayOfAdvent,
  getFixedDates,
  getGoodFriday,
  getMaundyThursday,
  getSundaysOfChurchYear,
  getTheBaptismOfChrist,
  getTrinitySunday,
  getWesternEaster,
} from "$src/temporal.ts";

const assertTrue = (condition: boolean, message?: string) => {
  assertEquals(condition, true, message);
};

Deno.test("getChristmasDay function", async (t) => {
  await t.step("returns correct date for a regular year", () => {
    const christmas2023 = getChristmasDay(2023);
    assertEquals(christmas2023.toString(), "2023-12-25");
    assertEquals(christmas2023.dayOfWeek, 1); // Monday
  });

  await t.step("returns correct date for a leap year", () => {
    const christmas2024 = getChristmasDay(2024);
    assertEquals(christmas2024.toString(), "2024-12-25");
    assertEquals(christmas2024.dayOfWeek, 3); // Wednesday
  });

  await t.step("handles year 1", () => {
    const christmas1 = getChristmasDay(1);
    assertEquals(christmas1.toString(), "0001-12-25");
  });

  await t.step("handles year 9999", () => {
    const christmas9999 = getChristmasDay(9999);
    assertEquals(christmas9999.toString(), "9999-12-25");
  });

  await t.step("handles negative years (BCE)", () => {
    const christmasBCE1 = getChristmasDay(-1);
    assertEquals(christmasBCE1.toString(), "-000001-12-25");
  });

  await t.step("returns a Temporal.PlainDate object", () => {
    const christmas = getChristmasDay(2025);
    assertEquals(christmas instanceof Temporal.PlainDate, true);
  });

  await t.step("throws for non-integer years", () => {
    assertThrows(() => getChristmasDay(2023.5), RangeError);
  });

  await t.step("throws for non-numeric input", () => {
    assertThrows(() => getChristmasDay("2023" as any), TypeError);
  });

  await t.step("throws for years out of range", () => {
    assertThrows(() => getChristmasDay(-271821), RangeError);
    assertThrows(() => getChristmasDay(275760), RangeError);
  });
});

Deno.test("getSeasonsOfYear function", async (t) => {
  await t.step("returns correct seasons for a typical year", () => {
    const seasons = getSeasonsOfYear(2023);
    assertEquals(seasons.length, 10);
    assertEquals(seasons[0].season, "Advent");
    assertEquals(seasons[0].start.toString(), "2022-11-27");
    assertEquals(seasons[0].end.toString(), "2022-12-24");
  });

  await t.step("handles leap year correctly", () => {
    const seasons = getSeasonsOfYear(2024);
    assertEquals(seasons.length, 10);
    const lentSeason = seasons.find((season) => season.season === "Lent");
    assertTrue(lentSeason.start.toString() <= "2024-02-29" && lentSeason.end.toString() >= "2024-02-29");
  });

  await t.step("works with different input formats", () => {
    const seasons1 = getSeasonsOfYear("2023-06-15");
    const seasons2 = getSeasonsOfYear(new Temporal.PlainDate(2023, 6, 15));
    const seasons3 = getSeasonsOfYear({ year: 2023, month: 6, day: 15 });

    assertEquals(seasons1, seasons2);
    assertEquals(seasons1, seasons3);
  });

  await t.step("throws error for invalid date string", () => {
    assertThrows(() => getSeasonsOfYear("invalid-date"), RangeError);
    assertThrows(() => getSeasonsOfYear(""), RangeError);
  });

  await t.step("throws error for invalid date object", () => {
    assertThrows(() => getSeasonsOfYear("2023-13-01"), RangeError);
    assertThrows(() => getSeasonsOfYear(new Temporal.PlainDate(2023, 13, 1)), RangeError);
    assertThrows(() => getSeasonsOfYear({ year: 2023, month: 13, day: 1 }), RangeError);
  });

  await t.step("handles custom seasons correctly", () => {
    const customSeasons = [
      { season: "CustomSeason", start: new Temporal.PlainDate(2023, 5, 1), end: new Temporal.PlainDate(2023, 5, 31) },
    ];
    const seasons = getSeasonsOfYear(2023, { customSeasons });
    const customSeason = seasons.find((season) => season.season === "CustomSeason");
    assertEquals(customSeason.start.toString(), "2023-05-01");
    assertEquals(customSeason.end.toString(), "2023-05-31");
  });

  await t.step("boundary conditions", () => {
    const seasons = getSeasonsOfYear(2023);
    const adventSeason = seasons.find((season) => season.season === "Advent");
    assertEquals(adventSeason.start.toString(), "2022-11-27");
    assertEquals(adventSeason.end.toString(), "2022-12-24");

    const christmasSeason = seasons.find((season) => season.season === "Christmas");
    assertEquals(christmasSeason.start.toString(), "2022-12-25");
    assertEquals(christmasSeason.end.toString(), "2023-01-05");
  });
});

Deno.test("getEpiphany function", async (t) => {
  await t.step("Regular cases", async (t) => {
    await t.step("Returns correct date for multiple years", () => {
      assertEquals(getEpiphany(2023).toString(), "2023-01-06");
      assertEquals(getEpiphany(2024).toString(), "2024-01-06");
      assertEquals(getEpiphany(2025).toString(), "2025-01-06");
    });

    await t.step("Accepts string input", () => {
      assertEquals(getEpiphany("2023-12-25").toString(), "2024-01-06");
      assertEquals(getEpiphany("2024-01-01").toString(), "2024-01-06");
    });

    await t.step("Accepts Temporal.PlainDate input", () => {
      const date = new Temporal.PlainDate(2023, 12, 25);
      assertEquals(getEpiphany(date).toString(), "2024-01-06");
    });

    await t.step("Accepts object input", () => {
      assertEquals(getEpiphany({ year: 2023, month: 12, day: 25 }).toString(), "2024-01-06");
    });
  });

  await t.step("Edge cases", async (t) => {
    await t.step("Handles leap years correctly", () => {
      assertEquals(getEpiphany(2024).toString(), "2024-01-06");
      assertEquals(getEpiphany(2028).toString(), "2028-01-06");
    });

    await t.step("Handles year boundaries correctly", () => {
      assertEquals(getEpiphany("2023-12-31").toString(), "2024-01-06");
      assertEquals(getEpiphany("2024-01-01").toString(), "2024-01-06");
    });

    await t.step("Handles very early years", () => {
      assertEquals(getEpiphany(1).toString(), "0001-01-06");
    });

    await t.step("Handles far future years", () => {
      assertEquals(getEpiphany(9999).toString(), "9999-01-06");
    });

    await t.step("Handles negative years (BCE)", () => {
      assertEquals(getEpiphany(-1).toString(), "-000001-01-06");
    });
  });

  await t.step("Consistency checks", async (t) => {
    await t.step("Epiphany is always on January 6th", () => {
      for (let year = 2020; year <= 2030; year++) {
        const epiphany = getEpiphany(year);
        assertEquals(epiphany.month, 1, `Month should be January for year ${year}`);
        assertEquals(epiphany.day, 6, `Day should be 6th for year ${year}`);
      }
    });

    await t.step("Epiphany is in the correct church year", () => {
      assertEquals(getEpiphany("2023-12-25").year, 2024);
      assertEquals(getEpiphany("2024-01-01").year, 2024);
      assertEquals(getEpiphany("2024-01-07").year, 2024);
    });
  });

  await t.step("Error cases", async (t) => {
    await t.step("Throws for invalid date string", () => {
      assertThrows(() => getEpiphany("invalid-date"), RangeError);
    });

    await t.step("Throws for invalid date object", () => {
      assertThrows(() => getEpiphany({ year: 2023, month: 13, day: 1 }), RangeError);
    });

    await t.step("Throws for non-integer years", () => {
      assertThrows(() => getEpiphany(2023.5), RangeError);
    });

    await t.step("Throws for years out of range", () => {
      assertThrows(() => getEpiphany(-271821), RangeError);
      assertThrows(() => getEpiphany(275760), RangeError);
    });
  });
});

Deno.test("getTheBaptismOfChrist function", async (t) => {
  await t.step("Regular cases", async (t) => {
    await t.step("Returns correct date for multiple years", () => {
      assertEquals(getTheBaptismOfChrist(2023).toString(), "2023-01-08");
      assertEquals(getTheBaptismOfChrist(2024).toString(), "2024-01-07");
      assertEquals(getTheBaptismOfChrist(2025).toString(), "2025-01-12");
    });

    await t.step("Accepts string input", () => {
      assertEquals(getTheBaptismOfChrist("2023-12-25").toString(), "2024-01-07");
    });

    await t.step("Accepts Temporal.PlainDate input", () => {
      const date = new Temporal.PlainDate(2023, 12, 25);
      assertEquals(getTheBaptismOfChrist(date).toString(), "2024-01-07");
    });

    await t.step("Accepts object input", () => {
      assertEquals(getTheBaptismOfChrist({ year: 2023, month: 12, day: 25 }).toString(), "2024-01-07");
    });
  });

  await t.step("Edge cases", async (t) => {
    await t.step("When Epiphany falls on a Sunday", () => {
      assertEquals(getTheBaptismOfChrist(2019).toString(), "2019-01-13");
    });

    await t.step("When Epiphany is on January 6 or before", () => {
      assertEquals(getTheBaptismOfChrist(2023).toString(), "2023-01-08");
    });

    await t.step("When Epiphany is on January 7 or 8", () => {
      assertEquals(getTheBaptismOfChrist(2024).toString(), "2024-01-07");
      assertEquals(getTheBaptismOfChrist(2025).toString(), "2025-01-12");
    });

    await t.step("Handles leap years correctly", () => {
      assertEquals(getTheBaptismOfChrist(2024).toString(), "2024-01-07");
      assertEquals(getTheBaptismOfChrist(2028).toString(), "2028-01-09");
    });

    await t.step("Handles year boundaries correctly", () => {
      assertEquals(getTheBaptismOfChrist("2023-12-31").toString(), "2024-01-07");
      assertEquals(getTheBaptismOfChrist("2024-01-01").toString(), "2024-01-07");
    });
  });

  await t.step("Consistency checks", async (t) => {
    await t.step("Baptism of Christ is always after Epiphany", () => {
      for (let year = 2020; year <= 2030; year++) {
        const baptism = getTheBaptismOfChrist(year);
        assertTrue(Temporal.PlainDate.compare(baptism, new Temporal.PlainDate(year, 1, 6)) > 0);
      }
    });

    await t.step("Baptism of Christ is always on a Sunday or Monday", () => {
      for (let year = 2020; year <= 2030; year++) {
        const baptism = getTheBaptismOfChrist(year);
        assertTrue([0, 1].includes(baptism.dayOfWeek));
      }
    });
  });

  await t.step("Error cases", async (t) => {
    await t.step("Throws for invalid date string", () => {
      assertThrows(() => getTheBaptismOfChrist("invalid-date"), RangeError);
    });

    await t.step("Throws for invalid date object", () => {
      assertThrows(() => getTheBaptismOfChrist({ year: 2023, month: 13, day: 1 }), RangeError);
    });

    await t.step("Throws for non-integer years", () => {
      assertThrows(() => getTheBaptismOfChrist(2023.5), RangeError);
    });

    await t.step("Throws for years out of range", () => {
      assertThrows(() => getTheBaptismOfChrist(-271821), RangeError);
      assertThrows(() => getTheBaptismOfChrist(275760), RangeError);
    });
  });
});

Deno.test("getAshWednesday function", async (t) => {
  await t.step("Regular cases", async (t) => {
    await t.step("Returns correct Ash Wednesday dates for multiple years", () => {
      assertEquals(getAshWednesday(2023).toString(), "2023-02-22");
      assertEquals(getAshWednesday(2024).toString(), "2024-02-14");
      assertEquals(getAshWednesday(2025).toString(), "2025-03-05");
    });

    await t.step("Handles leap years correctly", () => {
      assertEquals(getAshWednesday(2024).toString(), "2024-02-14");
      assertEquals(getAshWednesday(2028).toString(), "2028-02-16");
    });

    await t.step("Ash Wednesday is always 46 days before Easter", () => {
      for (let year = 2020; year <= 2030; year++) {
        const ashWednesday = getAshWednesday(year);
        const easter = getWesternEaster(year);
        assertEquals(ashWednesday.until(easter, { largestUnit: "day" }).days, 46);
      }
    });
  });

  await t.step("Edge cases", async (t) => {
    await t.step("Handles earliest possible Ash Wednesday date (February 4)", () => {
      // This occurs when Easter is on March 22
      const earliestEasterYear = 1818;
      assertEquals(getAshWednesday(earliestEasterYear).toString(), "1818-02-04");
    });

    await t.step("Handles latest possible Ash Wednesday date (March 10)", () => {
      // This occurs when Easter is on April 25
      const latestEasterYear = 1943;
      assertEquals(getAshWednesday(latestEasterYear).toString(), "1943-03-10");
    });
  });

  await t.step("Input format tests", async (t) => {
    await t.step("Accepts string input", () => {
      assertEquals(getAshWednesday("2023-01-01").toString(), "2023-02-22");
    });

    await t.step("Accepts Temporal.PlainDate input", () => {
      const date = new Temporal.PlainDate(2023, 1, 1);
      assertEquals(getAshWednesday(date).toString(), "2023-02-22");
    });

    await t.step("Accepts object input", () => {
      assertEquals(getAshWednesday({ year: 2023, month: 1, day: 1 }).toString(), "2023-02-22");
    });
  });

  await t.step("Error cases", async (t) => {
    await t.step("Throws for invalid date string", () => {
      assertThrows(() => getAshWednesday("invalid-date"), RangeError);
    });

    await t.step("Throws for invalid date object", () => {
      assertThrows(() => getAshWednesday({ year: 2023, month: 13, day: 1 }), RangeError);
    });

    await t.step("Throws for non-integer years", () => {
      assertThrows(() => getAshWednesday(2023.5), RangeError);
    });

    await t.step("Throws for years out of range", () => {
      assertThrows(() => getAshWednesday(-1), RangeError);
      assertThrows(() => getAshWednesday(275760), RangeError);
    });
  });
});

Deno.test("getMaundyThursday function", async (t) => {
  await t.step("Regular cases", async (t) => {
    await t.step("Returns correct Maundy Thursday dates for multiple years", () => {
      assertEquals(getMaundyThursday(2023).toString(), "2023-04-06");
      assertEquals(getMaundyThursday(2024).toString(), "2024-03-28");
      assertEquals(getMaundyThursday(2025).toString(), "2025-04-17");
    });

    await t.step("Handles leap years correctly", () => {
      assertEquals(getMaundyThursday(2024).toString(), "2024-03-28");
      assertEquals(getMaundyThursday(2028).toString(), "2028-04-13");
    });

    await t.step("Maundy Thursday is always 3 days before Easter", () => {
      for (let year = 2020; year <= 2030; year++) {
        const maundyThursday = getMaundyThursday(year);
        const easter = getWesternEaster(year);
        assertEquals(maundyThursday.until(easter, { largestUnit: "day" }).days, 3);
      }
    });
  });

  await t.step("Edge cases", async (t) => {
    await t.step("Handles earliest possible Maundy Thursday date (March 19)", () => {
      // This occurs when Easter is on March 22
      const earliestEasterYear = 1818;
      assertEquals(getMaundyThursday(earliestEasterYear).toString(), "1818-03-19");
    });

    await t.step("Handles latest possible Maundy Thursday date (April 22)", () => {
      // This occurs when Easter is on April 25
      const latestEasterYear = 1943;
      assertEquals(getMaundyThursday(latestEasterYear).toString(), "1943-04-22");
    });
  });

  await t.step("Input format tests", async (t) => {
    await t.step("Accepts string input", () => {
      assertEquals(getMaundyThursday("2023-01-01").toString(), "2023-04-06");
    });

    await t.step("Accepts Temporal.PlainDate input", () => {
      const date = new Temporal.PlainDate(2023, 1, 1);
      assertEquals(getMaundyThursday(date).toString(), "2023-04-06");
    });

    await t.step("Accepts object input", () => {
      assertEquals(getMaundyThursday({ year: 2023, month: 1, day: 1 }).toString(), "2023-04-06");
    });
  });

  await t.step("Error cases", async (t) => {
    await t.step("Throws for invalid date string", () => {
      assertThrows(() => getMaundyThursday("invalid-date"), RangeError);
    });

    await t.step("Throws for invalid date object", () => {
      assertThrows(() => getMaundyThursday({ year: 2023, month: 13, day: 1 }), RangeError);
    });

    await t.step("Throws for non-integer years", () => {
      assertThrows(() => getMaundyThursday(2023.5), RangeError);
    });

    await t.step("Throws for years out of range", () => {
      assertThrows(() => getMaundyThursday(-1), RangeError);
      assertThrows(() => getMaundyThursday(275760), RangeError);
    });
  });
});

Deno.test("getGoodFriday function", async (t) => {
  await t.step("Regular cases", async (t) => {
    await t.step("Returns correct Good Friday dates for multiple years", () => {
      assertEquals(getGoodFriday(2023).toString(), "2023-04-07");
      assertEquals(getGoodFriday(2024).toString(), "2024-03-29");
      assertEquals(getGoodFriday(2025).toString(), "2025-04-18");
    });

    await t.step("Handles leap years correctly", () => {
      assertEquals(getGoodFriday(2024).toString(), "2024-03-29");
      assertEquals(getGoodFriday(2028).toString(), "2028-04-14");
    });

    await t.step("Good Friday is always 2 days before Easter", () => {
      for (let year = 2020; year <= 2030; year++) {
        const goodFriday = getGoodFriday(year);
        const easter = getWesternEaster(year);
        assertEquals(goodFriday.until(easter, { largestUnit: "day" }).days, 2);
      }
    });
  });

  await t.step("Edge cases", async (t) => {
    await t.step("Handles earliest possible Good Friday date (March 20)", () => {
      // This occurs when Easter is on March 22
      const earliestEasterYear = 1818;
      assertEquals(getGoodFriday(earliestEasterYear).toString(), "1818-03-20");
    });

    await t.step("Handles latest possible Good Friday date (April 23)", () => {
      // This occurs when Easter is on April 25
      const latestEasterYear = 1943;
      assertEquals(getGoodFriday(latestEasterYear).toString(), "1943-04-23");
    });
  });

  await t.step("Input format tests", async (t) => {
    await t.step("Accepts string input", () => {
      assertEquals(getGoodFriday("2023-01-01").toString(), "2023-04-07");
    });

    await t.step("Accepts Temporal.PlainDate input", () => {
      const date = new Temporal.PlainDate(2023, 1, 1);
      assertEquals(getGoodFriday(date).toString(), "2023-04-07");
    });

    await t.step("Accepts object input", () => {
      assertEquals(getGoodFriday({ year: 2023, month: 1, day: 1 }).toString(), "2023-04-07");
    });
  });

  await t.step("Error cases", async (t) => {
    await t.step("Throws for invalid date string", () => {
      assertThrows(() => getGoodFriday("invalid-date"), RangeError);
    });

    await t.step("Throws for invalid date object", () => {
      assertThrows(() => getGoodFriday({ year: 2023, month: 13, day: 1 }), RangeError);
    });

    await t.step("Throws for non-integer years", () => {
      assertThrows(() => getGoodFriday(2023.5), RangeError);
    });

    await t.step("Throws for years out of range", () => {
      assertThrows(() => getGoodFriday(-1), RangeError);
      assertThrows(() => getGoodFriday(275760), RangeError);
    });
  });
});

Deno.test("getAscensionDay function", async (t) => {
  await t.step("Regular cases", async (t) => {
    await t.step("Returns correct Ascension Day dates for multiple years", () => {
      assertEquals(getAscensionDay(2023).toString(), "2023-05-18");
      assertEquals(getAscensionDay(2024).toString(), "2024-05-09");
      assertEquals(getAscensionDay(2025).toString(), "2025-05-29");
    });

    await t.step("Handles leap years correctly", () => {
      assertEquals(getAscensionDay(2024).toString(), "2024-05-09");
      assertEquals(getAscensionDay(2028).toString(), "2028-05-04");
    });

    await t.step("Ascension Day is always 40 days after Easter", () => {
      for (let year = 2020; year <= 2030; year++) {
        const ascensionDay = getAscensionDay(year);
        const easter = getWesternEaster(year);
        assertEquals(easter.until(ascensionDay, { largestUnit: "day" }).days, 39);
      }
    });
  });

  await t.step("Edge cases", async (t) => {
    await t.step("Handles earliest possible Ascension Day date (April 30)", () => {
      // This occurs when Easter is on March 22
      const earliestEasterYear = 1818;
      assertEquals(getAscensionDay(earliestEasterYear).toString(), "1818-04-30");
    });

    await t.step("Handles latest possible Ascension Day date (June 3)", () => {
      // This occurs when Easter is on April 25
      const latestEasterYear = 1943;
      assertEquals(getAscensionDay(latestEasterYear).toString(), "1943-06-03");
    });
  });

  await t.step("Input format tests", async (t) => {
    await t.step("Accepts string input", () => {
      assertEquals(getAscensionDay("2023-01-01").toString(), "2023-05-18");
    });

    await t.step("Accepts Temporal.PlainDate input", () => {
      const date = new Temporal.PlainDate(2023, 1, 1);
      assertEquals(getAscensionDay(date).toString(), "2023-05-18");
    });

    await t.step("Accepts object input", () => {
      assertEquals(getAscensionDay({ year: 2023, month: 1, day: 1 }).toString(), "2023-05-18");
    });
  });

  await t.step("Error cases", async (t) => {
    await t.step("Throws for invalid date string", () => {
      assertThrows(() => getAscensionDay("invalid-date"), RangeError);
    });

    await t.step("Throws for invalid date object", () => {
      assertThrows(() => getAscensionDay({ year: 2023, month: 13, day: 1 }), RangeError);
    });

    await t.step("Throws for non-integer years", () => {
      assertThrows(() => getAscensionDay(2023.5), RangeError);
    });

    await t.step("Throws for years out of range", () => {
      assertThrows(() => getAscensionDay(-1), RangeError);
      assertThrows(() => getAscensionDay(275760), RangeError);
    });
  });
});

Deno.test("getDayOfPentecost function", async (t) => {
  await t.step("Regular cases", async (t) => {
    await t.step("Returns correct Pentecost dates for multiple years", () => {
      assertEquals(getDayOfPentecost(2023).toString(), "2023-05-28");
      assertEquals(getDayOfPentecost(2024).toString(), "2024-05-19");
      assertEquals(getDayOfPentecost(2025).toString(), "2025-06-08");
    });

    await t.step("Handles leap years correctly", () => {
      assertEquals(getDayOfPentecost(2024).toString(), "2024-05-19");
      assertEquals(getDayOfPentecost(2028).toString(), "2028-05-14");
    });

    await t.step("Pentecost is always 49 days after Easter", () => {
      for (let year = 2020; year <= 2030; year++) {
        const pentecost = getDayOfPentecost(year);
        const easter = getWesternEaster(year);
        assertEquals(easter.until(pentecost, { largestUnit: "day" }).days, 49);
      }
    });
  });

  await t.step("Edge cases", async (t) => {
    await t.step("Handles earliest possible Pentecost date (May 10)", () => {
      // This occurs when Easter is on March 22
      const earliestEasterYear = 1818;
      assertEquals(getDayOfPentecost(earliestEasterYear).toString(), "1818-05-10");
    });

    await t.step("Handles latest possible Pentecost date (June 13)", () => {
      // This occurs when Easter is on April 25
      const latestEasterYear = 1943;
      assertEquals(getDayOfPentecost(latestEasterYear).toString(), "1943-06-13");
    });
  });

  await t.step("Input format tests", async (t) => {
    await t.step("Accepts string input", () => {
      assertEquals(getDayOfPentecost("2023-01-01").toString(), "2023-05-28");
    });

    await t.step("Accepts Temporal.PlainDate input", () => {
      const date = new Temporal.PlainDate(2023, 1, 1);
      assertEquals(getDayOfPentecost(date).toString(), "2023-05-28");
    });

    await t.step("Accepts object input", () => {
      assertEquals(getDayOfPentecost({ year: 2023, month: 1, day: 1 }).toString(), "2023-05-28");
    });
  });

  await t.step("Error cases", async (t) => {
    await t.step("Throws for invalid date string", () => {
      assertThrows(() => getDayOfPentecost("invalid-date"), RangeError);
    });

    await t.step("Throws for invalid date object", () => {
      assertThrows(() => getDayOfPentecost({ year: 2023, month: 13, day: 1 }), RangeError);
    });

    await t.step("Throws for non-integer years", () => {
      assertThrows(() => getDayOfPentecost(2023.5), RangeError);
    });

    await t.step("Throws for years out of range", () => {
      assertThrows(() => getDayOfPentecost(-1), RangeError);
      assertThrows(() => getDayOfPentecost(275760), RangeError);
    });
  });
});

Deno.test("getTrinitySunday function", async (t) => {
  await t.step("Regular cases", async (t) => {
    await t.step("Returns correct Trinity Sunday dates for multiple years", () => {
      assertEquals(getTrinitySunday(2023).toString(), "2023-06-04");
      assertEquals(getTrinitySunday(2024).toString(), "2024-05-26");
      assertEquals(getTrinitySunday(2025).toString(), "2025-06-15");
    });

    await t.step("Handles leap years correctly", () => {
      assertEquals(getTrinitySunday(2024).toString(), "2024-05-26");
      assertEquals(getTrinitySunday(2028).toString(), "2028-05-21");
    });

    await t.step("Trinity Sunday is always 7 days after Pentecost", () => {
      for (let year = 2020; year <= 2030; year++) {
        const trinitySunday = getTrinitySunday(year);
        const pentecost = getDayOfPentecost(year);
        assertEquals(pentecost.until(trinitySunday, { largestUnit: "day" }).days, 7);
      }
    });
  });

  await t.step("Edge cases", async (t) => {
    await t.step("Handles earliest possible Trinity Sunday date (May 17)", () => {
      // This occurs when Easter is on March 22
      const earliestEasterYear = 1818;
      assertEquals(getTrinitySunday(earliestEasterYear).toString(), "1818-05-17");
    });

    await t.step("Handles latest possible Trinity Sunday date (June 20)", () => {
      // This occurs when Easter is on April 25
      const latestEasterYear = 1943;
      assertEquals(getTrinitySunday(latestEasterYear).toString(), "1943-06-20");
    });
  });

  await t.step("Input format tests", async (t) => {
    await t.step("Accepts string input", () => {
      assertEquals(getTrinitySunday("2023-01-01").toString(), "2023-06-04");
    });

    await t.step("Accepts Temporal.PlainDate input", () => {
      const date = new Temporal.PlainDate(2023, 1, 1);
      assertEquals(getTrinitySunday(date).toString(), "2023-06-04");
    });

    await t.step("Accepts object input", () => {
      assertEquals(getTrinitySunday({ year: 2023, month: 1, day: 1 }).toString(), "2023-06-04");
    });

    await t.step("Accepts number input (year)", () => {
      assertEquals(getTrinitySunday(2023).toString(), "2023-06-04");
    });
  });

  await t.step("Error cases", async (t) => {
    await t.step("Throws for invalid date string", () => {
      assertThrows(() => getTrinitySunday("invalid-date"), RangeError);
    });

    await t.step("Throws for invalid date object", () => {
      assertThrows(() => getTrinitySunday({ year: 2023, month: 13, day: 1 }), RangeError);
    });
  });
});

Deno.test("getCorpusChristi function", async (t) => {
  await t.step("Regular cases", async (t) => {
    await t.step("Returns correct Corpus Christi dates for multiple years", () => {
      assertEquals(getCorpusChristi(2023).toString(), "2023-06-08");
      assertEquals(getCorpusChristi(2024).toString(), "2024-05-30");
      assertEquals(getCorpusChristi(2025).toString(), "2025-06-19");
    });

    await t.step("Corpus Christi is always 4 days after Trinity Sunday", () => {
      for (let year = 2020; year <= 2030; year++) {
        const corpusChristi = getCorpusChristi(year);
        const trinitySunday = getTrinitySunday(year);
        assertEquals(trinitySunday.until(corpusChristi, { largestUnit: "day" }).days, 4);
      }
    });

    await t.step("Handles leap years correctly", () => {
      assertEquals(getCorpusChristi(2024).toString(), "2024-05-30");
      assertEquals(getCorpusChristi(2028).toString(), "2028-05-25");
    });
  });

  await t.step("Edge cases", async (t) => {
    await t.step("Handles earliest possible Corpus Christi date (May 21)", () => {
      // This occurs when Easter is on March 22
      const earliestEasterYear = 1818;
      assertEquals(getCorpusChristi(earliestEasterYear).toString(), "1818-05-21");
    });

    await t.step("Handles latest possible Corpus Christi date (June 24)", () => {
      // This occurs when Easter is on April 25
      const latestEasterYear = 1943;
      assertEquals(getCorpusChristi(latestEasterYear).toString(), "1943-06-24");
    });
  });

  await t.step("Input format tests", async (t) => {
    await t.step("Accepts string input", () => {
      assertEquals(getCorpusChristi("2023-01-01").toString(), "2023-06-08");
    });

    await t.step("Accepts Temporal.PlainDate input", () => {
      const date = new Temporal.PlainDate(2023, 1, 1);
      assertEquals(getCorpusChristi(date).toString(), "2023-06-08");
    });

    await t.step("Accepts object input", () => {
      assertEquals(getCorpusChristi({ year: 2023, month: 1, day: 1 }).toString(), "2023-06-08");
    });

    await t.step("Accepts number input (year)", () => {
      assertEquals(getCorpusChristi(2023).toString(), "2023-06-08");
    });
  });

  await t.step("Error cases", async (t) => {
    await t.step("Throws for invalid date string", () => {
      assertThrows(() => getCorpusChristi("invalid-date"), RangeError);
    });

    await t.step("Throws for invalid date object", () => {
      assertThrows(() => getCorpusChristi({ year: 2023, month: 13, day: 1 }), RangeError);
    });

    await t.step("Throws for years out of range", () => {
      assertThrows(() => getCorpusChristi(-271821), RangeError);
      assertThrows(() => getCorpusChristi(275760), RangeError);
    });
  });
});

Deno.test("getChristTheKing function", async (t) => {
  await t.step("Regular cases", async (t) => {
    await t.step("Returns correct Christ the King Sunday dates for multiple years", () => {
      assertEquals(getChristTheKing(2023).toString(), "2023-11-26");
      assertEquals(getChristTheKing(2024).toString(), "2024-11-24");
      assertEquals(getChristTheKing(2025).toString(), "2025-11-23");
    });

    await t.step("Christ the King Sunday is always the Sunday before the First Sunday of Advent", () => {
      for (let year = 2020; year <= 2030; year++) {
        const christTheKing = getChristTheKing(year);
        const firstAdvent = getFirstSundayOfAdvent(year);
        assertEquals(christTheKing.until(firstAdvent, { largestUnit: "day" }).days, 7);
      }
    });

    await t.step("Handles leap years correctly", () => {
      assertEquals(getChristTheKing(2024).toString(), "2024-11-24");
      assertEquals(getChristTheKing(2028).toString(), "2028-11-26");
    });
  });

  await t.step("Edge cases", async (t) => {
    await t.step("Handles earliest possible Christ the King Sunday date (November 20)", () => {
      assertEquals(getChristTheKing(2021).toString(), "2021-11-21");
    });

    await t.step("Handles latest possible Christ the King Sunday date (November 26)", () => {
      assertEquals(getChristTheKing(2023).toString(), "2023-11-26");
    });
  });

  await t.step("Input format tests", async (t) => {
    await t.step("Accepts string input", () => {
      assertEquals(getChristTheKing("2023-01-01").toString(), "2023-11-26");
    });

    await t.step("Accepts Temporal.PlainDate input", () => {
      const date = new Temporal.PlainDate(2023, 1, 1);
      assertEquals(getChristTheKing(date).toString(), "2023-11-26");
    });

    await t.step("Accepts object input", () => {
      assertEquals(getChristTheKing({ year: 2023, month: 1, day: 1 }).toString(), "2023-11-26");
    });

    await t.step("Accepts number input (year)", () => {
      assertEquals(getChristTheKing(2023).toString(), "2023-11-26");
    });
  });

  await t.step("Consistency checks", async (t) => {
    await t.step("Christ the King Sunday is always on a Sunday", () => {
      for (let year = 2020; year <= 2030; year++) {
        const christTheKing = getChristTheKing(year);
        assertEquals(christTheKing.dayOfWeek, 7, `Christ the King Sunday should be on a Sunday in ${year}`);
      }
    });

    await t.step("Christ the King Sunday is always in November", () => {
      for (let year = 2020; year <= 2030; year++) {
        const christTheKing = getChristTheKing(year);
        assertEquals(christTheKing.month, 11, `Christ the King Sunday should be in November in ${year}`);
      }
    });
  });

  await t.step("Error cases", async (t) => {
    await t.step("Throws for invalid date string", () => {
      assertThrows(() => getChristTheKing("invalid-date"), RangeError);
    });

    await t.step("Throws for invalid date object", () => {
      assertThrows(() => getChristTheKing({ year: 2023, month: 13, day: 1 }), RangeError);
    });

    await t.step("Throws for non-integer years", () => {
      assertThrows(() => getChristTheKing(2023.5), RangeError);
    });

    await t.step("Throws for years out of range", () => {
      assertThrows(() => getChristTheKing(-271821), RangeError);
      assertThrows(() => getChristTheKing(275760), RangeError);
    });
  });
});

Deno.test("getMoveableDates function", async (t) => {
  await t.step("Regular cases", async (t) => {
    await t.step("Returns correct moveable dates for multiple years", () => {
      const dates2023 = getMoveableDates(2023);
      assertEquals(dates2023.easter.toString(), "2023-04-09");
      assertEquals(dates2023.ascensionDay.toString(), "2023-05-18");
      assertEquals(dates2023.pentecost.toString(), "2023-05-28");
    });

    await t.step("Handles leap years correctly", () => {
      const dates2024 = getMoveableDates(2024);
      assertEquals(dates2024.easter.toString(), "2024-03-31");
      assertEquals(dates2024.ascensionDay.toString(), "2024-05-09");
      assertEquals(dates2024.pentecost.toString(), "2024-05-19");
    });
  });

  await t.step("Edge cases", async (t) => {
    await t.step("Handles earliest possible Easter date (March 22)", () => {
      const earliestEasterYear = 1818;
      const dates = getMoveableDates(earliestEasterYear);
      assertEquals(dates.easter.toString(), "1818-03-22");
      assertEquals(dates.ascensionDay.toString(), "1818-04-30");
      assertEquals(dates.pentecost.toString(), "1818-05-10");
    });

    await t.step("Handles latest possible Easter date (April 25)", () => {
      const latestEasterYear = 1943;
      const dates = getMoveableDates(latestEasterYear);
      assertEquals(dates.easter.toString(), "1943-04-25");
      assertEquals(dates.ascensionDay.toString(), "1943-06-03");
      assertEquals(dates.pentecost.toString(), "1943-06-13");
    });
  });

  await t.step("Input format tests", async (t) => {
    await t.step("Accepts string input", () => {
      const dates = getMoveableDates("2023-01-01");
      assertEquals(dates.easter.toString(), "2023-04-09");
    });

    await t.step("Accepts Temporal.PlainDate input", () => {
      const date = new Temporal.PlainDate(2023, 1, 1);
      const dates = getMoveableDates(date);
      assertEquals(dates.easter.toString(), "2023-04-09");
    });

    await t.step("Accepts object input", () => {
      const dates = getMoveableDates({ year: 2023, month: 1, day: 1 });
      assertEquals(dates.easter.toString(), "2023-04-09");
    });
  });

  await t.step("Error cases", async (t) => {
    await t.step("Throws for invalid date string", () => {
      assertThrows(() => getMoveableDates("invalid-date"), RangeError);
    });

    await t.step("Throws for invalid date object", () => {
      assertThrows(() => getMoveableDates({ year: 2023, month: 13, day: 1 }), RangeError);
    });

    await t.step("Throws for non-integer years", () => {
      assertThrows(() => getMoveableDates(2023.5), RangeError);
    });

    await t.step("Throws for years out of range", () => {
      assertThrows(() => getMoveableDates(-1), RangeError);
      assertThrows(() => getMoveableDates(275760), RangeError);
    });
  });
});

Deno.test("getFixedDates function", async (t) => {
  await t.step("Regular cases", async (t) => {
    await t.step("Returns correct number of fixed dates for a year", () => {
      const dates2023 = getFixedDates(2023);
      assertEquals(dates2023.length > 0, true);
      // You may want to adjust this number based on your actual implementation
      assertEquals(dates2023.length, 365);
    });

    await t.step("Handles leap years correctly", () => {
      const dates2024 = getFixedDates(2024);
      assertEquals(dates2024.length, 366);
    });

    await t.step("All dates are in the correct year", () => {
      const year = 2025;
      const dates = getFixedDates(year);
      dates.forEach((event) => {
        event.observed.forEach((date) => {
          assertEquals(date.year, year);
        });
      });
    });
  });

  await t.step("Edge cases", async (t) => {
    await t.step("Handles year boundary correctly (December 31 to January 1)", () => {
      const dates2023 = getFixedDates(2023);
      const dec31 = dates2023.find((event) => event.observed.some((date) => date.month === 12 && date.day === 31));
      const dates2024 = getFixedDates(2024);
      const jan1 = dates2024.find((event) => event.observed.some((date) => date.month === 1 && date.day === 1));
      assertEquals(dec31 !== undefined, true);
      assertEquals(jan1 !== undefined, true);
    });

    await t.step("Correctly handles February 29 in leap years", () => {
      const dates2024 = getFixedDates(2024);
      const feb29 = dates2024.find((event) => event.observed.some((date) => date.month === 2 && date.day === 29));
      assertEquals(feb29 !== undefined, true);
    });

    await t.step("Does not include February 29 in non-leap years", () => {
      const dates2023 = getFixedDates(2023);
      const feb29 = dates2023.find((event) => event.observed.some((date) => date.month === 2 && date.day === 29));
      assertEquals(feb29, undefined);
    });
  });

  await t.step("Input format tests", async (t) => {
    await t.step("Accepts number input", () => {
      const dates = getFixedDates(2023);
      assertEquals(dates.length > 0, true);
    });

    await t.step("Accepts string input", () => {
      const dates = getFixedDates("2023-01-01");
      assertEquals(dates.length > 0, true);
    });

    await t.step("Accepts Temporal.PlainDate input", () => {
      const date = new Temporal.PlainDate(2023, 1, 1);
      const dates = getFixedDates(date);
      assertEquals(dates.length > 0, true);
    });

    await t.step("Accepts object input", () => {
      const dates = getFixedDates({ year: 2023, month: 1, day: 1 });
      assertEquals(dates.length > 0, true);
    });
  });

  await t.step("Specific date checks", async (t) => {
    await t.step("Includes Christmas Day", () => {
      const dates2023 = getFixedDates(2023);
      const christmas = dates2023.find((event) => event.observed.some((date) => date.month === 12 && date.day === 25));
      assertEquals(christmas !== undefined, true);
      assertEquals(christmas?.title, "Christmas Day");
    });

    await t.step("Includes All Saints' Day", () => {
      const dates2023 = getFixedDates(2023);
      const allSaints = dates2023.find((event) => event.observed.some((date) => date.month === 11 && date.day === 1));
      assertEquals(allSaints !== undefined, true);
      assertEquals(allSaints?.title, "All Saints' Day");
    });
  });

  await t.step("Error cases", async (t) => {
    await t.step("Throws for invalid date string", () => {
      assertThrows(() => getFixedDates("invalid-date"), RangeError);
    });

    await t.step("Throws for invalid date object", () => {
      assertThrows(() => getFixedDates({ year: 2023, month: 13, day: 1 }), RangeError);
    });

    await t.step("Throws for non-integer years", () => {
      assertThrows(() => getFixedDates(2023.5), RangeError);
    });

    await t.step("Throws for years out of range", () => {
      assertThrows(() => getFixedDates(-1), RangeError);
      assertThrows(() => getFixedDates(275760), RangeError);
    });
  });
});

Deno.test("getSundaysOfYear function", async (t) => {
  await t.step("returns correct Sundays for a typical year", () => {
    const sundays = getSundaysOfChurchYear(2023);
    assertEquals(sundays.length, 52);
    assertEquals(sundays[0].toString(), "2022-11-27"); // First Sunday of Advent 2022
    assertEquals(sundays[sundays.length - 1].toString(), "2023-11-19"); // Last Sunday before Advent 2023
  });

  await t.step("handles leap year correctly", () => {
    const sundays = getSundaysOfChurchYear(2024);
    assertEquals(sundays.length, 52);
    assertEquals(sundays[0].toString(), "2023-12-03"); // First Sunday of Advent 2023
    assertEquals(sundays[sundays.length - 1].toString(), "2024-11-24"); // Last Sunday before Advent 2024

    // Check if February 29th is included
    const febSundays = sundays.filter((sunday) => sunday.month === 2);
    assertEquals(febSundays.length, 4);
    assertEquals(febSundays[3].toString(), "2024-02-25");
  });

  await t.step("correctly spans two calendar years", () => {
    const sundays = getSundaysOfChurchYear(2023);
    const decemberSundays = sundays.filter((sunday) => sunday.year === 2022 && sunday.month === 12);
    const januarySundays = sundays.filter((sunday) => sunday.year === 2023 && sunday.month === 1);

    assertEquals(decemberSundays.length, 4);
    assertEquals(januarySundays.length, 5);
  });

  await t.step("works with different input formats", () => {
    const sundays1 = getSundaysOfChurchYear("2023-06-15");
    const sundays2 = getSundaysOfChurchYear(new Temporal.PlainDate(2023, 6, 15));
    const sundays3 = getSundaysOfChurchYear({ year: 2023, month: 6, day: 15 });

    assertEquals(sundays1, sundays2);
    assertEquals(sundays1, sundays3);
  });

  await t.step("returns correct number of Sundays", () => {
    for (let year = 2020; year <= 2030; year++) {
      const sundays = getSundaysOfChurchYear(year);
      assertEquals(sundays.length, 52);
    }
  });

  await t.step("all returned dates are Sundays", () => {
    const sundays = getSundaysOfChurchYear(2023);
    sundays.forEach((sunday) => {
      assertEquals(sunday.dayOfWeek, 7);
    });
  });

  await t.step("first Sunday is First Sunday of Advent", () => {
    for (let year = 2020; year <= 2030; year++) {
      const sundays = getSundaysOfChurchYear(year);
      const firstAdvent = getFirstSundayOfAdvent(year - 1);
      assertEquals(sundays[0].toString(), firstAdvent.toString());
    }
  });

  await t.step("throws error for invalid date string", () => {
    assertThrows(() => getSundaysOfChurchYear("invalid-date"), RangeError);
    assertThrows(() => getSundaysOfChurchYear(""), RangeError);
  });

  await t.step("throws error for invalid date object", () => {
    assertThrows(() => getSundaysOfChurchYear("2023-13-01"), RangeError);
    assertThrows(() => getSundaysOfChurchYear(new Temporal.PlainDate(2023, 13, 1)), RangeError);
    assertThrows(() => getSundaysOfChurchYear({ year: 2023, month: 13, day: 1 }), RangeError);
  });
});

/*
Deno.test("Principal dates for liturgical year 2022 are correct", () => {
  const year = 2022;
  const seasons = getSeasonsOfYear(new Temporal.PlainDate(year, 1, 1));
  console.log(seasons);

  assertEquals(seasons.Lent.start.toString(), "2022-03-02", "Ash Wednesday");
  assertEquals(getWesternEaster(year).subtract({ days: 7 }).toString(), "2022-04-10", "Palm Sunday");
  assertEquals(getWesternEaster(year).subtract({ days: 2 }).toString(), "2022-04-15", "Good Friday");
  assertEquals(getWesternEaster(year).toString(), "2022-04-17", "Easter Day");
  assertEquals(getWesternEaster(year).add({ days: 39 }).toString(), "2022-05-26", "Ascension Day");
  assertEquals(seasons.Pentecost.start.toString(), "2022-06-05", "Pentecost");
  assertEquals(seasons.Pentecost.start.add({ days: 7 }).toString(), "2022-06-12", "Trinity Sunday");
  assertEquals(seasons.Advent.start.toString(), "2022-11-27", "Advent Sunday");
  assertEquals(seasons.Christmas.start.toString(), "2022-12-25", "Christmas Day");
  assertEquals(seasons.Christmas.start.dayOfWeek, 7, "Christmas Day is a Sunday");
});

Deno.test("Principal dates for liturgical year 2023 are correct", () => {
  const year = 2023;
  const seasons = getSeasonsOfYear(new Temporal.PlainDate(year, 1, 1));

  assertEquals(seasons.Lent.start.toString(), "2023-02-22", "Ash Wednesday");
  assertEquals(getWesternEaster(year).subtract({ days: 7 }).toString(), "2023-04-02", "Palm Sunday");
  assertEquals(getWesternEaster(year).subtract({ days: 2 }).toString(), "2023-04-07", "Good Friday");
  assertEquals(getWesternEaster(year).toString(), "2023-04-09", "Easter Day");
  assertEquals(getWesternEaster(year).add({ days: 39 }).toString(), "2023-05-18", "Ascension Day");
  assertEquals(seasons.Pentecost.start.toString(), "2023-05-28", "Pentecost");
  assertEquals(seasons.Pentecost.start.add({ days: 7 }).toString(), "2023-06-04", "Trinity Sunday");
  assertEquals(getFirstSundayOfAdvent(year).toString(), "2023-12-03", "Advent Sunday");
  assertEquals(new Temporal.PlainDate(year, 12, 25).toString(), "2023-12-25", "Christmas Day");
  assertEquals(new Temporal.PlainDate(year, 12, 25).dayOfWeek, 1, "Christmas Day is a Monday");
});

Deno.test("Principal dates for liturgical year 2024 are correct", () => {
  const year = 2024;
  const seasons = getSeasonsOfYear(new Temporal.PlainDate(year, 1, 1));

  assertEquals(seasons.Lent.start.toString(), "2024-02-14", "Ash Wednesday");
  assertEquals(getWesternEaster(year).subtract({ days: 7 }).toString(), "2024-03-24", "Palm Sunday");
  assertEquals(getWesternEaster(year).subtract({ days: 2 }).toString(), "2024-03-29", "Good Friday");
  assertEquals(getWesternEaster(year).toString(), "2024-03-31", "Easter Day");
  assertEquals(getWesternEaster(year).add({ days: 39 }).toString(), "2024-05-09", "Ascension Day");
  assertEquals(seasons.Pentecost.start.toString(), "2024-05-19", "Pentecost");
  assertEquals(seasons.Pentecost.start.add({ days: 7 }).toString(), "2024-05-26", "Trinity Sunday");
  assertEquals(getFirstSundayOfAdvent(year).toString(), "2024-12-01", "Advent Sunday");
  assertEquals(new Temporal.PlainDate(year, 12, 25).toString(), "2024-12-25", "Christmas Day");
  assertEquals(new Temporal.PlainDate(year, 12, 25).dayOfWeek, 3, "Christmas Day is a Wednesday");
});

Deno.test("Principal dates for liturgical year 2025 are correct", () => {
  const year = 2025;
  const seasons = getSeasonsOfYear(new Temporal.PlainDate(year, 1, 1));

  assertEquals(seasons.Lent.start.toString(), "2025-03-05", "Ash Wednesday");
  assertEquals(getWesternEaster(year).subtract({ days: 7 }).toString(), "2025-04-13", "Palm Sunday");
  assertEquals(getWesternEaster(year).subtract({ days: 2 }).toString(), "2025-04-18", "Good Friday");
  assertEquals(getWesternEaster(year).toString(), "2025-04-20", "Easter Day");
  assertEquals(getWesternEaster(year).add({ days: 39 }).toString(), "2025-05-29", "Ascension Day");
  assertEquals(seasons.Pentecost.start.toString(), "2025-06-08", "Pentecost");
  assertEquals(seasons.Pentecost.start.add({ days: 7 }).toString(), "2025-06-15", "Trinity Sunday");
  assertEquals(getFirstSundayOfAdvent(year).toString(), "2025-11-30", "Advent Sunday");
  assertEquals(new Temporal.PlainDate(year, 12, 25).toString(), "2025-12-25", "Christmas Day");
  assertEquals(new Temporal.PlainDate(year, 12, 25).dayOfWeek, 4, "Christmas Day is a Thursday");
});

Deno.test("Principal dates for liturgical year 2026 are correct", () => {
  const year = 2026;
  const seasons = getSeasonsOfYear(new Temporal.PlainDate(year, 1, 1));

  assertEquals(seasons.Lent.start.toString(), "2026-02-18", "Ash Wednesday");
  assertEquals(getWesternEaster(year).subtract({ days: 7 }).toString(), "2026-03-29", "Palm Sunday");
  assertEquals(getWesternEaster(year).subtract({ days: 2 }).toString(), "2026-04-03", "Good Friday");
  assertEquals(getWesternEaster(year).toString(), "2026-04-05", "Easter Day");
  assertEquals(getWesternEaster(year).add({ days: 39 }).toString(), "2026-05-14", "Ascension Day");
  assertEquals(seasons.Pentecost.start.toString(), "2026-05-24", "Pentecost");
  assertEquals(seasons.Pentecost.start.add({ days: 7 }).toString(), "2026-05-31", "Trinity Sunday");
  assertEquals(getFirstSundayOfAdvent(year).toString(), "2026-11-29", "Advent Sunday");
  assertEquals(new Temporal.PlainDate(year, 12, 25).toString(), "2026-12-25", "Christmas Day");
  assertEquals(new Temporal.PlainDate(year, 12, 25).dayOfWeek, 5, "Christmas Day is a Friday");
});

Deno.test("Principal dates for liturgical year 2027 are correct", () => {
  const year = 2027;
  const seasons = getSeasonsOfYear(new Temporal.PlainDate(year, 1, 1));

  assertEquals(seasons.Lent.start.toString(), "2027-02-10", "Ash Wednesday");
  assertEquals(getWesternEaster(year).subtract({ days: 7 }).toString(), "2027-03-21", "Palm Sunday");
  assertEquals(getWesternEaster(year).subtract({ days: 2 }).toString(), "2027-03-26", "Good Friday");
  assertEquals(getWesternEaster(year).toString(), "2027-03-28", "Easter Day");
  assertEquals(getWesternEaster(year).add({ days: 39 }).toString(), "2027-05-06", "Ascension Day");
  assertEquals(seasons.Pentecost.start.toString(), "2027-05-16", "Pentecost");
  assertEquals(seasons.Pentecost.start.add({ days: 7 }).toString(), "2027-05-23", "Trinity Sunday");
  assertEquals(getFirstSundayOfAdvent(year).toString(), "2027-11-28", "Advent Sunday");
  assertEquals(new Temporal.PlainDate(year, 12, 25).toString(), "2027-12-25", "Christmas Day");
  assertEquals(new Temporal.PlainDate(year, 12, 25).dayOfWeek, 6, "Christmas Day is a Saturday");
});

Deno.test("Principal dates for liturgical year 2028 are correct", () => {
  const year = 2028;
  const seasons = getSeasonsOfYear(new Temporal.PlainDate(year, 1, 1));

  assertEquals(seasons.Lent.start.toString(), "2028-03-01", "Ash Wednesday");
  assertEquals(getWesternEaster(year).subtract({ days: 7 }).toString(), "2028-04-09", "Palm Sunday");
  assertEquals(getWesternEaster(year).subtract({ days: 2 }).toString(), "2028-04-14", "Good Friday");
  assertEquals(getWesternEaster(year).toString(), "2028-04-16", "Easter Day");
  assertEquals(getWesternEaster(year).add({ days: 39 }).toString(), "2028-05-25", "Ascension Day");
  assertEquals(seasons.Pentecost.start.toString(), "2028-06-04", "Pentecost");
  assertEquals(seasons.Pentecost.start.add({ days: 7 }).toString(), "2028-06-11", "Trinity Sunday");
  assertEquals(getFirstSundayOfAdvent(year).toString(), "2028-12-03", "Advent Sunday");
  assertEquals(new Temporal.PlainDate(year, 12, 25).toString(), "2028-12-25", "Christmas Day");
  assertEquals(new Temporal.PlainDate(year, 12, 25).dayOfWeek, 1, "Christmas Day is a Monday");
});

Deno.test("Principal dates for liturgical year 2029 are correct", () => {
  const year = 2029;
  const seasons = getSeasonsOfYear(new Temporal.PlainDate(year, 1, 1));

  assertEquals(seasons.Lent.start.toString(), "2029-02-14", "Ash Wednesday");
  assertEquals(getWesternEaster(year).subtract({ days: 7 }).toString(), "2029-03-25", "Palm Sunday");
  assertEquals(getWesternEaster(year).subtract({ days: 2 }).toString(), "2029-03-30", "Good Friday");
  assertEquals(getWesternEaster(year).toString(), "2029-04-01", "Easter Day");
  assertEquals(getWesternEaster(year).add({ days: 39 }).toString(), "2029-05-10", "Ascension Day");
  assertEquals(seasons.Pentecost.start.toString(), "2029-05-20", "Pentecost");
  assertEquals(seasons.Pentecost.start.add({ days: 7 }).toString(), "2029-05-27", "Trinity Sunday");
  assertEquals(getFirstSundayOfAdvent(year).toString(), "2029-12-02", "Advent Sunday");
  assertEquals(new Temporal.PlainDate(year, 12, 25).toString(), "2029-12-25", "Christmas Day");
  assertEquals(new Temporal.PlainDate(year, 12, 25).dayOfWeek, 2, "Christmas Day is a Tuesday");
});

Deno.test("Principal dates for liturgical year 2030 are correct", () => {
  const year = 2030;
  const seasons = getSeasonsOfYear(new Temporal.PlainDate(year, 1, 1));

  assertEquals(seasons.Lent.start.toString(), "2030-03-06", "Ash Wednesday");
  assertEquals(getWesternEaster(year).subtract({ days: 7 }).toString(), "2030-04-14", "Palm Sunday");
  assertEquals(getWesternEaster(year).subtract({ days: 2 }).toString(), "2030-04-19", "Good Friday");
  assertEquals(getWesternEaster(year).toString(), "2030-04-21", "Easter Day");
  assertEquals(getWesternEaster(year).add({ days: 39 }).toString(), "2030-05-30", "Ascension Day");
  assertEquals(seasons.Pentecost.start.toString(), "2030-06-09", "Pentecost");
  assertEquals(seasons.Pentecost.start.add({ days: 7 }).toString(), "2030-06-16", "Trinity Sunday");
  assertEquals(getFirstSundayOfAdvent(year).toString(), "2030-12-01", "Advent Sunday");
  assertEquals(new Temporal.PlainDate(year, 12, 25).toString(), "2030-12-25", "Christmas Day");
  assertEquals(new Temporal.PlainDate(year, 12, 25).dayOfWeek, 3, "Christmas Day is a Wednesday");
});

Deno.test("Principal dates for liturgical year 2031 are correct", () => {
  const year = 2031;
  const seasons = getSeasonsOfYear(new Temporal.PlainDate(year, 1, 1));

  assertEquals(seasons.Lent.start.toString(), "2031-02-26", "Ash Wednesday");
  assertEquals(getWesternEaster(year).subtract({ days: 7 }).toString(), "2031-04-06", "Palm Sunday");
  assertEquals(getWesternEaster(year).subtract({ days: 2 }).toString(), "2031-04-11", "Good Friday");
  assertEquals(getWesternEaster(year).toString(), "2031-04-13", "Easter Day");
  assertEquals(getWesternEaster(year).add({ days: 39 }).toString(), "2031-05-22", "Ascension Day");
  assertEquals(seasons.Pentecost.start.toString(), "2031-06-01", "Pentecost");
  assertEquals(seasons.Pentecost.start.add({ days: 7 }).toString(), "2031-06-08", "Trinity Sunday");
  assertEquals(getFirstSundayOfAdvent(year).toString(), "2031-11-30", "Advent Sunday");
  assertEquals(new Temporal.PlainDate(year, 12, 25).toString(), "2031-12-25", "Christmas Day");
  assertEquals(new Temporal.PlainDate(year, 12, 25).dayOfWeek, 4, "Christmas Day is a Thursday");
});
 */
