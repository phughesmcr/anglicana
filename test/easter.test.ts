import { assertEquals, assertThrows } from "@std/assert";

import { getEasterSunday, getJulianEaster, getOrthodoxEaster, getWesternEaster } from "../src/temporal.ts";

const assertTrue = (condition: boolean, message?: string) => {
  assertEquals(condition, true, message);
};

Deno.test("getEasterSunday function", async (t) => {
  await t.step("Regular cases", async (t) => {
    await t.step("Returns correct Easter dates for multiple years", () => {
      assertEquals(getEasterSunday(2023).toString(), "2023-04-09");
      assertEquals(getEasterSunday(2024).toString(), "2024-03-31");
      assertEquals(getEasterSunday(2025).toString(), "2025-04-20");
    });

    await t.step("Handles leap years correctly", () => {
      assertEquals(getEasterSunday(2024).toString(), "2024-03-31");
      assertEquals(getEasterSunday(2028).toString(), "2028-04-16");
    });
  });

  await t.step("Edge cases", async (t) => {
    await t.step("Handles earliest possible Easter date (March 22)", () => {
      assertEquals(getEasterSunday(1818).toString(), "1818-03-22");
    });

    await t.step("Handles latest possible Easter date (April 25)", () => {
      assertEquals(getEasterSunday(1943).toString(), "1943-04-25");
    });

    await t.step("Calculates Easter for different calendar systems", () => {
      const westernEaster2023 = getEasterSunday(2023);
      const julianEaster2023 = getEasterSunday(2023, { julian: true });
      const orthodoxEaster2023 = getEasterSunday(2023, { gregorian: true, julian: true });

      assertEquals(westernEaster2023.toString(), "2023-04-09");
      assertEquals(julianEaster2023.toString(), "2023-04-03");
      assertEquals(orthodoxEaster2023.toString(), "2023-04-16");
    });

    await t.step("Handles year 1", () => {
      assertEquals(getEasterSunday(1).toString(), "0001-03-25");
    });

    await t.step("Handles far future years", () => {
      assertEquals(getEasterSunday(9999).toString(), "9999-04-11");
    });
  });

  await t.step("Error cases", async (t) => {
    await t.step("Throws for non-integer years", () => {
      assertThrows(() => getEasterSunday(2023.5), RangeError);
    });

    await t.step("Throws for non-numeric input", () => {
      assertThrows(() => getEasterSunday("2023" as unknown as number), TypeError);
    });

    await t.step("Throws for years out of range", () => {
      assertThrows(() => getEasterSunday(-1), RangeError);
      assertThrows(() => getEasterSunday(275760), RangeError);
    });
  });
});

Deno.test("getWesternEaster function", async (t) => {
  await t.step("Regular cases", async (t) => {
    await t.step("Returns correct Easter dates for multiple years", () => {
      assertEquals(getWesternEaster(2023).toString(), "2023-04-09");
      assertEquals(getWesternEaster(2024).toString(), "2024-03-31");
      assertEquals(getWesternEaster(2025).toString(), "2025-04-20");
      assertEquals(getWesternEaster(2026).toString(), "2026-04-05");
      assertEquals(getWesternEaster(2027).toString(), "2027-03-28");
    });

    await t.step("Handles leap years correctly", () => {
      assertEquals(getWesternEaster(2024).toString(), "2024-03-31");
      assertEquals(getWesternEaster(2028).toString(), "2028-04-16");
      assertEquals(getWesternEaster(2032).toString(), "2032-03-28");
    });
  });

  await t.step("Edge cases", async (t) => {
    await t.step("Handles earliest possible Easter date (March 22)", () => {
      assertEquals(getWesternEaster(1818).toString(), "1818-03-22");
    });

    await t.step("Handles latest possible Easter date (April 25)", () => {
      assertEquals(getWesternEaster(1943).toString(), "1943-04-25");
    });

    await t.step("Handles year boundaries correctly", () => {
      assertEquals(getWesternEaster(1999).toString(), "1999-04-04");
      assertEquals(getWesternEaster(2000).toString(), "2000-04-23");
      assertEquals(getWesternEaster(2099).toString(), "2099-04-12");
      assertEquals(getWesternEaster(2100).toString(), "2100-03-28");
    });

    await t.step("Handles year 1", () => {
      assertEquals(getWesternEaster(1).toString(), "0001-03-25");
    });

    await t.step("Handles far future years", () => {
      assertEquals(getWesternEaster(9999).toString(), "9999-04-11");
    });
  });

  await t.step("Error cases", async (t) => {
    await t.step("Throws for non-integer years", () => {
      assertThrows(() => getWesternEaster(2023.5), RangeError);
    });

    await t.step("Throws for non-numeric input", () => {
      assertThrows(() => getWesternEaster("2023" as unknown as number), TypeError);
    });

    await t.step("Throws for years out of range", () => {
      assertThrows(() => getWesternEaster(-1), RangeError);
      assertThrows(() => getWesternEaster(275760), RangeError);
    });
  });
});

