import { assertEquals } from "@std/assert";

import { getPrincipalFeasts } from "@/calendar/temporal/mod.ts";

Deno.test("getPrincipalFeasts function", async (t) => {
  await t.step("returns all principal feasts for 2024", () => {
    const feasts = getPrincipalFeasts(2024);

    assertEquals(feasts.christmas.toString(), "2024-12-25");
    assertEquals(feasts.epiphany.toString(), "2024-01-06");
    assertEquals(feasts.presentation.toString(), "2024-02-02");
    assertEquals(feasts.annunciation.toString(), "2024-04-08"); // Transferred after 2nd Sunday of Easter
    assertEquals(feasts.ascension.toString(), "2024-05-09");
    assertEquals(feasts.pentecost.toString(), "2024-05-19");
    assertEquals(feasts.trinitySunday.toString(), "2024-05-26");
    assertEquals(feasts.allSaintsDay.toString(), "2024-11-01");
  });

  await t.step("returns correct feasts for 2023", () => {
    const feasts = getPrincipalFeasts(2023);

    assertEquals(feasts.christmas.toString(), "2023-12-25");
    assertEquals(feasts.epiphany.toString(), "2023-01-06");
    assertEquals(feasts.presentation.toString(), "2023-02-02");
    assertEquals(feasts.annunciation.toString(), "2023-03-25"); // Not transferred in 2023
    assertEquals(feasts.ascension.toString(), "2023-05-18");
    assertEquals(feasts.pentecost.toString(), "2023-05-28");
    assertEquals(feasts.trinitySunday.toString(), "2023-06-04");
    assertEquals(feasts.allSaintsDay.toString(), "2023-11-01");
  });

  await t.step("handles different Easter options", () => {
    const westernFeasts = getPrincipalFeasts(2024, { gregorian: false, julian: false });
    const orthodoxFeasts = getPrincipalFeasts(2024, { gregorian: true, julian: true });

    // Orthodox Easter dates will be different, affecting dependent feasts
    assertEquals(westernFeasts.ascension.toString(), "2024-05-09");
    assertEquals(orthodoxFeasts.ascension.toString(), "2024-06-13"); // Different due to Orthodox Easter
  });
});
