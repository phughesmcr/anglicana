import { assert, assertEquals } from "@std/assert";

import {
  generateLiturgicalCalendar,
  getEventsForDate,
  getSaturdayEveningPrayerCollectContext,
  getTrinitySundaySeriesInfo,
} from "../mod.ts";

function assertExists<T>(value: T | undefined | null, msg?: string): asserts value is T {
  assert(value != null, msg ?? "expected value");
}

Deno.test("All Saints optional secondary observance on 1 November", async (t) => {
  await t.step("default does not add 1 November when All Saints is on Sunday transfer", () => {
    const cal = generateLiturgicalCalendar(2020, {
      transferAllSaintsToSunday: true,
    });
    const all = cal.filter((e) => e.name.includes("All Saints"));
    assertEquals(all.length, 1);
    assertEquals(all[0]?.observance, undefined);
  });

  await t.step("includeAllSaintsSecondaryOnNovember1 adds secondary on 1 November", () => {
    const cal = generateLiturgicalCalendar(2020, {
      transferAllSaintsToSunday: true,
      includeAllSaintsSecondaryOnNovember1: true,
    });
    const all = cal.filter((e) => e.name.includes("All Saints"));
    assertEquals(all.length, 2);
    const secondary = all.find((e) => e.observance === "secondary");
    assertExists(secondary);
    assertEquals(secondary.date.toString(), "2021-11-01");
    const principal = all.find((e) => e.observance === undefined);
    assertExists(principal);
    assertEquals(principal.date.toString(), "2021-10-31");
  });
});

Deno.test("Trinity 22nd/23rd Sunday eucharistic proper swap (23 Sundays in series)", async (t) => {
  await t.step("getTrinitySundaySeriesInfo detects swap years", () => {
    const info = getTrinitySundaySeriesInfo(2007);
    assertEquals(info.appliesTwentySecondTwentyThirdProperSwap, true);
    assertEquals(info.sundayCount, 23);
    assertEquals(info.twentySecondSundayAfterTrinity?.toString(), "2008-10-19");
    assertEquals(info.twentyThirdSundayAfterTrinity?.toString(), "2008-10-26");
  });

  await t.step("calendar events carry eucharisticProperAs on affected Sundays", () => {
    const cal = generateLiturgicalCalendar(2007);
    const d22 = cal.find((e) => e.name === "Twenty-Second Sunday after Trinity");
    const d23 = cal.find((e) => e.name === "Last Sunday after Trinity");
    assertEquals(d22?.eucharisticProperAs, "third_sunday_before_lent");
    assertEquals(d23?.eucharisticProperAs, "last_sunday_after_trinity");
  });

  await t.step("non-swap years omit eucharisticProperAs on ordinary Sundays after Trinity", () => {
    const cal = generateLiturgicalCalendar(2025);
    const anyTagged = cal.some((e) => e.eucharisticProperAs !== undefined);
    assertEquals(anyTagged, false);
  });
});

Deno.test("Saturday Evening Prayer collect of ensuing Sunday", async (t) => {
  await t.step("ordinary Saturday uses ensuing Sunday", () => {
    const r = getSaturdayEveningPrayerCollectContext("2025-06-14");
    assertEquals(r.kind, "ensuing_sunday");
    if (r.kind === "ensuing_sunday") {
      assertEquals(r.ensuingSunday.toString(), "2025-06-15");
    }
  });

  await t.step("non-Saturday returns not_saturday", () => {
    const r = getSaturdayEveningPrayerCollectContext("2025-06-15");
    assertEquals(r.kind, "not_saturday");
  });

  await t.step("Holy Saturday is easter_eve", () => {
    const r = getSaturdayEveningPrayerCollectContext("2026-04-04");
    assertEquals(r.kind, "easter_eve");
  });

  await t.step("Saturday Christmas Eve is christmas_eve", () => {
    const r = getSaturdayEveningPrayerCollectContext("2022-12-24");
    assertEquals(r.kind, "christmas_eve");
  });

  await t.step("Saturday that is a festival uses same_day", () => {
    const r = getSaturdayEveningPrayerCollectContext("2020-12-26", { liturgicalYear: 2020 });
    assertEquals(r.kind, "same_day");
    if (r.kind === "same_day") assertEquals(r.reason, "festival");
  });
});

Deno.test("BCP George and Mark transfer harmonisation", async (t) => {
  await t.step("Mark follows George by one day when both transferred after Easter", () => {
    const cal = generateLiturgicalCalendar(2018);
    const george = cal.find((e) => e.name.startsWith("George, Martyr, Patron of England"));
    const mark = cal.find((e) => e.name.startsWith("Mark the Evangelist"));
    assertExists(george);
    assertExists(mark);
    assertEquals(
      mark.date.toString(),
      george.date.add({ days: 1 }).toString(),
    );
  });

  await t.step("bcpGeorgeMarkTransferHarmonisation preserves alignment when already CW-correct", () => {
    const base = generateLiturgicalCalendar(2018);
    const bcp = generateLiturgicalCalendar(2018, { bcpGeorgeMarkTransferHarmonisation: true });
    const markBase = base.find((e) => e.name.startsWith("Mark the Evangelist"));
    const markBcp = bcp.find((e) => e.name.startsWith("Mark the Evangelist"));
    assertEquals(markBase?.date.toString(), markBcp?.date.toString());
  });
});

Deno.test("getEventsForDate forwards calendar options", async (t) => {
  await t.step("pastoral mode affects lookup", () => {
    const canonical = getEventsForDate("2026-01-04", 2025, { canonicalMode: "canonical" });
    const pastoral = getEventsForDate("2026-01-04", 2025, { canonicalMode: "pastoral" });
    assertEquals(canonical.some((e) => e.name === "The Epiphany"), false);
    assertEquals(pastoral.some((e) => e.name === "The Epiphany"), true);
  });
});