Deno.test("getJulianEaster function", async (t) => {
  await t.step("Regular cases", async (t) => {
    await t.step("Returns correct Julian Easter dates for multiple years", () => {
      assertEquals(getJulianEaster(2023).toString(), "2023-04-16");
      assertEquals(getJulianEaster(2024).toString(), "2024-05-05");
      assertEquals(getJulianEaster(2025).toString(), "2025-04-20");
      assertEquals(getJulianEaster(2026).toString(), "2026-04-12");
      assertEquals(getJulianEaster(2027).toString(), "2027-05-02");
    });

    await t.step("Handles leap years correctly", () => {
      assertEquals(getJulianEaster(2024).toString(), "2024-05-05");
      assertEquals(getJulianEaster(2028).toString(), "2028-05-01");
      assertEquals(getJulianEaster(2032).toString(), "2032-04-25");
    });
  });

  await t.step("Edge cases", async (t) => {
    await t.step("Handles earliest possible Julian Easter date (April 3)", () => {
      // Note: This date may vary depending on the specific implementation
      assertEquals(getJulianEaster(1805).toString(), "1805-04-03");
    });

    await t.step("Handles latest possible Julian Easter date (May 8)", () => {
      // Note: This date may vary depending on the specific implementation
      assertEquals(getJulianEaster(1848).toString(), "1848-05-08");
    });

    await t.step("Calculates Julian Easter across century boundaries", () => {
      assertEquals(getJulianEaster(1900).toString(), "1900-04-22");
      assertEquals(getJulianEaster(2000).toString(), "2000-04-30");
      assertEquals(getJulianEaster(2100).toString(), "2100-05-07");
    });

    await t.step("Handles year 1", () => {
      assertEquals(getJulianEaster(1).toString(), "0001-04-09");
    });

    await t.step("Handles far future years", () => {
      assertEquals(getJulianEaster(9999).toString(), "9999-04-25");
    });
  });

  await t.step("Comparison with Western Easter", async (t) => {
    await t.step("Julian Easter is always on or after Western Easter", () => {
      for (let year = 2020; year <= 2030; year++) {
        const julianEaster = getJulianEaster(year);
        const westernEaster = getWesternEaster(year);
        assertTrue(
          julianEaster >= westernEaster,
          `Julian Easter (${julianEaster}) should be on or after Western Easter (${westernEaster}) in ${year}`,
        );
      }
    });

    await t.step("Difference between Julian and Western Easter varies", () => {
      const differences = new Set();
      for (let year = 2020; year <= 2050; year++) {
        const julianEaster = getJulianEaster(year);
        const westernEaster = getWesternEaster(year);
        const difference = julianEaster.since(westernEaster, { largestUnit: "day" }).days;
        differences.add(difference);
      }
      assertTrue(differences.size > 1, "There should be varying differences between Julian and Western Easter dates");
    });
  });

  await t.step("Error cases", async (t) => {
    await t.step("Throws for non-integer years", () => {
      assertThrows(() => getJulianEaster(2023.5), RangeError);
    });

    await t.step("Throws for non-numeric input", () => {
      assertThrows(() => getJulianEaster("2023" as unknown as number), TypeError);
    });

    await t.step("Throws for years out of range", () => {
      assertThrows(() => getJulianEaster(-1), RangeError);
      assertThrows(() => getJulianEaster(275760), RangeError);
    });
  });
});

Deno.test("getOrthodoxEaster function", async (t) => {
  await t.step("Regular cases", async (t) => {
    await t.step("Returns correct Orthodox Easter dates for multiple years", () => {
      assertEquals(getOrthodoxEaster(2023).toString(), "2023-04-16");
      assertEquals(getOrthodoxEaster(2024).toString(), "2024-05-05");
      assertEquals(getOrthodoxEaster(2025).toString(), "2025-04-20");
      assertEquals(getOrthodoxEaster(2026).toString(), "2026-04-12");
      assertEquals(getOrthodoxEaster(2027).toString(), "2027-05-02");
    });

    await t.step("Handles leap years correctly", () => {
      assertEquals(getOrthodoxEaster(2024).toString(), "2024-05-05");
      assertEquals(getOrthodoxEaster(2028).toString(), "2028-04-16");
      assertEquals(getOrthodoxEaster(2032).toString(), "2032-05-02");
    });
  });

  await t.step("Edge cases", async (t) => {
    await t.step("Handles earliest possible Orthodox Easter date (April 4)", () => {
      assertEquals(getOrthodoxEaster(2010).toString(), "2010-04-04");
    });

    await t.step("Handles latest possible Orthodox Easter date (May 8)", () => {
      assertEquals(getOrthodoxEaster(1983).toString(), "1983-05-08");
    });

    await t.step("Calculates Orthodox Easter across century boundaries", () => {
      assertEquals(getOrthodoxEaster(1900).toString(), "1900-04-22");
      assertEquals(getOrthodoxEaster(2000).toString(), "2000-04-30");
      assertEquals(getOrthodoxEaster(2100).toString(), "2100-05-02");
    });

    await t.step("Handles year 1", () => {
      assertEquals(getOrthodoxEaster(1).toString(), "0001-04-09");
    });

    await t.step("Handles far future years", () => {
      assertEquals(getOrthodoxEaster(9999).toString(), "9999-04-11");
    });
  });

  await t.step("Comparison with Western Easter", async (t) => {
    await t.step("Orthodox Easter is always on or after Western Easter", () => {
      for (let year = 2020; year <= 2030; year++) {
        const orthodoxEaster = getOrthodoxEaster(year);
        const westernEaster = getWesternEaster(year);
        assertTrue(
          orthodoxEaster >= westernEaster,
          `Orthodox Easter (${orthodoxEaster}) should be on or after Western Easter (${westernEaster}) in ${year}`,
        );
      }
    });

    await t.step("Difference between Orthodox and Western Easter varies", () => {
      const differences = new Set();
      for (let year = 2020; year <= 2050; year++) {
        const orthodoxEaster = getOrthodoxEaster(year);
        const westernEaster = getWesternEaster(year);
        const difference = orthodoxEaster.since(westernEaster, { largestUnit: "day" }).days;
        differences.add(difference);
      }
      assertTrue(differences.size > 1, "There should be varying differences between Orthodox and Western Easter dates");
    });
  });

  await t.step("Consistency checks", async (t) => {
    await t.step("Orthodox Easter is always on a Sunday", () => {
      for (let year = 2020; year <= 2030; year++) {
        const orthodoxEaster = getOrthodoxEaster(year);
        assertEquals(orthodoxEaster.dayOfWeek, 7, `Orthodox Easter should always be on a Sunday (year ${year})`);
      }
    });

    await t.step("Orthodox Easter is always between April 4 and May 8", () => {
      for (let year = 1900; year <= 2100; year++) {
        const orthodoxEaster = getOrthodoxEaster(year);
        assertTrue(
          (orthodoxEaster.month === 4 && orthodoxEaster.day >= 4) ||
            (orthodoxEaster.month === 5 && orthodoxEaster.day <= 8),
          `Orthodox Easter should be between April 4 and May 8 (year ${year})`,
        );
      }
    });
  });

  await t.step("Error cases", async (t) => {
    await t.step("Throws for non-integer years", () => {
      assertThrows(() => getOrthodoxEaster(2023.5), RangeError);
    });

    await t.step("Throws for non-numeric input", () => {
      assertThrows(() => getOrthodoxEaster("2023" as unknown as number), TypeError);
    });

    await t.step("Throws for years out of range", () => {
      assertThrows(() => getOrthodoxEaster(-1), RangeError);
      assertThrows(() => getOrthodoxEaster(275760), RangeError);
    });
  });
});
